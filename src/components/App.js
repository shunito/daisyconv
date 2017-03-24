// jshint esversion:6
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

// Components
import ProjectList from './ProjectList';
import DaisyStatus from './DaisyStatus';
import DaisyMetadata from './DaisyMetadata';
import DaisyPages from './DaisyPages';
import DaisyItems from './DaisyItems';

import EpubConfig from './EpubConfig';
import EpubCover from './EpubCover';
import EpubMetadata from './EpubMetadata';
import EpubPages from './EpubPages';
import EpubStatus from './EpubStatus';

class App extends Component {
    render() {
        return (
            <div>
            <h1>DAISY Converter</h1>
            <p>DAISY 2.02 to EPUB 3.1</p>
            </div>);
    }
}

class LoadingData extends Component {
    render() {
        return (
            <div>
                <h2>Loading...</h2>
                <div className={"loader"}>Loading...</div>
            </div>);
    }
}

function _selectComponent( mode ){
    switch( mode ){
        case 'VIEW_PROJECT_LIST': return( ProjectList );
        case 'VIEW_LOADING': return(LoadingData);
        case 'VIEW_DAISY_STATUS': return(DaisyStatus);
        case 'VIEW_DAISY_METADATA': return(DaisyMetadata);
        case 'VIEW_DAISY_PAGES': return(DaisyPages);
        case 'VIEW_DAISY_ITEMS': return(DaisyItems);

        case 'VIEW_EPUB_CONFIG': return(EpubConfig);
        case 'VIEW_EPUB_COVER': return(EpubCover);
        case 'VIEW_EPUB_METADATA': return(EpubMetadata);
        case 'VIEW_EPUB_PAGES': return(EpubPages);
        case 'VIEW_EPUB_STATUS': return(EpubStatus);

        default: return( App );
    }
}

const rootDOM = document.getElementById("app");

ipcRenderer.on("render", (sender, state) => {
    const mode = state.operation;
    const component = _selectComponent( mode.menu );

    console.log('on render ',sender ,state);

    ReactDOM.render(React.createElement(component, state), rootDOM);
});
