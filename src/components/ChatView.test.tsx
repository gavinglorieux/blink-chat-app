import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chat } from "../types";
import ChatView from "./ChatView";

const mockChat: Chat = {
  id: "1234",
  last_updated: "2020-05-04T03:37:18",
  name: "Conversation 1",
  messages: [
    {
      id: "id-1",
      text: "Lorem Ipsum",
      last_updated: "2020-05-04T03:37:18",
    },
  ],
};

const mockSelectedMessage = null;
const mockOnSetMessage = jest.fn();
const mockOnSendMessage = jest.fn();
const mockOnEditMessage = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ChatView", () => {
  test("renders the messages for a particular chat", () => {
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockSelectedMessage}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );
    const chatMessage = screen.getByTestId("message:id-1");

    expect(chatMessage).toHaveTextContent("Lorem Ipsum");
  });

  test("renders the date for the messages", () => {
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockSelectedMessage}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );
    const chatMessageDate = screen.getByTestId("date:id-1");

    expect(chatMessageDate).toHaveTextContent("Mon, 04 May 2020 02:37:18 GMT");
  });

  test("calls onSend when new message is sent", async () => {
    const user = userEvent.setup();
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockSelectedMessage}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );
    const messageInput = screen.getByLabelText("Message:");
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.type(messageInput, "new message");
    await user.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalled();
    expect(mockOnSendMessage).toHaveBeenCalledWith(
      "1234",
      expect.objectContaining({
        text: "new message",
      })
    );
  });

  test("clears message input after message is sent", async () => {
    const user = userEvent.setup();
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockSelectedMessage}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );
    const messageInput = screen.getByLabelText("Message:");
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.type(messageInput, "new message");
    await user.click(sendButton);

    expect(messageInput).toHaveValue("");
  });

  test("does not call onSend when no new message is sent", async () => {
    const user = userEvent.setup();
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockSelectedMessage}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  test("shows edit message form with messaage text when there is a selected message", async () => {
    render(
      <ChatView
        chat={mockChat}
        selectedMessage={mockChat.messages[0]}
        onSetMessage={mockOnSetMessage}
        onSendMessage={mockOnSendMessage}
        onEditMessage={mockOnEditMessage}
      />
    );

    expect(screen.getByLabelText("Message:")).toHaveValue("Lorem Ipsum");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
