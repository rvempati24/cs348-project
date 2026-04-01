"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API = "http://127.0.0.1:8080";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "greens_speed", label: "Greens Speed" },
  { key: "greens_quality", label: "Greens Quality" },
  { key: "fairway_quality", label: "Fairway Quality" },
  { key: "bunker_maintenance", label: "Bunker Maintenance" },
  { key: "tee_boxes", label: "Tee Boxes" },
  { key: "rough_condition", label: "Rough Condition" },
  { key: "pace_of_play", label: "Pace of Play" },
  { key: "staff_friendliness", label: "Staff Friendliness" },
  { key: "value_for_money", label: "Value for Money" },
];

const DEFAULT_RATINGS = Object.fromEntries(CATEGORIES.map((c) => [c.key, 7.0]));

interface Course { course_id: number; name: string; city: string; state: string; region?: string; num_holes?: number; par?: number; green_fees?: number; website?: string; }
interface Visit {
  visit_id: number;
  course_id: number;
  visit_date: string;
  overall_score: number;
  comments: string;
  course_name: string;
  city: string;
  state: string;
  ratings: Record<string, number>;
}

function scoreLabel(score: number) {
  if (score >= 9.0) return "Elite Conditions";
  if (score >= 8.0) return "Excellent Conditions";
  if (score >= 7.0) return "Good Conditions";
  if (score >= 5.5) return "Fair Conditions";
  return "Poor Conditions";
}

function scoreBadgeBg(score: number) {
  if (score >= 8.5) return "bg-primary text-on-primary";
  if (score >= 7.0) return "bg-secondary text-on-secondary";
  if (score >= 5.5) return "bg-secondary-fixed text-on-secondary-fixed";
  return "bg-error-container text-on-error-container";
}

export default function VisitsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCity, setNewCourseCity] = useState("");
  const [newCourseState, setNewCourseState] = useState("");
  const [newCourseRegion, setNewCourseRegion] = useState("");
  const [newCourseHoles, setNewCourseHoles] = useState("");
  const [newCoursePar, setNewCoursePar] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [courseId, setCourseId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [comments, setComments] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>(DEFAULT_RATINGS);

  const fetchAll = useCallback(async () => {
    const [c, v] = await Promise.all([
      fetch(`${API}/api/courses`).then((r) => r.json()),
      fetch(`${API}/api/visits`).then((r) => r.json()),
    ]);
    setCourses(c);
    setVisits(v);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const overallScore = parseFloat(
    (Object.values(ratings).reduce((a, b) => a + b, 0) / CATEGORIES.length).toFixed(1)
  );

  function resetForm() {
    setEditingId(null);
    setCourseId("");
    setVisitDate("");
    setComments("");
    setRatings(DEFAULT_RATINGS);
    setError("");
  }

  function startEdit(v: Visit) {
    setEditingId(v.visit_id);
    setCourseId(String(v.course_id));
    setVisitDate(v.visit_date);
    setComments(v.comments || "");
    setRatings({ ...DEFAULT_RATINGS, ...v.ratings });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAddCourse() {
    setShowAddCourse(false);
    setNewCourseName("");
    setNewCourseCity("");
    setNewCourseState("");
    setNewCourseRegion("");
    setNewCourseHoles("");
    setNewCoursePar("");
  }

  async function handleAddCourse() {
    if (!newCourseName || !newCourseCity || !newCourseState || !newCourseRegion || !newCourseHoles || !newCoursePar) {
      setError("Please fill in all course details.");
      return;
    }
    setAddingCourse(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourseName,
          city: newCourseCity,
          state: newCourseState,
          region: newCourseRegion,
          num_holes: parseInt(newCourseHoles),
          par: parseInt(newCoursePar),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to add course.");
      } else {
        const newCourse = await res.json();
        resetAddCourse();
        await fetchAll();
        setCourseId(String(newCourse.course_id));
      }
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setAddingCourse(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || !visitDate) {
      setError("Please fill in course and date.");
      return;
    }
    setSaving(true);
    setError("");
    const body = { course_id: Number(courseId), visit_date: visitDate, comments, ratings };
    try {
      const url = editingId ? `${API}/api/visits/${editingId}` : `${API}/api/visits`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Save failed.");
      } else {
        resetForm();
        await fetchAll();
      }
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`${API}/api/visits/${deleteId}`, { method: "DELETE" });
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
    await fetchAll();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-on-surface-variant text-sm">
        Loading…
      </div>
    );
  }

  const selectedCourse = courses.find((c) => String(c.course_id) === courseId);

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-12">
          <header className="space-y-2">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
              {editingId ? "Edit Visit" : "Log Your Round"}
            </h1>
            <p className="text-on-surface-variant font-medium">
              Contribute to the Digital Clubhouse by detailing your latest visit.
            </p>
          </header>

          {error && (
            <div className="px-5 py-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Course + Date */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-surface-container-low rounded-xl">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Select Golf Course
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={courseId}
                      onChange={(e) => {
                        if (e.target.value === "add_new") {
                          setShowAddCourse(true);
                        } else {
                          setCourseId(e.target.value);
                        }
                      }}
                      required
                      className="w-full appearance-none bg-surface-container-lowest border-none py-4 px-4 rounded-lg focus:ring-2 focus:ring-secondary transition-all outline-none font-semibold text-primary text-sm pr-10"
                    >
                      <option value="">Select a course…</option>
                      {courses.map((c) => (
                        <option key={c.course_id} value={c.course_id}>
                          {c.name} — {c.city}, {c.state}
                        </option>
                      ))}
                      <option value="add_new">+ Add New Course</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">▾</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(true)}
                    className="px-4 py-4 bg-secondary text-on-secondary font-bold rounded-lg hover:brightness-110 transition-all"
                    title="Add new course"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Date of Visit
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                  className="w-full bg-surface-container-lowest border-none py-4 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
                />
              </div>
            </section>

            {/* Condition Categories */}
            <section>
              <div className="mb-8 flex items-baseline justify-between">
                <h2 className="font-headline text-2xl font-bold text-primary">
                  Course Conditions
                </h2>
                <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                  Rate from 1.0 to 10.0
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8">
                {CATEGORIES.map(({ key, label }) => (
                  <div key={key} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary text-sm">{label}</span>
                      <span className="text-secondary font-black">{ratings[key].toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={ratings[key]}
                      onChange={(e) => setRatings((r) => ({ ...r, [key]: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Comments + Submit */}
            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Additional Notes
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe the weather, pin placements, or specific highlights..."
                  rows={4}
                  className="w-full bg-surface-container-low border-none rounded-xl p-6 focus:ring-2 focus:ring-secondary transition-all outline-none font-body text-primary placeholder:text-outline resize-none text-sm"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-5 bg-secondary text-on-secondary font-headline font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
                >
                  {saving ? "Saving…" : editingId ? "Update Visit" : "Submit Report"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-5 bg-surface-container-high text-on-surface font-headline font-bold rounded-xl hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </section>
          </form>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-4 space-y-12">
          {/* Live Score Badge */}
          <div className="bg-primary p-1 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-surface-container-lowest rounded-[1.25rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
              <h3 className="font-label text-xs uppercase tracking-widest font-black text-outline">
                Overall Score
              </h3>
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-[10px] border-primary-fixed flex items-center justify-center shadow-inner">
                  <span className="font-headline text-7xl font-black text-primary tracking-tighter">
                    {overallScore.toFixed(1)}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg">
                  <span className="text-on-secondary text-lg">★</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-headline text-xl font-bold text-primary">
                  {scoreLabel(overallScore)}
                </p>
                {selectedCourse && (
                  <p className="text-sm text-on-surface-variant font-medium">
                    {selectedCourse.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Visits */}
          <section className="space-y-6">
            <h3 className="font-headline text-2xl font-bold text-primary">Recent Visits</h3>
            {visits.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No visits logged yet.</p>
            ) : (
              <div className="space-y-4">
                {visits.slice(0, 6).map((v) => (
                  <div
                    key={v.visit_id}
                    className={`bg-surface-container-low p-5 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors ${editingId === v.visit_id ? "ring-2 ring-secondary" : ""}`}
                    onClick={() => startEdit(v)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-primary leading-tight truncate">{v.course_name}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">
                        {v.visit_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className={`w-12 h-12 rounded-full beli-badge flex items-center justify-center font-black text-sm shrink-0 ${scoreBadgeBg(v.overall_score)}`}>
                        {v.overall_score.toFixed(1)}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(v.visit_id); }}
                        className="text-outline hover:text-error transition-colors text-sm font-bold opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {visits.length > 6 && (
              <button className="w-full text-center py-4 font-label text-[10px] uppercase tracking-widest font-black text-outline hover:text-secondary transition-colors">
                {visits.length - 6} more visits
              </button>
            )}
          </section>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-surface-container-lowest border-none whisper-shadow">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">Delete visit?</DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              This permanently removes the visit and all its condition ratings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteId(null)}
              className="px-5 py-2 rounded-lg font-headline font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2 rounded-lg bg-error text-on-error font-headline font-bold text-sm hover:brightness-110 transition-all"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={showAddCourse} onOpenChange={(open) => !open && resetAddCourse()}>
        <DialogContent className="bg-surface-container-lowest border-none whisper-shadow">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">Add New Golf Course</DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              Enter the details of the golf course you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Course Name *
              </label>
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Pebble Beach Golf Links"
                className="w-full bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  City *
                </label>
                <input
                  type="text"
                  value={newCourseCity}
                  onChange={(e) => setNewCourseCity(e.target.value)}
                  placeholder="Pebble Beach"
                  className="w-full bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  State *
                </label>
                <input
                  type="text"
                  value={newCourseState}
                  onChange={(e) => setNewCourseState(e.target.value)}
                  placeholder="CA"
                  className="w-full bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Region *
              </label>
              <select
                value={newCourseRegion}
                onChange={(e) => setNewCourseRegion(e.target.value)}
                className="w-full appearance-none bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
              >
                <option value="">Select region…</option>
                <option value="Northeast">Northeast</option>
                <option value="Southeast">Southeast</option>
                <option value="Midwest">Midwest</option>
                <option value="Southwest">Southwest</option>
                <option value="West">West</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Number of Holes *
                </label>
                <input
                  type="number"
                  value={newCourseHoles}
                  onChange={(e) => setNewCourseHoles(e.target.value)}
                  placeholder="18"
                  min="9"
                  max="27"
                  className="w-full bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Par *
                </label>
                <input
                  type="number"
                  value={newCoursePar}
                  onChange={(e) => setNewCoursePar(e.target.value)}
                  placeholder="72"
                  min="60"
                  max="80"
                  className="w-full bg-surface-container-low border-none py-3 px-4 rounded-lg focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary text-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={resetAddCourse}
              className="px-5 py-2 rounded-lg font-headline font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCourse}
              disabled={addingCourse}
              className="px-5 py-2 rounded-lg bg-secondary text-on-secondary font-headline font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              {addingCourse ? "Adding…" : "Add Course"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
