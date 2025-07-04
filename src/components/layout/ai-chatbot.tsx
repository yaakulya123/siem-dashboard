'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const aiResponses = {
  greeting: "Hello! I'm your AI Security Assistant. I can help you analyze threats, investigate alerts, and provide security insights. How can I assist you today?",
  threats: "I've analyzed the current threat landscape. There are 5 critical threats detected in the last hour, with increased APT activity from Eastern Europe. Would you like me to prioritize them by risk score?",
  alerts: "I've processed 1,247 alerts using machine learning. 12 require immediate attention based on behavioral analysis. Shall I create automated response workflows?",
  compliance: "AI compliance monitoring shows 94% adherence to security frameworks. I've identified 3 areas for improvement and can generate remediation plans automatically.",
  help: "I can assist with:\n• Threat intelligence analysis\n• Alert prioritization using ML\n• Automated incident response\n• Compliance gap analysis\n• Security pattern recognition\n• Risk assessment automation",
  unknown: "I'm analyzing your query using natural language processing. Could you please clarify what specific security aspect you'd like me to help with?"
};

const quickSuggestions = [
  "Analyze current threats",
  "Prioritize critical alerts", 
  "Generate security report",
  "Check compliance status",
  "Investigate anomalies",
  "Suggest response actions"
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: aiResponses.greeting,
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 3)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('threat') || msg.includes('attack') || msg.includes('malware')) {
      return aiResponses.threats;
    } else if (msg.includes('alert') || msg.includes('incident') || msg.includes('detection')) {
      return aiResponses.alerts;
    } else if (msg.includes('compliance') || msg.includes('regulation') || msg.includes('audit')) {
      return aiResponses.compliance;
    } else if (msg.includes('help') || msg.includes('what can you do')) {
      return aiResponses.help;
    } else {
      return aiResponses.unknown;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(content),
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3) + 3)
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group animate-float"
          >
            <div className="relative">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-gray-800/50">
              AI Security Assistant
            </span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/70 dark:border-gray-700/50 w-96 h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-500/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner animate-pulse-slow">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Security Assistant</h3>
                  <div className="flex items-center text-xs opacity-90">
                    <div className="status-dot active"></div>
                    <span className="ml-1.5">Active & Learning</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-blue-500/30 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-md'
                      : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl rounded-tl-sm shadow-md border border-gray-100/50 dark:border-gray-600/30'
                  } p-3.5 text-sm`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                          <CpuChipIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-medium opacity-70">Quick actions:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-blue-50/50 dark:bg-gray-600/50 hover:bg-blue-100/50 dark:hover:bg-gray-600/70 rounded-lg px-3 py-1.5 transition-colors border border-blue-100/50 dark:border-gray-500/30"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-1.5 text-right">
                      <span className="text-[10px] opacity-50">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl rounded-tl-sm p-3.5 text-sm shadow-md border border-gray-100/50 dark:border-gray-600/30">
                    <div className="flex items-center mb-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                        <CpuChipIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">AI Assistant</span>
                    </div>
                    <div className="flex space-x-1.5 px-1">
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200/70 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about security threats, alerts, or compliance..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/80 dark:text-white text-sm backdrop-blur-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all duration-200 shadow-sm"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 