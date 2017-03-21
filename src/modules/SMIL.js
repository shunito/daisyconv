// jshint esversion:6

const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const XMLF = require('./xmlFormatter.js');


function _transform( smil ){

        const smilTemplate = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<smil xmlns="http://www.w3.org/ns/SMIL"',
            ' xmlns:dc="http://purl.org/dc/elements/1.1/"',
            ' xmlns:epub="http://www.idpf.org/2007/ops" version="3.0">',
            '</smil>'
        ].join('');

        let $smil1 = cheerio.load(smil, {
            decodeEntities: false,
            xmlMode: true
        });
        let $smil3 = cheerio.load(smilTemplate, {
            decodeEntities: false,
            xmlMode: true
        });

        $smil1('meta').each(function(i, elm) {
            var name = $smil1(elm).attr('name');
            if (name.toLowerCase() === 'dc:format') {
                $smil1(elm).attr('content', 'EPUB 3.1');
            }
            if (name.toLowerCase().indexOf("ncc:") > -1) {
                $smil1(elm).remove();
            }
        });

        $smil1('par').each(function(i, elm){
            var audio = $smil1(elm).find('audio');
            if( audio.length > 0 ){
                let audio2 = $smil1(audio[0]).clone();
                let begin = $smil1(audio2).attr('clip-begin');
                let end = $smil1(audio2).attr('clip-end');

                $smil1(audio2).attr('clipBegin', begin);
                $smil1(audio2).attr('clipEnd', end);
                $smil1(audio2).removeAttr('clip-begin');
                $smil1(audio2).removeAttr('clip-end');
                $smil1(elm).append( audio2 );
            }
            $smil1(elm).find('seq').remove();
        });

        $smil3('smil').append($smil1('head'));
        $smil3('smil').append($smil1('body'));

        return XMLF.format($smil3.html(), 2);
}

module.exports.makeHTMLToc = function( smil, smilId ) {

    let result = [];
    let $ = cheerio.load(smil, {
        decodeEntities: false,
        xmlMode: true
    });

    $('text').each(function(i, elm){
        let text = elm.attribs;
        text.smilId = smilId;
        result.push( elm.attribs );
    });
    return( result );
};


module.exports.makeSMIL3 = function( smilFile ,callback ) {
    fs.readFile(smilFile, 'utf8', function(err, smil) {
        if (err) throw err;
        else{
            callback( _transform( smil ) );
        }
    });
};


module.exports.transform = function( smil ) {
    return _transform( smil );
};
