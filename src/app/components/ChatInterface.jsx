import { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ModelSelection from "./ModelSelection";
import ImageSelection from "./ImageSelection";
import { sendMessageService } from "../services/chatService";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("META");
  const [showOptions, setShowOptions] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOption");
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const handleSelection = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    setMessages([]);
    localStorage.setItem("selectedOption", option);
  };

  const sendMessage = async () => {
    if (input.trim() !== "" && !loading) {
      setLoading(true);
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      const responseMessage = await sendMessageService(input, selectedOption, messages);
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 w-full border-1 border-black justify-end">
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-grow h-full pt-16">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-2 bg-gray-800 rounded-2xl flex flex-col items-center w-full max-w-5xl mx-auto sticky bottom-0 space-y-2">
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />
        <div className="flex items-center space-x-2 w-full">
          <ModelSelection selectedOption={selectedOption} showOptions={showOptions} setShowOptions={setShowOptions} handleSelection={handleSelection} />
          <ImageSelection imageSelected={imageSelected} setImageSelected={setImageSelected} />
        </div>
      </div>
    </div>
  );
}
