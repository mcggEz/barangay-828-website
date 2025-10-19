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

  return (
    <div className={`fixed bottom-4 right-4 z-50 chat-button-container ${isOpen ? 'chat-open' : ''}`} style={{ zIndex: 9999 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 sm:w-96 h-96 sm:h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 chat-container sm:chat-container max-w-[calc(100vw-2rem)] sm:max-w-none" style={{ maxHeight: 'calc(100vh - 2rem)', minHeight: '400px' }}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image src="/sk-logo.png" alt="SK Logo" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Barangay Assistant</h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-blue-700"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                {!message.isUser && (
                  <div className="mr-2 mt-1 w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                    <Image src="/sk-logo.png" alt="Assistant" width={20} height={20} className="object-contain" />
                  </div>
                )}
                <div>
                  <div
                    className={`inline-block rounded-lg p-3 max-w-[85%] ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
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

          {/* Chat Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="I-type ang inyong mensahe..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[40px]"
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
            <div className="mt-2 text-[10px] text-gray-500 text-center">
              Data privacy: Personal information and message history is not stored.
            </div>
          </div>
        </div>
      )}

      {/* Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <svg
            className="w-6 h-6"
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