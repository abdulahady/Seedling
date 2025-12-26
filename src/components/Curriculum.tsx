import React, { useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Classes from './Classes'
import Home from './Home'

const Curriculum: React.FC = () => {
  const navigate = useNavigate()

  const handleRowClick = (path: string, courseName: string) => {
    // Use the extractCourseCode function to get the course code from the course name
    const courseCode = extractCourseCode(courseName)

    // Proceed with your navigation logic and pass the courseCode in the state
    const id = path.split('/').pop()
    navigate(path, { state: { id, courseCode } }) // Include courseCode in the navigation state
  }

  // Function to extract course code from the course name
  function extractCourseCode(courseName: string) {
    const parts = courseName.split(':')
    return parts[0].trim()
  }

  // Your table rendering code...

  return (
    <>
      <h1 className="text-4xl font-bold leading-tight text-gray-900">
        Curriculum Subjects
      </h1>
      <h2 className="pt-6 pb-2 text-3xl font-semibold leading-snug text-gray-700">
        Mathematics
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/8', 'MATH-161:')}
            >
              <td>1</td>
              <td>MATH-161: Trigonometry and MATH-162: Precalculus</td>
              <td>46% and 57%</td>
            </tr>

            {/* row 2 */}
            {/* row 2 - Calculus I */}
            <tr
              className="hover:cursor-pointer "
              onClick={() => handleRowClick('/classes/9', 'MATH-171:')}
            >
              <th>2</th>
              <td>MATH-171: Calculus I</td>
              <td>57%</td>
            </tr>

            {/* row 3 - Calculus II */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/6', 'MATH-172:')}
            >
              <th>3</th>
              <td>MATH-172: Calculus II</td>
              <td>70%</td>
            </tr>

            {/* Calculus III and IV */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/10', 'MATH-173:')}
            >
              <th>4</th>
              <td>MATH-173: Calculus III and IV</td>
              <td>54%</td>
            </tr>

            {/* Linear Algebra */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/11', 'MATH-191:')}
            >
              <th>5</th>
              <td>MATH-191: Linear Algebra</td>
              <td>67%</td>
            </tr>

            {/* Ordinary Differential Equations */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/12', 'MATH-193:')}
            >
              <th>6</th>
              <td>MATH-193: Ordinary Differential Equations</td>
              <td>67%</td>
            </tr>

            {/* Elementary Statistics */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/13', 'MATH-134:')}
            >
              <th>7</th>
              <td>MATH-134: Elementary Statistics</td>
              <td>TBD</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="pt-6 pb-2 text-3xl font-semibold leading-snug text-gray-700">
        Physics
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="hover">
              <th></th>
              <th>Name</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/24', 'PHYS-165:')}
            >
              <th>1</th>
              <td>PHYS-165: Introductory Physics</td>
              <td>54%</td>
            </tr>
            {/* row 2 */}

            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/14', 'PHYS-101:')}
            >
              <th>2</th>
              <td>PHYS-101: Mechanics</td>
              <td>67%</td>
            </tr>
            {/* row 3 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/15', 'PHYS-102:')}
            >
              <th>3</th>
              <td>PHYS-102: Waves, Thermodynamics, Optics</td>
              <td>79%</td>
            </tr>
            {/* row 4 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/16', 'PHYS-103:')}
            >
              <th>4</th>
              <td>PHYS-103: Electricity, Magnetism, and Modern Physics</td>
              <td>77%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="pt-6 pb-2 text-3xl font-semibold leading-snug text-gray-700">
        Engineering
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="hover">
              <th></th>
              <th>Name</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/25', 'ENGR-141:')}
            >
              <th>1</th>
              <td>ENGR-141: Circuits</td>
              <td>TBD</td>
            </tr>
            {/* row 2 */}

            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/26', 'ENGR-135:')}
            >
              <th>2</th>
              <td>ENGR-135: Statics</td>
              <td>TBD</td>
            </tr>
            {/* row 3 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/27', 'ENGR-130:')}
            >
              <th>3</th>
              <td>ENGR-130: Properties Of Materials</td>
              <td>TBD</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="pt-6 pb-2 text-3xl font-semibold leading-snug text-gray-700">
        Chemistry
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="hover">
              <th></th>
              <th>Name</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/17', 'CHEM-101:')}
            >
              <th>1</th>
              <td>CHEM-101: Chemistry I</td>
              <td>43%</td>
            </tr>
            {/* row 2 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/18', 'CHEM-102:')}
            >
              <th>2</th>
              <td>CHEM-102: Chemistry II</td>
              <td>51.28%</td>
            </tr>
            {/* row 3 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/19', 'CHEM-112:')}
            >
              <th>3</th>
              <td>CHEM-112: Organic Chemistry I</td>
              <td>TBD</td>
            </tr>
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/20', 'CHEM:113')}
            >
              <th>4</th>
              <td>CHEM-113: Organic Chemistry II</td>
              <td>93%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="pt-6 pb-2 text-3xl font-semibold leading-snug text-gray-700">
        Biology
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="hover">
              <th></th>
              <th>Name</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/21', 'BIO-101:')}
            >
              <th>1</th>
              <td>BIO-101: Biological Principles</td>
              <td>82%</td>
            </tr>
            {/* row 2 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/22', 'BOT-101:')}
            >
              <th>2</th>
              <td>BOT-101: General Botany</td>
              <td>78%</td>
            </tr>
            {/* row 3 */}
            <tr
              className="hover:cursor-pointer"
              onClick={() => handleRowClick('/classes/23', 'ZOOL-101:')}
            >
              <th>3</th>
              <td>ZOOL-101: General Zoology</td>
              <td>TBD</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Curriculum
