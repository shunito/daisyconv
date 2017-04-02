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

export class RadioBtn extends Component {
    constructor(props) {
        super(props);
        const handle = this.props.handle;
        this.state = this.props;
        this.handleChange = handle.bind(this);
    }

    render() {
        this.state = this.props;
        let state = this.state;
        let isChecked = state.check  === state.label ? true : false;

        return (
            <label>
              <input type="radio" checked={ isChecked } name={state.name} value={state.label} data-group={state.group} onChange={this.handleChange} className={'radio'} /> {state.label}
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
        if ((event.which && event.which === 13) || (event.keyCode && event.keyCode === 13)) {
            return false;
        }
        const target = event.target;
        const name = target.name;
        const group = event.currentTarget.getAttribute('data-group');
        const oldState = JSON.parse(JSON.stringify(this.stateNow));
        let value = target.type === 'checkbox' ? target.checked : target.value;

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

        //console.log('change:', group, name, value );

        if( group === 'accessMode' ){
            newConfigState = toggleValue( this.state.a11y_accessMode, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessMode: newConfigState})
        }
        else if( group === 'accessibilityFeature' ){
            newConfigState = toggleValue( this.state.a11y_accessibilityFeature, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessibilityFeature: newConfigState})
        }
        else if( group === 'accessibilityHazard' ){
            newConfigState = toggleValue( this.state.a11y_accessibilityHazard, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessibilityHazard: newConfigState})
        }
        else if( group === 'accessibilityAPI' ){
            newConfigState = toggleValue( this.state.a11y_accessibilityAPI, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessibilityAPI: newConfigState})
        }
        else if( group === 'accessibilityControl' ){
            newConfigState = toggleValue( this.state.a11y_accessibilityControl, value , name );
            this.state = Object.assign({}, this.state, {a11y_accessibilityControl: newConfigState})
        } else{
            if( value === 'true' ){ value = true; }
            if( value === 'false' ){ value = false; }
            this.state = Object.assign({}, this.state, {[name]: value })
        }



        //console.log('new state:', this.state );

        this.stateNow = oldState;
        this.setState( this.state );
    }

    handleSubmit(event) {
      event.preventDefault();

      const value = this.state;
      this.stateNow = this.state;

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

        let accessibilityFeatureList = accessibilityFeature.map(function( label, index ){
            isCheck = isCheck = state.a11y_accessibilityFeature.indexOf( label ) > -1 ? true : false;
            return (<Checkbox name={ label } check={isCheck} label={label} group={"accessibilityFeature"} handle={ handle } key={ index} />);
        });

        let accessibilityHazardList = accessibilityHazard.map(function( label, index ){
            isCheck = isCheck = state.a11y_accessibilityHazard.indexOf( label ) > -1 ? true : false;
            return (<Checkbox name={ label } check={isCheck} label={label} group={"accessibilityHazard"} handle={ handle } key={ index} />);
        });

        let accessibilityAPIList = accessibilityAPI.map(function( label, index ){
            isCheck = isCheck = state.a11y_accessibilityAPI.indexOf( label ) > -1 ? true : false;
            return (<Checkbox name={ label } check={isCheck} label={label} group={"accessibilityAPI"} handle={ handle } key={ index} />);
        });

        let accessibilityControlList = accessibilityControl.map(function( label, index ){
            isCheck = isCheck = state.a11y_accessibilityControl.indexOf( label ) > -1 ? true : false;
            return (<Checkbox name={ label } check={isCheck} label={label} group={"accessibilityControl"} handle={ handle } key={ index} />);
        });

        //console.log('state:', state );
        //console.log('now:', now );
        let isV

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
                    <td><input type="text" value={ state.base_lang } name="base_lang" data-group="" onChange={this.handleChange} className={"small"} /></td>
                </tr>
                <tr>
                    <td>Rendition layout</td><td>{ now.rendition_layout }</td>
                    <td>
                    <div className={"radio"}>
                    <RadioBtn name={'rendition_layout'} check={state.rendition_layout} label={'reflowable'} group={"rendition_layout"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_layout'} check={state.rendition_layout} label={'pre-paginated'} group={"rendition_layout"} handle={ this.handleChange } />
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>Rendition Orientation</td><td>{ now.rendition_orientation }</td>
                    <td>
                    <div className={"radio"}>
                    <RadioBtn name={'rendition_orientation'} check={state.rendition_orientation} label={'auto'} group={"rendition_orientation"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_orientation'} check={state.rendition_orientation} label={'portrait'} group={"rendition_orientation"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_orientation'} check={state.rendition_orientation} label={'landscape'} group={"rendition_orientation"} handle={ this.handleChange } />
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>Rendition Spread</td><td>{ now.rendition_spread }</td>
                    <td>
                    <div className={"radio"}>
                    <RadioBtn name={'rendition_spread'} check={state.rendition_spread} label={'auto'} group={"rendition_spread"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_spread'} check={state.rendition_spread} label={'none'} group={"rendition_spread"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_spread'} check={state.rendition_spread} label={'portrait'} group={"rendition_spread"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_spread'} check={state.rendition_spread} label={'landscape'} group={"rendition_spread"} handle={ this.handleChange } />
                    <RadioBtn name={'rendition_spread'} check={state.rendition_spread} label={'both'} group={"rendition_spread"} handle={ this.handleChange } />
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>Viewport Setting</td><td>{ now.viewport ? 'ON' : 'OFF' }</td>
                    <td>
                    <div className={"radio"}>
                    <label><input type="radio" name="viewport" data-group="viewport" value={ true } checked={ state.viewport } onChange={this.handleChange} /> ON</label>
                    <label><input type="radio" name="viewport" data-group="viewport" value={ false } checked={ !state.viewport } onChange={this.handleChange} /> OFF</label>
                    </div>
                    <p className={"text"}>
                        <label>Width <input type="text" defaultValue={ state.viewport_width } name="viewport_width" data-group="" onChange={this.handleChange} disabled={!state.viewport} className={"micro"} /></label>
                        <label>Height <input type="text" defaultValue={ state.viewport_height } name="viewport_height" data-group="" onChange={this.handleChange} disabled={!state.viewport} className={"micro"} /></label></p>
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
                <td><span className={"must"}>MUST</span><br />
                Conforms To (WCAG 2.0 Level)</td><td>{ now.a11y_conformsTo }</td>
                <td>
                <div className={"radio"}>
                <RadioBtn name={'a11y_conformsTo'} check={state.a11y_conformsTo} label={'A'} group={"a11y_conformsTo"} handle={ this.handleChange } />
                <RadioBtn name={'a11y_conformsTo'} check={state.a11y_conformsTo} label={'AA'} group={"a11y_conformsTo"} handle={ this.handleChange } />
                <RadioBtn name={'a11y_conformsTo'} check={state.a11y_conformsTo} label={'AAA'} group={"a11y_conformsTo"} handle={ this.handleChange } />
                </div>
                </td>
            </tr>
            <tr>
                <td><span className={"must"}>MUST</span><br />
                Certified By</td><td>{ now.a11y_certifiedBy }</td>
                <td><input type="text" value={ state.a11y_certifiedBy } name="a11y_certifiedBy" data-group="" onChange={this.handleChange} className={"max"} /></td>
            </tr>
            <tr>
                <td><span className={"must"}>MUST</span><br />
                Aaccess Mode</td><td>{ now.a11y_accessMode.join(', ') }</td>
                <td><div className={"checkbox"}>{ accessModeList }</div></td>
            </tr>
            <tr>
                <td><span className={"must"}>MUST</span><br />
                Accessibility Feature</td><td>{ now.a11y_accessibilityFeature.join(', ') }</td>
                <td><div className={"checkbox"}>{ accessibilityFeatureList }</div></td>
            </tr>
            <tr>
                <td><span className={"must"}>MUST</span><br />
                Accessibility Hazard</td><td>{ now.a11y_accessibilityHazard.join(', ') }</td>
                <td><div className={"checkbox"}>{ accessibilityHazardList }</div></td>
            </tr>
            <tr>
                <td><span className={"must"}>MUST</span><br />
                Accessibility Summary</td><td>{ now.a11y_accessibilitySummary }</td>
                <td><textarea value={ state.a11y_accessibilitySummary } name="a11y_accessibilitySummary" onChange={this.handleChange} className={"max"} /></td>
            </tr>
            <tr>
                <td><span className={"optional"}>OPTIONAL</span><br />
                Certifier Credential</td><td>{ now.a11y_certifierCredential }</td>
                <td><input type="text" value={ state.a11y_certifierCredential } name="a11y_certifierCredential" data-group="" onChange={this.handleChange} className={"max"} /></td>
            </tr>
            <tr>
                <td><span className={"optional"}>OPTIONAL</span><br />
                Certifier Report</td><td>{ now.a11y_certifierReport }</td>
                <td><input type="text" value={ state.a11y_certifierReport } name="a11y_certifierReport" data-group="" onChange={this.handleChange} className={"max"} /></td>
            </tr>
            <tr>
                <td><span className={"optional"}>OPTIONAL</span><br />
                Accessibility API</td><td>{ now.a11y_accessibilityAPI.join(', ') }</td>
                <td><div className={"checkbox"}>{ accessibilityAPIList }</div></td>
            </tr>
            <tr>
                <td><span className={"optional"}>OPTIONAL</span><br />
                Accessibility Control</td><td>{ now.a11y_accessibilityControl.join(', ') }</td>
                <td><div className={"checkbox"}>{ accessibilityControlList }</div></td>
            </tr>
            </tbody>
            </table>
            </div>

            <div className={"form-actions"}>
                <button type="button" className={"btn btn-form btn-primary"} onClick={this.handleSubmit}>Update Configuration</button>
            </div>
            </form>
            </div>
        );
    }
}
