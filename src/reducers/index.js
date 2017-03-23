// jshint esversion:6

const redux = require('redux');
const operationsReducer = require('./operations');
const projectsReducer = require('./projects');
const daisyReducer = require('./daisy');
const epubReducer = require('./epub');

// Get Reducers
const operation = operationsReducer.reducer;
const projects = projectsReducer.reducer;
const daisy = daisyReducer.reducer;
const epub = epubReducer.reducer;

const rootReducer = redux.combineReducers({
    operation,
    projects,
    daisy,
    epub
});

module.exports.rootReducer = rootReducer;
