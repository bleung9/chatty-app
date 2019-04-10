import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    const listMapping = this.props.messages.map(message => (<Message message={message} key={message.id}/>));

    return (
      <main className="messages">
        <ul>{listMapping}</ul>
      </main>
    );
  }
}

export default MessageList;

