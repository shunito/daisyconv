// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';


export class EPUBBuildButton extends Component {

    _onClicBuildButton(e){
        const id = e.currentTarget.getAttribute('data-daisyId');
        ipcRenderer.send("convert-epub", {
            type: "EPUB_BUILD_INIT",
            value: id
        });
    }

    render(){
        const daisy = this.props.daisy;
        return(
            <div className={"page-btn-group"}>
                <button className={"btn btn-default"} onClick={this._onClicBuildButton} data-daisyId={daisy.id}>
                <span className={"icon icon-folder icon-text"}></span> Convert to EPUB Data
                </button>
            </div>
        )
    }
}

export default class DaisyStatus extends Component {

    _viewCheckResult( check ){
        if( check ) return 'OK';
        return 'NG';
    }

    render() {
        const daisy = this.props.daisy;
        const isReady = daisy.isReady;
        const isTitleOK = daisy.title ? true : false;
        const isIDOK = daisy.id ? true : false;
        const isMetaOK = daisy.metadata  && daisy.metadata.length > 0  ? true : false;
        const isTocOK = daisy.toc  && daisy.toc.length > 0  ? true : false;
        const isSMILOK = daisy.items.smil.length > 0  ? true : false;
        const isHTMLOK = daisy.items.html.length > 0  ? true : false;

        return(
            <div>
            <h2 className={"title-main"}>DAISY Data Status</h2>
            {isReady ? <EPUBBuildButton daisy={daisy} /> : null }
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Name</th><th>Value</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>Title</td><td>{ daisy.title }</td>
                    <td>{this._viewCheckResult(isTitleOK)}</td></tr>
                <tr><td>ID</td><td>{ daisy.id }</td>
                    <td>{this._viewCheckResult(isIDOK)}</td></tr>
                <tr><td>Metadata</td><td>{ daisy.metadata.length } Data</td>
                    <td>{this._viewCheckResult(isMetaOK)}</td></tr>
                <tr><td>Table of Contents</td><td>{ daisy.toc.length } section</td>
                    <td>{this._viewCheckResult(isTocOK)}</td></tr>
                <tr><td>SMIL Files</td><td>{ daisy.items.smil.length } file</td>
                    <td>{this._viewCheckResult(isSMILOK)}</td></tr>
                <tr><td>HTML Files</td><td>{ daisy.items.html.length } file</td>
                    <td>{this._viewCheckResult(isHTMLOK)}</td></tr>
                <tr><td>Audio Files</td><td>{ daisy.items.audio.length } file</td><td>-</td></tr>
                <tr><td>Image Files</td><td>{ daisy.items.image.length } file</td><td>-</td></tr>
                <tr><td>Data Dir</td><td>{ daisy.workingDir } file</td><td>-</td></tr>
            </tbody>
            </table>
            </div>
        );
    }
}
