import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User, Phone, Mail } from 'lucide-react';
import { chatbotConfig } from '../config/chatbotConfig';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // TODO: Integrate actual AI backend here
    // Placeholder response simulation
    setTimeout(() => {
      setIsTyping(false);
      let botText = "I'm currently in training mode! My full knowledge base will be integrated soon to answer your specific questions.";
      let showOptions = true;
      let nextOptions = chatbotConfig.quickActions;

      if (text === "Talk to Mechafy Global Team") {
        botText = `You can reach our team directly via:\nEmail: ${chatbotConfig.supportEmail}\nPhone: ${chatbotConfig.supportPhone}`;
        showOptions = true;
        nextOptions = ["Back to Menu"];
      } else if (text === "Back to Menu") {
        botText = "How else can I assist you today?";
        showOptions = true;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botText,
          sender: 'bot',
          timestamp: new Date(),
          isOptions: showOptions,
          options: nextOptions
        }
      ]);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-[9999]">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
          className="flex items-center justify-center w-14 h-14 bg-electric-blue text-navy-900 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 group"
        >
          <MessageCircle className="w-7 h-7 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="flex flex-col w-[90vw] sm:w-[380px] h-[75vh] max-h-[600px] bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-navy-800 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue border border-electric-blue/30 relative">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-navy-800 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Mechafy Assistant</h3>
                <p className="text-xs text-electric-blue">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Minimize chat"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-navy-900/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.sender === 'bot' ? (
                      <div className="w-6 h-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue text-xs">
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
                          ? 'bg-electric-blue text-navy-900 rounded-tr-sm font-medium' 
                          : 'bg-navy-800 text-slate-200 border border-white/5 rounded-tl-sm'
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
                            className="text-xs px-3 py-1.5 bg-navy-800 border border-electric-blue/30 text-cyan-100 rounded-full hover:bg-electric-blue hover:text-navy-900 transition-colors text-left"
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
                    <div className="w-6 h-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="bg-navy-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-navy-800 border-t border-white/10 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 bg-navy-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-electric-blue/50 transition-colors">
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
                  className="w-full max-h-32 bg-transparent text-sm text-white px-3 py-3 resize-none outline-none custom-scrollbar"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 p-3 bg-electric-blue text-navy-900 rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-slate-500">AI Support Assistant • Powered by Mechafy Global</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
