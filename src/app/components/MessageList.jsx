import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MessageList({ messages, messagesEndRef }) {
    return (
        <div className="flex-grow overflow-auto space-y-4 p-4 pt-18" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            {messages.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-2xl font-semibold mb-4">What can I help with?</h1>
                    <h3 className="text-xs font-extralight italic mb-4 text-gray-400">** It can make mistakes. Check important info.</h3>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-4 rounded-2xl mr-4 max-w-fit break-words text-gray-200 ${msg.sender === "user" ? "bg-gray-800 border-0" : "border-0"}`}>
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
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}
