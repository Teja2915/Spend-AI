import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '../../types';
import { generateSqlAndData } from '../../services/geminiService';
import { ResultDisplay } from './ResultDisplay';

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
      U
    </div>
);
const AIIcon = () => (
    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5A.75.75 0 0 1 9 4.5Zm6 0a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5A.75.75 0 0 1 15 4.5ZM3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3 19.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
    </div>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            sender: 'user',
            text: input,
        };

        const aiLoadingMessage: ChatMessage = {
            id: `ai_loading_${Date.now()}`,
            sender: 'ai',
            isLoading: true,
        };

        setMessages(prev => [...prev, userMessage, aiLoadingMessage]);
        setInput('');
        setIsThinking(true);

        try {
            const { sql, result, responseText } = await generateSqlAndData(input);
            const aiResponseMessage: ChatMessage = {
                id: `ai_${Date.now()}`,
                sender: 'ai',
                sql,
                data: result,
                responseText,
            };
            setMessages(prev => {
                const newMessages = [...prev];
                const loadingIndex = newMessages.findIndex(m => m.isLoading);
                if (loadingIndex !== -1) {
                    newMessages[loadingIndex] = aiResponseMessage;
                }
                return newMessages;
            });
        } catch (error: any) {
             const aiErrorMessage: ChatMessage = {
                id: `ai_error_${Date.now()}`,
                sender: 'ai',
                error: error.message || 'An unknown error occurred.',
            };
            setMessages(prev => {
                const newMessages = [...prev];
                const loadingIndex = newMessages.findIndex(m => m.isLoading);
                if (loadingIndex !== -1) {
                    newMessages[loadingIndex] = aiErrorMessage;
                }
                return newMessages;
            });
        } finally {
            setIsThinking(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <AIIcon />}
                         <div className={`max-w-xl rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                             {msg.isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                                </div>
                             ) : msg.error ? (
                                <div className="flex items-center gap-2 text-destructive">
                                    <WarningIcon />
                                    <p>{msg.error}</p>
                                </div>
                             ) : (
                                <div className="space-y-3">
                                    {msg.text && <p>{msg.text}</p>}
                                    {msg.responseText && <p>{msg.responseText}</p>}
                                    {msg.sql && msg.sql !== 'N/A' && <ResultDisplay sql={msg.sql} data={msg.data} />}
                                </div>
                             )}
                         </div>
                         {msg.sender === 'user' && <UserIcon />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isThinking}
                        className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                    <button type="submit" disabled={!input.trim() || isThinking} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};