import React, { useState, useEffect } from "react";
import { FaLinkedin, FaSearch } from "react-icons/fa";
import Sem1Results from "./Sem1Results.json";
import Sem2Results from "./Sem2Results.json";
import Sem3Results from "./Sem3Results.json";
import Sem4Results from "./Sem4Results.json";

import Modal from './Modal';
import CGPAExplanation from './CGPAExplanation';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [allResults, setAllResults] = useState([]);
  const [combinedResults, setCombinedResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Load data once on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      // Combine all semester data
      const combined = {};

      // Process Sem1
      Sem1Results.forEach((student) => {
        const totalWeightedGradePoints = student.results.reduce((acc, result) => {
          const gp = parseFloat(result.gradePoint) || 0;
          const ch = parseInt(result.creditHours, 10) || 0;
          return acc + gp * ch;
        }, 0);

        const totalCreditHours = student.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        const average = totalCreditHours ? (totalWeightedGradePoints / totalCreditHours).toFixed(2) : "0.00";

        if (!combined[student.hallTicket]) {
          combined[student.hallTicket] = {
            name: student.name,
            hallTicket: student.hallTicket,
            semesters: {},
          };
        }

        combined[student.hallTicket].semesters.sem1 = {
          results: student.results,
          average,
          totalCreditPoints: totalWeightedGradePoints.toFixed(2),
          totalCreditHours,
        };
      });

      // Process Sem2
      Sem2Results.forEach((student) => {
        const totalWeightedGradePoints = student.results.reduce((acc, result) => {
          const gp = parseFloat(result.gradePoint) || 0;
          const ch = parseInt(result.creditHours, 10) || 0;
          return acc + gp * ch;
        }, 0);

        const totalCreditHours = student.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        const average = totalCreditHours ? (totalWeightedGradePoints / totalCreditHours).toFixed(2) : "0.00";

        if (!combined[student.hallTicket]) {
          combined[student.hallTicket] = {
            name: student.name,
            hallTicket: student.hallTicket,
            semesters: {},
          };
        }

        combined[student.hallTicket].semesters.sem2 = {
          results: student.results,
          average,
          totalCreditPoints: totalWeightedGradePoints.toFixed(2),
          totalCreditHours,
        };
      });

      // Process Sem3
      Sem3Results.forEach((student) => {
        const totalWeightedGradePoints = student.results.reduce((acc, result) => {
          const gp = parseFloat(result.gradePoint) || 0;
          const ch = parseInt(result.creditHours, 10) || 0;
          return acc + gp * ch;
        }, 0);

        const totalCreditHours = student.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        const average = totalCreditHours ? (totalWeightedGradePoints / totalCreditHours).toFixed(2) : "0.00";

        if (!combined[student.hallTicket]) {
          combined[student.hallTicket] = {
            name: student.name,
            hallTicket: student.hallTicket,
            semesters: {},
          };
        }

        combined[student.hallTicket].semesters.sem3 = {
          results: student.results,
          average,
          totalCreditPoints: totalWeightedGradePoints.toFixed(2),
          totalCreditHours,
        };
      });

          // Process Sem3
      Sem4Results.forEach((student) => {
        const totalWeightedGradePoints = student.results.reduce((acc, result) => {
          const gp = parseFloat(result.gradePoint) || 0;
          const ch = parseInt(result.creditHours, 10) || 0;
          return acc + gp * ch;
        }, 0);

        const totalCreditHours = student.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        const average = totalCreditHours ? (totalWeightedGradePoints / totalCreditHours).toFixed(2) : "0.00";

        if (!combined[student.hallTicket]) {
          combined[student.hallTicket] = {
            name: student.name,
            hallTicket: student.hallTicket,
            semesters: {},
          };
        }

        combined[student.hallTicket].semesters.sem4 = {
          results: student.results,
          average,
          totalCreditPoints: totalWeightedGradePoints.toFixed(2),
          totalCreditHours,
        };
      });

      // Calculate CGPA for each student
      Object.keys(combined).forEach((hallTicket) => {
        const student = combined[hallTicket];
        let totalCreditPoints = 0;
        let totalCreditHours = 0;

        Object.keys(student.semesters).forEach((sem) => {
          totalCreditPoints += parseFloat(student.semesters[sem].totalCreditPoints);
          totalCreditHours += student.semesters[sem].totalCreditHours;
        });

        student.cgpa = totalCreditHours ? (totalCreditPoints / totalCreditHours).toFixed(2) : "0.00";
      });

      setCombinedResults(combined);

      // Set initial view to Sem3
      const updatedResults = Sem3Results.map((student) => {
        const totalWeightedGradePoints = student.results.reduce((acc, result) => {
          const gp = parseFloat(result.gradePoint) || 0;
          const ch = parseInt(result.creditHours, 10) || 0;
          return acc + gp * ch;
        }, 0);

        const totalCreditHours = student.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        const average = totalCreditHours ? (totalWeightedGradePoints / totalCreditHours).toFixed(2) : "0.00";

        return {
          ...student,
          average,
          totalCreditPoints: totalWeightedGradePoints.toFixed(2),
          totalCreditHours,
          expanded: false,
          cgpa: combined[student.hallTicket]?.cgpa || "0.00",
          activeSemester: "sem1", // Track active semester per student
        };
      });

      setAllResults(updatedResults);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSemesterChange = (hallTicket, sem) => {
    setAllResults((prevResults) =>
      prevResults.map((student) => (student.hallTicket === hallTicket ? { ...student, activeSemester: sem } : student)),
    );
  };

  // Filter and sort results
  const filteredAndSortedResults = [...allResults]
    .filter((student) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return student.name.toLowerCase().includes(searchLower) || student.hallTicket.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return parseFloat(a.cgpa) - parseFloat(b.cgpa);
      if (sortOrder === "desc") return parseFloat(b.cgpa) - parseFloat(a.cgpa);
      return 0; // Default/no sorting
    });

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="bg-white rounded-lg shadow px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
            College: <span className="font-medium">1005 - Dr. S. R. K. GOVT. ARTS COLLEGE, YANAM</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700">B.Sc. Computer Science Examination Results (2023-2026)</p>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p className="text-xs font-medium text-gray-700">Developed by Raju Rekadi</p>
          <a
            href="https://www.linkedin.com/in/rajurekadi7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center mt-1 hover:text-blue-800"
          >
            <FaLinkedin size={24} className="text-blue-600 hover:text-blue-800 transition" />
          </a>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}
      {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}

      {/* Sort and Search */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSortOrder("desc")}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              sortOrder === "desc" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Sort By CGPA
          </button>
          <button
            onClick={() => setSortOrder("")}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              sortOrder === "" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Sort By Roll Number
          </button>
        </div>

         <div className="">
      {/* Your existing content */}
      
      <button 
        onClick={() => setShowModal(true)}
        className="text-blue-500 hover:underline text-[9px] flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How is CGPA calculated?
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CGPAExplanation />
        </Modal>
      )}
    </div>


        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or roll number"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

         

      {/* Results */}
      {submitted && (
        <div className="mt-6 space-y-4">
          {filteredAndSortedResults.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-600">No students found matching your search.</p>
            </div>
          ) : (
            filteredAndSortedResults.map((student, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-md border">
                <div
                  className={`flex justify-between items-center cursor-pointer rounded-md p-2 sm:p-4 shadow-sm border transition ${
                    student.expanded ? "bg-blue-100 border-blue-400" : "bg-white"
                  }`}
                  onClick={() => {
                    const updated = allResults.map((s) =>
                      s.hallTicket === student.hallTicket ? { ...s, expanded: !s.expanded } : s,
                    );
                    setAllResults(updated);
                  }}
                >
                  <h3 className="text-xs sm:text-lg font-semibold max-w-[70%] break-words leading-snug">
                    {idx + 1}. {student.name} ({student.hallTicket})
                  </h3>
                  <div className="flex items-center sm:gap-4 flex-shrink-0 whitespace-nowrap">
                    <span className="text-xs sm:text-xs bg-blue-200 px-2 py-1 rounded font-bold">
                      CGPA: {student.cgpa}
                    </span>
                    <span className="text-lg sm:text-xl">{student.expanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {student.expanded && (
                  <div className="mt-2">
                    {/* Semester Tabs */}
                    <div className="flex gap-2 mb-4">
                      {["sem1", "sem2", "sem3", "sem4"].map(
                        (semKey) =>
                          combinedResults[student.hallTicket]?.semesters?.[semKey] && (
                            <button
                              key={semKey}
                              onClick={() => handleSemesterChange(student.hallTicket, semKey)}
                              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium border ${
                                student.activeSemester === semKey ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              }`}
                            >
                              Semester {semKey.replace("sem", "")}
                            </button>
                          ),
                      )}
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-200 text-center">
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">Sl. No</th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">
                              Subject Name
                            </th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">Th/Pr</th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">
                              Credit Hours
                            </th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">Grade Point</th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">
                              Credit Point
                            </th>
                            <th className="px-2 sm:px-4 py-2 border text-[8px] sm:text-sm align-middle">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combinedResults[student.hallTicket]?.semesters[student.activeSemester]?.results.map(
                            (r, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.slNo}
                                </td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle">{r.subject}</td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.thPr}
                                </td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.creditHours}
                                </td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.gradePoint}
                                </td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.creditPoint}
                                </td>
                                <td className="px-2 sm:px-4 py-2 text-[8px] sm:text-sm align-middle text-center">
                                  {r.grade}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>

                      <div className="mt-1 flex justify-center text-center text-[10px] sm:text-sm text-gray-800 p-2">
                        <div>
                          <p className="font-semibold">Total SGPA : Total Credit Points / Total Credit Hours</p>
                          <p className="font-semibold">
                            {combinedResults[student.hallTicket]?.semesters[student.activeSemester]?.totalCreditPoints}{" "}
                            /{combinedResults[student.hallTicket]?.semesters[student.activeSemester]?.totalCreditHours}{" "}
                            ={combinedResults[student.hallTicket]?.semesters[student.activeSemester]?.average}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
