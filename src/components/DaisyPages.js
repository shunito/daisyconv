// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class DaisyPages extends Component {

    _levelIndent( level ){
        var i,l = parseInt(level) -1;
        var result = '';
        for(i=0;i<l;i++){
            result += '　';
        }
        return ( result + level );
    }

    _onSelectPage( e ){
        const id = e.currentTarget.getAttribute('data-pageId');
        //console.log( id );
        ipcRenderer.send("dispatch-store", {
            type: "PAGE_CHECK",
            value: id
        });
    }

    render() {
        var daisy = this.props.daisy;
        var ncc, pages = [];
        var i,l,list = [];

        if( typeof daisy !== 'undefined' ){
            pages = daisy.toc;
        }

        list = pages.map((page) =>
            <tr key={page.id} onClick={ this._onSelectPage } data-pageId={page.id}>
            <td className={"level"}>{ this._levelIndent(page.level) }</td>
            <td>{page.id}</td>
            <td>{page.href}</td>
            <td>{page.text}</td>
            </tr>
        );

        return(
            <div>
            <h2>DAISY Pages</h2>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Level</th><th>ID</th><th>href</th><th>Subject</th></tr>
            </thead>
            <tbody>{list}</tbody>
            </table>
            </div>
        );
    }
}
