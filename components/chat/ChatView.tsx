
import React from 'react';
import { ChatInterface } from './ChatInterface';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const ChatView: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>
            Ask questions about your invoice data in plain English. For example: "What was my total spend last month?"
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ChatInterface />
        </CardContent>
      </Card>
    </div>
  );
};
