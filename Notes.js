const notesList = document.getElementById("notesList");
const newNoteBtn = document.getElementById("newNoteBtn");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");
const pinNoteBtn = document.getElementById("pinNoteBtn");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeNoteId = null;
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

if (darkMode) document.body.classList.add("dark");

newNoteBtn.onclick = createNote;
deleteNoteBtn.onclick = deleteNote;
pinNoteBtn.onclick = togglePin;
themeToggle.onclick = toggleTheme;

noteTitle.oninput = updateNote;
noteBody.oninput = updateNote;
searchInput.oninput = renderNotes;

function createNote() {
  const note = {
    id: Date.now(),
    title: "Untitled",
    body: "",
    pinned: false,
    updated: new Date().toLocaleString()
  };

  notes.unshift(note);
  activeNoteId = note.id;
  saveAndRender();
}

function renderNotes() {
  notesList.innerHTML = "";
  const query = searchInput.value.toLowerCase();

  notes
    .filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.body.toLowerCase().includes(query)
    )
    .sort((a, b) => b.pinned - a.pinned)
    .forEach(note => {
      const li = document.createElement("li");
      li.className = "note-item" + (note.id === activeNoteId ? " active" : "");
      li.innerHTML = `
        <strong>${note.pinned ? "📌 " : ""}${note.title}</strong>
        <br />
        <small>${note.updated}</small>
      `;
      li.onclick = () => openNote(note.id);
      notesList.appendChild(li);
    });
}

function openNote(id) {
  const note = notes.find(n => n.id === id);
  activeNoteId = id;
  noteTitle.value = note.title;
  noteBody.value = note.body;
  renderNotes();
}

function updateNote() {
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;

  note.title = noteTitle.value;
  note.body = noteBody.value;
  note.updated = new Date().toLocaleString();
  saveAndRender(false);
}

function deleteNote() {
  if (!activeNoteId) return;
  notes = notes.filter(n => n.id !== activeNoteId);
  activeNoteId = null;
  noteTitle.value = "";
  noteBody.value = "";
  saveAndRender();
}

function togglePin() {
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;
  note.pinned = !note.pinned;
  saveAndRender();
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkMode);
}

function saveAndRender(scroll = true) {
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

renderNotes();
