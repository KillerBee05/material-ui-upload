// *-* mode: rjsx -*-
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Card, CardHeader, CardMedia, CardActions} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import {SHA1} from 'jshashes';

import Upload from 'material-ui-upload/Upload';

import styles from './index.css';


export default class UploadPreview extends Component {

    static defaultProps = {
        title: '',
        label: 'Upload',
        fileTypeRegex: /^image.*$/,
        onFileLoad: (e, file) => undefined,
        onChange: (items,fileName) => undefined,
        initialItems: {},
        fileName:[]
    };

    static propTypes = {
        title: propTypes.string,
        label: propTypes.string,
        fileTypeRegex: propTypes.object,
        onFileLoad: propTypes.func,
        onChange: propTypes.func,
        initialItems: propTypes.object,
        fileName: _propTypes2.default.Array
    };

    exclusiveProps = [
        'title',
        'children',
        'onFileLoad',
        'initialItems'
    ];

    constructor(props) {
        super();
        this.state = {items: props.initialItems , fileName:[]};
    };

    onFileLoad = (e, file) => {
        let hash = new SHA1().hex(e.target.result);
        let items = {...this.state.items};
        items[hash] = e.target.result;
        let Images = [...this.state.fileName];
        Images.push(file);
        this.setState({ items, fileName: Images });

        this.props.onFileLoad(e, file);
        this.props.onChange(items , this.state.fileName);
    };

    onRemoveAllClick = (e) => {
        let items = {};
        const $this = this;
        this.state.fileName = [];
        this.setState({items});
        this.props.onChange(items,this.state.fileName);
        setTimeout(function() {$this.forceUpdate()},200);
    };

    onRemoveClick = (key) => (e) => {
        const $this = this;
        let items = {...this.state.items};
        delete items[key];
        _this.state.fileName.splice(fileName,1);
        var filename = _this.state.fileName;
        this.setState({ items , fileName: filename });
        this.props.onChange(items,this.state.fileName);
        setTimeout(function() {$this.forceUpdate()},200);
    };

    getUploadProps() {
        return Object
            .keys(this.props)
            .filter(
                (name) => this.exclusiveProps.indexOf(name) === -1
            )
            .reduce(
                (acc, name) => {
                    acc[name] = this.props[name];
                    return acc;
                },
                {onFileLoad: this.onFileLoad}
            );
    };

    renderPreview = (key , fileName) => (
        <div key={key} className={styles.PreviewContainer}>
          <img src={this.state.items[key]} className={styles.Image}/>
          <FloatingActionButton
            className={styles.RemoveItem}
            mini={true}
            onClick={this.onRemoveClick(key , fileName)}
            >
            <ContentRemove/>
          </FloatingActionButton>
        </div>
    );

    renderPreviews = () => (
        <div className={styles.PreviewsContainer}>
          {
              Object
                  .keys(this.state.items , this.state.fileName)
                  .map(this.renderPreview)
          }
        </div>
    );

    renderAddButton = () => (
        React.createElement(
            Upload,
            {
                onFileLoad: this.onFileLoad,
                // XXX: Force re-render on items change
                // see: https://github.com/corpix/material-ui-upload/issues/8
                key: Object.keys(this.state.items).length,
                ...this.getUploadProps()
            }
        )
    );

    renderRemoveButton = () => (
        <FlatButton
          label="Remove all"
          style={
              {
                  visibility: Object.keys(this.state.items).length
                      ? 'visible'
                      : 'hidden'
              }
          }
          onClick={this.onRemoveAllClick}
          />
    );

    render() {
        return (
            <Card>
              <CardHeader title={this.props.title}/>
              <CardMedia>
                {this.renderPreviews()}
              </CardMedia>
              <CardActions>
                <div className={styles.ActionsContainer}>
                  {this.renderAddButton()}
                  {this.renderRemoveButton()}
                </div>
              </CardActions>
            </Card>
        );
    };
}
