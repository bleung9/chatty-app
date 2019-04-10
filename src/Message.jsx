import React, {Component} from 'react';

function Message(props) {
  if (props.message.type === "incomingMessage") {
    return (<li className="message">
              <span className="message-username">{props.message.username}</span>
              <span className="message-content">{props.message.content}</span>
            </li>);
  } else {
    return (<div className="notification">
              <span className="notification-content">{props.message.content}</span>
            </div>);
    }
}

export default Message;