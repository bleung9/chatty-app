import React, {Component} from 'react';
import { SlowBuffer } from 'buffer';

class Chatbar extends Component {
  constructor(props) {
    super();
    this.state = {user: props.currentUser};
    this.userChange = this.userChange.bind(this);
    this.userSubmit = this.userSubmit.bind(this);
    this.submitChange = this.submitChange.bind(this);
  }

  userChange(event) {
    this.setState({user: event.target.value});
  }

  userSubmit(event) {
    if (event.charCode === 13 && event.target.value !== "" && this.props.currentUser !== this.state.user) {
      let new_user = event.target.value;
      this.props.submitNewUser(new_user);
    }
  }

  submitChange(event) {
    //13 is Enter key
    if (event.charCode === 13 && event.target.value !== "") {
      let new_message = event.target.value;
      event.target.value = "";
      if (this.props.currentUser !== this.state.user) {
        this.props.submitNewUser(this.state.user, this.props.submitMessage.bind(null, new_message));
      } else {
        this.props.submitMessage(new_message);
      }
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" value={this.state.user} onChange={this.userChange} onKeyPress={this.userSubmit}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.submitChange}/>
      </footer>
    );
  }
}
export default Chatbar;


