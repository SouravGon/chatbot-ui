import axios from "axios";

export async function sendMessageService(input, selectedOption, messages) {

    const CHAT_API_URL = process.env.NEXT_PUBLIC_TEXT_GENERATION_API_URL;
    const META = process.env.NEXT_PUBLIC_META_MODEL;
    const DEEPSEEK = process.env.NEXT_PUBLIC_DEEPSEEK_MODEL;

    let payload = {
        model: selectedOption === "META" ? META : DEEPSEEK,
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
        const response = await axios.post(CHAT_API_URL, payload, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response.data.STATUS_CODE === "200"
            ? { text: response.data.STATUS_MESSAGE.trim(), sender: "assistant" }
            : { text: "Sorry, I couldn't fetch a response. Please try again.", sender: "assistant" };
    } catch {
        return { text: "Sorry, I couldn't fetch a response. Please try again.", sender: "assistant" };
    }
}
