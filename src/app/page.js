"use client"
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, ArrowUpCircle, Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";


export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("META");
  const [showOptions, setShowOptions] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelection = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    setMessages([]);
    localStorage.setItem("selectedOption", option);
  };

  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOption");
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() !== "" && !loading) { // Prevent sending multiple times
      setLoading(true); // Disable send button
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      let payload = {
        model: selectedOption === "META" ? "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free" : "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [{ role: "user", content: input }]
      };

      if (messages.length > 0) {
        const lastUserMessage = messages.filter(msg => msg.sender === "user").pop();
        const lastBotMessage = messages.filter(msg => msg.sender === "assistant").pop();
        if (lastUserMessage && lastBotMessage) {
          payload.messages.unshift({ role: "assistant", content: lastBotMessage.text });
          payload.messages.unshift({ role: "user", content: lastUserMessage.text });
        }
      }

      try {
        const response = await axios.post("http://localhost:8081/api/v1/chat", payload, {
          headers: {
            "Content-Type": "application/json"
          },
        });

        if (response.data.STATUS_CODE === "200") {
          const botMessage = { text: response.data.STATUS_MESSAGE.trim(), sender: "assistant" };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          const errorMessage = { text: "Sorry, I couldn't fetch a response. Please try again.", sender: "assistant" };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      } catch (error) {
        const errorMessage = { text: "Sorry, I couldn't fetch a response. Please try again.", sender: "assistant" };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

      setLoading(false); // Re-enable send button after response
    }
  };


  return (
    <div className={`flex flex-col h-screen bg-gray-900 text-white p-4 w-full border-1 border-black justify-end`}>
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-grow h-full pt-16">
        {messages.length === 0 && (
          <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-2xl font-semibold mb-4">What can I help with?</h1>
          </div>
        )}
        {messages.length > 0 && (
          <div className="flex-grow overflow-auto space-y-4 p-4 pt-18" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-2xl mr-4 max-w-fit break-words ${msg.sender === "user" ? "bg-gray-800 border-0" : "border-0"}`}>

                  {/* ✅ ReactMarkdown with Syntax Highlighting */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-700 text-yellow-300 p-1 rounded">{children}</code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>

                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Input Section */}
      <div className="p-2 bg-gray-800 rounded-2xl flex flex-col items-center w-full max-w-5xl mx-auto sticky bottom-0 space-y-2">
        {/* Input & Send Button */}
        <div className="flex items-center w-full">
          <textarea
            className="flex-grow bg-gray-800 p-3 rounded-lg mx-3 text-gray-300 placeholder-gray-400 text-m focus:outline-none w-full sm:w-auto resize-none min-h-[20px]"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className={`p-3 text-gray-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={sendMessage}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <Send size={24} />
            )}
          </button>
        </div>

        {/* Selection Buttons */}
        <div className="flex items-center space-x-2 w-full">
          {/* Selection Toggle */}
          <div className="relative">
            <button
              className="p-3 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center w-10 h-10"
              onClick={() => setShowOptions(!showOptions)}
            >
              <ArrowUpCircle size={20} />
            </button>
            {showOptions && (
              <div className="absolute bottom-full mb-2.5 bg-gray-700 text-gray-300 rounded-lg p-2 w-32">
                <button
                  className={`block px-4 py-2 w-full text-left rounded-md ${selectedOption === "META" ? "bg-blue-600" : "hover:bg-gray-600"}`}
                  onClick={() => handleSelection("META")}
                >
                  META
                </button>
                <button
                  className={`block px-4 py-2 w-full text-left rounded-md ${selectedOption === "DeepSeek" ? "bg-blue-600" : "hover:bg-gray-600"}`}
                  onClick={() => handleSelection("DeepSeek")}
                >
                  DeepSeek
                </button>
              </div>
            )}
          </div>
          {/* Image Selection Button */}
          <div className="relative flex items-center">
            <button
              className={`flex items-center px-4 py-2 rounded-3xl relative hover:shadow-xs hover:shadow-blue-500/50 transition duration-300 ${imageSelected ? "bg-blue-600" : "bg-gray-700"}`}
              onClick={() => setImageSelected(!imageSelected)}
            >
              <Image size={18} className="mr-1" />
              <span className="text-gray-300 text-m">Create image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
