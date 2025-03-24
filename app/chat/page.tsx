"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Video, Settings, Paperclip, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Message {
  id: number;
  text?: string;
  sender: "user" | "bot";
  file?: File;
  audioUrl?: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selfDestructTime, setSelfDestructTime] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatbotResponses = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const responses: Record<string, string> = {
      "hello": "Helloo! How's your day going? 😊",
      "hi": "Hey there! What's up? 😃",
      "namaste": "Namaste! Hope you're having a great day! 🙏",
      "how are you": "I'm fine, thank you! How about you? 😇",
      "bye": "Bye-bye! Take care and see you soon! 👋",
    };
    return responses[lowerMessage] || "That’s interesting! Tell me more! 😊";
  };

  const getTimeStamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: Date.now(), text: input, sender: "user", timestamp: getTimeStamp() };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(false);

    if (selfDestructTime) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      }, selfDestructTime);
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: chatbotResponses(input),
        sender: "bot",
        timestamp: getTimeStamp(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (selfDestructTime) {
        setTimeout(() => {
          setMessages((prev) => prev.filter((msg) => msg.id !== botMessage.id));
        }, selfDestructTime);
      }
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newMessage: Message = { id: Date.now(), text: `📎 ${file.name}`, sender: "user", file, timestamp: getTimeStamp() };
      setMessages([...messages, newMessage]);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newMessage: Message = { id: Date.now(), sender: "user", audioUrl, timestamp: getTimeStamp() };
        setMessages((prev) => [...prev, newMessage]);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    setIsTyping(input.trim() !== "");
  }, [input]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h2 className="text-xl font-bold">Chat</h2>
        <div className="flex gap-4">
          <button onClick={() => router.push("/settings")} className="text-gray-400 hover:text-white">
            <Settings size={24} />
          </button>
          <button onClick={() => router.push("/video")} className="text-gray-400 hover:text-white">
            <Video size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-3 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"}`}>
            <div className="text-sm">{msg.text}</div>
            {msg.audioUrl && <audio controls src={msg.audioUrl} className="w-full" />}
            {msg.file && <a href={URL.createObjectURL(msg.file)} download={msg.file.name} className="text-blue-300 underline">{msg.text}</a>}
            <div className="text-xs text-gray-400 text-right mt-1">{msg.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800 flex items-center gap-2">
        <input type="file" className="hidden" id="fileInput" onChange={handleFileUpload} />
        <label htmlFor="fileInput" className="p-2 text-gray-400 hover:text-white cursor-pointer">
          <Paperclip size={24} />
        </label>
        <input type="text" className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <Button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send</Button>
        <button className="p-2 text-gray-400 hover:text-white" onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X size={24} /> : <Mic size={24} />}</button>
      </div>
    </div>
  );
}
