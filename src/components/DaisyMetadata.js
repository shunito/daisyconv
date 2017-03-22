// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class DaisyMetadata extends Component {
    render() {
        var daisy = this.props.daisy;
        var ncc, metadatas = [];
        var i,l,list = [];

        if( typeof daisy !== 'undefined' ){
            metadatas = daisy.metadata;
        }

        list = metadatas.map((metadata, index) =>
            <tr key={index}>
            <td>{metadata.meta}</td>
            <td>{metadata.type}</td>
            <td>{metadata.scheme}</td>
            <td>{metadata.content}</td>
            </tr>
        );

        return(
            <div>
            <h2>DAISY Metadeta</h2>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Metadata</th><th>Type</th><th>Scheme</th><th>Content</th></tr>
            </thead>
            <tbody>{list}</tbody>
            </table>
            </div>
        );
    }
}
