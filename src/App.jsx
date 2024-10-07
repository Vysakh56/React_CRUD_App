import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar.jsx';

const API_URL = 'https://react-crud-server-yn26.onrender.com';

const NoteList = ({ fetchNotes, notes }) => {
  const navigate = useNavigate();

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  return (
    <div className="note-list">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-actions">
              <button onClick={() => navigate(`/edit/${note.id}`)}>Edit</button>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

const NoteForm = ({ fetchNotes }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNoteForEditing = async () => {
      if (id) {
        const response = await axios.get(`${API_URL}/${id}`);
        const note = response.data;
        setTitle(note.title);
        setContent(note.content);
        setIsEditing(true);
      }
    };
    fetchNoteForEditing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    if (isEditing) {
      // Update existing note
      await axios.put(`${API_URL}/${id}`, { title, content });
    } else {
      // Create new note
      await axios.post(API_URL, { title, content });
    }

    fetchNotes();
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Note' : 'Add Note'}</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? 'Update Note' : 'Add Note'}</button>
        <Link to="/">
          <button type="button">Cancel</button>
        </Link>
      </form>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = async () => {
    const response = await axios.get(API_URL);
    setNotes(response.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="container">
        <h1>Notes Website</h1>

        <div className="top-actions">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Link to="/add">
            <div tabIndex="0" className="plusButton">
              <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
              </svg>
            </div>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<NoteList fetchNotes={fetchNotes} notes={filteredNotes} />} />
          <Route path="/add" element={<NoteForm fetchNotes={fetchNotes} />} />
          <Route path="/edit/:id" element={<NoteForm fetchNotes={fetchNotes} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
