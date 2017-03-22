// jshint esversion:6
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

// Components
import ProjectList from './ProjectList';
import DaisyStatus from './DaisyStatus';
import DaisyMetadata from './DaisyMetadata';
import DaisyPages from './DaisyPages';
import DaisyItems from './DaisyItems';


class App extends Component {
    render() {
        return (
            <div>
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

const rootDOM = document.getElementById("app");

ipcRenderer.on("render", (sender, state) => {
    const mode = state.operation;
    console.log('on render ',sender ,state);

    if( mode.menu === 'projects'){
        ReactDOM.render(React.createElement(ProjectList, state), rootDOM);
    }
    else if( mode.menu === 'loading'){
        ReactDOM.render(React.createElement(LoadingData, state), rootDOM);
    }
    else if( mode.menu === 'daisy_status'){
        ReactDOM.render(React.createElement(DaisyStatus, state), rootDOM);
    }
    else if( mode.menu === 'daisy_metadata'){
        ReactDOM.render(React.createElement(DaisyMetadata, state), rootDOM);
    }
    else if( mode.menu === 'daisy_pages'){
        ReactDOM.render(React.createElement(DaisyPages, state), rootDOM);
    }
    else if( mode.menu === 'daisy_items'){
        ReactDOM.render(React.createElement(DaisyItems, state), rootDOM);
    }
    else{
        ReactDOM.render(React.createElement(App, state), rootDOM);
    }

});
