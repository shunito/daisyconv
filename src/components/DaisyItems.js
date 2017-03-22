// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class DaisyItems extends Component {

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
        const daisy = this.props.daisy;
        const items = daisy.items;
        const htmlList = items.html;
        var i,l,list = [];

        list = htmlList.map((page , index) =>
            <tr key={ index }>
            <td>{page}</td>
            </tr>
        );

        return(
            <div>
            <h2>Daisy Items</h2>
            <h3>HTML</h3>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>File Name</th></tr>
            </thead>
            <tbody>{list}</tbody>
            </table>
            </div>
        );
    }
}
