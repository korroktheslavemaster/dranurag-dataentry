import React, { Component } from "react";

import { ListGroup, ListGroupItem } from "reactstrap";

export var DisplayResults = ({
  results,
  onClick,
  primaryDisplayKey,
  secondaryDisplayKeys
}) => (
  <ListGroup>
    {results.map((e, idx) => (
      <ListGroupItem
        key={idx}
        onClick={() => {
          onClick(e);
        }}
      >
        <span className="row">{e[primaryDisplayKey]}</span>
        {secondaryDisplayKeys.map((secondaryDisplayKey, idx) => (
          <small key={idx} className="text-muted row">
            {e[secondaryDisplayKey]}
          </small>
        ))}
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

export var DisplaySelectedResults = ({
  results,
  onClick,
  inputCallbacks,
  primaryDisplayKey,
  secondaryDisplayKeys
}) => (
  <ListGroup>
    {results.map((e, idx) => (
      <ListGroupItem key={idx}>
        <span
          className="row"
          onClick={() => {
            onClick(e);
          }}
        >
          {e[primaryDisplayKey]}
        </span>
        {secondaryDisplayKeys.map((secondaryDisplayKey, idx) => (
          <small key={idx} className="text-muted row">
            {e[secondaryDisplayKey]}
          </small>
        ))}
        {inputCallbacks.map(({ key, cb }, idx) => (
          <Field
            key={idx}
            txt={key}
            value={e[key] || ""}
            onChange={event => {
              cb(e.listId, event.target.value);
            }}
          />
        ))}
      </ListGroupItem>
    ))}
  </ListGroup>
);
