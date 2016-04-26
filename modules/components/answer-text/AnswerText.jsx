// AnswerText.js

'use strict';

require('./AnswerText.css');
require('../../../stylesheets/vendor/reactSelectOverride.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Select = require('react-select');

var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var LORelatedItemsBadge = require('../lo-related-items-badge/LORelatedItemsBadge');

var AnswerText = React.createClass({
    getInitialState: function () {
        var confusedLO = this.props.confusedLO === 'None linked yet' ? '' : this.props.confusedLO;
        return {
            confusedLO: confusedLO,
            showModal: false
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
        // this seems hacky...but without the timeout
        // it sets the height before the iframe content
        // has fully rendered, making the height 10px;
        var _this = this;
        window.setTimeout(function () {
            _this.setFrameHeight(_this.refs.myFrame);
        }, 100);
    },
    close: function () {
        this.setState({showModal: false});
        this.reset();
    },
    onChange: function (e) {
        if (e == null) {
            this.setState({ confusedLO: '' });
        } else {
            this.setState({ confusedLO: e.value });
        }
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    renderOutcomes: function () {
        return _.map(this.props.outcomes, function (outcome) {
            return <option value={outcome.id}
                           title={outcome.description.text}
                           key={outcome.id}>
                {outcome.displayName.text}
            </option>;
        });
    },
    reset: function () {

    },
    save: function (e) {
        var payload = {
            answerId: this.props.answerId,
            confusedLearningObjectiveId: this.state.confusedLO,
            itemId: this.props.itemId,
            libraryId: this.props.libraryId
        };

        Dispatcher.dispatch({
            type: ActionTypes.LINK_ANSWER_LO,
            content: payload
        });
        this.close();
    },
    setFrameHeight: function (frame) {
        // fix iFrame height
        // per http://www.dyn-web.com/tutorials/iframes/height/
        function getDocHeight(doc) {
            doc = doc || document;
            // stackoverflow.com/questions/1145850/
            var body = doc.body, html = doc.documentElement;
            var height = Math.max( body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight );
            return height;
        }
        function setIframeHeight(ifrm) {
            var doc = ifrm.contentDocument? ifrm.contentDocument:
                ifrm.contentWindow.document;
            ifrm.style.visibility = 'hidden';
            ifrm.style.height = "10px"; // reset to minimal height ...
            // IE opt. for bing/msn needs a bit added or scrollbar appears
            ifrm.style.height = getDocHeight( doc ) + 4 + "px";
            ifrm.style.visibility = 'visible';
        }
        setIframeHeight(frame);
    },
    wrapHTML: function (str) {
        return '<html>' +
                '<head>' +
                    '<style>body * {margin:0px;padding:4px;}</style>' +
                '</head>' +
                '<body style="margin:0px;">' + str + '</body' +
            '</html>';
    },
    render: function () {
        var formattedOutcomes = _.map(this.props.outcomes, function (outcome) {
            return {
                value: outcome.id,
                label: outcome.displayName.text
            };
        }),
            linkButton = '',
            answerHTML = this.wrapHTML(this.props.answerText);
//            answerHTML = this.props.answerText;

        if (!this.props.hideLinkBtn) {
            if (this.props.enableClickthrough) {
                linkButton = <div className="wrong-answer-actions">
                    <LORelatedItemsBadge confusedLO={this.state.confusedLO}
                                         libraryId={this.props.libraryId}
                                         relatedItems={this.props.relatedItems} />
                    <div>
                        <Button onClick={this.open} bsSize="small">
                            <Glyphicon glyph="link" />
                        </Button>
                    </div>
                    <Modal show={this.state.showModal} onHide={this.close}>
                        <Modal.Header closeButton>
                            <Modal.Title>Link Answer to Outcome</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <FormGroup controlId="outcomeSelector">
                                    <ControlLabel>Select a learning outcome ...</ControlLabel>
                                    <Select name="confusedOutcomeSelector"
                                            placeholder="Select an outcome ... "
                                            value={this.state.confusedLO}
                                            onChange={this.onChange}
                                            options={formattedOutcomes}>
                                    </Select>
                                </FormGroup>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                            <Button bsStyle="success" onClick={this.save}>Save</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            }
        } else {
            linkButton = <div className="right-answer-check">
                <Glyphicon glyph="ok" />
            </div>
        }

        return <div className="taggable-text">
            <div className="text-blob">
                <iframe ref="myFrame"
                        srcDoc={answerHTML}
                        frameBorder={0}
                        width="100%"
                        sandbox="allow-same-origin"
                        ></iframe>
            </div>
            {linkButton}
        </div>

    }
});

module.exports = AnswerText;