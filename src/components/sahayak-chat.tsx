"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBotResponse, ChatMessage } from "@/services/ai-assistant"

export function SahayakChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: "Namaste! I am Sahayak. Ask me about any government schemes or eligibility criteria!" }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: ChatMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Artificial delay for "AI Feel"
        setTimeout(async () => {
            const botResponse = await getBotResponse(input)
            setMessages(prev => [...prev, { role: 'bot', content: botResponse }])
            setIsTyping(false)
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
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Digital Assistant</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
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
                        <form className="flex w-full items-center gap-2 mt-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <Input
                                placeholder="Ask about scholarships..."
                                className="h-12 border-slate-100 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-0 text-sm font-medium"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                            <Button size="icon" className="h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-xl shrink-0 shadow-lg shadow-blue-500/20">
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
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
