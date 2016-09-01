// WrongAnswerEditor.js
'use strict';

require('./WrongAnswerEditor.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var SequenceNumberTexts = require('../../constants/AuthoringConstants').SequenceNumberTexts;

var WrongAnswerEditor = React.createClass({
    getInitialState: function () {
        var wrongAnswerText = this.props.text === '' ? '' : this.props.text;

        return {
            wrongAnswerText: wrongAnswerText
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    onChange: function (e) {
        // update via the parent
        var data = {
            index: this.props.index,
            text: this.state.wrongAnswerText
        };
        this.props.update(data);
    },
    removeWrongAnswer: function () {
        this.props.remove(this.props.index);
    },
    render: function () {
        var viewableIndex = this.props.index + 1,
            answerId = 'wrongAnswer' + viewableIndex,
            nthText = SequenceNumberTexts[this.props.index],
            placeholder = 'The ' + nthText + ' mis-direction answer',
            wrongAnswer = '';
        if (this.props.error) {
            wrongAnswer = <FormGroup controlId={answerId}
                              validationState="error">
                <div className="wrong-answer-header">
                    <ControlLabel className="wrong-answer-title">
                        Wrong Answer {viewableIndex}
                    </ControlLabel>
                    <Button onClick={this.addWrongAnswer}
                            bsStyle="danger">
                        <Glyphicon glyph="trash" />
                        Delete Wrong Answer
                    </Button>
                </div>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswerText}
                             onChange={this.onChange}
                             placeholder={placeholder} />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer = <FormGroup controlId={answerId}>
                <div className="wrong-answer-header">
                    <ControlLabel className="wrong-answer-title">
                        Wrong Answer {viewableIndex}
                    </ControlLabel>
                    <Button onClick={this.removeWrongAnswer}
                            bsStyle="danger">
                        <Glyphicon glyph="trash" />
                        Delete Wrong Answer
                    </Button>
                </div>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswerText}
                             onChange={this.onChange}
                             placeholder={placeholder} />
            </FormGroup>
        }

        return <div>
            {wrongAnswer}
        </div>
    }
});

module.exports = WrongAnswerEditor;