interface MetricsSectionProps {
  energy: number;
  onEnergyChange: (level: number) => void;
}

export function MetricsSection({
  energy,
  onEnergyChange,
}: MetricsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Energy Level */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-foreground">
            Energy Level
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {["😴", "😑", "😐", "🙂", "⚡"][energy - 1]}
            </span>
            <span className="text-lg font-bold text-primary">{energy}/5</span>
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onEnergyChange(level)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${energy === level
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={energy}
          onChange={(e) => onEnergyChange(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
