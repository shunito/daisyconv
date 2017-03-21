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
        DAISY.load(file,function( daisy ){
            store.dispatch({
                type: types.DAISY_LOAD,
                value: daisy
            });

            resolve( daisy );
        });
    });
};

module.exports.addProject = function( store, daisy ){
    return new Promise(function(resolve, reject){
        project = Projects.new(daisy);

        Projects.addProject( project,function(){
            // Weit save storage??
            setTimeout(function(){
                resolve(project);
            },1000);
        });
    });
};



module.exports.viewDaisyStatus = function( id ){
    return {
        type: types.VIEW_DAISY_STATUS ,
        id: id
    };
};
