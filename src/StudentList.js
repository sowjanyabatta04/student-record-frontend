import React, { useEffect, useState } from "react";
import api from "./api"; // make sure api.js is in src

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Student List</h2>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.rollNumber} - {s.name} - {s.course} - {s.marks}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
