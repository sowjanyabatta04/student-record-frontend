import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]); // ✅ initialize as array
  const [form, setForm] = useState({ name: "", rollNumber: "", course: "", marks: "" });
  const [search, setSearch] = useState("");

  const apiUrl = "http://localhost:5000/api/students";

  // Fetch all students safely
  const fetchStudents = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      // Ensure we always set an array
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data) {
        setStudents([data]); // if single object returned, wrap in array
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add new student
  const addStudent = async () => {
    if (!form.name || !form.rollNumber || !form.course || !form.marks) {
      return alert("All fields are required!");
    }
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      fetchStudents();
      setForm({ name: "", rollNumber: "", course: "", marks: "" });
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  // Update student
  const updateStudent = async (roll) => {
    const student = students.find((s) => s.rollNumber === roll);
    if (!student) return;
    try {
      await fetch(`${apiUrl}/${roll}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      fetchStudents();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  // Delete student
  const deleteStudent = async (roll) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await fetch(`${apiUrl}/${roll}`, { method: "DELETE" });
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  // Handle inline edit
  const handleChange = (roll, key, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNumber === roll ? { ...s, [key]: value } : s))
    );
  };

  // Filtered students safely
  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      <header>
        <h1>Student Record Management</h1>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          placeholder="Search by Name or Roll Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")}>Clear</button>
      </div>

      {/* Add Student Form */}
      <div className="form-container">
        <h2>Add New Student</h2>
        <div className="form-grid">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Roll Number"
            value={form.rollNumber}
            onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          />
          <input
            placeholder="Course"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />
          <input
            type="number"
            placeholder="Marks"
            value={form.marks}
            onChange={(e) => setForm({ ...form, marks: e.target.value })}
          />
        </div>
        <div className="form-buttons">
          <button onClick={addStudent}>Add Student</button>
        </div>
      </div>

      {/* Students List */}
      <section>
        <h2>All Students</h2>
        <div className="students-grid">
          {filteredStudents.map((s) => (
            <div key={s.rollNumber} className="student">
              <input
                value={s.name}
                onChange={(e) => handleChange(s.rollNumber, "name", e.target.value)}
              />
              <input value={s.rollNumber} disabled />
              <input
                value={s.course}
                onChange={(e) => handleChange(s.rollNumber, "course", e.target.value)}
              />
              <input
                value={s.marks}
                type="number"
                onChange={(e) => handleChange(s.rollNumber, "marks", e.target.value)}
              />
              <div className="student-buttons">
                <button onClick={() => updateStudent(s.rollNumber)}>Update</button>
                <button onClick={() => deleteStudent(s.rollNumber)}>Delete</button>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && <p>No students found.</p>}
        </div>
      </section>
    </div>
  );
}

export default App;
