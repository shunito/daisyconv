// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class SideMenuDaisy extends Component {
    constructor(props) {
      super(props);
    }

    _isActive( m ) {
        return this.props.mode === m;
    }

    _onMenuSelect( e ) {
        const menu = e.currentTarget.getAttribute('data-menuId');
        const id = e.currentTarget.getAttribute('data-projectId');

        ipcRenderer.send("dispatch-store", {
            type: menu,
            value: id
        });
    }

    render() {
        const id = this.props.id;

        return (
            <nav className={"nav-group"}>
              <h5 className={"nav-group-title"}>Daisy</h5>

              <span className={ this._isActive('VIEW_DAISY_STATUS') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_DAISY_STATUS" data-projectId={id} onClick={this._onMenuSelect}>
                  <span className={"icon icon-heart"}></span> Status
              </span>

              <span className={ this._isActive('VIEW_DAISY_METADATA') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_DAISY_METADATA" data-projectId={id} onClick={this._onMenuSelect}>
                  <span className={"icon icon-vcard"}></span> Metadata
              </span>

              <span className={ this._isActive('VIEW_DAISY_PAGES') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_DAISY_PAGES" data-projectId={id} onClick={this._onMenuSelect}>
                  <span className={"icon icon-book-open"}></span> Pages
              </span>

              <span className={ this._isActive('VIEW_DAISY_ITEMS') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_DAISY_ITEMS" data-projectId={id} onClick={this._onMenuSelect}>
                  <span className={"icon icon-docs"}></span> Items
              </span>

            </nav>
        );
    }
}

class SideMenuEPUB extends Component {
    constructor(props) {
      super(props);
    }

    _isActive( m ) {
        return this.props.mode === m;
    }

    _onMenuSelect( e ) {
        const menu = e.currentTarget.getAttribute('data-menuId');
        const id = e.currentTarget.getAttribute('data-projectId');

        ipcRenderer.send("dispatch-store", {
            type: menu,
            value: id
        });
    }

    render() {
        const id = this.props.id;

        return (
            <nav className={"nav-group"}>
            <h5 className={"nav-group-title"}>Build EPUB</h5>
            <span className={ this._isActive('VIEW_EPUB_STATUS') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_EPUB_STATUS" data-projectId={id} onClick={ this._onMenuSelect }>
                <span className={"icon icon-heart"}></span> Status
            </span>
            <span className={ this._isActive('VIEW_EPUB_CONFIG') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_EPUB_CONFIG" data-projectId={id} onClick={ this._onMenuSelect }>
                <span className={"icon icon-tools"}></span> Build Config
            </span>
            <span className={ this._isActive('VIEW_EPUB_METADATA') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_EPUB_METADATA" data-projectId={id} onClick={ this._onMenuSelect }>
                <span className={"icon icon-vcard"}></span> Metadata
            </span>
            <span className={ this._isActive('VIEW_EPUB_COVER') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_EPUB_COVER" data-projectId={id} onClick={ this._onMenuSelect }>
                <span className={"icon icon-picture"}></span> Cover
            </span>
            <span className={ this._isActive('VIEW_EPUB_PAGES') ? "nav-group-item active" : "nav-group-item" } data-menuId="VIEW_EPUB_PAGES" data-projectId={id} onClick={ this._onMenuSelect }>
                <span className={"icon icon-book-open"}></span> Pages
            </span>
            </nav>
        );
    }

}


class SideMenu extends Component {

    render() {
        const isLoaded = this.props.operation.isLoaded;
        const isBuild = this.props.epub.build;
        const isConvert = this.props.epub.convert;
        const mode = this.props.operation.menu;
        const id = this.props.operation.projectId;

        return(
            <div>
            {isLoaded ? (<SideMenuDaisy mode={mode} id={id}/>) : null }
            {isConvert ? (<SideMenuEPUB mode={mode} id={id}/>) : null }
            </div>
        );
    }
}


const sideMenuDOM = document.getElementById("sidemenu");

ipcRenderer.on("render", (sender, state) => {
    //console.log('on render sub :',sender ,state);
    ReactDOM.render(React.createElement(SideMenu, state), sideMenuDOM);
});
