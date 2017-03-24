// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export default class EpubStatus extends Component {

    render() {
        const daisy = this.props.daisy;
        const epub = this.props.epub;

        return(
            <div>
            <h2 className={"title-main"}>EPUB Status</h2>
            <div className={"section"}>
            <p>test { epub.id }</p>
            <p>TODO: epub.historyからデータコンバートとEPUB生成のログを表示。ビルドボタンもここに。</p>
            </div>
            </div>
        );
    }
}
