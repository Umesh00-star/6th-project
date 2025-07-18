import React, { useState, useEffect, useRef } from "react";

// Sample FAQs with keyword support
const faqs = [
  {
    question: "How can I track my order?",
    answer: "You can track your order in the 'My Orders' section or via the tracking link sent to your email.",
    keywords: ["track", "tracking", "order status"],
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards, UPI, net banking, and cash on delivery.",
    keywords: ["payment", "pay", "methods", "card", "UPI", "cash"],
  },
  {
    question: "How do I return or exchange a product?",
    answer: "To return or exchange, go to 'My Orders', select the item, and click 'Return or Exchange'.",
    keywords: ["return", "exchange", "refund"],
  },
  {
    question: "Can I cancel an order after placing it?",
    answer: "Yes, but only before it is shipped. After shipping, cancellation might not be possible.",
    keywords: ["cancel", "cancellation"],
  },
  {
    question: "How do I contact customer support?",
    answer: "Visit the 'Contact Us' page or use the live chat at the bottom of your screen.",
    keywords: ["contact", "support", "help", "customer care"],
  },
];

const Bot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { type: "bot", message: "Hi! I'm Naurio 🤖. Ask me a question about your order, payment, returns, or anything else!" },
  ]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    const matchedFAQ = faqs.find(faq =>
      faq.keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))
    );

    return matchedFAQ
      ? matchedFAQ.answer
      : "Sorry, I couldn't find an answer to that. Try rephrasing or visit our help center.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", message: input.trim() };
    setChat(prev => [...prev, userMessage]);
    setTyping(true);
    setInput("");

    setTimeout(() => {
      const botMessage = { type: "bot", message: getBotResponse(userMessage.message) };
      setChat(prev => [...prev, botMessage]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-4">Naurio Bot 🤖</h2>
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-md border" style={{ scrollbarWidth: "none" }}>
        {chat.map((entry, index) => (
          <div
            key={index}
            className={`flex mb-2 ${entry.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                entry.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {entry.message}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-[70%] animate-pulse">
              Naurio is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-5 rounded-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Bot;
