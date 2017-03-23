// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export class DaisyItemList extends Component {
    render() {
        const htmlList = this.props.items;
        let i,l,list = [];

        list = htmlList.map((page , index) =>
            <tr key={ index }>
            <td>{page}</td>
            </tr>
        );

        return(
            <div className={"section"}>
            <h3>{ this.props.title }</h3>
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

export default class DaisyItems extends Component {

    _onClickOpenButton( e ) {
        const id = e.currentTarget.getAttribute('data-daisyId');
        const dir = e.currentTarget.getAttribute('data-daisyDir');

        ipcRenderer.send("daisy-open", {
            id: id,
            dir: dir
        });
    }

    render() {
        const daisy = this.props.daisy;
        const daisyId = daisy.id;
        const items = daisy.items;

        return(
            <div>
            <h2 className={"title-main"}>Daisy Items</h2>
            <div className={"page-btn-group"}>
                <button className={"btn btn-default"} onClick={this._onClickOpenButton}
                data-daisyId={daisyId} data-daisyDir={daisy.daisyDataDir} >
                <span className={"icon icon-folder icon-text"}></span> Open DAISY Directory
                </button>
            </div>

            { items.html ? <DaisyItemList items={items.html} title={'HTML'} /> : null }
            { items.smil ? <DaisyItemList items={items.smil} title={'SMIL'} /> : null }
            { items.audio ? <DaisyItemList items={items.audio} title={'Audio'} /> : null }
            { items.image ? <DaisyItemList items={items.image} title={'Images'} /> : null }
            { items.css ? <DaisyItemList items={items.css} title={'CSS'} /> : null }
            { items.other ? <DaisyItemList items={items.other} title={'Other Files'} /> : null }
            </div>
        );
    }
}
