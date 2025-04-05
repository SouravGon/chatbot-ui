import { Image } from "lucide-react";

export default function ImageSelection({ imageSelected, setImageSelected }) {
    return (
        <div className="relative flex items-center">
            <button
                className={`flex items-center px-4 py-2 rounded-3xl relative hover:shadow-xs hover:shadow-blue-500/50 transition duration-300 ${imageSelected ? "bg-blue-600" : "bg-gray-700"
                    }`}
                onClick={() => setImageSelected(!imageSelected)}
            >
                <Image size={18} className="mr-1" />
                <span className="text-gray-300 text-m">Create image</span>
            </button>
        </div>
    );
}
