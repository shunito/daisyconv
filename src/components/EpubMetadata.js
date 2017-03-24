// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class EpubMetadata extends Component {

    render() {
        const daisy = this.props.daisy;
        const epub = this.props.epub;

        return(
            <div>
            <h2 className={"title-main"}>EPUB Metadata</h2>
            <div className={"section"}>
            <p>test { epub.id }</p>
            <p>DAISYからコンバートしたメタデータの確認と、利用の設定、追加、削除。ここも結構重い。</p>
            </div>
            </div>
        );
    }
}
