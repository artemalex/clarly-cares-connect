
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatContext } from "@/contexts/chat";

const ChatContainer = () => {
  const { isLoading } = useChatContext();

  return (
    <div className="border rounded-xl shadow-sm flex flex-col h-[75vh] bg-background">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
