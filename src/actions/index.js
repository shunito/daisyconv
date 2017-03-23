// jshint esversion:6

const types = require('../constants/ActionTypes');
const Projects = require('../modules/Projects');
const DAISY = require('../modules/DAISY');
const SMIL = require('../modules/SMIL');

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
    return new Promise(function(resolve, reject){
        DAISY.load(file).then(function( daisy ){
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
