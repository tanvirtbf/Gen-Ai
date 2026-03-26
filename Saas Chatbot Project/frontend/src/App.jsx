import { useState, useRef, useEffect } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/chat/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.assistant },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#171717] p-3 md:flex">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          New Chat
        </button>

        <div className="mt-6 flex-1 overflow-y-auto">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-white/30">
            Recent
          </p>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold">
              U
            </div>
            <span className="text-sm text-white/70">User</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button
            onClick={handleNewChat}
            className="rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-base font-semibold">ChatBot</h1>
          <div className="w-8" />
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center pt-40">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8 text-white"
                    >
                      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 20.97v-3.17a4.525 4.525 0 0 1-1.087-3.108V10.4c0-2.133 1.492-3.915 3.405-4.127a47.302 47.302 0 0 1-.405-3.615ZM11.25 8.25c0-.966.784-1.75 1.75-1.75h.008c.966 0 1.75.784 1.75 1.75v.008c0 .966-.784 1.75-1.75 1.75H13c-.966 0-1.75-.784-1.75-1.75V8.25Z" />
                      <path d="M13 15.75c0-.966.784-1.75 1.75-1.75h5.5c.966 0 1.75.784 1.75 1.75v.008c0 .966-.784 1.75-1.75 1.75h-5.5c-.966 0-1.75-.784-1.75-1.75v-.008Z" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold text-white/90">
                    How can I help you today?
                  </h2>
                  <p className="text-sm text-white/40">
                    Ask me anything and I&apos;ll do my best to help.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-xs font-bold">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-[#303030] text-white"
                          : "text-white/90"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-xs font-bold">
                      AI
                    </div>
                    <div className="flex items-center gap-1.5 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <footer className="px-4 pb-4 pt-2">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/10 bg-[#2f2f2f] px-4 py-3 shadow-lg transition-colors focus-within:border-white/20"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ChatBot..."
              className="max-h-40 flex-1 resize-none bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-all hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-white/30">
            ChatBot can make mistakes. Consider checking important information.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
