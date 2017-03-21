// jshint esversion:6
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class App extends Component {
    render() {
        return (
            <div>
            <p>TEST</p>
            </div>);
    }
}


const rootDOM = document.getElementById("app");

ipcRenderer.on("render", (sender, state) => {

    console.log('on render ',sender ,state);
    ReactDOM.render(React.createElement(App, state), rootDOM);
});
