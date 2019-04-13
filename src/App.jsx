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

  //send a message object to the server
  sendToServer(obj) {
    this.socket.send(JSON.stringify(obj));
  }

  //assemble a message object, call sendtoServer to send message to server
  submitMessage(message) {
    let new_obj = {type: "postMessage", username: this.state.currentUser.name, content: message, color: this.state.color};
    this.sendToServer(new_obj);
  }

  //update state to reflect a username change
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
    this.socket.onmessage = event => {
      let incoming = JSON.parse(event.data);
      
      if (Object.keys(incoming).includes("loggedIn")) {
        //if someone just opened a new client in the browser, set the state to the random color that was assigned by the server.  if someone closed the client, they won't be assigned a color b/c the server won't send a color to the client to be updated
        this.setState({usersLoggedIn: incoming.loggedIn});
        if (!this.state.color) {
          this.setState({color: incoming.color});
        }
      } else if (typeof incoming !== "object") {
        //if someone closes the client, only a number is sent back by the server, so just update the usersLoggedIn to the number of users sent back by the server
          let num_of_users = Number(event.data);
          this.setState({usersLoggedIn: num_of_users});
      } else {
        //final condition is if the incoming message from server is someone typing in a message and submitting it, so just send that
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

export default App;
