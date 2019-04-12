import React, {Component} from 'react';
import Chatbar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      currentUser: {name: "Pikachu"},
      messages: [],
      usersLoggedIn: 0
    }
    this.submitMessage = this.submitMessage.bind(this);
    this.submitNewUser = this.submitNewUser.bind(this);
    this.sendToServer = this.sendToServer.bind(this);
    this.socket = new WebSocket('ws://localhost:3001');
  }

  sendToServer(obj) {
    this.socket.send(JSON.stringify(obj));
  }

  submitMessage(message) {
    let new_obj = {type: "postMessage", username: this.state.currentUser.name, content: message, color: this.state.color};
    this.sendToServer(new_obj);
  }

  submitNewUser(user, callback) {
    let new_user_update = {"type": "postNotification", "content": `${this.state.currentUser.name} has changed their name to ${user}.`};
    this.setState({currentUser: {name: user}}, callback);
    this.sendToServer(new_user_update);
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
      let incoming = JSON.parse(event.data);
      console.log(incoming);
      console.log(Object.keys(incoming));
      if (Object.keys(incoming).includes("loggedIn")) {
        this.setState({usersLoggedIn: incoming.loggedIn});
        if (!this.state.color) {
          this.setState({color: incoming.color});
        }
      } else if (typeof incoming !== "object") {
          let num_of_users = Number(event.data);
          this.setState({usersLoggedIn: num_of_users});
      } else {
        // the actual message from the server is contained in the `data` key of event object
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
        this.setState({messages: [incoming, ...this.state.messages]});
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
          <a href="/" className="navbar-brand">Pika-chat</a>
          <span className="num-logged-in">{this.state.usersLoggedIn} Pikachu online</span>
        </nav>
        <MessageList messages={this.state.messages}/>
        <Chatbar currentUser={this.state.currentUser.name} submitMessage={this.submitMessage} submitNewUser={this.submitNewUser}/>
      </div>);
  }
}

//(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))

export default App;
