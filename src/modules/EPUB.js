// jshint esversion:6
const electron = require('electron');
const storage = require('electron-json-storage');
const fs = require('fs-extra');
const path = require('path');
const glob = require("glob");
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const mime = require('mime');


// Setting
const app = electron.app;
const userPath = app.getPath('userData');
const projectsDir = path.join(userPath, 'projects');
const epubTemplatePath = path.resolve('assets/epub_template/');

function resolveClockValue(time) {
    var h, min, sc , re,
        result = parseFloat(time);
    if( typeof time === 'number') { return time; }
    if( typeof time !== 'string' ) { return 0; }

    re = time.match(/([0-9\.]+)(h|min|s|ms)/i);
    if(re){
        result = parseFloat(re[1]);
        if( re[2] ==='h' ){ result = result * 3600; }
        else if( re[2] ==='min' ){ result = result * 60; }
        else if( re[2] ==='ms' ){ result = result / 1000; }
        return result;
    }

    re = time.match(/([0-9]+):([0-9]+):([0-9\.]+)/i);
    if(re){
        h = parseInt(re[1],10);
        min = parseInt(re[2],10);
        sc = parseFloat(re[3]);
        result = h * 3600 + min * 60 + sc;
        return result;
    }
    else{
        re = time.match(/([0-9]+):([0-9\.]+)/i);
        if(re){
            min = parseInt(re[1],10);
            sc = parseFloat(re[2]);
            result = min * 60 + sc;
            return result;
        }
    }
    return result;
}

function _copyBaseData( daisy , epub ){

    function _getLang( metadata ){
        let i,l, meta;
        l = metadata.length;
        for(i=0;i<l;i++){
            meta = metadata[i];
            if( meta.type === 'language'){
                return meta.content;
            }
        }
        return '';
    }

    function _convMetadata( daisyMeta ){
        let meta = daisyMeta.meta;
        let type = daisyMeta.type;
        let content = daisyMeta.content;
        let scheme = daisyMeta.scheme;
        let use = false;

        if( type === 'format' ){ content = 'EPUB 3.1'; }
        if( type === 'narrator' ){ meta = 'media:narrator'; use = true; }
        if( type === 'totaltime' ){ meta = 'media:duration'; use = true; }

        if( type === 'date' ){
            content = new Date( content );
            content = content.toISOString();
            use = true;
        }

        // Dublin Core
        if( meta.indexOf('dc') === 0 ){
            use = true;
        }

        return {
            daisy: daisyMeta.meta,
            meta: meta,
            content: content,
            use: use
        };

    }

    return new Promise(function(resolve, reject){
        let result = Object.assign({}, epub);
        let i,l, metadata = [];

        // Basic Settings
        result.id = daisy.id;
        result.config.base_lang = _getLang( daisy.metadata );

        // Convert Metadata
        l = daisy.metadata.length;
        for(i=0;i<l;i++){
            metadata.push( _convMetadata(daisy.metadata[i]) );
        }
        result.metadata = metadata;
        resolve( result );
    });
}

function _convertDAISYItems( daisy, epub ){

    function _convertItems( items , type ){
        let i,l, id , result = [];
        let item ,mimetype , use ;

        l = items.length;
        for(i=0;i<l;i++){
            use = true;
            id = [ type , i+1 ].join('_');
            item = items[i];
            mimetype = mime.lookup( item );

            if( item === 'ncc.html'){ use = false; }

            result.push({
                id: id,
                href: item,
                mime : mimetype,
                use: use
            });
        }
        return result;
    }

    return new Promise(function(resolve, reject){
        let result = Object.assign({}, epub);
        let epubItems = [];
        let i,l;

        const items = daisy.items;
        epubItems = _convertItems( items.audio, 'audio' );
        epubItems = epubItems.concat( _convertItems( items.css, 'css' ) );
        epubItems = epubItems.concat( _convertItems( items.image, 'image' ) );
        epubItems = epubItems.concat( _convertItems( items.html, 'html' ) );

        result.items = epubItems;
        resolve( result );
    });

}

function _convertToc( daisy, epub ){

    function __searchTextIndex( smil, file, hash ){
        let result;
        let i,l, s;

        l = smil.length;
        for(i=0;i<l;i++){
            s = smil[i];
            if( s.smil === file ){
                if( hash && s.text.id === hash ){
                    return s.text.src;
                }
                else{
                    return s.html;
                }
            }
        }
        return '';
    }

    function __convert( daisy ){
        const toc = daisy.toc;
        const smil = daisy.smil;
        let i,l, content , href , filePath , hash;
        let result = [], src;
        let level ,text, id;

        l = toc.length;
        for(i=0;i<l;i++){
            content = toc[i];
            href = content.href;
            level = content.level;
            text = content.text;
            id = content.id;
            filepath = href.split('#');

            if( filepath.length > 1){
                hash = filepath[1];
                filepath = filepath[0];
            } else {
                filepath = filepath[0];
            }
            src = __searchTextIndex(smil, filepath, hash );
            //console.log( 'SRC::', src,  filepath, hash );

            result.push( {
                href : src,
                level: level,
                smilhref: href,
                text: text,
                id: id
            });
        }
        return result;
    }

    return new Promise(function(resolve, reject){
        let result = Object.assign({}, epub);
        const toc = __convert( daisy );
        result.toc = toc;
        resolve( result );
    });
}

function _makeSMILforEPUB(daisy, epub){

    function __searchSMILIndex( smil, src ){
        let result = [];
        let i,l;

        l = smil.length;
        for( i=0;i<l;i++){
            if( smil[i].html === src ){
                result.push( smil[i] );
            }
        }
        return result;
    }

    function __makeDuration( smil ){
        let i,l, minClipBegin, maxClipEnd , duration;
        let clipEnd, clipBegin ,tmp;

        l = smil.length;
        minClipBegin = Number.MAX_VALUE;
        maxClipEnd = 0;

        for(i=0;i<l;i++){
            clipBegin = smil[i].audio.clipBegin;
            clipEnd = smil[i].audio.clipEnd;

            tmp = clipBegin.split("=");
            if( tmp.length > 1 ){ clipBegin = resolveClockValue(tmp[1]); }
            else{ clipBegin = resolveClockValue(tmp[1]); }

            tmp = clipEnd.split("=");
            if( tmp.length > 1 ){ clipEnd = resolveClockValue(tmp[1]); }
            else{ clipEnd = resolveClockValue(tmp[1]); }

            if( clipBegin <  minClipBegin ){ minClipBegin = clipBegin; }
            if( clipEnd >  maxClipEnd ){ maxClipEnd = clipEnd; }
        }

        //console.log( 'minClipBegin::' ,minClipBegin );
        //console.log( 'maxClipEnd::' ,maxClipEnd );

        duration = maxClipEnd - minClipBegin;
        //console.log( 'duration::' ,duration );

        if( duration > 0 ){
            return duration;
        }
        return 0;
    }


    function __convert( smil, html ){
        let result = [], value = [];
        let i,l, par , src, duration;

        l = html.length;
        for(i=0;i<l;i++){
            src = html[i];
            value = __searchSMILIndex( smil, src );

            duration = __makeDuration( value );

            result.push({
                href : src,
                duration: duration,
                val : value
            });
        }

        return result;
    }

    return new Promise(function(resolve, reject){
        let result = Object.assign({}, epub);
        const smil = daisy.smil;
        const html = daisy.items.html;

        result.smil =  __convert( smil, html );
        resolve( result );
    });
}


module.exports.copyBaseData = _copyBaseData;
module.exports.convertDAISYItems = _convertDAISYItems;
module.exports.convertToc = _convertToc;
module.exports.makeSMILforEPUB = _makeSMILforEPUB;

module.exports.copyEPUBTemplate = function( id ){
    return new Promise(function(resolve, reject){
        let projectPath = path.join(projectsDir, id , 'epub');
        fs.ensureDir( projectPath ,function( err ){
            if( err ){ reject( err ); }

            fs.copy( epubTemplatePath, projectPath, function(err){
                if (err) reject( err );
                resolve( projectPath );
            });
        });
    });
};

module.exports.getStore = function( id ){
    return new Promise(function(resolve, reject){
        const storageId = id +'_epub';
        storage.get( storageId, function (error, epub) {
            if (error) { reject(error); }
            if (Object.keys(epub).length === 0){
                resolve([]);
            }
            resolve(epub);
        });
    });
};

module.exports.setStore = function( epub ){
    return new Promise(function(resolve, reject){
        const storageId = epub.id + '_epub';
        storage.set(storageId, epub ,function (error) {
            if (error) { reject(error);}
            resolve( epub );
        });
    });
};
