"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { CHAT_API } from "@/app/config";

const ChatPage = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessionMessages, setSessionMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionContentLoading, setSessionContentLoading] = useState(false);
  const [sessionListError, setSessionListError] = useState<string | null>(null);
  const [sessionContentError, setSessionContentError] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("sessions");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    appName: string;
    appVersion: string;
    status: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showFilesOverlay, setShowFilesOverlay] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  const apiBase = CHAT_API?.replace(/\/+$/, "") ?? "";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!apiBase) {
      setApiError("Chat API URL not configured.");
      return;
    }

    fetch(apiBase)
      .then((response) => response.json())
      .then((data) => {
        setApiStatus({
          appName: data["App Name"] || data.appName || "Unknown",
          appVersion: data["App Version"] || data.appVersion || "Unknown",
          status: data.Status || data.status || "Unknown",
        });
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setApiError(errorMessage || "Failed to fetch chat API status.");
      });
  }, [apiBase]);
  const fetchSessionMessages = useCallback(
    async (sessionId: string) => {
      if (!apiBase) {
        setSessionContentError("Chat API URL not configured.");
        return;
      }

      setSessionContentLoading(true);
      setSessionContentError(null);
      setSessionMessages([]);

      try {
        const response = await fetch(
          `${apiBase}/chat/${encodeURIComponent(sessionId)}`,
        );
        if (!response.ok) {
          throw new Error("Could not load session messages.");
        }

        const data = await response.json();
        setSessionMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setSessionContentError(
          errorMessage || "Failed to load session messages.",
        );
        setSessionMessages([]);
      } finally {
        setSessionContentLoading(false);
      }
    },
    [apiBase],
  );

  const fetchSessions = useCallback(async () => {
    if (!apiBase) {
      setSessionListError("Chat API URL not configured.");
      return;
    }

    setSessionLoading(true);
    setSessionListError(null);

    try {
      const response = await fetch(`${apiBase}/chat/sessions`);
      if (!response.ok) {
        throw new Error("Could not load sessions.");
      }

      const data = await response.json();
      const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
      setSessions(sessionsList);
      if (sessionsList.length > 0) {
        const firstSession = sessionsList[0];
        setSelectedSession(firstSession);
        await fetchSessionMessages(firstSession);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setSessionListError(errorMessage || "Failed to load sessions.");
      setSessions([]);
    } finally {
      setSessionLoading(false);
    }
  }, [apiBase, fetchSessionMessages]);

  useEffect(() => {
    if (!apiBase) return;
    fetchSessions();
  }, [apiBase, fetchSessions]);

  const fetchFiles = async () => {
    if (!apiBase) {
      setFileError("Chat API URL not configured.");
      return;
    }

    setLoadingFiles(true);
    setFileError(null);
    setFileStatus(null);

    try {
      const response = await fetch(`${apiBase}/data/files`);
      if (!response.ok) {
        throw new Error("Could not load file list.");
      }

      const data = await response.json();
      setFiles(Array.isArray(data.files) ? data.files : []);
      if (data.Signal) {
        setFileStatus(data.Signal);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setFileError(errorMessage || "Failed to load files.");
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!sessionId) return;
    if (!apiBase) {
      setSessionListError("Chat API URL not configured.");
      return;
    }

    // No browser confirm: delete immediately (optimistic UI update below)

    setDeletingSession(sessionId);
    setSessionListError(null);

    // Optimistically remove only the targeted session from local state
    const previousSessions = sessions;
    const updatedSessions = previousSessions.filter((s) => s !== sessionId);
    setSessions(updatedSessions);

    try {
      const response = await fetch(
        `${apiBase}/chat/${encodeURIComponent(sessionId)}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.Signal || data.message || "Failed to delete session.",
        );
      }

      // If the deleted session was selected, select the next available session or clear
      if (selectedSession === sessionId) {
        const next = updatedSessions.length > 0 ? updatedSessions[0] : "";
        setSelectedSession(next);
        setSessionMessages([]);
        if (next) await fetchSessionMessages(next);
      }
    } catch (error: unknown) {
      // restore on error
      setSessions(previousSessions);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setSessionListError(errorMessage || "Failed to delete session.");
    } finally {
      setDeletingSession(null);
    }
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileStatus(null);
    const file = event.target.files?.[0] ?? null;

    if (file && file.type !== "application/pdf") {
      setFileError("Please select a PDF file.");
      setSelectedFile(null);
      return;
    }

    if (file) {
      setSelectedFile(file);
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!apiBase) {
      setFileError("Chat API URL not configured.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setFileError(null);
    setFileStatus(null);

    try {
      const response = await fetch(`${apiBase}/data/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.Signal || data.message || "Upload failed.");
      }

      setFileStatus(
        data.Signal || "File uploaded successfully. Processing... ",
      );
      setSelectedFile(null);

      await fetch(`${apiBase}/process/push_all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chunk_size: 800,
          overlap_size: 20,
        }),
      });

      setFileStatus("File uploaded and processing started.");
      if (showFilesOverlay) {
        await fetchFiles();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setFileError(errorMessage || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!apiBase) {
      setFileError("Chat API URL not configured.");
      return;
    }

    setDeletingFile(fileName);
    setFileError(null);
    setFileStatus(null);

    try {
      const response = await fetch(
        `${apiBase}/data/${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.Signal || data.message || "Failed to delete file.",
        );
      }

      setFileStatus(data.Signal || "File deleted successfully.");
      await fetchFiles();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setFileError(errorMessage || "Failed to delete file.");
    } finally {
      setDeletingFile(null);
    }
  };

  const handleSendMessage = () => {
    (async () => {
      if (!message.trim()) {
        setFileStatus("Please type a message or attach a PDF to send.");
        return;
      }

      if (!apiBase) {
        setFileStatus("Chat API URL not configured.");
        return;
      }

      if (!selectedSession) {
        setFileStatus("Please select a session before sending a message.");
        return;
      }

      // Optimistically add user's message
      setSessionMessages((prev) => [
        ...prev,
        { role: "user", content: message },
      ]);
      setFileStatus("Sending message...");

      try {
        const response = await fetch(`${apiBase}/chat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: selectedSession,
            question: message,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.Signal || data.message || "Failed to send chat message.",
          );
        }

        const answer = data.answer ?? data.Signal ?? "";
        if (answer) {
          setSessionMessages((prev) => [
            ...prev,
            { role: "assistant", content: answer },
          ]);
        }

        if (data.Signal) setFileStatus(data.Signal);
        else setFileStatus("Message sent and response received.");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setFileStatus(errorMessage || "Failed to send message.");
      } finally {
        setMessage("");
      }
    })();
  };

  const openFileOverlay = async () => {
    setShowFilesOverlay(true);
    setActiveTab("files");
    await fetchFiles();
  };

  const openFilePicker = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const createNewSession = (name?: string) => {
    const trimmed = name?.trim();
    const id =
      trimmed && trimmed.length > 0
        ? trimmed
        : `${Math.floor(Math.random() * 900000) + 100000}`; // random 6-digit number as name
    setSessions((prev) => [id, ...prev]);
    setSelectedSession(id);
    setSessionMessages([]);
    setActiveTab("sessions");
    setShowFilesOverlay(false);
    setNewSessionName("");
  };

  return (
    <div className="relative w-full h-screen p-3 sm:p-4 md:p-8 flex flex-col gap-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Chat
        </h1>
      </div>

      <div className="flex flex-col-reverse xl:flex-row gap-5 flex-1 min-h-0">
        <aside className="group relative flex flex-col w-full xl:w-[320px] shrink-0 overflow-hidden rounded-2xl border shadow-sm transition duration-300 border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="border-b border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-950/50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Sessions
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Recent conversations
              </h2>
            </div>

            <div className="mt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createNewSession(newSessionName);
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      createNewSession(newSessionName);
                    }
                  }}
                  placeholder="New chat name (opt)"
                  aria-label="New chat name"
                  className="flex-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 max-w-full"
                />
                <button
                  type="submit"
                  aria-label="Create new chat"
                  title="New chat"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <div className="p-5 flex-1 min-h-0 overflow-y-auto space-y-4">
            <nav className="space-y-3">
              {sessionLoading ? (
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  Loading sessions...
                </div>
              ) : sessionListError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950 dark:text-rose-300">
                  {sessionListError}
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  No sessions available.
                </div>
              ) : (
                sessions.map((session) => {
                  const active = session === selectedSession;
                  return (
                    <div key={session} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSession(session);
                          setActiveTab("sessions");
                          setShowFilesOverlay(false);
                          fetchSessionMessages(session);
                        }}
                        className={`flex-1 flex items-center gap-3 text-left rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "border border-blue-300 bg-blue-50 text-slate-900 shadow-sm dark:border-blue-700 dark:bg-blue-900/80 dark:text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex-1 truncate">
                          <span className="font-medium">{session}</span>
                        </div>
                        <div className="text-xs text-slate-400 ml-2 truncate">
                          &nbsp;
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session);
                        }}
                        disabled={deletingSession === session}
                        title="Delete session"
                        aria-label={`Delete session ${session}`}
                        className="ml-2 shrink-0 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-950 dark:text-rose-300"
                      >
                        {deletingSession === session ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M6 7h8v9H6z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 5a1 1 0 012 0v7a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v7a1 1 0 11-2 0V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </nav>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-5 min-h-0">
          {/* Server status merged into Workspace controls below */}

          <div className="group relative w-full flex-none overflow-hidden rounded-2xl border shadow-sm transition duration-300 border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Workspace controls
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Open files or work with sessions from the same interface.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    type="button"
                    onClick={openFileOverlay}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${activeTab === "files" ? "border-blue-300 bg-blue-50 text-slate-900 shadow-sm dark:border-blue-700 dark:bg-blue-900/80 dark:text-white" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-900"}`}
                  >
                    Files
                  </button>
                  {/* Server status inline */}
                  <div className="ml-2 inline-flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {apiStatus?.appName || "Chat API"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${apiStatus?.status === "Good" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"}`}
                    >
                      {apiStatus?.status || (apiError ? "Error" : "Loading...")}
                    </span>
                    <span className="rounded-2xl border border-slate-200/90 bg-slate-50 px-3 py-1 text-xs dark:border-slate-700 dark:bg-slate-900">
                      Ver: {apiStatus?.appVersion || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative w-full flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border shadow-sm transition duration-300 border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm">
            <div className="p-6 flex-1 flex flex-col min-h-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Conversation
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Messages for the selected chat session.
                  </p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedSession || "No session selected"}
                </span>
              </div>

              {sessionContentLoading ? (
                <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  Loading messages...
                </div>
              ) : sessionContentError ? (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950 dark:text-rose-300">
                  {sessionContentError}
                </div>
              ) : (
                <div className="mt-5 flex-1 min-h-0 overflow-y-auto space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                  {sessionMessages.length > 0 ? (
                    sessionMessages.map((messageItem, index) => (
                      <div
                        key={`${messageItem.role}-${index}`}
                        className={`rounded-2xl p-4 text-sm ${
                          messageItem.role === "assistant"
                            ? "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                            : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <p className="font-semibold uppercase tracking-[0.2em] text-xs text-slate-500 dark:text-slate-400">
                          {messageItem.role}
                        </p>
                        <p className="mt-2 whitespace-pre-line leading-6">
                          {messageItem.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      No messages loaded yet. Select a session to view its chat.
                    </div>
                  )}
                </div>
              )}
              {/* Message input (merged from Send message panel) */}
              <div className="mt-5">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={uploading}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {uploading ? "Uploading…" : "Attach"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileSelected}
                  />

                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 resize-none"
                  />

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      className="h-10 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {selectedFile ? (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 truncate">
                      {selectedFile.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-sm font-semibold text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
              {selectedFile ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {selectedFile.name} (uploading automatically)
                </p>
              ) : null}
              {fileError ? (
                <p className="mt-3 text-xs text-rose-500">{fileError}</p>
              ) : null}
              {fileStatus ? (
                <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-300">
                  {fileStatus}
                </p>
              ) : null}
            </div>
          </div>

          {/* Send message panel merged into Conversation above */}
        </div>
      </div>

      {showFilesOverlay ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl dark:border-slate-700/90 dark:bg-slate-950/95">
            <div className="flex flex-col gap-3 border-b border-slate-200/90 p-5 dark:border-slate-700/90 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Files
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Delete any uploaded PDF or refresh the list.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={fetchFiles}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilesOverlay(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {loadingFiles ? (
                <div className="rounded-3xl border border-slate-200/90 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  Loading files...
                </div>
              ) : files.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/90 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  No files uploaded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((fileName) => (
                    <div
                      key={fileName}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="truncate text-sm text-slate-700 dark:text-slate-200">
                        {fileName}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(fileName)}
                        disabled={deletingFile === fileName}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/40 dark:bg-rose-950 dark:text-rose-300"
                      >
                        {deletingFile === fileName ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fileError ? (
                <p className="mt-4 text-sm text-rose-500">{fileError}</p>
              ) : null}
              {fileStatus ? (
                <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">
                  {fileStatus}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatPage;
