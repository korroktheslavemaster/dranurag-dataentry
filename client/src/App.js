import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ListGroup, ListGroupItem } from "reactstrap";
import ReactJson from "react-json-view";

var DisplayResults = ({ results, onClick }) => (
  <ListGroup>
    {results.map((e, idx) => (
      <ListGroupItem
        key={idx}
        onClick={() => {
          onClick(e);
        }}
      >
        <span className="row">{e.name}</span>
        <small className="text-muted row">{e.manufacturer}</small>
      </ListGroupItem>
    ))}
  </ListGroup>
);

var Field = ({ txt, onChange, value }) => (
  <div className="row">
    <div className="col-6">{txt}</div>
    <div className="col-6">
      <input onChange={onChange} value={value} />
    </div>
  </div>
);

var DisplaySelectedResults = ({ results, onClick, inputCallbacks }) => (
  <ListGroup>
    {results.map((e, idx) => (
      <ListGroupItem key={idx}>
        <span
          className="row"
          onClick={() => {
            onClick(e);
          }}
        >
          {e.name}
        </span>
        <small className="text-muted row">{e.manufacturer}</small>
        {inputCallbacks.map(({ key, cb }, idx) => (
          <Field
            key={idx}
            txt={key}
            value={e[key]}
            onChange={event => {
              cb(e.listId, event.target.value);
            }}
          />
        ))}
      </ListGroupItem>
    ))}
  </ListGroup>
);

var listId = 0;
class App extends Component {
  state = {
    onemgResults: [],
    healthosResults: [],
    resultsToSave: []
  };

  fetchResults = (source, q) => {
    fetch("/autocomplete/" + source + "?q=" + q)
      .then(res => res.json())
      .then(res => this.setState({ [`${source}Results`]: res }));
  };

  onInputChange = event => {
    var q = event.target.value;
    if (q) ["onemg" /*, "healthos"*/].forEach(e => this.fetchResults(e, q));
  };

  onSave = () => {
    const { resultsToSave } = this.state;
    fetch("/addDrugs", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ docs: resultsToSave })
    }).then(res => {
      console.log(res);
      this.setState({ resultsToSave: [] });
    });
  };

  onAdd = e => {
    const { resultsToSave } = this.state;
    listId++;
    this.setState({
      resultsToSave: [...resultsToSave, { ...e, listId: listId }]
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
    const { onemgResults, healthosResults, resultsToSave } = this.state;
    return (
      <div className="App container">
        <input onChange={this.onInputChange} />
        <div className="row">
          <div className="col-6">
            <DisplayResults results={onemgResults} onClick={this.onAdd} />
          </div>
          <div className="col-6">
            <DisplaySelectedResults
              results={resultsToSave}
              onClick={this.onRemove}
              inputCallbacks={[
                "frequency",
                "specialComments",
                "duration",
                "dosage"
              ].map(key => ({
                key: key,
                cb: (listId, value) => this.onParamChanged(listId, value, key)
              }))}
            />
            <button className="btn btn-primary" onClick={this.onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
