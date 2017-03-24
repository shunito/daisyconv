// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class EpubCover extends Component {

    render() {
        const daisy = this.props.daisy;
        const epub = this.props.epub;

        return(
            <div>
            <h2 className={"title-main"}>EPUB Cover</h2>
            <div className={"section"}>
            <p>test { epub.id }</p>
            <p>画像を選択してカバーページの設定。daisy内の画像から選択か、画像の追加（解除）。</p>
            </div>
            </div>
        );
    }
}
