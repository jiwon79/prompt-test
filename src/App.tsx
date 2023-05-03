import React, {useRef, useState} from 'react';
import {Configuration, OpenAIApi} from "openai";
import Input from "./components/Input/Input";
import Message from "./model/Message";
import Dialog from "./components/Dialog/Dialog";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function App() {
  const [system, setSystem] = useState("");
  const [introPrefix, setIntroPrefix] = useState("");
  const [introSuffix, setIntroSuffix] = useState("");
  const [bodyPrefix, setBodyPrefix] = useState("");
  const [bodySuffix, setBodySuffix] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const currentRole = useRef<string>("user");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const reset = () => {
    setMessages([]);
    messagesRef.current = [];
  }

  const addMessage = (text: string) => {
    if (text === "") return;
    if (messages.length === 0) {
      const systemMessage: Message = new Message("system", system);
      const userText = currentRole.current === "user" ? [introPrefix, text, introSuffix].join(" ") : text;
      // @ts-ignore
      const message: Message = new Message(currentRole.current, userText);
      setMessages(messages => [...messages, systemMessage, message]);
      messagesRef.current.push(systemMessage, message);
    } else {
      const userText = currentRole.current === "user" ? [bodyPrefix, text, bodySuffix].join(" ") : text;
      // @ts-ignore
      const message: Message = new Message(currentRole.current, userText);
      setMessages(messages => [...messages, message]);
      messagesRef.current.push(message);
    }
    setText("");
  }

  const softRequest = async (text: string) => {
    addMessage(text);
  }

  const request = async (text: string) => {
    addMessage(text);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesRef.current.map(message => message.toChatCompletionRequestMessage()),
    });
    const newMessage = Message.fromChatCompletionResponseMessage(completion.data.choices[0].message!);
    setMessages(messages => [...messages, newMessage]);
    messagesRef.current.push(newMessage);
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing) {
      request(text);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <div>
        <Input label={"System"} text={system} setText={setSystem} rows={8} />
        <Input label={"Intro Prefix"} text={introPrefix} setText={setIntroPrefix} />
        <Input label={"Intro Suffix"} text={introSuffix} setText={setIntroSuffix} />
        <Input label={"Body Prefix"} text={bodyPrefix} setText={setBodyPrefix} />
        <Input label={"Body Suffix"} text={bodySuffix} setText={setBodySuffix} />
      </div>
      <div>
        <button onClick={(e) => reset()}>reset</button>
      </div>
      <Dialog messages={messages} isLoading={isLoading} />
      <div>
        <select value={currentRole.current} onChange={(e) => {currentRole.current = e.target.value}}>
          <option value="system">system</option>
          <option value="assistant">assistant</option>
          <option value="user">user</option>
        </select>
        <textarea
          ref={textareaRef}
          onKeyDown={onKeyDown}
          onChange={onChange}
          value={text}
          cols={50}
          rows={3}
        />
        <button onClick={() => request(text)}>전송</button>
        <button onClick={() => softRequest(text)}>추가</button>
      </div>
    </div>
  );
}

export default App;
