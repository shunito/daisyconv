// jshint esversion:6
const storage = require('electron-json-storage');

module.exports.list = [];

function newProject( daisy ){
    const date = new Date();
    return {
        id: daisy.id,
        name: daisy.ncc.title,
        status: 'loaded',
        include: date.toISOString()
    };
}

function _getProjectById( id ){
    return new Promise(function(resolve, reject){
        storage.get('projects', function (error, projects) {
            if (error) { reject(error); }

            let i,l,project;
            if (Object.keys(projects).length === 0){
                resolve([]);
            }
            l = projects.length;
            for(i=0;i<l;i++){
                project = projects[i];
                if( project.id === id ){
                    resolve( project );
                }
            }
            resolve([]);
        });
    });
}

function _getProjects(){
    return new Promise(function(resolve, reject){
        storage.get('projects', function (error, projects) {
            if (error) { reject(error); return; }
            if (Object.keys(projects).length === 0){
                resolve([]);
            }
            resolve(projects);
        });
    });
}


function _setProjects(projects){
    module.exports.list = projects;
    storage.set('projects', projects ,function (error) {
        if (error) throw error;
    });
}

module.exports.getProjects = _getProjects;

module.exports.getProjectById = function(id, callback) {
    let proj;
    _getProjectById( id ).then(function(project){
        proj = project;
        return _getDaisyById( id );
    })
    .then(function(daisy){
        proj.daisy = daisy;
        callback(proj);
    })
    .catch(function(err){
        console.log( err );
    });
};

module.exports.addProject = function(project, callback ){
    _getProjects().then(function(projects){
        let i,l,proj;
        let notfound = true;

        l = projects.length;
        for(i=0;i<l;i++){
            proj = projects[i];
            // Update
            if( project.id === proj.id ){
                projects[i] = project;
                notfound = false;
            }
        }
        if( notfound ){
            projects.push( project );
        }

        module.exports.list = projects;
        _setProjects(projects);
        callback(projects);
    });
};

module.exports.setProjects = _setProjects;
module.exports.new = newProject;
