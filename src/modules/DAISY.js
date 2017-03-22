// jshint esversion:6
const electron = require('electron');
const storage = require('electron-json-storage');
const fs = require('fs-extra');
const unzip = require('unzip');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime');
const glob = require("glob");
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

// Modules
const Smil = require('./SMIL.js');

// Setting
const app = electron.app;
const userPath = app.getPath('userData');
const projectsDir = path.join(userPath, 'projects');

function _createNewDAISY(){
    return {
        "id": '',
        "title": '',
        "isReady": false,
        "workingDir": '',
        "nccFilePath": '',
        "daisyDataDir": '',
        "toc": [],
        "items": {},
        "smil": [],
        "metadata":[]
    };
}

function _md5_hex(src) {
    const md5 = crypto.createHash('md5');
    md5.update(src, 'utf8');
    return md5.digest('hex');
}

function _getDirName( tempDirpath ){
    return new Promise(function(resolve, reject){
        let result = [] , dirpath;
        fs.readdir( tempDirpath , function (err, list) {
            if (err) {
                reject( err );
            }
            else {
                for (var i = 0; i < list.length; i++) {
                    dirpath = path.join(tempDirpath, list[i]);
                    if( fs.statSync( dirpath ).isDirectory() ){
                        result.push( dirpath );
                    }
                }
                resolve( result );
            }
        });
    });
}

function _getDirName( tempDirpath ,callback ){
    var result = [] , dirpath;

    fs.readdir( tempDirpath , function (err, list) {
        if (err) {
            console.error(err);
            callback( null, err );
        }
        else {
            for (var i = 0; i < list.length; i++) {
                dirpath = path.join(tempDirpath, list[i]);
                if( fs.statSync( dirpath ).isDirectory() ){
                    result.push( dirpath );
                }
            }
            callback( result );
        }
    });
}

function _makeWorkingDirectory( daisyFilePath ){
    return new Promise(function(resolve, reject){
        let daisy = _createNewDAISY();
        let targetFilePath, bookId, unixtime;
        const stats = fs.statSync(daisyFilePath);

        if (stats.isFile()) {
            const mimetype = mime.lookup(daisyFilePath);
            const filename = path.basename(daisyFilePath);

            if (mimetype !== 'application/zip') {
                logger.error('Import Error : DAISY format :%s ', daisyFilePath );
                reject('file type error');
            }

            unixtime = Math.floor(new Date().getTime() / 1000);
            bookId = _md5_hex( unixtime + filename );
            targetFilePath = path.join(projectsDir, bookId );
            fs.mkdirs( targetFilePath, function(err){
                if( err ){
                    logger.error('Import Error : Mkdirs :%s ', targetFilePath );
                    reject('mkdirs error');
                }
                daisy.id = bookId;
                daisy.workingDir = targetFilePath;
                resolve( daisy );
            });
        }
    });
}

function _unzipDAISY( daisyFilePath, daisy ){
    return new Promise(function(resolve, reject){
        const targetFilePath = daisy.workingDir;

        fs.createReadStream(daisyFilePath)
            .pipe(unzip.Extract({
                path: targetFilePath
            })
            .on('error',function(err){
                reject( err );
            })
            .on('finish',function(){
                _getDirName( targetFilePath, function(list, err){
                    if( err ){
                        reject( err );
                    }
                    if( list.length ){
                        daisy.daisyDataDir = list[0];

                        // waiting UNZIP Extract...?
                        setTimeout(function(){
                            resolve( daisy );
                        }, 2000);
                    }
                });
            })
        );
    });
}

function _parseNCC( daisy ){

    function parse( ncc ) {
        let $ = cheerio.load( ncc );
        var title, titles = [];
        var identifier = '';
        var metadata = [];
        var structure = [];
        var headerLevel = 1;

        var regMetadata = RegExp("^(dc|ncc):(.*)","i");
        var regHeader = RegExp("h([0-9])","i");

        title = $("title").text();

        $("meta").each(function(){
            var self = this.attribs;
            var meta = '',
                type = '',
                name = '',
                content = '',
                scheme = '';

            if( typeof self.name === 'string' ){
                name = self.name;
            }
            if( typeof self.content === 'string' ){
                content = self.content;
            }
            if( typeof self.scheme === 'string' ){
                scheme = self.scheme;
            }

            re = name.match(regMetadata);
            if( re ){
                meta = re[0].toLowerCase();
                type = re[2].toLowerCase();
                if( type === 'title' ){
                    titles.push( content );
                }

                if( type === 'identifier' ){
                    identifier = content;
                }

                metadata.push({
                    meta: meta,
                    type: type,
                    content : content,
                    scheme : scheme
                });
            }
        });

        $("a").each(function(){
            var self = this;
            var parent = this.parent;
            var tagName = parent.name;
            var re, id, text, href;

            href = self.attribs.href;
            text = $(self).text();
            //console.log( parent.name, parent.attribs );
            //console.log( self.attribs, $(self).text() );

            if( typeof parent.attribs.id === 'string' ){
                id = parent.attribs.id;
                if( typeof self.attribs.id === 'string' ){
                    id= self.attribs.id;
                }
            }

            re = tagName.match(regHeader);
            if( re ){
                headerLevel = parseInt( re[1] );
            }

            structure.push({
                level: headerLevel,
                id: id,
                href: href,
                text: text
            });
        });

        if( titles.length > 1){
            title = titles[0];
        }

/*
        console.log( title );
        console.log( identifier );
        console.log( metadata );
        console.log( structure );
*/
        return ({
            title: title,
            identifier:identifier,
            metadata: metadata,
            structure: structure
        });

    }

    return new Promise(function(resolve, reject){
        const nccPath = daisy.nccFilePath;
        fs.readFile(nccPath,function(err, data){
            if( err ){ reject(err); }
            const encode = jschardet.detect(data);
            const buf = new Buffer(data, 'binary');
            const ncc = iconv.decode(buf, encode.encoding);
            const result = parse( ncc );
            daisy.title = result.title;
            daisy.metadata = result.metadata;
            daisy.toc = result.structure;
            resolve( daisy );
        });
    });
}

function _readItems( daisy ){
    const dir = daisy.daisyDataDir + '/';

    function getItems( cb ){
        const pattern = path.join( dir , '*');
        let items = {
            html: [],
            smil: [],
            audio: [],
            image: [],
            css:[],
            other: []
        };

        glob( pattern, function (er, files) {
            let i,l , file;
            let mimetype;
            l = files.length;
            for(i=0;i<l;i++){
                file = files[i];
                file = file.replace(dir ,'');
                mimetype = mime.lookup(file);

                if(mimetype.indexOf('html') > -1 ){
                    items.html.push( file );
                }
                else if(mimetype.indexOf('audio') > -1 ){
                    items.audio.push( file );
                }
                else if(mimetype.indexOf('smil') > -1 ){
                    items.smil.push( file );
                }
                else if(mimetype.indexOf('image') > -1 ){
                    items.image.push( file );
                }
                else if(mimetype.indexOf('css') > -1 ){
                    items.css.push( file );
                }
                else {
                    items.other.push( file );
                }
            }
            cb(items);
        });
    }

    return new Promise(function(resolve, reject){
        console.log('data dir :', dir );
        getItems(function( items ){
            daisy.items = items;
            resolve( daisy );
        });
    });
}


function _makeSMILData( daisy ){
    const smils = daisy.items.smil;
    let result = [];

    function _readSMIL( file ) {
        return new Promise(function(resolve, reject) {
            let filePath = path.join( daisy.daisyDataDir, file );
            fs.readFile(filePath, 'utf8', function(err, smil) {
                let i,l , list;
                if (err) { reject(err); }
                else{

                    let listByHTML = Smil.makeParList(smil);

                    console.log( listByHTML );
                    result = result.concat( listByHTML );

                    resolve( result );
                }
            });
        });
    }

    return new Promise(function(resolve, reject){
        let i,l = smils.length;

        smils.reduce(function (current, args) {
            return current.then(function(){
                return _readSMIL(args);
            });
        }, Promise.resolve()).then(function(){
            daisy.smil = result;
            resolve( daisy );
        });

    });
}

module.exports.DAISY = {};

module.exports.load = function( daisyFilePath ){
    return new Promise(function(resolve, reject){
        console.log('DAISY parse:', daisyFilePath);
        _makeWorkingDirectory(daisyFilePath).then(function( daisy ){
            return _unzipDAISY(daisyFilePath, daisy);
        }).then(function(daisy){
            daisy.nccFilePath = path.join( daisy.daisyDataDir, "ncc.html");
            return _parseNCC( daisy );
        }).then(function( daisy ){
            return _readItems( daisy );
        }).then(function( daisy ){
            return _makeSMILData( daisy );
        }).then(function( daisy ){
            daisy.isReady = true;
            console.log( daisy );
            resolve( daisy );
        }).catch(function( err ){
            console.log( err );
            reject( err );
        });

    });
};

module.exports.getStore = function( id ){
    return new Promise(function(resolve, reject){
        const storageId = id +'_daisy';
        storage.get( storageId, function (error, daisy) {
            if (error) { reject(error); }
            if (Object.keys(daisy).length === 0){
                resolve([]);
            }
            resolve(daisy);
        });
    });
};

module.exports.setStore = function( daisy ){
    return new Promise(function(resolve, reject){
        const storageId = daisy.id + '_daisy';
        storage.set(storageId, daisy ,function (error) {
            if (error) { reject(error);}
            resolve( daisy );
        });
    });
};
