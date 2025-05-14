// import React, { useState, useEffect } from "react";

// const App = () => {
//   const [count, setCount] = useState(0);
//   const [value, setValue] = useState("");

//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("https://dummyjson.com/products")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("data", data.products);
//         setProducts(data.products);
//       });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (value === "") {
//       alert("PLease Enter Text");
//     } else {
//       alert("Entered Text is" + value);
//     }
//     console.log("value", value);
//   };

//   return (
//     <>
//       <div className="text-4xl font-bold"> {count}</div>

//       <button className="px-2 py-2 bg-blue-300 rounded" onClick={() => setCount(count + 1)}>Increment</button>
//       <button className="ml-2 px-2 py-2 bg-blue-300 rounded" onClick={() => setCount(count - 1)}>Decrement</button>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
//   {products?.length > 0 ? (
//     products.map((p, index) => (
//       <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
//         <img
//           src={p.thumbnail}
//           alt={p.title}
//           className="w-24 h-24 object-contain mb-2"
//         />
//         <h1 className="text-md font-semibold text-center">{p.title}</h1>
//         <h2 className="text-sm text-gray-600">₹ {p.price}</h2>
//       </div>
//     ))
//   ) : (
//     <p className="col-span-full text-center">Loading...</p>
//   )}
// </div>


    
//     </>
//   );
// };
// export default App;




import React, { useState, useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon
import resultsData from './results.json'; // Import the JSON file

function App() {
  const [semester, setSemester] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  const [allResults, setAllResults] = useState([]);

  // Fetch data on page load
  useEffect(() => {
    if (!semester) {
      setError('Please select Semester');
      setLoading(false);
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      // Replace the API call with the local JSON data
      const response = { data: { allResults: resultsData } };

      if (response.data?.allResults?.length > 0) {
        const updatedResults = response.data.allResults.map((student) => {
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
            expanded: false, // for toggling visibility
          };
        });

        setAllResults(updatedResults);
        setSubmitted(true);
      } else {
        setError('No results found for students.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, [semester]);

  const sortedResults = [...allResults].sort((a, b) => {
    const avgA = parseFloat(a.average);
    const avgB = parseFloat(b.average);

    if (sortOrder === 'asc') return avgA - avgB;
    if (sortOrder === 'desc') return avgB - avgA;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-10">
      {/* Header with "Developed by Raju Rekadi" */}
     <div className="flex flex-col md:flex-row justify-between items-center px-4 py-6 bg-white shadow rounded-lg">
      <div className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
          College: <span className="font-medium">1005 - Dr. S. R. K. GOVT. ARTS COLLEGE, YANAM</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700">
          (III Semester B.Sc. Computer Science JANUARY 2025 Examinations)
        </p>
      </div>

      <div className="mt-4 md:mt-0 text-center md:text-right">
        <p className="text-sm font-medium text-gray-700">Developed by Raju Rekadi</p>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}

      {/* Sort by SGPA */}
      <div className="max-w-6xl mx-auto mt-4 flex items-center justify-end gap-2">
        <label htmlFor="sortOrder" className="font-medium text-gray-700">
          Sort by SGPA:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm"
        >
          <option value="">Roll Number</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Display Results */}
      {submitted && sortedResults.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 space-y-6">
          {sortedResults.map((student, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-md border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => {
                  const updated = allResults.map((s) =>
                    s.hallTicket === student.hallTicket
                      ? { ...s, expanded: !s.expanded }
                      : s
                  );
                  setAllResults(updated);
                }}
              >
                <h3 className="text-lg font-bold">
                  {idx + 1}. {student.name} ({student.hallTicket})
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-md font-medium">SGPA: {student.average}</span>
                  <span className="text-xl">{student.expanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expandable Table */}
              {student.expanded && (
                <div className="mt-4">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border text-sm">Sl. No</th>
                        <th className="px-4 py-2 border text-sm">Subject</th>
                        <th className="px-4 py-2 border text-sm">Th/Pr</th>
                        <th className="px-4 py-2 border text-sm">Credit Hours</th>
                        <th className="px-4 py-2 border text-sm">Grade Point</th>
                        <th className="px-4 py-2 border text-sm">Credit Point</th>
                        <th className="px-4 py-2 border text-sm">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.results.map((r, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-2 text-center text-xs sm:text-sm">{r.slNo}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.subject}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.thPr}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.creditHours}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.gradePoint}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.creditPoint}</td>
                          <td className="px-4 py-2 text-xs sm:text-sm">{r.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
