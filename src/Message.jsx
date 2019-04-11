import React, {Component} from 'react';

function Message(props) {
  let user_style = {
    color: props.message.color
  }
  if (props.message.type === "incomingMessage") {
    return (<li className="message">
              <span className="message-username" style={user_style}>{props.message.username} </span>
              <span className="message-content" dangerouslySetInnerHTML={{__html: props.message.content}}></span>
            </li>);
  } else {
    return (<div className="notification">
              <span className="notification-content">{props.message.content}</span>
            </div>);
    }
}



export default Message;