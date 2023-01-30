import React, { useEffect, useRef } from "react";
import { Chat, Message } from "../types";
import uniqid from "uniqid";
import "./ChatView.css";

interface ChatViewProps {
  chat: Chat;
  selectedMessage: Message | null;
  onSetMessage: (message: Message | null) => void;
  onSendMessage: (chatId: string, message: Message) => void;
  onEditMessage: (chatId: string, message: Message) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  chat,
  selectedMessage,
  onSetMessage,
  onSendMessage,
  onEditMessage,
}) => {
  const newMessageInputRef = useRef<HTMLInputElement>(null);
  const editMessageInputRef = useRef<HTMLInputElement>(null);
  const { messages, id } = chat;

  useEffect(() => {
    if (editMessageInputRef.current && selectedMessage) {
      editMessageInputRef.current.value = selectedMessage.text;
    }

    if (newMessageInputRef.current && !selectedMessage) {
      newMessageInputRef.current.value = "";
    }
  }, [selectedMessage]);

  const onSendHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (newMessageInputRef.current && newMessageInputRef.current.value) {
      const enteredMessage = newMessageInputRef.current.value;

      const newMessage = {
        id: uniqid(),
        text: enteredMessage,
        last_updated: new Date().toISOString(),
      };

      onSendMessage(id, newMessage);
      newMessageInputRef.current.value = "";
    }
  };

  const onEditHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      selectedMessage &&
      editMessageInputRef.current &&
      editMessageInputRef.current.value
    ) {
      const enteredMessage = editMessageInputRef.current.value;

      const editedMessage = {
        ...selectedMessage,
        text: enteredMessage,
        last_updated: new Date().toISOString(),
      };

      onEditMessage(id, editedMessage);
      onSetMessage(null);
      editMessageInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="chat-view__messages">
        {messages.map((message) => (
          <section
            key={message.id}
            onClick={() => {
              if (message.id === selectedMessage?.id) {
                onSetMessage(null);
              } else {
                onSetMessage(message);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (message.id === selectedMessage?.id) {
                  onSetMessage(null);
                } else {
                  onSetMessage(message);
                }
              }
            }}
            className={`message ${
              selectedMessage?.id === message.id && "message--selected"
            }`}
            tabIndex={0}
          >
            <div data-testid={`date:${message.id}`} className="message__date">
              {new Date(message.last_updated).toUTCString()}
            </div>
            <p data-testid={`message:${message.id}`} className="message__text">
              {message.text}
            </p>
          </section>
        ))}
      </div>
      <div className="chat-view__form">
        {selectedMessage ? (
          <form onSubmit={onEditHandler}>
            <label htmlFor={`edit-message-input-${selectedMessage?.id}`}>
              Message:
            </label>
            <input
              type="text"
              id={`edit-message-input-${selectedMessage?.id}`}
              ref={editMessageInputRef}
            />
            <button type="submit">Edit</button>
          </form>
        ) : (
          <form onSubmit={onSendHandler}>
            <label htmlFor="new-message-input">Message:</label>
            <input
              type="text"
              id="new-message-input"
              ref={newMessageInputRef}
              autoFocus
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </>
  );
};

export default ChatView;
