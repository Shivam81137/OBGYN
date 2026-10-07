"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Bot, User, X, FileText } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: File[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am your OBGYN AI Tutor. How can I help you with your NEET PG preparation today? You can ask me questions or upload a PDF for a summary.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setAttachedFiles([]);

    // Simulate AI response for Phase 1
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "I'm processing your request. In Phase 2, this will be connected to our Groq/Gemini AI backend!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const pdfFiles = filesArray.filter(f => f.type === 'application/pdf');
      if (pdfFiles.length > 0) {
        setAttachedFiles((prev) => [...prev, ...pdfFiles]);
      } else {
        alert("Please upload PDF files only.");
      }
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-80px)] max-w-5xl flex-col px-4 py-6 sm:h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/50 p-4 shadow-sm backdrop-blur-md dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              OBGYN AI Tutor
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Powered by Advanced AI for Medical Students
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 dark:border-slate-700/50 dark:bg-slate-900/70">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {msg.role === "user" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      <User className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-bold text-slate-500">
                      {msg.role === "user" ? "You" : "AI Tutor"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                    }`}
                  >
                    {/* Render Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {msg.attachments.map((file, idx) => (
                          <div key={idx} className={`flex items-center gap-2 rounded-lg p-2 text-sm ${msg.role === 'user' ? 'bg-blue-700/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            <FileText className="h-4 w-4" />
                            <span className="truncate font-medium">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/50 bg-white/50 p-4 dark:border-slate-700/50 dark:bg-slate-900/50">
          
          {/* Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 border border-purple-100 dark:bg-purple-900/30 dark:border-purple-800/50">
                  <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 max-w-[150px] truncate">
                    {file.name}
                  </span>
                  <button 
                    onClick={() => removeAttachment(idx)}
                    className="ml-1 rounded-full p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question or request a summary..."
                className="w-full resize-none rounded-2xl border-0 bg-slate-100 py-3 pl-4 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 min-h-[52px] max-h-32"
                rows={1}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
                multiple
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                title="Attach PDF"
              >
                <Paperclip className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && attachedFiles.length === 0}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700 disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="h-5 w-5 ml-1" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] font-medium text-slate-400">
              AI can make mistakes. Consider verifying critical medical information.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
