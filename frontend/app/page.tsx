import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[600px]">
        {/* Gradient background standing in for course image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #316948 0%, transparent 50%), radial-gradient(circle at 80% 20%, #004225 0%, transparent 50%)" }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-headline font-extrabold text-6xl md:text-8xl text-white mb-4 tracking-tighter">
            FairwayCheck
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-primary-container font-medium mb-12 tracking-wide">
            Know before you go
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/visits"
              className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-headline font-bold text-base tracking-wide transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-secondary/20"
            >
              Log a Visit
            </Link>
            <Link
              href="/report"
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-headline font-bold text-base tracking-wide transition-all hover:bg-white/20"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-surface py-14">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="font-label text-secondary font-extrabold tracking-[0.2em] text-xs">
                THE PLATFORM
              </span>
              <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight mt-2">
                Built by golfers, for golfers
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "12", label: "Courses Tracked", sub: "Across 8 states" },
              { value: "21", label: "Community Visits", sub: "Last 6 months" },
              { value: "9", label: "Condition Categories", sub: "Per visit review" },
            ].map(({ value, label, sub }) => (
              <div key={label} className="bg-surface-container-low p-8 rounded-xl">
                <p className="font-headline text-5xl font-black text-primary tracking-tighter">{value}</p>
                <p className="font-headline text-base font-bold text-primary mt-2">{label}</p>
                <p className="text-on-surface-variant text-sm mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-primary rounded-xl p-10 flex flex-col justify-end min-h-[280px] relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-[120px] font-headline font-black leading-none select-none">
                9.4
              </div>
              <h3 className="font-headline text-3xl font-bold mb-3 z-10">
                Real-Time Course Intelligence
              </h3>
              <p className="text-on-primary-container max-w-md text-base z-10">
                Get up-to-date ratings on aeration, pace, and playing conditions before you book your next tee time.
              </p>
            </div>
            <div className="bg-secondary rounded-xl p-10 flex flex-col items-center justify-center text-center text-on-secondary">
              <p className="font-headline text-5xl font-black mb-4">⛳</p>
              <h3 className="font-headline text-xl font-bold mb-2">Clubhouse Access</h3>
              <p className="text-xs font-bold opacity-90 uppercase tracking-widest font-label">
                Community Reviews
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
