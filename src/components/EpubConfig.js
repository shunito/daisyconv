// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

import a11ySchema, {
    accessMode,
    accessibilityFeature,
    accessibilityHazard,
    accessibilityAPI,
    accessibilityControl } from '../constants/a11ySchema';

export class ConfigForm extends Component{

    render(){
        const config = this.props.config;
        return(
            <tr>
                <td>Language</td>
                <td>{ config.base_lang }</td>
                <td><input type="text" ref="base_lang" defaultValue={ config.base_lang } /></td>
            </tr>
        );
    }
}

export default class EpubConfig extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.epub.config;
        this._updateConfig = this._updateConfig.bind(this);
    }

    _updateConfig( e ){
        e.preventDefault();
        const base_lang = this.base_lang.value;
        console.log( this.state );
    }

    render() {

        let daisy = this.props.daisy;
        let epub = this.props.epub;
        let config = epub.config;
        let accessModeList = config.a11y_accessMode;
        let accessibilityFeatureList = config.a11y_accessibilityFeature;

        function _handleInputChange(event) {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            const group = event.currentTarget.getAttribute('data-group');
            let assign = [], result = [];

            console.log( group, name , value );

            if( group === 'a11y_accessMode' ){
                assign = accessModeList;
            }
            else{
                assign = accessibilityFeatureList;
            }

            if( value ){
                if( assign.indexOf( name ) < 0 ){
                    assign.push( name );
                }
                result = assign;
            }
            else{
                    result = assign.filter(function( v ){
                    return v != name;
                });
            }

            console.log( result );

            if( group === 'a11y_accessMode' ){
                config.a11y_accessMode = result;
            }
            else{
                config.a11y_accessibilityFeature = result;
            }

            console.log( config );
        }


        function _makeCheckboxs( list, checked ,group ){
            let i,l, box;
            let result = [];

            l = list.length;
            for(i=0;i<l;i++){
                if( checked.indexOf( list[i] ) > -1 ){
                    result.push(
                        <label className={"check"} key={i+1}>
                        <input type="checkbox" name={ list[i] } data-group={ group } defaultValue={ list[i] } defaultChecked={true}
                        onChange={_handleInputChange} />{list[i]}
                        </label>
                    );
                }
                else{
                    result.push(
                        <label className={"check"} key={i+1}>
                        <input type="checkbox" name={ list[i] } data-group={ group } defaultValue={ list[i] } onChange={_handleInputChange} />{list[i]}
                        </label>
                    );
                }
            }
            return result;
        }

        return(
            <div>
            <h2 className={"title-main"}>EPUB Config</h2>
            <form>

            <div className={"section"}>
            <p>test { epub.id }</p>
            <h3>Basic Settings</h3>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Name</th><th>now</th><th>edit</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>Language</td><td>{ config.base_lang }</td>
                    <td><input type="text" ref={(base_lang) => this.base_lang = base_lang} defaultValue={ config.base_lang } /></td>
                </tr>
                <tr>
                    <td>Rendition layout</td><td>{ config.rendition_layout }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Rendition Orientation</td><td>{ config.rendition_orientation }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Rendition Spread</td><td>{ config.rendition_spread }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Viewport Setting</td><td>{ config.viewport }</td>
                    <td>
                    width, height
                    </td>
                </tr>
            </tbody>
            </table>
            </div>

            <div className={"section"}>
            <h3>Accessibility Settings</h3>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Name</th><th>now</th><th>edit</th></tr>
            </thead>
            <tbody>
            <tr>
                <td>WCAG Level</td><td>{ config.a11y_wcag_level }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certified By</td><td>{ config.a11y_certifiedBy }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certifier Credential</td><td>{ config.a11y_certifierCredential }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certifier Report</td><td>{ config.a11y_certifierReport }</td>
                <td></td>
            </tr>
            <tr>
                <td>Aaccess Mode</td><td>{ config.a11y_accessMode.join(' ') }</td>
                <td>
                    <div className={"checkbox"}>{ _makeCheckboxs( accessMode, config.a11y_accessMode , 'a11y_accessMode' ) }</div>
                </td>
            </tr>
            <tr>
                <td>Accessibility Feature</td><td>{ config.a11y_accessibilityFeature.join('<br>') }</td>
                <td>
                <div className={"checkbox"}>{ _makeCheckboxs( accessibilityFeature, config.a11y_accessibilityFeature , 'a11y_accessibilityFeature' ) }</div>

                </td>
            </tr>
            <tr>
                <td>Accessibility Hazard</td><td>{ config.a11y_accessibilityHazard }</td>
                <td></td>
            </tr>
            <tr>
                <td>Accessibility Summary</td><td>{ config.a11y_accessibilitySummary }</td>
                <td></td>
            </tr>
            <tr>
                <td>Accessibility API</td><td>{ config.a11y_accessibilityAPI }</td>
                <td></td>
            </tr>
            <tr>
                <td>Accessibility Control</td><td>{ config.a11y_accessibilityControl }</td>
                <td></td>
            </tr>

            </tbody>
            </table>
            </div>


            <div className={"section"}>
                <button className={"btn btn-large btn-primary pull-right"} onClick={this._updateConfig}>Update Config</button>
            </div>

            </form>
            </div>
        );
    }
}
