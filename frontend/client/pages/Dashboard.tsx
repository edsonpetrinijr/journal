import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SummaryCard } from "../components/SummaryCard";
import { TranscriptEditor } from "../components/TranscriptEditor";

interface JournalEntry {
    id: string;
    timestamp: string;
    date: string;
    mood: number;
    sleepHours: number;
    energy: number;
    habits: {
        gym: boolean;
        reading: boolean;
        prayer: boolean;
        deepWork: boolean;
    };
    audioUrl: string | null;
    transcript: string;
    aiSummary: {
        highlights: string[];
        lessons: string[];
        improvements: string[];
        nextActions: string[];
    };
}

const getMoodEmoji = (mood: number) => {
    switch (mood) {
        case 5: return "😊";
        case 4: return "🙂";
        case 3: return "😐";
        case 2: return "🙁";
        case 1: return "😢";
        default: return "😶";
    }
};

export default function Dashboard() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch("http://localhost:3001/journal");
                if (!response.ok) throw new Error("Failed to fetch entries");
                const data = await response.json();

                // Map backend data to frontend model
                const mappedEntries: JournalEntry[] = data.map((entry: any) => ({
                    id: entry.id.toString(),
                    timestamp: entry.date || entry.createdAt,
                    date: new Date(entry.date || entry.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                    mood: entry.mood,
                    sleepHours: entry.sleepHours,
                    energy: entry.energy,
                    habits: {
                        gym: entry.gym,
                        reading: entry.reading,
                        prayer: entry.prayer,
                        deepWork: entry.deepWork,
                    },
                    audioUrl: entry.audioPath ? `http://localhost:3001/${entry.audioPath.replace(/\\/g, '/')}` : null,
                    transcript: entry.transcript,
                    aiSummary: entry.summary ? {
                        highlights: JSON.parse(entry.summary.highlights),
                        lessons: JSON.parse(entry.summary.lessons),
                        improvements: JSON.parse(entry.summary.improvements),
                        nextActions: JSON.parse(entry.summary.nextActions),
                    } : {
                        highlights: [],
                        lessons: [],
                        improvements: [],
                        nextActions: [],
                    },
                }));

                setEntries(mappedEntries);
                if (mappedEntries.length > 0) {
                    setSelectedEntry(mappedEntries[0]);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntries();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                    <Link
                        to="/"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-semibold shadow-sm hover:shadow-md active:scale-95"
                    >
                        + New Entry
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Loading your insights...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Entries List */}
                        <div className="md:col-span-1 space-y-4">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                📅 History
                            </h2>
                            {entries.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                                    <p className="text-muted-foreground italic">No reflections yet.</p>
                                    <Link to="/" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">Start your first one</Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {entries.map((entry) => (
                                        <button
                                            key={entry.id}
                                            onClick={() => setSelectedEntry(entry)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedEntry?.id === entry.id
                                                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                                : "bg-card border-transparent hover:border-primary/30 hover:bg-muted/50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-muted-foreground uppercase">
                                                    {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                                            </div>
                                            <p className="text-sm text-foreground font-medium line-clamp-1">
                                                {entry.transcript.slice(0, 40)}...
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details View */}
                        <div className="md:col-span-2 space-y-6">
                            {!selectedEntry ? (
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
                                    Select an entry to view details
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>{selectedEntry.date}</span>
                                                <span className="text-2xl">{getMoodEmoji(selectedEntry.mood)}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Energy</p>
                                                    <p className="text-lg font-bold">{"⭐".repeat(selectedEntry.energy)}</p>
                                                </div>
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Sleep</p>
                                                    <p className="text-lg font-bold">{selectedEntry.sleepHours}h</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Habits</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(selectedEntry.habits).map(([habit, done]) => (
                                                        <span
                                                            key={habit}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${done ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {habit.charAt(0).toUpperCase() + habit.slice(1)} {done ? "✓" : "✗"}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedEntry.audioUrl && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Recording</p>
                                                    <audio controls src={selectedEntry.audioUrl} className="w-full h-8" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                <span>📝</span> Transcript
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <TranscriptEditor
                                                transcript={selectedEntry.transcript}
                                                onChange={() => { }} // Read-only in dashboard for now
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                <span>✨</span> AI Insights
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <SummaryCard aiSummary={selectedEntry.aiSummary} />
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
