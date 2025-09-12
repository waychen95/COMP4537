/**
 * UI class for displaying messages to the DOM.
 */
export class UI {
    /**
     * Displays a message inside an element with the given ID.
     */
    displayMessages(id, message) {
        const container = document.getElementById(id)
        if (container) {
            container.innerHTML = message
        } else {
            console.log(ERROR_MESSAGE)
        }
    }

    /**
     * Show all notes inside the container.
     * If user is a writer, allow editing and removing notes.
     */
    displayNotes(id, notes, isWriter) {

        const note_container = document.getElementById(id)
        note_container.innerHTML = ""
        notes.forEach(note => {
            const noteDiv = document.createElement("div")
            noteDiv.classList.add("note")
            noteDiv.innerHTML = `
                <textarea id=${note.id} class="note-box modify" ${isWriter ? "" : "disabled"}>${note.text}</textarea>
                ${isWriter ? `<button data-id="${note.id}" class="btn remove">${REMOVE_BUTTON}</button>` : ''}
            `
            note_container.appendChild(noteDiv)
        });
    }

    /**
     * Add event listeners to remove buttons.
     */
    addRemoveButtonListeners(callback) {
        const remove_buttons = document.querySelectorAll(".remove")
        remove_buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id")
                callback(id)
            })
        })
    }

    /**
     * Add event listeners to textareas for editing notes.
     */
    addModifyButtonListeners(callback) {
        const modify_note = document.querySelectorAll(".modify")
        modify_note.forEach((note) => {
            note.addEventListener("change", () => {
                const value = note.value
                const id = note.getAttribute("id")
                callback(id, value)
            })
        })
    }
}

/**
 * Handles the overall notebook (UI + notes).
 */
export class NoteBookManager {
    constructor() {
        this.ui = new UI()
        this.notebook = new NoteBook()
    }

    /**
     * Show welcome messages and buttons when page loads.
     */
    start() {
        this.ui.displayMessages("welcome-message", WELCOME_MESSAGE)
        this.ui.displayMessages("writer-button", WRITER_BUTTON)
        this.ui.displayMessages("reader-button", READER_BUTTON)
    }

    /**
     * Refresh notebook display and set up event listeners.
     */
    refreshNoteBook(isWriter) {
        const notes = [...this.notebook.getAllNotes()].reverse()
        this.ui.displayNotes("notebook-container", notes, isWriter)

        if (isWriter) {
            this.ui.addRemoveButtonListeners((id) => {
                this.notebook.removeNote(id)
                this.refreshNoteBook(isWriter)
                if (this.notebook.getAllNotes().length == 0) {
                    this.ui.displayMessages("time", "")
                }
            })

            this.ui.addModifyButtonListeners((id, value) => {
                this.notebook.modifyNote(id, value)
                this.refreshNoteBook(isWriter)
            })
        }
    }

    /**
     * Clear all notes from the notebook.
     */
    clearNoteBook(isWriter) {
        this.notebook.removeAll()
        this.refreshNoteBook(isWriter)
    }
}


/**
 * Stores and manages the notes.
 */
export class NoteBook {
    constructor() {
        this.notes = this.loadNotes()
    }

    addNote(note) {
        this.notes.push(note)
        this.saveNotes()
    }

    removeNote(id) {
        this.notes = this.notes.filter(n => n.id !== parseInt(id))
        if (this.notes.length === 0) {
            localStorage.removeItem("createdTime")
        }
        this.saveNotes()
    }

    modifyNote(id, text) {
        const note = this.notes.find(n => n.id == parseInt(id))
        if (note) {
            note.text = text
            this.saveNotes()
        }
    }

    getAllNotes() {
        return this.loadNotes()
    }

    getLastNote() {
        return this.notes.length > 0 ? this.notes[this.notes.length - 1] : null
    }

    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes))
    }

    loadNotes() {
        const notes = localStorage.getItem("notes")
        return notes ? JSON.parse(notes) : []
    }

    removeAll() {
        this.notes = []
        localStorage.removeItem("notes")
        localStorage.removeItem("noteCounter")
        localStorage.removeItem("createdTime")
        this.saveNotes()
    }

}

/**
 * A single note object (with id, text, and created time).
 */
export class Note {
    constructor(text) {
        this.id = Note.getNextId()
        this.text = text
        this.createdAt = new Date()
        this.remove_button
    }

    // Get the next unique ID for a new note
    static getNextId() {
        let lastId = localStorage.getItem("noteCounter");
        lastId = lastId ? parseInt(lastId) : 0;
        const newId = lastId + 1;
        localStorage.setItem("noteCounter", newId);
        return newId;
    }
}

window.onload = () => {
    const nm = new NoteBookManager()
    nm.start()
}