// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class ProjectList extends Component {
    _onClickOpenButton() {
        var options = {
            title: 'Open DAISY File',
            filters: [
                {name: 'DAISY', extensions: ['zip', 'daisy' ]}
            ],
            properties: ['openFile']
        };

        dialog.showOpenDialog(options,function(files){
            if( files ){
                ipcRenderer.send("file-open", {
                    files: files
                });
            }
        });
    }

    _onSelectProject( e ){
        const id = e.currentTarget.getAttribute('data-projId');
        ipcRenderer.send("dispatch-store", {
            type: 'VIEW_DAISY_STATUS',
            value: id
        });
    }


    render() {
        var projects = this.props.projects;
        var i,l, project;

        var list = projects.map((project, index) =>
            <tr key={index} onClick={ this._onSelectProject } data-projId={project.id}>
            <td>{project.name}</td>
            <td>{project.id}</td>
            <td>{project.include}</td>
            </tr>
        );

        return (<div>
            <h2 className={"title-main"}>Projects</h2>
            <div className={"page-btn-group"}>
                <button className={"btn btn-default"} onClick={this._onClickOpenButton}>
                <span className={"icon icon-folder icon-text"}></span> Open New DAISY
                </button>
            </div>
            <div className={"section"}>
                <table className={"table-striped table"}>
                <thead>
                    <tr><th>Title</th><th>ID</th><th>Include Date</th></tr>
                </thead>
                <tbody>{list}</tbody>
                </table>
            </div>
        </div>);
    }
}
