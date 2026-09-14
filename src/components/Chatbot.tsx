import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User, Phone, Mail } from 'lucide-react';
import { chatbotConfig } from '../config/chatbotConfig';
import { fetchProducts } from '../services/productService';

type Sender = 'user' | 'bot' | 'system';

interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isOptions?: boolean;
  options?: string[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [websiteContext, setWebsiteContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting popup
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowGreeting(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Fetch website context on load
  useEffect(() => {
    const loadContext = async () => {
      try {
        const products = await fetchProducts();
        const contextStr = products.map(p => 
          `Product: ${p.name}\nCategory: ${p.category_name} -> ${p.subcategory_name || ''}\nPrice: ${p.price > 0 ? '₹' + p.price : 'Contact for price'}\nStock: ${p.stock > 0 ? p.stock + ' in Stock' : 'Out of Stock'}\nDescription: ${p.description || 'No description available.'}`
        ).join('\n\n');
        
        const fullContext = `
Mechafy Global is a technology company offering IT Services, PCs, 3D Printers, and Accessories.
Here are our available products:
${contextStr}
        `;
        setWebsiteContext(fullContext);
      } catch (error) {
        console.error("Failed to load products for chatbot context:", error);
      }
    };
    loadContext();
  }, []);

  // Hide greeting if chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          text: chatbotConfig.welcomeMessage,
          sender: 'bot',
          timestamp: new Date(),
          isOptions: true,
          options: chatbotConfig.quickActions
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    if (text === "Talk to Mechafy Global Team") {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: `You can reach our team directly via:\nEmail: ${chatbotConfig.supportEmail}\nPhone: ${chatbotConfig.supportPhone}`,
            sender: 'bot',
            timestamp: new Date(),
            isOptions: true,
            options: ["Back to Menu"]
          }
        ]);
      }, 500);
      return;
    } else if (text === "Back to Menu") {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "How else can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
            isOptions: true,
            options: chatbotConfig.quickActions
          }
        ]);
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.sender === 'bot' ? 'model' : 'user', text: m.text })),
          context: websiteContext
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: data.text,
          sender: 'bot',
          timestamp: new Date(),
          isOptions: data.options && data.options.length > 0,
          options: data.options || []
        }
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `Error: ${error.message}. Please check your API keys or contact support.`,
          sender: 'bot',
          timestamp: new Date(),
          isOptions: true,
          options: ["Talk to Mechafy Global Team"]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[9999] transition-all duration-300`}>
      {/* Chat Button and Greeting */}
      {!isOpen && (
        <div className="relative flex flex-col items-end">
          {/* Greeting Popup */}
          <div 
            onClick={() => setIsOpen(true)}
            className={`absolute right-full bottom-0 mr-4 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-4 transition-all duration-500 origin-bottom-right cursor-pointer ${showGreeting ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-2 pointer-events-none'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-800 font-semibold text-sm">Hey there!</span>
            </div>
            <div className="text-slate-600 text-xs leading-relaxed">
              How can we help you today?
            </div>
            
            {/* Speech pointer */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-gray-100 transform rotate-45"></div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open support chat"
            className="relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
          >
            <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="flex flex-col w-[90vw] sm:w-[380px] h-[75vh] max-h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white relative">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Mechafy Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Minimize chat"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.sender === 'bot' ? (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex flex-col gap-2">
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user' 
                          ? 'bg-blue-50 text-slate-800 rounded-tr-sm font-medium' 
                          : 'bg-gray-100 text-slate-800 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Quick Actions (if any) */}
                    {msg.sender === 'bot' && msg.isOptions && msg.options && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-blue-700 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors text-left shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex max-w-[85%] gap-2 flex-row">
                  <div className="shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="bg-gray-100 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full max-h-32 bg-transparent text-sm text-slate-800 placeholder-gray-400 px-3 py-3 resize-none outline-none custom-scrollbar"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400 font-medium">AI Support Assistant • Powered by Mechafy Global</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
