interface HabitToggleProps {
  habits: {
    gym: boolean;
    reading: boolean;
    prayer: boolean;
    deepWork: boolean;
  };
  onChange: (habits: HabitToggleProps["habits"]) => void;
}

const habitsList = [
  { key: "gym" as const, label: "Gym", icon: "💪" },
  { key: "reading" as const, label: "Reading", icon: "📖" },
  { key: "prayer" as const, label: "Prayer", icon: "🙏" },
  { key: "deepWork" as const, label: "Deep Work", icon: "🧠" },
];

export function HabitToggle({ habits, onChange }: HabitToggleProps) {
  const handleToggle = (key: keyof typeof habits) => {
    onChange({
      ...habits,
      [key]: !habits[key],
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        Habits Completed
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {habitsList.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleToggle(key)}
            className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${habits[key]
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-foreground hover:bg-muted/80"
              }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
