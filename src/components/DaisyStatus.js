// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class DaisyStatus extends Component {
    render() {
        var daisy = this.props.daisy;
        var ncc, metadatas = [];
        var i,l,list = [];

        if( typeof daisy !== 'undefined' ){
            ncc = daisy.ncc;
            metadatas = daisy.metadata;
        }

        return(
            <div>
            <h2>DAISY Data Status</h2>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Name</th><th>Value</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>Title</td><td>{ daisy.title }</td><td>OK</td></tr>
                <tr><td>ID</td><td>{ daisy.id }</td><td>OK</td></tr>
                <tr><td>Metadata</td><td>{ daisy.metadata.length } Data</td><td>OK</td></tr>
                <tr><td>Table of Contents</td><td>{ daisy.toc.length } section</td><td>OK</td></tr>
                <tr><td>SMIL Files</td><td>{ daisy.items.smil.length } file</td><td>OK</td></tr>
                <tr><td>HTML Files</td><td>{ daisy.items.html.length } file</td><td>OK</td></tr>
                <tr><td>Image Files</td><td>{ daisy.items.image.length } file</td><td>OK</td></tr>
                <tr><td>Audio Files</td><td>{ daisy.items.audio.length } file</td><td>OK</td></tr>
                <tr><td>Data Dir</td><td>{ daisy.workingDir } file</td><td>OK</td></tr>
            </tbody>
            </table>
            </div>
        );
    }
}
