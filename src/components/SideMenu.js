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
        ipcRenderer.send("dispatch-store", {
            type: "MENU_SELECT",
            value: menu
        });
    }

    render() {
        return (
            <nav className={"nav-group"}>
              <h5 className={"nav-group-title"}>Daisy</h5>

              <span className={ this._isActive('daisy_status') ? "nav-group-item active" : "nav-group-item" } data-menuId="daisy_status" onClick={this._onMenuSelect}>
                  <span className={"icon icon-heart"}></span> Status
              </span>

              <span className={ this._isActive('daisy_metadata') ? "nav-group-item active" : "nav-group-item" } data-menuId="daisy_metadata" onClick={this._onMenuSelect}>
                  <span className={"icon icon-vcard"}></span> Metadata
              </span>

              <span className={ this._isActive('daisy_pages') ? "nav-group-item active" : "nav-group-item" } data-menuId="daisy_pages" onClick={this._onMenuSelect}>
                  <span className={"icon icon-book-open"}></span> Pages
              </span>

              <span className={ this._isActive('daisy_items') ? "nav-group-item active" : "nav-group-item" } data-menuId="daisy_items" onClick={this._onMenuSelect}>
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
        ipcRenderer.send("dispatch-store", {
            type: "MENU_SELECT",
            value: menu
        });
    }

    render() {
        return (
            <nav className={"nav-group"}>
            <h5 className={"nav-group-title"}>Build EPUB</h5>
            <span className={ this._isActive('epub_status') ? "nav-group-item active" : "nav-group-item" } data-menuId="epub_status" onClick={ this._onMenuSelect }>
                <span className={"icon icon-heart"}></span> Status
            </span>
            <span className={ this._isActive('epub_config') ? "nav-group-item active" : "nav-group-item" } data-menuId="epub_config" onClick={ this._onMenuSelect }>
                <span className={"icon icon-tools"}></span> Build Config
            </span>
            <span className={ this._isActive('epub_metadata') ? "nav-group-item active" : "nav-group-item" } data-menuId="epub_metadata" onClick={ this._onMenuSelect }>
                <span className={"icon icon-vcard"}></span> Metadata
            </span>
            <span className={ this._isActive('epub_cover') ? "nav-group-item active" : "nav-group-item" } data-menuId="epub_cover" onClick={ this._onMenuSelect }>
                <span className={"icon icon-picture"}></span> Cover
            </span>
            <span className={ this._isActive('epub_pages') ? "nav-group-item active" : "nav-group-item" } data-menuId="epub_pages" onClick={ this._onMenuSelect }>
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

        return(
            <div>
            {isLoaded ? (<SideMenuDaisy mode={mode}/>) : null }
            {isConvert ? (<SideMenuEPUB mode={mode}/>) : null }
            </div>
        );
    }
}


const sideMenuDOM = document.getElementById("sidemenu");

ipcRenderer.on("render", (sender, state) => {
    //console.log('on render sub :',sender ,state);
    ReactDOM.render(React.createElement(SideMenu, state), sideMenuDOM);
});
