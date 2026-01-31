"use client"

import { useState, useEffect } from "react"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { CitizenProfile } from "@/lib/types"

export function ProfileForm() {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Initial state matching CitizenProfile['profileData']
    const [formData, setFormData] = useState<CitizenProfile['profileData']>({
        name: "",
        age: 0,
        education: "",
        income: 0,
        caste: "",
        state: "",
        occupationTags: []
    })

    // Helper for tagging UI (comma separated string -> array)
    const [tagsInput, setTagsInput] = useState("")

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                getDoc(doc(db, "citizenProfiles", currentUser.uid)).then(snap => {
                    if (snap.exists()) {
                        const data = snap.data() as CitizenProfile;
                        setFormData(data.profileData)
                        setTagsInput(data.profileData.occupationTags.join(", "))
                    }
                })
            } else {
                router.push("/login")
            }
        })
        return () => unsubscribe()
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: (id === 'age' || id === 'income') ? Number(value) : value
        }))
    }

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value)
        // Update real state on blur or submit, but let's sync for now
        const tags = e.target.value.split(",").map(t => t.trim()).filter(t => t.length > 0)
        setFormData(prev => ({ ...prev, occupationTags: tags }))
    }

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)
        try {
            const profile: CitizenProfile = {
                userId: user.uid,
                managedBy: 'self',
                profileData: formData,
                documentStatus: {}, // Init empty
                createdAt: new Date() as any // Firebase Timestamp adjustment needed in real app, generic Date works for now
            }
            await setDoc(doc(db, "citizenProfiles", user.uid), profile, { merge: true })
            router.push("/schemes")
        } catch (error) {
            console.error(error)
            alert("Error saving profile")
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div className="text-center p-10">Loading...</div>

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                    Complete your profile to get personalized scheme recommendations.
                </CardDescription>
            </CardHeader>
            <form onSubmit={saveProfile}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="20" value={formData.age || ''} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="education">Education Level</Label>
                        <Input id="education" placeholder="e.g. 12th Pass, Graduate" value={formData.education} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="income">Annual Family Income (₹)</Label>
                        <Input id="income" type="number" placeholder="100000" value={formData.income || ''} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caste">Category / Caste</Label>
                        <Input id="caste" placeholder="General, OBC, SC, ST" value={formData.caste} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="e.g. Karnataka, Delhi" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="occupationTags">Occupation / Tags (comma separated)</Label>
                        <Input id="tags" placeholder="Student, Farmer, Unemployed" value={tagsInput} onChange={handleTagsChange} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save & Find Schemes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
