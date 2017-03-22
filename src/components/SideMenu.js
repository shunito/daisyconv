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
            <span className={ this._isActive('epubGlobal') ? "nav-group-item active" : "nav-group-item" } data-menuId="epubGlobal" onClick={ this._onMenuSelect }>
                <span className={"icon icon-tools"}></span> Build Settings
            </span>
            <span className={ this._isActive('epubMetadata') ? "nav-group-item active" : "nav-group-item" } data-menuId="epubMetadata" onClick={ this._onMenuSelect }>
                <span className={"icon icon-vcard"}></span> Metadata
            </span>
            <span className={ this._isActive('epubCover') ? "nav-group-item active" : "nav-group-item" } data-menuId="epubCover" onClick={ this._onMenuSelect }>
                <span className={"icon icon-picture"}></span> Cover
            </span>
            <span className={ this._isActive('epubPages') ? "nav-group-item active" : "nav-group-item" } data-menuId="epubPages" onClick={ this._onMenuSelect }>
                <span className={"icon icon-book-open"}></span> Pages
            </span>
            </nav>
        );
    }

}


class SideMenu extends Component {

    render() {
        const isLoaded = this.props.operation.isLoaded;
        const mode = this.props.operation.menu;

        return(
            <div>
            {isLoaded ? (<SideMenuDaisy mode={mode}/>) : null }
            </div>
        );
    }
}


const sideMenuDOM = document.getElementById("sidemenu");

ipcRenderer.on("render", (sender, state) => {
    //console.log('on render sub :',sender ,state);
    ReactDOM.render(React.createElement(SideMenu, state), sideMenuDOM);
});
