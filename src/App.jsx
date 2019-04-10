import React, {Component} from 'react';
import Message from './Message.jsx';
import Chatbar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      currentUser: {name: "Pikachu"},
      messages: []
    }
    this.submitMessage = this.submitMessage.bind(this);
    this.submitNewUser = this.submitNewUser.bind(this);
    this.socket = new WebSocket('ws://localhost:3001');
  }

  submitMessage(message) {
    let new_obj = {username: this.state.currentUser.name, content: message};
    this.socket.send(JSON.stringify(new_obj));
  }

  submitNewUser(user) {
    this.setState({currentUser: {name: user}});
  }

  componentDidMount() {
    console.log("componentDidMount <App />");

    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   const newMessage = {id: 3, username: "Ash", content: "PIKACHU! I FOUND YOU <3!!!!!"};
    //   const messages = this.state.messages.concat(newMessage)
    //   // Update the state of the app component.
    //   // Calling setState will trigger a call to render() in App and all child components.
    //   this.setState({messages: messages})
    // }, 3000);


    // This event listener is fired when the socket is opened (i.e. connected)
    this.socket.onopen = () => {
      console.log('Client connected');
    };

    // This event listener is fired whenever the socket receives a message from the server
    // The parameter e is a MessageEvent which contains the message from the server along with some metadata.
    this.socket.onmessage = event => {
      // the actual message from the server is contained in the `data` key
      let incoming = JSON.parse(event.data);
      this.setState({messages: [...this.state.messages, incoming]});
    };

    // This event listener is fired when the socket is closed (either by us or the server)
    this.onclose = () => {
      console.log('Client disconnected');
    };

}

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages}/>
        <Chatbar currentUser={this.state.currentUser.name} submitMessage={this.submitMessage} submitNewUser={this.submitNewUser}/>
      </div>
    );
  }
}
export default App;
