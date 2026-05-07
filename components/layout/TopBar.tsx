export default function TopBar() {
  return (
    <header className="h-14 border-b border-warm-400/10 flex items-center justify-between px-6 bg-midnight-800/50">
      <div className="font-serif text-lg gradient-text-amber md:hidden">Fluenta</div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="text-sm text-warm-300">
          <span className="text-amber-400 font-semibold">⚡ 1,240 XP</span>
        </div>
      </div>
    </header>
  );
}
