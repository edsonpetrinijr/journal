interface SummaryCardProps {
  aiSummary: {
    highlights: string[];
    lessons: string[];
    improvements: string[];
    nextActions: string[];
  };
}

export function SummaryCard({ aiSummary }: SummaryCardProps) {
  const sections = [
    { title: "Highlights", items: aiSummary.highlights, icon: "⭐" },
    { title: "Lessons Learned", items: aiSummary.lessons, icon: "💡" },
    { title: "Improvements", items: aiSummary.improvements, icon: "🎯" },
    { title: "Next Day Actions", items: aiSummary.nextActions, icon: "📋" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-4 bg-card border border-border rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{section.icon}</span>
              <h4 className="font-semibold text-sm text-card-foreground">
                {section.title}
              </h4>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-card-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
