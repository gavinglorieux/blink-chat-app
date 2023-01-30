import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chat } from "../types";
import ChatList from "./ChatList";

const mockChats: Chat[] = [
  {
    id: "1234",
    last_updated: "2020-05-04T03:37:18",
    name: "Conversation 1",
    messages: [],
  },
  {
    id: "5678",
    last_updated: "2020-01-18T02:37:10",
    name: "Conversation 2",
    messages: [],
  },
];

const mockOnClickChat = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ChatList", () => {
  test("renders a list of buttons for the chats provided in order of the last updated", () => {
    render(<ChatList chats={mockChats} onClickChat={mockOnClickChat} selectedChatId={null} />);

    const listItems = screen.getAllByRole("button");

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent("Conversation 2");
    expect(listItems[1]).toHaveTextContent("Conversation 1");
  });

  test("sets selected chat when chat button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatList chats={mockChats} onClickChat={mockOnClickChat} selectedChatId={null} />);

    const chat2Button = screen.getByText("Conversation 2");
    await user.click(chat2Button);

    expect(mockOnClickChat).toHaveBeenCalled();
    expect(mockOnClickChat).toHaveBeenCalledWith("5678");
  });

  test("sets selected chat when enter is pressed on the chat button", async () => {
    const user = userEvent.setup();
    render(<ChatList chats={mockChats} onClickChat={mockOnClickChat} selectedChatId={null} />);

    const chat2Button = screen.getByText("Conversation 2");
    await user.type(chat2Button, '{Enter}');

    expect(mockOnClickChat).toHaveBeenCalled();
    expect(mockOnClickChat).toHaveBeenCalledWith("5678");
  });
});
