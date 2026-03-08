interface TranscriptEditorProps {
  transcript: string;
  onChange: (transcript: string) => void;
}

export function TranscriptEditor({
  transcript,
  onChange,
}: TranscriptEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        Transcript
      </label>
      <textarea
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcribed reflection will appear here..."
        className="w-full p-4 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        rows={6}
      />
    </div>
  );
}
