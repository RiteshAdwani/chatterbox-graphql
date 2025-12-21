import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useMessages } from "../../hooks/chat/useMessages";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import {
  ChatContainer,
  ChatHeader,
  ChatTitle,
  MessagesArea,
  MessageInputContainer,
  MessageInputWrapper,
  MessageTextarea,
  SendButton,
  EmptyState,
  MessageBubble,
  MessageContent,
  MessageText,
  MessageTime,
  MessageSender,
} from "../../pages/Chats/Chats.styles";

interface ChatWindowProps {
  currentUserId: string;
}

export function ChatWindow({ currentUserId }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId || "";

  const { messages, loading: messagesLoading } = useMessages(chatId);
  const { sendMessage, loading: sending } = useSendMessage(chatId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detect if it's a group chat by checking unique participants
  const uniqueParticipants = new Set(messages.map((m) => m.from.id));
  const isGroupChat = uniqueParticipants.size > 2;

  // Get chat title from first message's recipient or show generic title
  const chatTitle = messages.length > 0 && messages[0].from.id !== currentUserId
    ? messages[0].from.username
    : "Chat";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage(messageText.trim());
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time for messages
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>{chatTitle}</ChatTitle>
      </ChatHeader>

      <MessagesArea>
        {messagesLoading ? (
          <EmptyState>
            <Spin />
          </EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>No messages yet. Start the conversation!</EmptyState>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.from.id === currentUserId;
              return (
                <MessageBubble key={message.id} $isOwn={isOwnMessage}>
                  {!isOwnMessage && isGroupChat && (
                    <MessageSender>{message.from.username}</MessageSender>
                  )}
                  <MessageContent $isOwn={isOwnMessage}>
                    <MessageText>{message.text}</MessageText>
                    <MessageTime>{formatTime(message.createdAt)}</MessageTime>
                  </MessageContent>
                </MessageBubble>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesArea>

      <MessageInputContainer>
        <MessageInputWrapper>
          <MessageTextarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            rows={1}
          />
        </MessageInputWrapper>
        <SendButton
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!messageText.trim() || sending}
          loading={sending}
        />
      </MessageInputContainer>
    </ChatContainer>
  );
}
