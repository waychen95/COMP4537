import { NoteBookManager, Note  } from "./script.js"

/**
 * WriterManager extends NoteBookManager but allows full editing.
 * Writers can add, edit, and remove notes.
 */
class WriterManager extends NoteBookManager {
    constructor() {
        super()
        this.isWriter = true
    }

    /**
     * Start the writer mode UI and set up event listeners.
     */
    start() {
        this.ui.displayMessages("welcome-message", WRITER_BUTTON)
        this.ui.displayMessages("back-button", BACK_BUTTON)
        this.ui.displayMessages("add-button", ADD_BUTTON)
        this.ui.displayMessages("remove-all-button", REMOVE_ALL_BUTTON)

        const bb = document.getElementById("back-button")
        const ab = document.getElementById("add-button")
        const rab = document.getElementById("remove-all-button")

        let createdTime = localStorage.getItem("createdTime")
        createdTime = createdTime ? `${UPDATED_TIME} ${createdTime}` : ""
        this.ui.displayMessages("time", createdTime)

        this.refreshNoteBook(this.isWriter)
        
        bb.addEventListener("click", () => {
            if (document.referrer !== "") {
                history.back()
            } else {
                window.location.href = "/index.html"
            }
        })

        ab.addEventListener("click", () => {
            this.createNote()
            this.refreshNoteBook(this.isWriter)
            let note = this.notebook.getLastNote()
            if (note) {
                this.ui.displayMessages("time", `${UPDATED_TIME} ${note.createdAt.toLocaleTimeString()}`)
                localStorage.setItem("createdTime", note.createdAt.toLocaleTimeString())
            }
        })

        rab.addEventListener("click", () => {
            this.clearNoteBook(this.isWriter)
            this.ui.displayMessages("time", "")
        })
    }

    /**
     * Create a new note from input field and save it.
     */
    createNote() {
        const input = document.getElementById("note-input")
        let text = ""
        if (input) {
            text = input.value
            if (text == "") {
                alert(EMPTY_INPUT_ERROR)
                return
            }
        } else {
            console.log(ERROR_MESSAGE)
        }

        const note = new Note(text)

        this.notebook.addNote(note)

        input.value = ""
    }
}

window.onload = () => {
    const wm = new WriterManager()
    wm.start()
}