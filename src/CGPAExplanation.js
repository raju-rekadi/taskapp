// CGPAExplanation.js
import React from 'react';

const CGPAExplanation = () => {
  return (
    <div className="cgpa-explanation p-4 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-blue-600">How CGPA is Calculated</h3>
      
      <div className="space-y-4">
        {/* SGPA Calculation */}
        <div className="calculation-step">
          <h4 className="font-semibold text-gray-800">1. Calculate SGPA (Semester GPA)</h4>
          <p className="text-gray-600 ml-4">
            For each semester: <br />
            <code className="font-mono bg-gray-100 px-2 py-1 rounded">
              SGPA = Total (Grade Points × Credit Hours) ÷ Total Credit Hours
            </code>
          </p>
          <div className="example-box mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium">Example:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Subject A: Grade 8 (4 credits) → 8 × 4 = 32</li>
              <li>Subject B: Grade 7 (2 credits) → 7 × 2 = 14</li>
              <li>Total Grade Points = 32 + 14 = 46</li>
              <li>Total Credits = 4 + 2 = 6</li>
              <li className="font-semibold">SGPA = 46 ÷ 6 = 7.666... → 7.67 (rounded)</li>
            </ul>
          </div>
        </div>

        {/* CGPA Calculation */}
        <div className="calculation-step">
          <h4 className="font-semibold text-gray-800">2. Calculate CGPA (Cumulative GPA)</h4>
          <p className="text-gray-600 ml-4">
            Across all semesters: <br />
            <code className="font-mono bg-gray-100 px-2 py-1 rounded">
              CGPA = Sum of (All Semester Grade Points) ÷ Sum of (All Semester Credit Hours)
            </code>
          </p>
          <div className="example-box mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium">Example (3 semesters):</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Sem 1: 142 grade points, 18 credits</li>
              <li>Sem 2: 142 grade points, 18 credits</li>
              <li>Sem 3: 152 grade points, 20 credits</li>
              <li>Total Grade Points = 142 + 142 + 152 = 436</li>
              <li>Total Credits = 18 + 18 + 20 = 56</li>
              <li className="font-semibold">CGPA = 436 ÷ 56 = 7.7857 → 7.79 (rounded)</li>
            </ul>
          </div>
        </div>

        {/* Rounding Rules */}
        <div className="rounding-rules mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h4 className="font-semibold text-gray-800">Rounding Rules</h4>
          <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
            <li>If 3rd decimal is 5 or higher → Round up (7.785 → 7.79)</li>
            <li>If 3rd decimal is less than 5 → Keep same (7.784 → 7.78)</li>
            <li className="text-xs text-gray-500 mt-2">*Some universities may use different rounding methods</li>
          </ul>
        </div>
      </div>

      <div className="note mt-4 text-sm text-gray-500 italic">
        <p>Note: This follows standard academic calculation methods. Check your university's handbook for specific policies.</p>
      </div>
    </div>
  );
};

export default CGPAExplanation;