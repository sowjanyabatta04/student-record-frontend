import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Use env variable for backend URL
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", rollNumber: "", course: "", marks: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(apiUrl);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl, { ...form, marks: Number(form.marks) });
      setForm({ name: "", rollNumber: "", course: "", marks: "" });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add student");
    }
  };

  const handleDelete = async (rollNumber) => {
    try {
      await axios.delete(`${apiUrl}/${rollNumber}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Student Record Management</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Roll Number" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required />
        <input placeholder="Course" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required />
        <input placeholder="Marks" type="number" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })} required />
        <button type="submit">Add</button>
      </form>

      <input placeholder="Search by Name or Roll Number" value={search} onChange={e => setSearch(e.target.value)} className="search-input" />

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
          {filteredStudents.map(s => (
            <tr key={s.rollNumber}>
              <td>{s.name}</td>
              <td>{s.rollNumber}</td>
              <td>{s.course}</td>
              <td>{s.marks}</td>
              <td><button onClick={() => handleDelete(s.rollNumber)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
