import React from "react";
import { Chat } from "../types";
import "./ChatList.css";

interface ChatListProps {
  chats: Chat[];
  onClickChat: (chatId: string) => void;
  selectedChatId: string | null;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onClickChat,
  selectedChatId,
}) => {
  const sortedChats = chats.sort((a, b) => {
    return Date.parse(a.last_updated) - Date.parse(b.last_updated);
  });

  return (
    <ul>
      {sortedChats.map((chat) => (
        <li
          className={`chat-list__button ${
            selectedChatId === chat.id && "chat-list__button--selected"
          }`}
          key={chat.id}
          role="button"
          onClick={() => onClickChat(chat.id)}
          onKeyDown={(event) => {if (event.key === "Enter") onClickChat(chat.id);}}
          tabIndex={0}
        >
          {chat.name}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
