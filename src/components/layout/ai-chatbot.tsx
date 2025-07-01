'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  CpuChipIcon,
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
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              AI Security Assistant
            </span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Security Assistant</h3>
                  <div className="flex items-center text-xs opacity-90">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-r-lg rounded-tl-lg'
                  } p-3 text-sm`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-2">
                        <CpuChipIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-xs font-medium text-blue-500">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium opacity-70">Quick actions:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white/10 dark:bg-gray-600/50 hover:bg-white/20 dark:hover:bg-gray-600/70 rounded px-2 py-1 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-r-lg rounded-tl-lg p-3 text-sm">
                    <div className="flex items-center mb-2">
                      <CpuChipIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-xs font-medium text-blue-500">AI Assistant</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about security threats, alerts, or compliance..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
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