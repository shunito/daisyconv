// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class EpubPages extends Component {

    render() {
        const daisy = this.props.daisy;
        const epub = this.props.epub;

        return(
            <div>
            <h2 className={"title-main"}>EPUB Pages</h2>
            <div className={"section"}>
            <p>test { epub.id }</p>
            <p>EPUBのHTMLごとにepub.typeを選択。HTMLはビルド時に自動生成なのでここでは見えない。</p>
            </div>
            </div>
        );
    }
}
