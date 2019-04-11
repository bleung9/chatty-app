import React, {Component} from 'react';
import Message from './Message.jsx';
import Chatbar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      currentUser: {name: "Pikachu"},
      messages: [],
      loggedIn: 0
    }
    this.submitMessage = this.submitMessage.bind(this);
    this.submitNewUser = this.submitNewUser.bind(this);
    this.socket = new WebSocket('ws://localhost:3001');
  }

  submitMessage(message) {
    let new_obj = {type: "postMessage", username: this.state.currentUser.name, content: message};
    this.socket.send(JSON.stringify(new_obj));
  }

  submitNewUser(user, callback) {
    let new_user_update = {"type": "postNotification", "content": `${this.state.currentUser.name} has changed their name to ${user}.`};
    this.setState({currentUser: {name: user}}, callback);
    this.socket.send(JSON.stringify(new_user_update));
  }

  componentDidMount() {
    console.log("componentDidMount <App />");

    // This event listener is fired when the socket is opened (i.e. connected)
    this.socket.onopen = () => {
      console.log('Browser client connected');
    };

    // This event listener is fired whenever the socket receives a message from the server
    // The parameter e is a MessageEvent which contains the message from the server along with some metadata.
    this.socket.onmessage = event => {
      if (typeof event.data === "string") {
        let num_of_users = Number(event.data);
        this.setState({loggedIn: num_of_users});
      } else {
        // the actual message from the server is contained in the `data` key of event object
        let incoming = JSON.parse(event.data);
        switch(incoming.type) {
          case "incomingMessage":
            // handle incoming message
            console.log("received incoming message from server of type:", incoming.type);
            break;
          case "incomingNotification":
            // handle incoming notification
            console.log("received incoming notification from server of type:", incoming.type);
            break;
          default:
            // show an error in the console if the message type is unknown
            throw new Error("Unknown event type " + data.type);
        };
        this.setState({messages: [...this.state.messages, incoming]});
      }

    // This event listener is fired when the socket is closed (either by us or the server)
    this.onclose = () => {
      console.log('Client disconnected');
    };
  }
}

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="num-logged-in">{this.state.loggedIn} Pikachu online</span>
        </nav>
        <MessageList messages={this.state.messages}/>
        <Chatbar currentUser={this.state.currentUser.name} submitMessage={this.submitMessage} submitNewUser={this.submitNewUser}/>
      </div>);
  }
}

export default App;
