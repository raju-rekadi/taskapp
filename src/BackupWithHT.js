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




import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [hallTicket, setHallTicket] = useState('23CS0301');
  const [semester, setSemester] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradeAverage, setGradeAverage] = useState(null);
const [allResults, setAllResults] = useState([]);
const [sortOrder, setSortOrder] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hallTicket || !semester) {
      alert('Please enter Hall Ticket and select Semester');
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/results', {
        params: { hallTicket, semester },
      });

      if (response.data.name) {
        setStudentName(response.data.name);
        setResults(response.data.results);

        // Calculate Grade Average
        const totalWeightedGradePoints = response.data.results.reduce((acc, result) => {
          const gradePoint = parseFloat(result.gradePoint) || 0;
          const creditHours = parseInt(result.creditHours, 10) || 0;
          return acc + (gradePoint * creditHours);
        }, 0);

        const totalCreditHours = response.data.results.reduce((acc, result) => {
          return acc + (parseInt(result.creditHours, 10) || 0);
        }, 0);

        if (totalCreditHours > 0) {
          const average = totalWeightedGradePoints / totalCreditHours;
          setGradeAverage(average.toFixed(2));  // Round to 2 decimal places
        } else {
          setGradeAverage(0);
        }

        setError('');
      } else {
        setStudentName('');
        setResults([]);
        setError('No result found for the given Hall Ticket and Semester.');
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch result');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

const handleFetchAll = async () => {
  if (!semester) {
    alert('Please select Semester');
    return;
  }

  setLoading(true);
  setAllResults([]);
  setSubmitted(false);
  setError('');

  try {
    const response = await axios.get('http://localhost:5000/api/results', {
      params: { hallTicket: 'ALL', semester },
    });

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
      setError('No results found for ALL students.');
    }
  } catch (err) {
    console.error(err);
    setError('Failed to fetch all results');
  } finally {
    setLoading(false);
  }
};


const sortedResults = [...allResults].sort((a, b) => {
  const avgA = parseFloat(a.average);
  const avgB = parseFloat(b.average);

  if (sortOrder === 'asc') return avgA - avgB;
  if (sortOrder === 'desc') return avgB - avgA;
  return 0;
},[sortOrder]);



 return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
      SRK College Degree Results
    </h1>

    <button
  type="button"
  onClick={handleFetchAll}
  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
>
  Get ALL Results
</button>


    {/* Form Section */}
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap justify-center gap-4 items-end max-w-5xl mx-auto mb-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Hall Ticket</label>
        <input
          type="text"
          value={hallTicket}
          onChange={(e) => setHallTicket(e.target.value)}
          placeholder="Enter Hall Ticket"
          className="px-4 py-2 border rounded-md w-52 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-4 py-2 border rounded-md w-40 focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">-- Select --</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </form>

    {/* Loading State */}
    {loading && (
      <div className="text-center py-4">
        <p>Loading...</p>
      </div>
    )}

    {/* Result Section */}
    {submitted && (
      <div className="max-w-4xl mx-auto bg-white border rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Result for Hall Ticket {hallTicket}
        </h2>

        {/* Display Student Name and Grade Average SGPA in one row */}
        {studentName && gradeAverage && (
         <div className="flex justify-between items-center mb-4">
  {/* Student Name on the Left */}
  <div className="text-lg font-semibold">
    <p>Student Name: {studentName}</p>
  </div>

  {/* Grade Average SGPA on the Right */}
  <div className="text-xl font-semibold text-right">
    <p>
      SGPA: {gradeAverage}
    </p>
  </div>
</div>

        )}

        {/* Error State */}
        {error && (
          <div className="text-red-600 font-semibold mb-4">{error}</div>
        )}

        <div className="max-w-6xl mx-auto mt-4 flex justify-end">
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="border px-3 py-2 rounded-md shadow-sm"
  >
    <option value="">Sort by SGPA</option>
    <option value="asc">Low to High</option>
    <option value="desc">High to Low</option>
  </select>
</div>


        {/* Display Results in Table */}
{allResults.length > 0 && (
  <div className="max-w-6xl mx-auto mt-10 space-y-6">
    {allResults.map((student, idx) => (
      <div key={idx} className="bg-white p-4 rounded-lg shadow-md border">
        {/* Header Row */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => {
            const updated = [...allResults];
            updated[idx].expanded = !updated[idx].expanded;
            setAllResults(updated);
          }}
        >
          <h3 className="text-lg font-bold">
            {student.name} ({student.hallTicket})
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-md font-medium">SGPA: {student.average}</span>
            <span className="text-xl">
              {student.expanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Expandable Table */}
        {student.expanded && (
          <table className="min-w-full table-auto mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Sl. No</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Th/Pr</th>
                <th className="px-4 py-2 border">Credit Hours</th>
                <th className="px-4 py-2 border">Grade Point</th>
                <th className="px-4 py-2 border">Credit Point</th>
                <th className="px-4 py-2 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {student.results.map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2 text-center">{r.slNo}</td>
                  <td className="px-4 py-2">{r.subject}</td>
                  <td className="px-4 py-2">{r.thPr}</td>
                  <td className="px-4 py-2">{r.creditHours}</td>
                  <td className="px-4 py-2">{r.gradePoint}</td>
                  <td className="px-4 py-2">{r.creditPoint}</td>
                  <td className="px-4 py-2">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    ))}
  </div>
)}


      </div>
    )}
  </div>
);

}

export default App;
