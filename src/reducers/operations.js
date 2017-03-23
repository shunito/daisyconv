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
    isLoaded: false,
    projectId : null
  };

function operations(state = initialState, action) {
    const assignState = Object.assign;

    switch (action.type) {
        case VIEW_PROJECT_LIST :
            return assignState({}, state, {
                text: 'Projects',
                menu:'projects'
              });

        case VIEW_LOADING:
            return assignState({}, state, {
                text: 'Now Loading',
                menu: 'loading',
              });

        case VIEW_DAISY_STATUS :
            return {
                text: 'Daisy Data Status',
                menu: 'daisy_status',
                isLoaded: true,
                projectId: action.value
            };

        case VIEW_DAISY_METADATA :
            return assignState({}, state, {
                text: 'Daisy Metadata',
                menu: 'daisy_metadata'
              });

        case VIEW_DAISY_PAGES :
            return assignState({}, state, {
                text: 'Daisy Pages',
                menu: 'daisy_pages'
            });

        case VIEW_DAISY_ITEMS :
            return assignState({}, state, {
                text: 'Daisy Items',
                menu: 'daisy_items'
            });

        default:
          return state;
    }
}

module.exports.reducer = operations;
