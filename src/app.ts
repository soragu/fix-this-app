import NotesView from "./view";
import NotesAPI from "./api";
import { Note } from "./models";

export default class App {
  view: NotesView
  notes: Note[]
  activeNote: Note | null | undefined

  constructor(root: HTMLElement) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes: Note[]) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note: Note | undefined) {
    if (note) {
      this.activeNote = note;
      this.view.updateActiveNote(note);
    }
  }

  _handlers() {
    return {
      onNoteSelect: (noteId: string) => {
        const selectedNote = this.notes.find((note: Note) => note.id === parseInt(noteId));
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "新建笔记",
          body: "开始记录...",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title: string, body: string) => {
        NotesAPI.saveNote({
          id: this.activeNote ? this.activeNote.id : null,
          title,
          body,
        });

        this._refreshNotes();
      },
      onNoteDelete: (noteId: number) => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
