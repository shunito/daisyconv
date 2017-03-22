// jshint esversion:6

const objectAssign = require('object-assign');
const assignState = Object.assign;

const {
    PROJECT_LOAD,
    PROJECT_ADD,
    PROJECT_REMOVE,
    PROJECT_UPDATE
    } = require('../constants/ActionTypes');


const initialState = [];

function projects(state = initialState, action) {

//console.log('PJ reducer:: ', action );

    switch (action.type) {
        case PROJECT_UPDATE:
            return state.push( action.value );

        case PROJECT_LOAD:
            return action.value;

        default:
            return state;
    }
}

module.exports.reducer = projects;
