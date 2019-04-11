import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    const listMapping = this.props.messages.map(function(message) {
      let temp = message.content;
      const regex = /{(http)?s?:?(\/\/[^"']*?\.(?:png|jpg|jpeg|gif|png|svg))/g;

      temp.replace()
      let url_to_replace = [];
      let idx = [];
      let offset = 0;
      while (temp.search(regex) !== -1) {
        let result = temp.match(regex)[0];
        url_to_replace.push(result);
        idx.push(temp.indexOf(result) + offset);
        offset += result.length;
        temp = temp.replace(result, "");
      }
      temp = message.content;
      let new_str = "";
      for (let i = idx.length - 1; i >= 0; i--) {
        let img_url = `<img src='${url_to_replace[i]}>'`;
        new_str = temp.substring(0, idx[i]) + img_url + new_str;
        console.log(new_str);
      }
      console.log(new_str);
      message.content = new_str;
      return (<Message message={message} key={message.id}/>);
    });

    return (
      <main className="messages">
        <ul>{listMapping}</ul>
      </main>
    );
  }
}

export default MessageList;

