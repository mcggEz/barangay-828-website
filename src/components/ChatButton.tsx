import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Magandang araw! Ako ang inyong Barangay Assistant. Paano ko kayo matutulungan ngayon?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { text: data.message, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Pasensya na po, may problema sa aming sistema. Pakisubukan po muli mamaya.", 
          isUser: false 
        }]);
      }
    } catch {
      setMessages(prev => [...prev, { 
        text: "Pasensya na po, may problema sa aming sistema. Pakisubukan po muli mamaya.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setShowNewChatConfirm(true);
  };

  const confirmNewChat = () => {
    setMessages([{ text: "Magandang araw! Ako ang inyong Barangay Assistant. Paano ko kayo matutulungan ngayon?", isUser: false }]);
    setShowNewChatConfirm(false);
  };

  const cancelNewChat = () => {
    setShowNewChatConfirm(false);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 chat-button-container ${isOpen ? 'chat-open' : ''}`} style={{ zIndex: 9999 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-full sm:w-96 h-full sm:h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border-b border-gray-200 chat-container sm:chat-container max-w-[calc(100vw-1rem)] sm:max-w-none" style={{ 
          maxHeight: 'calc(100vh - 1rem)', 
          minHeight: '300px',
          zIndex: 10000
        }}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <Image src="/sk-logo.png" alt="SK Logo" width={24} height={24} className="object-contain sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">Barangay Assistant</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={handleNewChat}
                className="text-white hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-blue-700"
                title="New Chat"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-blue-700"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                {!message.isUser && (
                  <div className="mr-1 sm:mr-2 mt-1 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                    <Image src="/sk-logo.png" alt="Assistant" width={32} height={32} className="object-contain sm:w-12 sm:h-12" />
                  </div>
                )}
                <div>
                  <div
                    className={`inline-block rounded-2xl p-3 sm:p-4 max-w-[90%] sm:max-w-[85%] shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 sm:mt-2 font-medium ${message.isUser ? 'text-right' : 'text-left'}`}>
                    {message.isUser ? 'You' : 'Assistant'}
                  </div>
                </div>
              </div>
            ))}
             {isLoading && (
               <div className="text-left">
                 <div className="inline-block bg-white rounded-lg p-3 shadow-sm">
                   <div className="flex items-center space-x-2">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                     </div>
                     <span className="text-gray-500 text-sm">Assistant is typing...</span>
                   </div>
                 </div>
               </div>
             )}
            <div ref={messagesEndRef} />
          </div>

          {/* New Chat Confirmation */}
          {showNewChatConfirm && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white border border-yellow-300 rounded-xl p-4 max-w-sm shadow-lg">
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Start New Chat?</h3>
                  <p className="text-xs text-gray-600 mb-4">This will clear your current conversation.</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelNewChat}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmNewChat}
                      className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      New Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-2 sm:p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-1 sm:gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="I-type ang inyong mensahe..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-xs sm:text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[36px] sm:min-w-[40px]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
            {/* Privacy notice below input */}
            <div className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-gray-500 text-center">
              Data privacy: Personal information and message history is not stored.
            </div>
          </div>
        </div>
      )}

      {/* Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16"
          style={{ zIndex: 10000 }}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

    </div>
  );
};

export default ChatButton; 