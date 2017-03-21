// jshint esversion:6
const objectAssign = require('object-assign');

const {
    VIEW_LOADING,
    VIEW_PROJECT_LIST,
    VIEW_DAISY_STATUS,
    VIEW_DAISY_METADATA,
    VIEW_DAISY_PAGES,
    VIEW_DAISY_ITEMS,
    OPEN_DAISY_FILE
    } = require('../constants/ActionTypes');


const initialState = {
    text: 'Projects',
    menu: 'projects',
  };

function operations(state = initialState, action) {
    const assignState = Object.assign;

    switch (action.type) {
        case VIEW_PROJECT_LIST :
            return initialState;

        case VIEW_LOADING:
            return {
                text: 'Now Loading',
                menu: 'loading',
            };

        case VIEW_DAISY_STATUS :
            return {
                text: 'Daisy Data Status',
                menu: 'daisy_status',
            };

        default:
          return state;
    }
}

module.exports.reducer = operations;
