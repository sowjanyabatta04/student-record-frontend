import React, { useState, useEffect } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", rollNumber: "", course: "", marks: "" });
  const [search, setSearch] = useState("");

  // Fetch all students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // GET /api/students
  const fetchStudents = async () => {
    try {
      const res = await api.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // POST /api/students
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/students", { ...form, marks: Number(form.marks) });
      setForm({ name: "", rollNumber: "", course: "", marks: "" });
      fetchStudents();
      alert("Student added successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add student");
    }
  };

  // DELETE /api/students/:rollNumber
  const handleDelete = async (rollNumber) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/api/students/${rollNumber}`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  // Filter students by search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Student Record Management</h1>

      {/* Add Student Form */}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          required
        />
        <input
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          required
        />
        <input
          placeholder="Marks"
          type="number"
          value={form.marks}
          onChange={(e) => setForm({ ...form, marks: e.target.value })}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      {/* Search Input */}
      <input
        placeholder="Search by Name or Roll Number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Student Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Course</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.rollNumber}>
              <td>{s.name}</td>
              <td>{s.rollNumber}</td>
              <td>{s.course}</td>
              <td>{s.marks}</td>
              <td>
                <button onClick={() => handleDelete(s.rollNumber)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
