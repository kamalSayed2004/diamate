"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  FileText,
  Plus,
  MessageSquare,
  X,
  Menu,
  Bot,
  User,
  MoreVertical,
  Trash2,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  attachment?: {
    name: string;
    size: string;
  };
  timestamp: Date;
};

type ChatSession = {
  id: string;
  title: string;
  date: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content:
        "Hello! I'm your DiaMate health assistant. I can help you analyze your blood sugar trends, suggest meal plans, or review your medical reports. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClearingSession, setIsClearingSession] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<ChatSession[]>([]);
  const [modelStatus, setModelStatus] = useState<"checking" | "online" | "offline">("checking");
  const [appInfo, setAppInfo] = useState<{ name: string, version: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSessionId(Date.now().toString());
    handleFetchChatSessions(true);
    checkModelStatus();
  }, []);

  const checkModelStatus = async () => {
    try {
      const rawBaseUrl = process.env.NEXT_PUBLIC_CHAT_API?.trim() || "http://localhost:8000/api/v1/";
      const response = await fetch(rawBaseUrl);
      if (!response.ok) throw new Error("Offline");
      const data = await response.json();
      if (data["Status"] === "Good") {
        setModelStatus("online");
        setAppInfo({ name: data["App Name"], version: data["App Version"] });
      } else {
        setModelStatus("offline");
      }
    } catch (e) {
      setModelStatus("offline");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getChatApiBase = () => {
    const rawBaseUrl =
      process.env.NEXT_PUBLIC_CHAT_API?.trim() ||
      "http://localhost:8000/api/v1/";
    return rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
  };

  const handleFetchFiles = async () => {
    const apiUrl = `${getChatApiBase()}data/files`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch file list");

      const data = await response.json();
      if (!data.files || !Array.isArray(data.files)) {
        throw new Error("Unexpected response format");
      }

      setFileList(data.files);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `${data.Signal}\nFiles:\n${data.files.join("\n")}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Unable to load file list. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!fileId) return;
    setIsDeleting(true);

    try {
      const apiUrl = `${getChatApiBase()}data/${encodeURIComponent(fileId)}`;
      const response = await fetch(apiUrl, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete file");

      const data = await response.json();
      setFileList((prev) => prev.filter((file) => file !== fileId));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: data.Signal || "File Deleted Successfully",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error deleting file:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Unable to delete the file. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePushFile = async (fileId: string) => {
    if (!fileId) return;
    setIsPushing(true);

    try {
      const apiUrl = `${getChatApiBase()}process/push`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: fileId,
          chunk_size: 400,
          overlap_size: 20,
        }),
      });

      if (!response.ok) throw new Error("Failed to push file");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: data.Signal || "Embeddings Pushed Successfully",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error pushing file:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Unable to push embeddings for this file. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsPushing(false);
    }
  };

  const handlePushAllFiles = async () => {
    setIsPushing(true);

    try {
      const apiUrl = `${getChatApiBase()}process/push_all`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chunk_size: 800,
          overlap_size: 20,
        }),
      });

      if (!response.ok) throw new Error("Failed to push all files");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: data.Signal || "Embeddings Pushed Successfully",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error pushing all files:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content:
            "Unable to process embeddings for all files. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsPushing(false);
    }
  };

  const handleReindex = async () => {
    setIsPushing(true);

    try {
      const apiUrl = `${getChatApiBase()}process/reindex`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chunk_size: 400,
          overlap_size: 20,
        }),
      });

      if (!response.ok) throw new Error("Failed to reindex");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: data.Signal || "Reindex Completed Successfully",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error reindexing:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Unable to complete reindexing. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsPushing(false);
    }
  };

  const handleSendChatMessage = async (question: string) => {
    if (!question.trim() || !sessionId) return;

    setIsChatLoading(true);

    try {
      const apiUrl = `${getChatApiBase()}chat/${encodeURIComponent(sessionId)}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question: question,
        }),
      });

      if (!response.ok) throw new Error("Failed to get chat response");

      const data = await response.json();
      const sourceText =
        data.source_chunks && data.source_chunks.length > 0
          ? `\n\nSources:\n${data.source_chunks.map((chunk: { file_id: string; score: number }) => `- ${chunk.file_id} (confidence: ${chunk.score})`).join("\n")}`
          : "";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `${data.answer || data.Signal}${sourceText}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content:
            "Sorry, I encountered an error processing your question. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFetchChatSessions = async (silent: boolean | React.MouseEvent = false) => {
    const apiUrl = `${getChatApiBase()}chat/sessions`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch chat sessions");

      const data = await response.json();
      const sessions = Array.isArray(data.sessions) ? data.sessions : [];
      type SessionPayload =
        | string
        | {
          session_id?: string;
          id?: string;
          title?: string;
          date?: string;
        };
      const sessionItems = (sessions as SessionPayload[]).map(
        (session, index) => {
          if (typeof session === "string") {
            return {
              id: session,
              title: session,
              date: "Saved",
            };
          }

          return {
            id: session.session_id || session.id || `session-${index}`,
            title:
              session.title ||
              session.session_id ||
              session.id ||
              `Session ${index + 1}`,
            date: session.date || "Saved",
          };
        },
      );

      setSessionHistory(sessionItems);
      if (!sessionId && sessionItems.length > 0) {
        setSessionId(sessionItems[0].id);
      }

      if (silent !== true) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: `${data.Signal || "Chat sessions loaded successfully."}\nSessions:\n${sessionItems
              .map((session) => `- ${session.title}`)
              .join("\n")}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Unable to load chat sessions. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleNewChat = () => {
    setSessionId(Date.now().toString());
    setMessages([{
      id: Date.now().toString(),
      role: "bot",
      content: "Hello! I'm your DiaMate health assistant. I can help you analyze your blood sugar trends, suggest meal plans, or review your medical reports. How can I help you today?",
      timestamp: new Date(),
    }]);
    if (window.innerWidth < 1024) {
      setIsHistoryOpen(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation();
    setIsClearingSession(true);

    try {
      const apiUrl = `${getChatApiBase()}chat/${encodeURIComponent(idToDelete)}`;
      const response = await fetch(apiUrl, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete session");

      await response.json();
      setSessionHistory((prev) =>
        prev.filter((session) => session.id !== idToDelete),
      );

      if (sessionId === idToDelete) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsClearingSession(false);
    }
  };

  const handleFetchSessionHistory = async (selectedSessionId: string) => {
    if (!selectedSessionId) return;
    setSessionId(selectedSessionId);

    try {
      const apiUrl = `${getChatApiBase()}chat/${encodeURIComponent(selectedSessionId)}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch session history");

      const data = await response.json();
      type SessionMessage = {
        role?: string;
        content?: string;
      };
      const loadedMessages: Message[] = Array.isArray(data.messages)
        ? (data.messages as SessionMessage[]).map((message, index) => ({
          id: `${selectedSessionId}-${index}`,
          role: message.role === "assistant" ? "bot" : "user",
          content: message.content || "",
          timestamp: new Date(),
        }))
        : [];

      setMessages(
        loadedMessages.length
          ? loadedMessages
          : [
            {
              id: `${selectedSessionId}-info`,
              role: "bot",
              content:
                "No message history was returned for this session. You can start a new conversation.",
              timestamp: new Date(),
            },
          ],
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `${selectedSessionId}-loaded`,
          role: "bot",
          content: `Session ${data.session_id || selectedSessionId} loaded successfully.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching session history:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `${selectedSessionId}-error`,
          role: "bot",
          content: "Unable to load session history. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleFetchProcessStatus = async () => {
    const apiUrl = `${getChatApiBase()}process/status`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch process status");

      await response.json();
    } catch (error) {
      console.error("Error fetching process status:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else if (file) {
      alert("Please upload a PDF file.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const currentFile = selectedFile;
    const currentInput = inputValue;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput || (currentFile ? "Uploaded a PDF file." : ""),
      timestamp: new Date(),
      attachment: currentFile
        ? { name: currentFile.name, size: formatFileSize(currentFile.size) }
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSelectedFile(null);

    if (currentFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", currentFile);

        const baseUrl = getChatApiBase();
        const response = await fetch(`${baseUrl}data/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              content: `File uploaded successfully. File ID: ${data.File_ID}`,
              timestamp: new Date(),
            },
          ]);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: "Sorry, I encountered an error while uploading your file.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsUploading(false);
      }
    } else {
      // Send text message via chat API
      await handleSendChatMessage(currentInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-screen h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-[#0a0f1c] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Mobile History Overlay */}
      {isHistoryOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 dark:bg-black/60 z-40 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Chat History Sidebar */}
      <div
        className={`fixed lg:relative z-50 h-full w-[280px] sm:w-[320px] flex flex-col border-r border-white/20 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl transition-transform duration-500 ease-out ${isHistoryOpen ? "translate-x-0 shadow-2xl shadow-blue-900/20" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-2xl transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} />
            New Conversation
          </button>
          <button
            className="lg:hidden p-2 ml-3 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
            onClick={() => setIsHistoryOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-2 uppercase tracking-widest">
              Recent Sessions
            </h3>
            <div className="space-y-1.5">
              {sessionHistory.map((chat) => (
                <div key={chat.id} className="relative group/item flex items-center">
                  <button
                    onClick={() => handleFetchSessionHistory(chat.id)}
                    className={`w-full flex items-start gap-3 px-3 py-3 pr-10 rounded-2xl text-left transition-all duration-300 group ${chat.id === sessionId
                      ? "bg-white dark:bg-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
                      : "hover:bg-white/50 dark:hover:bg-slate-800/40 border border-transparent"
                      }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg transition-colors ${chat.id === sessionId ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500"}`}>
                      <MessageSquare size={16} className="flex-shrink-0" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-sm font-semibold truncate transition-colors ${chat.id === sessionId ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                        {chat.title}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                        {chat.date}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDeleteSession(e, chat.id)}
                    disabled={isClearingSession}
                    className="absolute right-2 p-1.5 text-slate-400 opacity-0 group-hover/item:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete session"
                  >
                    <Trash2 size={16} className={isClearingSession ? "animate-pulse" : ""} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-transparent">
        {/* Chat Header */}
        <div className="h-[72px] flex items-center justify-between px-4 sm:px-8 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
              onClick={() => setIsHistoryOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  DiaMate AI
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${modelStatus === 'online' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : modelStatus === 'offline' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {modelStatus === 'online' && appInfo ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{appInfo.name} v{appInfo.version}</span>
                    ) : modelStatus === 'offline' ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">Model Offline</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Checking Status...</span>
                    )}
                    <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                    Session: <span className="text-slate-700 dark:text-slate-300">{sessionId || "New"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden md:flex bg-slate-100/50 dark:bg-slate-800/30 p-1 rounded-2xl backdrop-blur-md">
              <button
                onClick={handleFetchFiles}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/80 rounded-xl transition-all hover:shadow-sm"
                title="Fetch file list"
              >
                <Paperclip size={16} />
                <span className="hidden xl:inline">Files</span>
              </button>
              <button
                onClick={handleFetchChatSessions}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/80 rounded-xl transition-all hover:shadow-sm"
                title="Fetch chat sessions"
              >
                <MessageSquare size={16} />
                <span className="hidden xl:inline">Sessions</span>
              </button>
              <button
                onClick={handlePushAllFiles}
                disabled={isPushing}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40 rounded-xl transition-colors disabled:opacity-50"
              >
                Push All
              </button>
              <button
                onClick={handleReindex}
                disabled={isPushing}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-violet-700 bg-violet-100/80 hover:bg-violet-200 dark:text-violet-300 dark:bg-violet-900/30 dark:hover:bg-violet-800/40 rounded-xl transition-colors disabled:opacity-50"
              >
                Reindex
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 sm:gap-5 max-w-4xl mx-auto group ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${msg.role === "user"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                  : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30"
                  }`}
              >
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>

              <div
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"
                  } max-w-[85%] sm:max-w-[75%]`}
              >
                <div
                  className={`px-6 py-4 rounded-[24px] shadow-sm transition-all duration-300 ${msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-tr-sm"
                    : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-sm shadow-slate-200/20 dark:shadow-none hover:shadow-md"
                    }`}
                >
                  {msg.attachment && (
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl mb-3 ${msg.role === "user"
                        ? "bg-white/10 border border-white/20"
                        : "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700"
                        }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-red-500 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {msg.attachment.name}
                        </p>
                        <p
                          className={`text-xs mt-0.5 font-medium ${msg.role === "user"
                            ? "text-slate-300 dark:text-slate-600"
                            : "text-slate-500 dark:text-slate-400"
                            }`}
                        >
                          PDF Document • {msg.attachment.size}
                        </p>
                      </div>
                    </div>
                  )}
                  {msg.content && (
                    <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "font-medium" : ""}`}>
                      {msg.content}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex gap-5 max-w-4xl mx-auto flex-row">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30 animate-pulse">
                <Bot size={20} />
              </div>
              <div className="flex flex-col items-start max-w-[75%]">
                <div className="px-6 py-5 rounded-[24px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-tl-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 pt-8 mt-auto z-10">
          <div className="max-w-4xl mx-auto">
            {fileList.length > 0 && (
              <div className="mb-4 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Bot size={16} className="text-blue-500" /> Server Files Repository
                  </span>
                  <button
                    onClick={handleFetchFiles}
                    className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Refresh List
                  </button>
                </div>
                <div className="grid gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                  {fileList.map((fileId) => (
                    <div
                      key={fileId}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 px-4 py-2.5 group hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {fileId}
                      </span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePushFile(fileId)}
                          disabled={isPushing}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50 transition-colors"
                        >
                          Push
                        </button>
                        <button
                          onClick={() => handleDeleteFile(fileId)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100/80 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-800/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 p-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">

              {selectedFile && (
                <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/20 m-2 p-3 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 w-fit max-w-full">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all flex-shrink-0"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 p-1">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-12 h-12 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors flex-shrink-0"
                  title="Upload PDF"
                >
                  <Paperclip size={22} strokeWidth={2} />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedFile ? "Add a message about this file..." : `Ask DiaMate anything${sessionId ? ` in session "${sessionId}"` : ""}...`}
                  className="flex-1 max-h-32 min-h-[48px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[16px] font-medium leading-relaxed"
                  rows={1}
                  style={{ height: "auto" }}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!inputValue.trim() && !selectedFile) ||
                    isUploading ||
                    isChatLoading
                  }
                  className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 text-white rounded-full transition-all duration-300 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/30 disabled:shadow-none transform hover:scale-105 active:scale-95 disabled:scale-100"
                >
                  {isUploading || isChatLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} strokeWidth={2.5} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
                DiaMate AI can make mistakes. Please verify important health information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
