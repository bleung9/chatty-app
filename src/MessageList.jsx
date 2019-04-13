import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    const listMapping = this.props.messages.map(function(message, cur_idx) {
      let temp = message.content;
      const regex = /((http)?s?:?(\/\/[^"']*?\.(?:png|jpg|jpeg|gif|png|svg))){1}/gi;
      
      // string manipulation approach (before I realized there's a g modifier)...keeping this code here b/c of the lolz...  
      // let url_to_replace = [];
      // let idx = [];
      // let offset = 0;
      // while (temp.search(regex) !== -1) {
      //   let result = temp.match(regex)[0];
      //   url_to_replace.push(result);
      //   idx.push(temp.indexOf(result) + offset);
      //   offset += result.length;
      //   temp = temp.replace(result, "");
      // }
      // temp = message.content;
      // let new_str = "";
      // for (let i = idx.length - 1; i >= 0; i--) {
      //   let img_url = `<img src='${url_to_replace[i]}' style="max-width: 150px"
      //   style="max-height: 200px"/>`;
      //   new_str = temp.substring(0, idx[i]) + img_url + temp.substring(idx[i] + url_to_replace[i].length, idx[i + 1]) + new_str.substring(idx[i + 1]);

      let new_str = message.content.replace(regex, "<img src='$1' style=\"max-width: 150px\" style=\"max-height: 200px\" />");
      !temp.includes("<img src=") ? message.content = new_str : message.content = temp; 
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

