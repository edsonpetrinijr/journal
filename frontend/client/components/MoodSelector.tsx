interface MoodSelectorProps {
  mood: number;
  onChange: (mood: number) => void;
}

const moods = [
  { value: 1, emoji: "😞", label: "Terrible" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😄", label: "Great" },
  { value: 5, emoji: "😁", label: "Amazing" },
];

export function MoodSelector({ mood, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        How are you feeling?
      </label>
      <div className="flex gap-2 sm:gap-3 w-full">
        {moods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`flex flex-1 flex-col justify-center items-center gap-1.5 py-4 px-1 rounded-xl transition-all ${mood === m.value
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted hover:bg-muted/80"
              }`}
            title={m.label}
          >
            <span className="text-3xl sm:text-4xl">{m.emoji}</span>
            <span className={`text-xs font-semibold sm:text-sm ${mood === m.value ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
