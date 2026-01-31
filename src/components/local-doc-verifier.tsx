"use client"

import { useState } from "react"
import { createWorker } from "tesseract.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, FileText, Lock } from "lucide-react"
import { auth } from "@/lib/firebase"
import { Scheme, EligibilityToken } from "@/lib/types"
import { useLanguage } from "@/lib/LanguageContext"

interface LocalDocVerifierProps {
    scheme: Scheme;
    onTokenCreated: (token: EligibilityToken) => void;
}

export function LocalDocVerifier({ scheme, onTokenCreated }: LocalDocVerifierProps) {
    const { t } = useLanguage()
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failure'>('idle')
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState("")
    const [debugText, setDebugText] = useState<string | null>(null)
    const [detectedAadhaar, setDetectedAadhaar] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check if file is a PDF
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            setStatus('failure')
            setMessage("PDF files are not supported. Please upload an image (JPG/PNG) of your document for secure local processing.")
            return
        }

        setStatus('processing')
        setMessage("Initializing Secure Worker...")
        setProgress(10)

        try {
            // Modern Tesseract.js initialization
            const worker = await createWorker('eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(40 + Math.floor(m.progress * 50))
                    }
                }
            });

            await worker.setParameters({
                tessedit_char_whitelist: '0123456789.:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ₹ ',
            });

            setMessage("Reading Document...")
            setProgress(30)

            // Convert file to Data URL to ensure compatibility with Tesseract.js in all browsers
            const reader = new FileReader();
            const dataUrl = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setMessage("Scanning for data...")
            const { data: { text } } = await worker.recognize(dataUrl)
            setDebugText(text)

            await worker.terminate()
            // Verification Logic (Client-Side)
            verifyDocument(text)

        } catch (err: any) {
            console.error("OCR Error Details:", err)
            setStatus('failure')
            setMessage(`Failed to read document: ${err.message || 'Unknown Error'}`)
        }
    }

    const verifyDocument = (text: string) => {
        setMessage("Verifying Eligibility...")

        // Robust cleanup: remove commas and normalize whitespace
        const cleanText = text.replace(/,/g, '').replace(/\s+/g, ' ');

        // Multi-pattern strategy
        const patterns = [
            /(?:Annual\s+)?Income\s*[:=-]?\s*₹?\s*(\d+)/i,          // Annual Income: 50000
            /(?:Total\s+)?Income\s*[:=-]?\s*₹?\s*(\d+)/i,           // Total Income: 50000
            /Income\s*Certificate\s*[^\d]*(\d+)/i,                // Income Certificate ... 50000
            /Amount\s*[:=-]?\s*₹?\s*(\d+)/i                        // Amount: 50000
        ]

        let detectedIncome: number | null = null;

        for (const pattern of patterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                detectedIncome = parseInt(match[1], 10);
                break;
            }
        }

        // Final fallback: Look for any number over 1000 near keywords
        if (detectedIncome === null) {
            const keywords = ['income', 'salary', 'wages', 'compensation'];
            const words = cleanText.toLowerCase().split(' ');

            for (let i = 0; i < words.length; i++) {
                if (keywords.some(k => words[i].includes(k))) {
                    // Check next few segments for a number
                    const window = words.slice(i, i + 10).join(' ');
                    const anyNumber = window.match(/(\d{4,9})/); // Look for 4-9 digit numbers (typical annual income)
                    if (anyNumber) {
                        detectedIncome = parseInt(anyNumber[1], 10);
                        break;
                    }
                }
            }
        }

        // Detect Aadhaar (12 digits, maybe with spaces)
        const aadhaarMatch = cleanText.match(/\d{4}\s?\d{4}\s?\d{4}/);
        if (aadhaarMatch) {
            setDetectedAadhaar(aadhaarMatch[0]);
        }

        if (detectedIncome !== null) {
            const income = detectedIncome;

            if (scheme.incomeLimit > 0 && income > scheme.incomeLimit) {
                setStatus('failure')
                setMessage(`Income ₹${income.toLocaleString()} exceeds limit of ₹${scheme.incomeLimit.toLocaleString()}`)
            } else {
                setStatus('success')
                setMessage(`Verified! Income ₹${income.toLocaleString()} is within limit.`)

                // Create and store Token
                const tokenString = `VERIFIED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                const user = auth.currentUser;

                const token: EligibilityToken = {
                    tokenString,
                    userId: user?.uid || "anonymous",
                    schemeId: scheme.id,
                    issuedAt: new Date() as any,
                    expiresAt: new Date(Date.now() + 86400000) as any
                }

                // Persist to Firestore
                if (user) {
                    import("@/lib/firebase").then(({ db }) => {
                        import("firebase/firestore").then(({ collection, addDoc }) => {
                            addDoc(collection(db, "eligibilityTokens"), {
                                ...token,
                                createdAt: new Date()
                            });
                        });
                    });

                    import("@/services/schemeStatus").then(({ updateSchemeStatus }) => {
                        updateSchemeStatus(user.uid, scheme.id, 'eligible');
                    });
                }

                onTokenCreated(token)
            }
        } else {
            console.log("OCR Match Failed. Full text:", text);
            setStatus('failure')
            setMessage("Could not find income value. Please ensure 'Annual Income' is clear in the document.")
        }
    }

    return (
        <Card className="border-dashed border-2 p-6">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t.verifier.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t.verifier.description}
                    </p>
                </div>

                {status === 'idle' && (
                    <div className="w-full">
                        <Button variant="outline" className="w-full relative cursor-pointer" asChild>
                            <label>
                                <FileText className="mr-2 h-4 w-4" />
                                {t.verifier.select}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">Supports Example: &quot;Annual Income: 120000&quot; or &quot;Aadhaar: 1234 5678 9012&quot;</p>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="w-full space-y-2">
                        <Progress value={progress} />
                        <p className="text-xs text-muted-foreground animate-pulse">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center text-green-600 space-y-2 animate-in zoom-in">
                        <CheckCircle2 className="h-10 w-10" />
                        <p className="font-medium">{t.verifier.success}</p>
                        {detectedAadhaar && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Detected Aadhaar: XXXX-XXXX-{detectedAadhaar.slice(-4)}
                            </p>
                        )}
                    </div>
                )}

                {status === 'failure' && (
                    <div className="flex flex-col items-center text-red-600 space-y-2 animate-in shake">
                        <AlertCircle className="h-10 w-10" />
                        <p className="font-medium">{message}</p>
                        <Button variant="ghost" size="sm" onClick={() => setStatus('idle')}>Try Again</Button>
                        {debugText && (
                            <details className="text-left w-full mt-2">
                                <summary className="text-xs cursor-pointer">Debug OCR Text</summary>
                                <pre className="text-[10px] bg-muted p-2 rounded overflow-auto max-h-20">{debugText}</pre>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}
