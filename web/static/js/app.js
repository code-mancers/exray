import "phoenix_html"

import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux';
import {startConnection} from "./socket"

// Initial state of the store
const initialState = {
  // channel holds the Phoenix channel and subscribes to `events` topic
  channel: null,
  // All the events received so far in the format: {id: <id>, type: <string>}
  events: []
}

// Redux reducer for the app's store object
const appReducer = (state = initialState, action) => {
  let resetEvent = {
    id: 0,
    event_type: 'Connected to server'
  }

  switch (action.type) {
    case 'JOINED_CHANNEL':
      // Reset events when joining a channel
      return Object.assign({}, state, {channel: action.channel, events: [resetEvent]})

    case 'NEW_EVENT':
      console.log(action)

      // When receiving new events, add it to the list of events
      return Object.assign({}, state, {
        events: [
          {
            id: state.events.reduce((maxId, event) => Math.max(event.id, maxId), -1) + 1,
            event_type: action.event.type
          },
          ...state.events
        ]
      })
    default:
      return state;
  }
};

const store = createStore(appReducer);

// So that you can dispatch events from the console for testing
window.store = store;

// React component that renders a list of all events
const EventList = (props) => {
  return (<ul>
    {props.events.map(event =>
      <li key={event.id}> {event.event_type} </li>
    )}
  </ul>)
}

// Function that renders the list with latest store's state
const render = () => {
  ReactDom.render(<EventList events={store.getState().events}/>, document.getElementById('scene'));
}

// Render the list for the first time
render()
// Rerender the list whenever store changes
store.subscribe(render)
// Connect to server over websocket
startConnection(store);
