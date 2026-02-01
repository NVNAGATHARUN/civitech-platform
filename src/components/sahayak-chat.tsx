"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBotResponse, ChatMessage } from "@/services/ai-assistant"
import { useLanguage } from "@/lib/LanguageContext"

export function SahayakChat() {
    const { language } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: "Namaste! I am Sahayak. Ask me about any government schemes or eligibility criteria!" }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    useEffect(() => {
        if (isOpen && messages.length === 1 && messages[0].role === 'bot') {
            // Wait a bit for the animation to finish
            const timeout = setTimeout(() => {
                speak(messages[0].content);
            }, 600);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                setIsListening(false)
                // Auto-submit voice input
                handleSend(transcript)
            }

            recognition.onerror = () => {
                setIsListening(false)
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = recognition
        }
    }, [])

    const speak = (text: string) => {
        if (!('speechSynthesis' in window) || !voiceEnabled) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        const langMap: Record<string, string> = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'te': 'te-IN'
        };
        utterance.lang = langMap[language] || 'en-IN';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            const langMap: Record<string, string> = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'te': 'te-IN'
            }
            recognitionRef.current.lang = langMap[language] || 'en-US'
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    const handleSend = async (overrideInput?: string) => {
        const textToSend = overrideInput || input;
        if (!textToSend.trim()) return

        const userMsg: ChatMessage = { role: 'user', content: textToSend }
        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        if (!overrideInput) setInput("")
        setIsTyping(true)

        // Artificial delay for "AI Feel"
        setTimeout(async () => {
            const botResponse = await getBotResponse(textToSend, updatedMessages)
            setMessages(prev => [...prev, { role: 'bot', content: botResponse }])
            setIsTyping(false)
            // Speak the response
            speak(botResponse)
        }, 800)
    }

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            {isOpen ? (
                <Card className="w-[380px] h-[550px] shadow-2xl border-0 rounded-[2rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 bg-white/95 backdrop-blur-xl border border-slate-100">
                    <CardHeader className="bg-[#0F172A] text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black tracking-tight">Sahayak AI</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Digital Assistant</p>
                                        {isSpeaking && (
                                            <span className="flex gap-0.5 items-end h-2">
                                                <span className="w-0.5 bg-blue-400 animate-bounce" style={{ animationDelay: '0ms', height: '100%' }}></span>
                                                <span className="w-0.5 bg-blue-400 animate-bounce" style={{ animationDelay: '150ms', height: '60%' }}></span>
                                                <span className="w-0.5 bg-blue-400 animate-bounce" style={{ animationDelay: '300ms', height: '80%' }}></span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setVoiceEnabled(!voiceEnabled);
                                        if (isSpeaking) window.speechSynthesis.cancel();
                                    }}
                                    className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                                >
                                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setIsOpen(false);
                                    window.speechSynthesis.cancel();
                                }} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={cn(
                                "flex items-start gap-3 animate-in fade-in duration-300",
                                m.role === 'user' ? "flex-row-reverse" : ""
                            )}>
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                    m.role === 'user' ? "bg-slate-100 text-slate-500" : "bg-blue-600 text-white"
                                )}>
                                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed max-w-[80%] shadow-sm",
                                    m.role === 'user'
                                        ? "bg-slate-100 text-slate-900 rounded-tr-none"
                                        : "bg-blue-50 text-blue-900 rounded-tl-none border border-blue-100"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-11">
                                <Loader2 className="h-3 w-3 animate-spin" /> Sahayak is thinking...
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-6 pt-0 border-t border-slate-50">
                        <div className="flex flex-col w-full gap-2 mt-4">
                            {isListening && (
                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 px-1 animate-pulse">
                                    <Mic className="h-3 w-3" /> LISTENING ({language.toUpperCase()})...
                                </div>
                            )}
                            <form className="flex w-full items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Ask about scholarships..."
                                        className="h-12 border-slate-100 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-0 text-sm font-medium pr-10"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={cn(
                                            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                                            isListening ? "text-blue-600 bg-blue-50 shadow-inner" : "text-slate-400 hover:text-blue-500"
                                        )}
                                    >
                                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </button>
                                </div>
                                <Button size="icon" className="h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-xl shrink-0 shadow-lg shadow-blue-500/20">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-16 w-16 rounded-full bg-[#0F172A] hover:bg-slate-800 shadow-2xl flex items-center justify-center group transition-all hover:scale-110 active:scale-95"
                >
                    <MessageSquare className="h-7 w-7 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                        <Sparkles className="h-3 w-3 text-white" />
                    </div>
                </Button>
            )}
        </div>
    )
}
