import React, { useState, useEffect, useMemo } from "react";
import {
  FaLinkedin,
  FaSearch,
  FaSortAmountDown,
  FaGraduationCap,
  FaInfoCircle,
  FaChevronDown,
  FaExclamationTriangle,
  FaTimes,
  FaTrophy,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import Sem1Results from "./Sem1Results.json";
import Sem2Results from "./Sem2Results.json";
import Sem3Results from "./Sem3Results.json";
import Sem4Results from "./Sem4Results.json";
import Sem5Results from "./Sem5Results.json";
import Sem6Results from "./Sem6Results.json";

import Modal from "./Modal";
import CGPAExplanation from "./CGPAExplanation";

const SEMESTERS = ["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"];
const semNum = (key) => key.replace("sem", "");
const isFail = (grade) => /fail/i.test(grade || "");

// Grade -> chip colour. Ordered longest-first so "A+" is not matched by "A".
const GRADE_STYLES = [
  ["O", "bg-emerald-100 text-emerald-800 ring-emerald-200"],
  ["A+", "bg-emerald-100 text-emerald-800 ring-emerald-200"],
  ["A", "bg-teal-100 text-teal-800 ring-teal-200"],
  ["B+", "bg-sky-100 text-sky-800 ring-sky-200"],
  ["B", "bg-blue-100 text-blue-800 ring-blue-200"],
  ["C", "bg-amber-100 text-amber-800 ring-amber-200"],
  ["P", "bg-orange-100 text-orange-800 ring-orange-200"],
];

const gradeStyle = (grade) => {
  if (isFail(grade)) return "bg-red-100 text-red-700 ring-red-200";
  const g = (grade || "").trim().toUpperCase();
  const hit = GRADE_STYLES.find(([code]) => code === g);
  return hit ? hit[1] : "bg-gray-100 text-gray-700 ring-gray-200";
};

const gpaTone = (value) => {
  const v = parseFloat(value);
  if (v >= 8.0) return { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500" };
  if (v >= 7.0) return { chip: "bg-sky-50 text-sky-700 ring-sky-200", bar: "bg-sky-500" };
  if (v >= 6.0) return { chip: "bg-blue-50 text-blue-700 ring-blue-200", bar: "bg-blue-500" };
  if (v >= 5.0) return { chip: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-500" };
  return { chip: "bg-red-50 text-red-700 ring-red-200", bar: "bg-red-500" };
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeSem, setActiveSem] = useState({});
  const [sortOrder, setSortOrder] = useState("roll");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const combined = {};

      const processSemester = (semesterData, semesterKey) => {
        semesterData.forEach((student) => {
          const totalCreditPoints = student.results.reduce(
            (acc, r) => acc + (parseFloat(r.gradePoint) || 0) * (parseInt(r.creditHours, 10) || 0),
            0,
          );
          const totalCreditHours = student.results.reduce((acc, r) => acc + (parseInt(r.creditHours, 10) || 0), 0);

          if (!combined[student.hallTicket]) {
            combined[student.hallTicket] = {
              name: student.name,
              hallTicket: student.hallTicket,
              semesters: {},
              availableSemesters: [],
            };
          }

          combined[student.hallTicket].semesters[semesterKey] = {
            results: student.results,
            average: totalCreditHours ? (totalCreditPoints / totalCreditHours).toFixed(2) : "0.00",
            totalCreditPoints: totalCreditPoints.toFixed(2),
            totalCreditHours,
            arrears: student.results.filter((r) => isFail(r.grade)).length,
          };
          combined[student.hallTicket].availableSemesters.push(semesterKey);
        });
      };

      processSemester(Sem1Results, "sem1");
      processSemester(Sem2Results, "sem2");
      processSemester(Sem3Results, "sem3");
      processSemester(Sem4Results, "sem4");
      processSemester(Sem5Results, "sem5");
      processSemester(Sem6Results, "sem6");

      const list = Object.values(combined).map((student) => {
        let points = 0;
        let hours = 0;
        let arrears = 0;

        Object.values(student.semesters).forEach((sem) => {
          points += parseFloat(sem.totalCreditPoints);
          hours += sem.totalCreditHours;
          arrears += sem.arrears;
        });

        student.availableSemesters.sort();
        return {
          ...student,
          cgpa: hours ? (points / hours).toFixed(2) : "0.00",
          arrears,
          latestSemester: student.availableSemesters[student.availableSemesters.length - 1] || "sem1",
        };
      });

      setStudents(list);
      setActiveSem(Object.fromEntries(list.map((s) => [s.hallTicket, s.latestSemester])));
    } catch (err) {
      console.error(err);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    if (!students.length) return null;
    const gpas = students.map((s) => parseFloat(s.cgpa));
    const top = students.reduce((a, b) => (parseFloat(b.cgpa) > parseFloat(a.cgpa) ? b : a));
    return {
      count: students.length,
      average: (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2),
      top,
      withArrears: students.filter((s) => s.arrears > 0).length,
    };
  }, [students]);

  const visible = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return students
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.hallTicket.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortOrder === "cgpa") return parseFloat(b.cgpa) - parseFloat(a.cgpa);
        if (sortOrder === "name") return a.name.localeCompare(b.name);
        return a.hallTicket.localeCompare(b.hallTicket);
      });
  }, [students, searchTerm, sortOrder]);

  const toggle = (hallTicket) => setExpanded((prev) => ({ ...prev, [hallTicket]: !prev[hallTicket] }));

  const sortButton = (value, label, icon) => (
    <button
      onClick={() => setSortOrder(value)}
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition ${
        sortOrder === value
          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* ---------- Header ---------- */}
      <header className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4 pb-8 pt-6 text-white sm:px-6 sm:pb-10 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <FaGraduationCap className="mt-1 shrink-0 text-2xl text-blue-200 sm:text-3xl" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                1005 &middot; Dr. S. R. K. Govt. Arts College, Yanam
              </p>
              <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">B.Sc. Computer Science Results</h1>
              <p className="mt-1 text-sm text-blue-100">Batch 2023&ndash;2026 &middot; Semesters 1&ndash;6</p>
            </div>
          </div>

          <a
            href="https://www.linkedin.com/in/rajurekadi7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50 ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <FaLinkedin className="text-base" />
            Raju Rekadi
          </a>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <StatCard icon={<FaUsers />} label="Students" value={stats.count} />
            <StatCard icon={<FaChartLine />} label="Class avg CGPA" value={stats.average} />
            <StatCard icon={<FaTrophy />} label="Top CGPA" value={stats.top.cgpa} sub={stats.top.name} />
            <StatCard icon={<FaExclamationTriangle />} label="With arrears" value={stats.withArrears} />
          </div>
        )}
      </header>

      {/* ---------- Toolbar ---------- */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
            <input
              type="search"
              inputMode="search"
              placeholder="Search name or roll number"
              className="w-full rounded-full border-0 bg-gray-100 py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 ring-1 ring-transparent transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:overflow-visible sm:px-0">
            {sortButton("roll", "Roll no.")}
            {sortButton("cgpa", "Top CGPA", <FaSortAmountDown />)}
            {sortButton("name", "A–Z")}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-50"
            >
              <FaInfoCircle />
              CGPA?
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Body ---------- */}
      <main className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
            Loading results…
          </div>
        )}

        {error && (
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && (
          <>
            <p className="px-1 pb-3 text-xs font-medium text-gray-500">
              Showing {visible.length} of {students.length} students
            </p>

            {visible.length === 0 ? (
              <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-gray-200">
                <FaSearch className="mx-auto mb-3 text-3xl text-gray-300" />
                <p className="text-sm text-gray-500">No student matches “{searchTerm}”.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visible.map((student, idx) => {
                  const open = !!expanded[student.hallTicket];
                  const current = activeSem[student.hallTicket] || student.latestSemester;
                  const semData = student.semesters[current];
                  const tone = gpaTone(student.cgpa);

                  return (
                    <article
                      key={student.hallTicket}
                      className={`overflow-hidden rounded-2xl bg-white ring-1 transition ${
                        open ? "ring-blue-300 shadow-md" : "ring-gray-200 hover:ring-gray-300"
                      }`}
                    >
                      {/* Card header */}
                      <button
                        onClick={() => toggle(student.hallTicket)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50/70 sm:gap-4 sm:p-5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                          {idx + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">{student.name}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                            <span className="font-mono font-medium text-gray-600">{student.hallTicket}</span>
                            <span className="text-gray-300">•</span>
                            <span>Sem {student.availableSemesters.map(semNum).join(", ")}</span>
                            {student.arrears > 0 && (
                              <span className="rounded-full bg-red-50 px-2 py-0.5 font-semibold text-red-600 ring-1 ring-red-100">
                                {student.arrears} arrear{student.arrears > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                          <div className={`rounded-xl px-2.5 py-1.5 text-right ring-1 ${tone.chip}`}>
                            <div className="text-base font-bold leading-none sm:text-lg">{student.cgpa}</div>
                            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-70">
                              CGPA
                            </div>
                          </div>
                          <FaChevronDown
                            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded */}
                      {open && (
                        <div className="border-t border-gray-100 bg-slate-50/60 p-4 sm:p-5">
                          {/* Semester pills */}
                          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                            {SEMESTERS.map((key) => {
                              const data = student.semesters[key];
                              const isActive = current === key;
                              return (
                                <button
                                  key={key}
                                  disabled={!data}
                                  onClick={() =>
                                    setActiveSem((prev) => ({ ...prev, [student.hallTicket]: key }))
                                  }
                                  className={`min-w-[64px] shrink-0 rounded-xl px-3 py-2 text-center transition ${
                                    !data
                                      ? "cursor-not-allowed bg-gray-100 text-gray-300"
                                      : isActive
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                                  }`}
                                  title={data ? `Semester ${semNum(key)}` : "Not published"}
                                >
                                  <div className="text-xs font-semibold">Sem {semNum(key)}</div>
                                  <div className="text-[10px] opacity-80">{data ? data.average : "—"}</div>
                                </button>
                              );
                            })}
                          </div>

                          {!semData ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                              <FaExclamationTriangle className="mx-auto mb-2 text-xl text-amber-500" />
                              <p className="text-sm text-amber-800">Semester {semNum(current)} is not published.</p>
                            </div>
                          ) : (
                            <>
                              {/* Mobile: stacked subject cards */}
                              <div className="space-y-2 sm:hidden">
                                {semData.results.map((r, i) => (
                                  <div
                                    key={i}
                                    className={`rounded-xl bg-white p-3 ring-1 ${
                                      isFail(r.grade) ? "ring-red-200" : "ring-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="text-[13px] font-semibold leading-snug text-gray-800">
                                        {r.subject}
                                      </p>
                                      <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${gradeStyle(
                                          r.grade,
                                        )}`}
                                      >
                                        {r.grade}
                                      </span>
                                    </div>
                                    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
                                      <div className="flex gap-1">
                                        <dt>Credits</dt>
                                        <dd className="font-semibold text-gray-700">{r.creditHours}</dd>
                                      </div>
                                      <div className="flex gap-1">
                                        <dt>Grade pt</dt>
                                        <dd className="font-semibold text-gray-700">{r.gradePoint}</dd>
                                      </div>
                                      <div className="flex gap-1">
                                        <dt>Credit pt</dt>
                                        <dd className="font-semibold text-gray-700">{r.creditPoint}</dd>
                                      </div>
                                      <div className="flex gap-1">
                                        <dt>Type</dt>
                                        <dd className="font-semibold text-gray-700">{r.thPr}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                ))}
                              </div>

                              {/* Desktop: table */}
                              <div className="hidden overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 sm:block">
                                <table className="min-w-full">
                                  <thead>
                                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                                      <th className="px-4 py-2.5 text-left font-semibold">#</th>
                                      <th className="px-4 py-2.5 text-left font-semibold">Subject</th>
                                      <th className="px-4 py-2.5 text-center font-semibold">Type</th>
                                      <th className="px-4 py-2.5 text-center font-semibold">Credits</th>
                                      <th className="px-4 py-2.5 text-center font-semibold">Grade pt</th>
                                      <th className="px-4 py-2.5 text-center font-semibold">Credit pt</th>
                                      <th className="px-4 py-2.5 text-center font-semibold">Grade</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {semData.results.map((r, i) => (
                                      <tr key={i} className={isFail(r.grade) ? "bg-red-50/60" : "hover:bg-gray-50"}>
                                        <td className="px-4 py-3 text-sm text-gray-400">{r.slNo}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.subject}</td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-500">{r.thPr}</td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                          {r.creditHours}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                          {r.gradePoint}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                          {r.creditPoint}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span
                                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${gradeStyle(
                                              r.grade,
                                            )}`}
                                          >
                                            {r.grade}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* SGPA summary */}
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-200">
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Semester {semNum(current)} SGPA
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {semData.totalCreditPoints} credit points ÷ {semData.totalCreditHours} credits
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-gray-900">{semData.average}</span>
                                  {semData.arrears > 0 && (
                                    <p className="text-[11px] font-semibold text-red-600">
                                      {semData.arrears} arrear{semData.arrears > 1 ? "s" : ""}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            <p className="px-1 pt-8 text-center text-[11px] leading-relaxed text-gray-400">
              Provisional results sourced from Pondicherry University. Not a substitute for the official mark sheet.
            </p>
          </>
        )}
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CGPAExplanation />
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-100">
        <span className="text-blue-200">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-lg font-bold leading-none sm:text-xl">{value}</div>
      {sub && <div className="mt-1 truncate text-[10px] text-blue-200">{sub}</div>}
    </div>
  );
}

export default App;
