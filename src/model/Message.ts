import {ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum} from "openai/api";
import {ChatCompletionResponseMessage} from "openai";

class Message {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;

  constructor(role: ChatCompletionRequestMessageRoleEnum, content: string) {
    this.role = role;
    this.content = content;
  }

  toChatCompletionRequestMessage(): ChatCompletionRequestMessage {
    return {role: this.role, content: this.content}
  }

  static fromChatCompletionRequestMessage(message: ChatCompletionRequestMessage): Message {
    return new Message(message.role, message.content);
  }

  static fromChatCompletionResponseMessage(message: ChatCompletionResponseMessage): Message {
    return new Message(message.role, message.content);
  }
}

export default Message;
