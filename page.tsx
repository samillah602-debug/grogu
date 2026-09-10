"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your Groq AI Chatbot. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown error";

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: `⚠️ Error: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 👋 What would you like to talk about?",
      },
    ]);
  }

  return (
    <main className="page">
      <div className="chat-container">

        <header className="header">
          <div>
            <h1>Groq AI Chatbot</h1>
            <p>Powered by Groq</p>
          </div>

          <button
            className="clear-button"
            onClick={clearChat}
            type="button"
          >
            Clear Chat
          </button>
        </header>

        <section className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.role}`}
            >
              <div
                className={`message ${message.role}`}
              >
                <span className="message-name">
                  {message.role === "user"
                    ? "You"
                    : "AI"}
                </span>

                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="message assistant">
                <span className="message-name">
                  AI
                </span>

                <p>Thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <form
          className="input-area"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Type your message..."
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              loading || !input.trim()
            }
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

      </div>
    </main>
  );
}