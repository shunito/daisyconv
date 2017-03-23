// jshint esversion:6

const {
    EPUB_LOAD,
    EPUB_RESET,
    EPUB_BUILD_INIT,
    EPUB_BUILD_CONVERT,
    EPUB_BUILD_CONVERT_FINISH,
    EPUB_BUILD_REBUILD,
    EPUB_BUILD_FINISH } = require('../constants/ActionTypes');

const initialConfig = {
    base_lang: '',
    rendition_layout: 'reflowable',
    rendition_orientation: 'auto',
    rendition_spread: 'auto',
    viewport: false,
    viewport_width: null,
    viewport_height: null,
    ibooks_display_options_fixed: false,
    ibooks_display_options_fonts: false,
    mediaOverlay: true,
    a11y_wcag_level: 'A',
    a11y_certifiedBy: '',
    a11y_certifierCredential: '',
    a11y_certifierReport: '',
    a11y_accessMode: ['textual','visual','auditory'],
    a11y_accessibilityFeature: [],
    a11y_accessibilityHazard:[],
    a11y_accessibilitySummary: '',
    a11y_accessibilityAPI: ['ARIA'],
    a11y_accessibilityControl: []
};

const initialState = {
    id : '',
    config : initialConfig,
    cover : {},
    toc : [],
    items : [],
    smil : [],
    metadata : [],
    history: [],
    convert: false,
    build : false
};

function epub(state = initialState, action) {
    switch (action.type) {
        case EPUB_BUILD_INIT:
            return Object.assign({}, state, action.value );
        case EPUB_BUILD_CONVERT:
            return Object.assign({}, state, action.value );
        case EPUB_LOAD:
            return Object.assign({}, state, action.value );
        case EPUB_RESET:
            return initialState;

        default:
          return state;
    }
}

module.exports.reducer = epub;
