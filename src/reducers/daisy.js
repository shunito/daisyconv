// jshint esversion:6

const { DAISY_LOAD } = require('../constants/ActionTypes');

const initialState = {
    id: '',
    title: '',
    toc : [],
    items : [],
    smil: [],
    metadata: []
};

function daisy(state = initialState, action) {
    switch (action.type) {
        case DAISY_LOAD:
            return Object.assign({}, state, action.value );

        default:
          return state;
    }
}

module.exports.reducer = daisy;
