import { ChevronUp } from "lucide-react";

export default function ModelSelection({ selectedOption, showOptions, setShowOptions, handleSelection }) {
    return (
        <div className="relative">
            <button className="p-3 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center w-10 h-10" onClick={() => setShowOptions(!showOptions)}>
                <ChevronUp size={20} />
            </button>
            {showOptions && (
                <div className="absolute bottom-full mb-2.5 bg-gray-700 text-gray-300 rounded-lg p-2 w-32">
                    <button className={`block px-4 py-2 w-full text-left rounded-md ${selectedOption === "META" ? "bg-blue-600" : "hover:bg-gray-600"}`} onClick={() => handleSelection("META")}>
                        META
                    </button>
                    <button className={`block px-4 py-2 w-full text-left rounded-md ${selectedOption === "DeepSeek" ? "bg-blue-600" : "hover:bg-gray-600"}`} onClick={() => handleSelection("DeepSeek")}>
                        DeepSeek
                    </button>
                </div>
            )}
        </div>
    );
}
