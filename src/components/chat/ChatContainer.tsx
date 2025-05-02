
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatContainer = () => {
  return (
    <div className="border rounded-xl shadow-sm flex flex-col h-[75vh] bg-background">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
