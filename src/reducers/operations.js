// jshint esversion:6
const objectAssign = require('object-assign');

const {
    VIEW_LOADING,
    VIEW_PROJECT_LIST,
    VIEW_DAISY_STATUS,
    VIEW_DAISY_METADATA,
    VIEW_DAISY_PAGES,
    VIEW_DAISY_ITEMS,
    OPEN_DAISY_FILE,
    VIEW_EPUB_STATUS,
    VIEW_EPUB_CONFIG,
    VIEW_EPUB_METADATA,
    VIEW_EPUB_COVER,
    VIEW_EPUB_PAGES
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
                menu: VIEW_PROJECT_LIST
              });

        case VIEW_LOADING:
            return assignState({}, state, {
                text: 'Now Loading',
                menu: VIEW_PROJECT_LIST,
              });

        case VIEW_DAISY_STATUS :
            return {
                text: 'Daisy Data Status',
                menu: VIEW_DAISY_STATUS,
                isLoaded: true,
                projectId: action.value
            };

        case VIEW_DAISY_METADATA :
            return assignState({}, state, {
                text: 'Daisy Metadata',
                menu: VIEW_DAISY_METADATA
              });

        case VIEW_DAISY_PAGES :
            return assignState({}, state, {
                text: 'Daisy Pages',
                menu: VIEW_DAISY_PAGES
            });

        case VIEW_DAISY_ITEMS :
            return assignState({}, state, {
                text: 'Daisy Items',
                menu: VIEW_DAISY_ITEMS
            });

        case VIEW_EPUB_STATUS :
            return assignState({}, state, {
                text: 'EPUB Status',
                menu: VIEW_EPUB_STATUS
            });

        case VIEW_EPUB_CONFIG :
            return assignState({}, state, {
                text: 'EPUB Configuration',
                menu: VIEW_EPUB_CONFIG
            });

        case VIEW_EPUB_METADATA :
            return assignState({}, state, {
                text: 'EPUB Metadata',
                menu: VIEW_EPUB_METADATA
            });

        case VIEW_EPUB_COVER :
            return assignState({}, state, {
                text: 'EPUB Cover',
                menu: VIEW_EPUB_COVER
            });

        case VIEW_EPUB_PAGES :
            return assignState({}, state, {
                text: 'EPUB Pages',
                menu: VIEW_EPUB_PAGES
            });

        default:
          return state;
    }
}

module.exports.reducer = operations;
