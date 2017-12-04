import React, { Component } from "react";

import { ListGroup, ListGroupItem } from "reactstrap";
import { DisplayResults, DisplaySelectedResults } from "./SearchComponents";

var listId = 0;
class GenericEntry extends Component {
  state = {
    searchResults: [],
    resultsToSave: [],
    newestResultsTime: new Date()
  };

  fetchResults = (acEndpoint, q) => {
    var startTime = new Date();
    fetch(`${acEndpoint}?q=${q}`)
      .then(res => res.json())
      // only update if its a newer request
      .then(
        res =>
          this.state.newestResultsTime < startTime
            ? this.setState({
                searchResults: res,
                newestResultsTime: startTime
              })
            : this.state
      );
  };

  onInputChange = event => {
    const { acEndpoint } = this.props;
    var q = event.target.value;
    // single source only
    this.fetchResults(acEndpoint, q);
  };

  onSave = () => {
    const { resultsToSave } = this.state;
    const { saveEndpoint } = this.props;
    fetch(saveEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        docs: resultsToSave,
        prescriptionId: Math.random()
          .toString(36)
          .substring(7)
      })
    }).then(res => {
      console.log(res);
      this.setState({ resultsToSave: [] });
    });
  };

  onAdd = e => {
    const { resultsToSave } = this.state;
    console.log("adding element");
    console.log(e);
    listId++;
    this.setState({
      resultsToSave: [{ ...e, listId: listId }, ...resultsToSave]
    });
  };

  onRemove = e => {
    const { resultsToSave } = this.state;
    this.setState({
      resultsToSave: resultsToSave.filter(elm => elm.listId !== e.listId)
    });
  };

  onParamChanged = (listId, value, param) => {
    const { resultsToSave } = this.state;
    var elm = resultsToSave.find(e => e.listId === listId);
    if (elm) {
      this.setState({
        resultsToSave: resultsToSave.map(
          e => (e.listId === listId ? { ...e, [param]: value } : e)
        )
      });
    }
  };

  render() {
    const { searchResults, resultsToSave } = this.state;
    const { inputCallbackNames, displayKeys } = this.props;
    return (
      <div className="App container">
        <input onChange={this.onInputChange} />
        <div className="row">
          <div className="col">
            <DisplayResults
              results={searchResults}
              onClick={this.onAdd}
              {...displayKeys}
            />
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={this.onSave}>
              Save
            </button>
            <DisplaySelectedResults
              results={resultsToSave}
              onClick={this.onRemove}
              {...displayKeys}
              inputCallbacks={inputCallbackNames.map(key => ({
                key: key,
                cb: (listId, value) => this.onParamChanged(listId, value, key)
              }))}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GenericEntry;
