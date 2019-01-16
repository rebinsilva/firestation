import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import AceEditor from "react-ace";
import "brace/mode/sql";
import "brace/theme/github";
import "brace/ext/language_tools";

import store from "../stores/Store";

class Workbook extends Component {
  constructor() {
    super();
    this.codeRef;
  }

  componentDidUpdate() {
    //query inserted, move to end of workbook
    if (store && store.focus.get() && this.codeRef) {
      this.codeRef.editor.focus();
      this.codeRef.editor.navigateFileEnd();
      store.focus.set(false);
    }
  }

  render() {
    const { execute, defaultValue, listenForCtrlEnter } = this.props;

    if (!store) {
      return <span />;
    }

    let commands = [
      {
        name: "execute",
        exec: execute,
        bindKey: { mac: "cmd-enter", win: "ctrl-enter" }
      }
    ];

    let selectedTextChange = (newValue, e) => {
      store.selectedText.set(this.codeRef.editor.getSelectedText());
    };

    return (
      // add props enableBasicAutocompletion, enableLiveAutocompletion
      // to re-enable autocomplete
      <div className="Workbook" id="workbook-query">
        <AceEditor
          className="AceEditor"
          mode="sql"
          theme="github"
          height="25vh"
          width="100%"
          fontSize={14}
          ref={el => (this.codeRef = el)}
          onKeyDown={listenForCtrlEnter}
          onChange={e => {
            store.query.set(e);
          }}
          defaultValue={defaultValue}
          value={store.query.get()}
          name="UNIQUE_ID_OF_DIV"
          commands={commands}
          editorProps={{ $blockScrolling: true }}
          onSelectionChange={selectedTextChange}
        />
      </div>
    );
  }
}

Workbook.propTypes = {
  defaultValue: PropTypes.string,
  execute: PropTypes.func,
  listenForCtrlEnter: PropTypes.func
};

export default observer(Workbook);
