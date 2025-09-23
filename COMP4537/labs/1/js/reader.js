import { NoteBookManager } from "./script.js"

/**
 * ReaderManager extends NoteBookManager but in read-only mode.
 */
class ReaderManager extends NoteBookManager {
    constructor() {
        super()
        this.isWriter = false
    }

    /**
     * Start the reader mode UI and set up event listeners.
     */
    start() {
        this.ui.displayMessages("welcome-message", READER_BUTTON)
        this.ui.displayMessages("back-button", BACK_BUTTON)
        const bb = document.getElementById("back-button")

        let createdTime = localStorage.getItem("createdTime")
        createdTime = createdTime ? `${UPDATED_TIME} ${createdTime}` : ""
        this.ui.displayMessages("time", createdTime)

        this.refreshNoteBook(this.isWriter)

        window.addEventListener("storage", (event) => {
            if (event.key === "notes") {
                this.refreshNoteBook(this.isWriter)
            }

            if (event.key === "createdTime") {
                if (this.notebook.getAllNotes().length === 0) {
                    this.ui.displayMessages("time", "")
                } else {
                    this.ui.displayMessages("time", `${UPDATED_TIME} ${event.newValue}`)
                }
            }
        })

        bb.addEventListener("click", () => {
            if (document.referrer !== "") {
                history.back()
            } else {
                window.location.href = "/index.html"
            }
        })
    }
}

window.onload = () => {
    const rm = new ReaderManager()
    rm.start()
}