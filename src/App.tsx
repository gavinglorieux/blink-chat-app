import React, { useReducer, useState, useMemo } from "react";
import chatData from "./data/chats.json";
import { ChatAction, Message, Chat } from "./types";
import ChatList from "./components/ChatList";
import ChatView from "./components/ChatView";
import "./App.css";

const initialState: Chat[] = chatData;

const reducer = (state: Chat[], action: ChatAction) => {
  const { type, payload, chatId } = action;

  switch (type) {
    case "add-message":
      return state.map((chat) => {
        if (chatId === chat.id) {
          return {
            ...chat,
            messages: [...chat.messages, { ...payload }],
            last_updated: payload.last_updated,
          };
        } else {
          return chat;
        }
      });
    case "edit-message":
      return state.map((chat) => {
        if (chatId === chat.id) {
          const messages = chat.messages.map((msg) => {
            return msg.id === payload.id ? payload : msg;
          });
          return { ...chat, messages, last_updated: payload.last_updated };
        } else {
          return chat;
        }
      });
    default:
      return state;
  }
};

function App() {
  const [chatState, dispatch] = useReducer(reducer, initialState);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const selectedChat = useMemo(
    () => chatState.find((chat: Chat) => chat.id === selectedChatId),
    [chatState, selectedChatId]
  );

  const onSendMessage = (chatId: string, message: Message) => {
    dispatch({ type: "add-message", payload: message, chatId });
  };

  const onEditMessage = (chatId: string, message: Message) => {
    dispatch({ type: "edit-message", payload: message, chatId });
  };

  return (
    <div className="chat-app">
      <div className="chat-app__chat-list">
        <ChatList
          chats={chatState}
          onClickChat={(id: string) => {
            setSelectedChatId(id);
            setSelectedMessage(null);
          }}
          selectedChatId={selectedChatId}
        />
      </div>
      <div className="chat-app__message-view">
        {selectedChat && (
          <ChatView
            chat={selectedChat}
            selectedMessage={selectedMessage}
            onSetMessage={setSelectedMessage}
            onSendMessage={onSendMessage}
            onEditMessage={onEditMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
