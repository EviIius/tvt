export default function WellsFargoHeader() {
  return (
    <div className="w-full">
      <div className="bg-primary text-primary-foreground py-3 px-6">
        <h1 className="text-2xl font-bold tracking-wide">ML Platform</h1>
      </div>
      {/* Optional: Keep or remove the accent line based on preference */}
      <div className="h-1 bg-accent"></div>
    </div>
  );
}
