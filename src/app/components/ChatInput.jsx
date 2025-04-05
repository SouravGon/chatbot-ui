import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage, loading }) {
    return (
        <div className="flex items-center w-full">
            <textarea
                name="message"
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
            <button className={`p-3 text-gray-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={sendMessage} disabled={loading}>
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
    );
}
