export interface Message {
  id: string;
  text: string;
  last_updated: string;
}

export interface Chat {
  id: string;
  name: string;
  last_updated: string;
  messages: Message[];
}

export interface ChatAction {
  type: 'add-message' | 'edit-message',
  chatId: string,
  payload: Message
}
