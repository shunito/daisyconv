// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class EpubConfig extends Component {

    render() {
        const daisy = this.props.daisy;
        const epub = this.props.epub;

        return(
            <div>
            <h2 className={"title-main"}>EPUB Config</h2>
            <div className={"section"}>
            <p>test { epub.id }</p>
            <p>TODO: EPUB生成の設定、rendition、ibooksメタデータ、EPUB a11yなど、一番重いところ。</p>
            </div>
            </div>
        );
    }
}
