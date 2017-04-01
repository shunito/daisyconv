// jshint esversion:6

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

import a11ySchema, {
    accessMode,
    accessibilityFeature,
    accessibilityHazard,
    accessibilityAPI,
    accessibilityControl } from '../constants/a11ySchema';

export class Checkbox extends Component {
    constructor(props) {
        super(props);
        const handle = this.props.handle;
        this.state = this.props;
        this.handleChange = handle.bind(this);
    }

    render() {
        this.state = this.props;
        let state = this.state;

        return (
            <label className={"check"}>
              <input type="checkbox" checked={ state.check } name={state.name} data-group={state.group} onChange={this.handleChange} /> {state.label}
            </label>
        );
    }
}

export default class EpubConfig extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.epub.config;
        this.stateNow = Object.assign({}, this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange( event ){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const group = event.currentTarget.getAttribute('data-group');
        let newConfigState;

        function toggleValue( s, c , v ){
            let result = [];
            if( c ){
                if( s.indexOf( v ) < 0 ){
                    s.push(v);
                    result = s;
                }
            }
            else{
                result = s.filter(function(val, i) {
                    return (val !== v);
                });
            }
            return result;
        }

        if( group === 'accessMode' ){
            //console.log( 'accessMode Array..' , this.state.a11y_accessMode);
            newConfigState = toggleValue( this.state.a11y_accessMode, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessMode: newConfigState})
        }else{
            this.state = Object.assign({}, this.state, {[name]: event.target.value})
        }

        this.setState( this.state );
    }

    handleSubmit(event) {
//      alert('A name was submitted: ' + this.state);
      event.preventDefault();
      this.stateNow = this.state;

      const value = this.state;
      console.log( value );
      console.log( this );

      ipcRenderer.send("dispatch-store", {
          type: 'EPUB_CONFIG_UPDATE',
          id : this.props.daisy.id,
          value: value
      });
    }

    render() {
        let state = this.state;
        let now = this.stateNow;
        let isCheck;
        let handle = this.handleChange;

        let accessModeList = accessMode.map(function( label, index ){
            isCheck = isCheck = state.a11y_accessMode.indexOf( label ) > -1 ? true : false;
            return (<Checkbox name={ label } check={isCheck} label={label} group={"accessMode"} handle={ handle } key={ index} />);
        });

        //console.log( state );

      return (
            <div>
            <h2 className={"title-main"}>EPUB Config</h2>
            <form onSubmit={this.handleSubmit}>

            <div className={"section"}>
            <h3>Basic Settings</h3>
            <table className={"table-striped table"}>
            <thead>
                <tr><th>Name</th><th>now</th><th>edit</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>Language</td><td>{ now.base_lang }</td>
                    <td><input type="text" value={ state.base_lang } name="base_lang" data-group="" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                    <td>Rendition layout</td><td>{ now.rendition_layout }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Rendition Orientation</td><td>{ now.rendition_orientation }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Rendition Spread</td><td>{ now.rendition_spread }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Viewport Setting</td><td>{ now.viewport }</td>
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
                <td>WCAG Level</td><td>{ now.a11y_wcag_level }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certified By</td><td>{ now.a11y_certifiedBy }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certifier Credential</td><td>{ now.a11y_certifierCredential }</td>
                <td></td>
            </tr>
            <tr>
                <td>Certifier Report</td><td>{ now.a11y_certifierReport }</td>
                <td></td>
            </tr>
                <tr>
                    <td>Aaccess Mode</td><td>{ now.a11y_accessMode.join(' ') }</td>
                    <td><div className={"checkbox"}>{ accessModeList }</div></td>
                </tr>
                <tr>
                    <td>Accessibility Feature</td><td>{ now.a11y_accessibilityFeature.join(' ') }</td>
                    <td>
                    <div className={"checkbox"}></div>
                    </td>
                </tr>
                <tr>
                    <td>Accessibility Hazard</td><td>{ now.a11y_accessibilityHazard }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Accessibility Summary</td><td>{ now.a11y_accessibilitySummary }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Accessibility API</td><td>{ now.a11y_accessibilityAPI }</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Accessibility Control</td><td>{ now.a11y_accessibilityControl }</td>
                    <td></td>
                </tr>
            </tbody>
            </table>
            </div>

            <div className={"form-actions"}>
                <button type="submit" className={"btn btn-form btn-primary"}>Update Configuration</button>
            </div>
            </form>
            </div>
        );
    }
}
