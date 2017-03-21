// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class MainMenu extends Component {
    _onMenuProjects() {
        ipcRenderer.send("dispatch-store", {
            type: "VIEW_PROJECT_LIST"
        });
    }

    render() {
        let title = '';

        return <div>
                <button className={"btn btn-default"} onClick={this._onMenuProjects}>
                    <span className={"icon icon-archive icon-text"}></span> Projects
                </button>
                <span className={"projectTitle"}>{title}</span>
            </div>;
    }
}

const menuDOM = document.getElementById("toolbar");
ReactDOM.render(React.createElement(MainMenu), menuDOM);

ipcRenderer.on("render", (sender, state) => {
    //console.log('on render ',sender ,state);
    ReactDOM.render(React.createElement(MainMenu, state), menuDOM);
});
