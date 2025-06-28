"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smile,
  Paperclip,
  Loader2
} from 'lucide-react';
import { getContract } from "@/Hook/useContract";
import { Button } from "@/components/ui/button";
import { useAccount } from 'wagmi';

export const ChatView = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const { address } = useAccount();

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Formatting functions
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCircle2 className="w-3 h-3 text-blue-500" />;
      case 'read': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  const emojis = ['😊', '👍', '🎉', '💪', '🚀', '❤️', '😂', '🔥'];

  // Scroll function (declared first)
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Message handlers
  const handleNewMessage = useCallback((sender, messageId, content, timestamp) => {
    const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const isOwn = sender.toLowerCase() === address?.toLowerCase();
    
    setMessages(prev => {
      if (prev.some(msg => msg.id === messageId.toString())) {
        return prev;
      }
      return [
        ...prev,
        {
          id: messageId.toString(),
          sender,
          senderName: isOwn ? 'You' : `${sender.slice(0, 6)}...${sender.slice(-4)}`,
          content,
          timestamp: timestampNumber * 1000,
          avatar: sender.slice(2, 4).toUpperCase(),
          isOwn,
          status: 'delivered',
        }
      ];
    });
    setTimeout(() => scrollToBottom(), 100);
  }, [address]);

  const fetchMessages = useCallback(async () => {
    if (!contract || !address || hasFetchedRef.current) return;
    try {
      setIsLoading(true);
      setError(null);

      const totalBigInt = await contract.totalMessages();
      const total = Number(totalBigInt);
      if (total === 0) {
        setMessages([]);
        return;
      }

      const count = Math.min(20, total);
      const start = total > count ? total - count : 0;

      const fetchedMessages = await contract.getMessages(start, count);
      const formattedMessages = fetchedMessages.map((msg, index) => {
        const timestamp = typeof msg.timestamp === 'bigint' ? Number(msg.timestamp) : msg.timestamp;
        const isOwnMessage = msg.sender.toLowerCase() === address.toLowerCase();
        return {
          id: `${msg.sender}-${timestamp}-${index}`,
          sender: msg.sender,
          senderName: isOwnMessage ? 'You' : `${msg.sender.slice(0, 6)}...${msg.sender.slice(-4)}`,
          content: msg.content,
          timestamp: timestamp * 1000,
          avatar: msg.sender.slice(2, 4).toUpperCase(),
          isOwn: isOwnMessage,
          status: 'delivered',
        };
      });

      setMessages(formattedMessages);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [contract, address]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !contract || !isConnected || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      sender: address,
      senderName: 'You',
      content: newMessage,
      timestamp: Date.now(),
      avatar: address?.slice(2, 4).toUpperCase(),
      isOwn: true,
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
    setIsSending(true);

    try {
      const tx = await contract.sendMessage(newMessage);
      await tx.wait();
      setMessages((prev) =>
        prev.map((msg) => msg.id === tempId ? { ...msg, status: 'delivered' } : msg)
      );
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    } catch (err) {
      console.error("Message send failed:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Scroll handling
  const checkIfAtBottom = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkIfAtBottom);
    return () => container.removeEventListener('scroll', checkIfAtBottom);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom('auto');
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // Initialization
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum || !address || hasFetchedRef.current) return;

      try {
        setAccount(address);
        const freelancingContract = await getContract();
        setContract(prev => prev === freelancingContract ? prev : freelancingContract);
        await fetchMessages();
        setOnlineUsers(156);
        setIsConnected(true);
        freelancingContract.removeAllListeners("NewMessage");
        freelancingContract.on("NewMessage", handleNewMessage);
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to connect to chat. Please refresh and try again.");
      }
    };

    if (address) {
      init();
    }

    return () => {
      if (contract) {
        contract.removeAllListeners("NewMessage");
      }
    };
  }, [address, fetchMessages, handleNewMessage]);

  // Render
  return (
    <div className="flex flex-col h-screen pt-16">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col"
        style={{ overflowAnchor: 'none' }}
      >
        <div className="flex-1" />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          [...messages].reverse().map((message, index, reversedMessages) => {
            const showDate =
              index === 0 ||
              formatDate(message.timestamp) !== formatDate(reversedMessages[index - 1]?.timestamp);

            return (
              <div key={message.id} className="w-full">
                {showDate && (
                  <div className="flex justify-center my-2">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                )}
                <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
                  <div className={`flex ${message.isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-xs lg:max-w-md`}>
                    {!message.isOwn && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {message.avatar}
                      </div>
                    )}
                    <div className="flex flex-col">
                      {!message.isOwn && (
                        <p className="text-xs text-gray-500 mb-1 px-3">{message.senderName}</p>
                      )}
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${message.isOwn ? 
                        'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`flex items-center mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.isOwn && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-semibold">
                FC
              </div>
              <div className="bg-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 px-6 py-4">
        {!isConnected && !error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">Connecting to chat...</span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={!isConnected || isSending}
            />
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  className="p-1 hover:bg-gray-200 rounded-full" 
                  disabled={!isConnected || isSending}
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-50 w-48 bg-white border border-gray-200 rounded-xl shadow-xl ring-1 ring-black/5 p-3 grid grid-cols-4 gap-2">
                    {emojis.map((emoji, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        onClick={() => {
                          setNewMessage((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }} 
                        className="w-10 h-10 hover:bg-gray-100 transition rounded-full text-xl flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="p-1 hover:bg-gray-200 rounded-full" 
                disabled={!isConnected || isSending}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected || isSending} 
            className="p-3 disabled:opacity-50 shadow-lg transition-all"
            variant="fav"
          >
            {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </form>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};