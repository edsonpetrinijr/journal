import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoodSelector } from "../components/MoodSelector";
import { HabitToggle } from "../components/HabitToggle";
import { MetricsSection } from "../components/MetricsSection";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { TranscriptEditor } from "../components/TranscriptEditor";
import { SummaryCard } from "../components/SummaryCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface JournalEntry {
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
  audioBlob: Blob | null;
  transcript: string;
  aiSummary: {
    highlights: string[];
    lessons: string[];
    improvements: string[];
    nextActions: string[];
  };
}

const MOCK_TRANSCRIPT =
  "Today was productive. I worked on my drone project and went to the gym. I think tomorrow I should focus more on finishing the Kalman filter implementation. Overall, I feel good about my progress.";

const MOCK_AI_SUMMARY = {
  highlights: [
    "Worked on drone project",
    "Went to the gym",
    "Made progress on tasks",
  ],
  lessons: ["Need to stay more focused on one task", "Time management is key"],
  improvements: [
    "Reduce time watching YouTube",
    "Start working earlier in the day",
  ],
  nextActions: [
    "Finish Kalman filter code",
    "Go to gym earlier",
    "Review drone project requirements",
  ],
};

export default function Index() {
  const navigate = useNavigate();
  const [journal, setJournal] = useState<JournalEntry>({
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    mood: 0,
    sleepHours: 8,
    energy: 3,
    habits: {
      gym: false,
      reading: false,
      prayer: false,
      deepWork: false,
    },
    audioBlob: null,
    transcript: MOCK_TRANSCRIPT,
    aiSummary: MOCK_AI_SUMMARY,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setJournal((prev) => ({
      ...prev,
      audioBlob: blob,
    }));
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const handleDeleteRecording = () => {
    setJournal((prev) => ({
      ...prev,
      audioBlob: null,
    }));
    setRecordingDuration(0);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journal.audioBlob) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("audioFile", journal.audioBlob, "recording.webm");
    formData.append("mood", journal.mood.toString());
    formData.append("sleepHours", journal.sleepHours.toString());
    formData.append("energy", journal.energy.toString());
    formData.append("gym", journal.habits.gym.toString());
    formData.append("reading", journal.habits.reading.toString());
    formData.append("prayer", journal.habits.prayer.toString());
    formData.append("deepWork", journal.habits.deepWork.toString());

    try {
      const response = await fetch("http://localhost:3001/journal", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const data = await response.json();
      console.log("Entry saved:", data);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError("Failed to save your journal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = journal.mood > 0 && journal.audioBlob;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Journal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {journal.date}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-foreground rounded-lg transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Daily Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span>
                Daily Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MoodSelector
                mood={journal.mood}
                onChange={(mood) =>
                  setJournal((prev) => ({ ...prev, mood }))
                }
              />

              <HabitToggle
                habits={journal.habits}
                onChange={(habits) =>
                  setJournal((prev) => ({ ...prev, habits }))
                }
              />

              <MetricsSection
                energy={journal.energy}
                onEnergyChange={(energy) =>
                  setJournal((prev) => ({ ...prev, energy }))
                }
              />
            </CardContent>
          </Card>

          {/* Voice Recording Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>🎤</span>
                Voice Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                hasRecording={journal.audioBlob !== null}
                recordingDuration={recordingDuration}
                onDelete={handleDeleteRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={() => setIsRecording(false)}
              />
            </CardContent>
          </Card>

          {/* Sections moved to Dashboard as requested */}

          {/* Submit Button */}
          <div className="flex flex-col gap-4">
            {error && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!canSubmit || isRecording || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform flex items-center justify-center gap-2 ${canSubmit && !isRecording && !isSubmitting
                ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 cursor-pointer shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : isRecording ? (
                "⏹ Stop Recording"
              ) : (
                "Submit Entry"
              )}
            </button>
            {!canSubmit && !isRecording && (
              <p className="text-sm text-muted-foreground text-center">
                {journal.mood === 0
                  ? "Please select your mood"
                  : "Please record your reflection"}
              </p>
            )}
          </div>
        </form>
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 max-w-sm animate-in slide-in-from-bottom-5">
          <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold">Journal entry saved</p>
              <p className="text-sm opacity-90">
                Your reflection has been recorded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer spacing */}
      <div className="h-8" />
    </div>
  );
}
