// jshint esversion:6
const electron = require('electron');
const app = electron.app;

var fs = require('fs-extra');
var unzip = require('unzip');
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');
var glob = require("glob");
var jschardet = require('jschardet');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var userPath = app.getPath('userData');
var moduleDir = __dirname;

var tempDir = path.join(userPath, 'projects');

const Smil = require('./SMIL.js');

var DAISY = {
    "id": '',
    "status": 'unload',
    "loaded": false,
    "originFilePath": '',
    "workingDir": '',
    "daisyDataDir": '',
    "daisyNCCFilePath": ''
};

function md5_hex(src) {
    var md5 = crypto.createHash('md5');
    md5.update(src, 'utf8');
    return md5.digest('hex');
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function getDirName( tempDirpath ,callback ){
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

function makeWorkingDirectory( daisyFilePath, callback ) {

    DAISY.originFilePath = daisyFilePath;
    DAISY.status = 'loading';

    var stats = fs.statSync(daisyFilePath);
    var filename = '';
    var mimetype = '';
    var originFile = '';
    var targetFilePath = '';
    var bookId = '';
    var unixtime = 0;

    if (stats.isFile()) {
        filename = path.basename(daisyFilePath);
        mimetype = mime.lookup(daisyFilePath);

        if (mimetype !== 'application/zip') {
            logger.error('Import Error : DAISY format :%s ', daisyFilePath );
            return;
        }
        unixtime = Math.floor(new Date().getTime() / 1000);
        bookId = md5_hex( unixtime + filename);
        targetFilePath = path.join(tempDir, bookId );
        DAISY.id = bookId;

        console.log(filename, mimetype, stats.size, unixtime);
        console.log('bookId:', bookId);
        console.log('target:', targetFilePath);

        fs.mkdirs( targetFilePath, function(err){
            if( err ){
                console.log( err );
                DAISY.status = 'error';
                callback( DAISY );
                return;
            }

            console.log('mkdir:', targetFilePath );
            DAISY.workingDir = targetFilePath;

            fs.createReadStream(daisyFilePath)
                .pipe(unzip.Extract({
                    path: targetFilePath
                })
                .on('error',function(err){
                    console.log(err);
                    DAISY.status = 'error';
                    callback( DAISY );
                })
                .on('finish',function(){
                    getDirName( targetFilePath, function(list, err){
                        if( err ){
                            DAISY.status = 'error';
                            callback( DAISY );
                            return;
                        }
                        console.log( list );
                        if( list.length ){
                            DAISY.daisyDataDir = list[0];

                            // waiting UNZIP Extract...?
                            setTimeout(function(){
                                callback( DAISY );
                            }, 2000);
                        }
                    });
                })
            );
        });
    }
}

function parseNCC( ncc ) {
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

function findPage( daisy, pageId ){
    let i,l, page, pages;
    if( daisy || daisy.loaded ){
        pages = daisy.ncc.structure;
        l = pages.length;
        for(i=0;i<l;i++){
            page = pages[i];
            if(page.id === pageId ){
                return page;
            }
        }
    }
    return null;
}

let toc = [];
function _readSMIL( file ) {
    return new Promise(function(resolve, reject) {
        const filePath = file.file;
        const smilId = file.smilId;
        fs.readFile(filePath, 'utf8', function(err, smil) {
            if (err) { reject(err); }
            else{
                toc = toc.concat( Smil.makeHTMLToc(smil, smilId) );
                resolve(toc);
            }
        });
    });
}

function makeToc(daisy ,callback){
    toc = [];
    let i,l, page, pages;
    let result = [];
    if( daisy || daisy.loaded ){
        pages = daisy.ncc.structure;
        l = pages.length;
        for(i=0;i<l;i++){
            page = pages[i];
            const href = page.href;
            let filename = href.match("(.+?)([\?#;].*)?$");
            if( filename ){
                let filePath = path.join( daisy.daisyDataDir, filename[1] );
                if( result.indexOf( filePath ) < 0 ){
                    result.push({
                        smilId: page.id,
                        file: filePath
                    });
                }
            }
        }

        result.reduce(function (current, args) {
            return current.then(function () {
                return _readSMIL(args);
            });
        }, Promise.resolve()).then(function( htmllist){
            callback( htmllist );
        });

    }
}


module.exports.DAISY = {};

module.exports.load = function( daisyFilePath, callback ) {
    console.log('DAISY parse:', daisyFilePath);

    makeWorkingDirectory( daisyFilePath, function(daisy){
        var nccPath = path.join( daisy.daisyDataDir, "ncc.html");
        var options = { nocase: true };
        daisy.daisyNCCFilePath = nccPath;

        fs.readFile(nccPath,function(err, data){
            var ncc = {};
            if( err ){
                console.log( err );
                daisy.status = 'error';
            }
            else{
                // Change Encoding to UTF-8
                var encode = jschardet.detect(data);
                var buf = new Buffer(data, 'binary');
                data = iconv.decode(buf, encode.encoding);
                ncc = parseNCC( data );
            }
            daisy.status = 'loaded';
            daisy.loaded = true;
            daisy.ncc = ncc;

            toc = [];
            makeToc(daisy,function( htmlIndex ){
                daisy.html = htmlIndex;
                module.exports.DAISY = daisy;
                callback( daisy );
            });

        });
    });
};

module.exports.checkPage = function( pageId ) {
    const daisy = this.DAISY;
    const page = findPage( daisy, pageId );
    if( page ){
        const href = page.href;
        let filename = href.match("(.+?)([\?#;].*)?$");
        if( filename ){
            let filePath = path.join( daisy.daisyDataDir, filename[1] );

            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
    }
    return null;
};

module.exports.getStore = function( id ){
    return new Promise(function(resolve, reject){
        const storageId = id +'_daisy';
        storage.get( storageId, function (error, daisy) {
            if (error) { reject(error); }
            if (Object.keys(projects).length === 0){
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
