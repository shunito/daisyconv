// jshint esversion:6

const types = require('../constants/ActionTypes');
const Projects = require('../modules/Projects');
const DAISY = require('../modules/DAISY');
const SMIL = require('../modules/SMIL');
const EPUB = require('../modules/EPUB');

//module.exports.viewProjects = () => ({ type: types.VIEW_PROJECT_LIST });

function _loadDAISY( file ){
    return new Promise(function(resolve, reject){
        DAISY.load(file,function( daisy ){
            resolve( daisy );
        });
    });
}

function _addProject( daisy ){
    return new Promise(function(resolve, reject){
        project = Projects.new(daisy);

        Projects.addProject( project,function(){
            // Weit save storage??
            setTimeout(function(){
                resolve(project);
            },1000);
        });
    });
}


module.exports.selectMenu = function( store, menu ){
    return new Promise(function(resolve, reject){
        let ss = store.getState();
        let id = ss.operation.projectId;

        if( menu === 'daisy_status' && id ){
            store.dispatch({
                type: types.VIEW_DAISY_STATUS,
                value: id
            });
        }

        if(menu === 'daisy_metadata' && id ){
            store.dispatch({
                type: types.VIEW_DAISY_METADATA
            });
        }

        if(menu === 'daisy_pages' && id ){
            store.dispatch({
                type: types.VIEW_DAISY_PAGES
            });
        }

        if(menu === 'daisy_items' && id ){
            store.dispatch({
                type: types.VIEW_DAISY_ITEMS
            });
        }

        resolve( menu );
    });
};

module.exports.convDAISYtoEPUB = function( store , id ){
    console.log( 'build EPUB Data start --', id );
    const data = store.getState();

    return new Promise(function(resolve, reject){
        EPUB.copyEPUBTemplate( id ).then(function( dir ){
            console.log( dir );
            return EPUB.copyBaseData( data.daisy, data.epub );
        }).then(function( epub ){
            return EPUB.convertDAISYItems( data.daisy, epub );
        }).then(function( epub ){
            return EPUB.convertToc( data.daisy, epub );
        }).then(function( epub ){
            return EPUB.makeSMILforEPUB( data.daisy, epub );
        }).then(function( epub ){
            epub.convert = true;
            return EPUB.setStore(epub);
        }).then(function( epub ){
            store.dispatch({
                type: types.EPUB_BUILD_CONVERT,
                value: epub
            });
//            console.log( epub );
            resolve( epub );
        });
    });
};

function _initEPUBStorage( store ){
    store.dispatch({
        type: types.EPUB_RESET
    });
    return new Promise(function(resolve, reject){
        const state = store.getState();
        const daisy = state.daisy;
        let epub = state.epub;

        epub.id = daisy.id;
        EPUB.setStore( state.epub ).then(function( epub ){
            resolve( epub );
        });
    });
}



module.exports.viewLoading = function( store ){
    store.dispatch({
        type: types.VIEW_LOADING
    });
};

module.exports.viewProjects = function( store ){
    return new Promise(function(resolve, reject){
        store.dispatch({
            type: types.VIEW_PROJECT_LIST
        });
        resolve();
    });
};

module.exports.loadProjects = function( store ){
    return new Promise(function(resolve, reject){
        Projects.getProjects().then(function( projects ){
            console.log( projects );
            store.dispatch({
                type: types.PROJECT_LOAD,
                value: projects
            });
            resolve(projects);
        });
    });
};

module.exports.loadDAISY = function( store, file ){
    let data;
    return new Promise(function(resolve, reject){
        DAISY.load(file).then(function( daisy ){
            store.dispatch({
                type: types.DAISY_LOAD,
                value: daisy
            });
            data = daisy;
            return _initEPUBStorage(store);
        }).then(function(){
            resolve( data );
        }).catch(function( err ){
            reject( err );
        });
    });
};




module.exports.getDAISY = function( store, id ){
    return new Promise(function(resolve, reject){
        DAISY.getStore(id).then(function( daisy ){
            store.dispatch({
                type: types.DAISY_LOAD,
                value: daisy
            });
            resolve( daisy );
        }).catch(function( err ){
            reject( err );
        });
    });
};

module.exports.getEPUB = function( store, id ){
    return new Promise(function(resolve, reject){
        EPUB.getStore(id).then(function( epub ){
            store.dispatch({
                type: types.EPUB_LOAD,
                value: epub
            });
            resolve( epub );
        }).catch(function( err ){
            reject( err );
        });
    });
};


module.exports.addProject = function( store, daisy ){
    return new Promise(function(resolve, reject){
        let project;
        _addProject(daisy).then(function( pj ){
            project = pj;
            return DAISY.setStore(daisy);
        }).then(function(){
            console.log( project );
            resolve( project );
        });
    });
};

module.exports.viewDaisyStatus = function( id ){
    return {
        type: types.VIEW_DAISY_STATUS ,
        id: id
    };
};
