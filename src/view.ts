import { Note } from './models'

export default class NotesView {
  root: HTMLElement
  onNoteSelect: any
  onNoteAdd: any
  onNoteEdit: any
  onNoteDelete: any

  constructor(
    root: HTMLElement,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
          <div class="notes__sidebar">
              <button class="notes__add" type="button">添加新的笔记 📒</button>
              <div class="notes__list"></div>
          </div>
          <div class="notes__preview">
              <input class="notes__title" type="text" placeholder="新笔记...">
              <textarea class="notes__body">编辑笔记...</textarea>
          </div>
      `;

    const btnAddNote = this.root.querySelector(".notes__add") as HTMLElement;
    const inpTitle = this.root.querySelector(".notes__title") as HTMLInputElement;
    const inpBody = this.root.querySelector(".notes__body") as HTMLInputElement;

    btnAddNote && btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField: HTMLInputElement) => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
          <div class="notes__list-item" data-note-id="${id}">
              <div class="notes__small-title">${title}</div>
              <div class="notes__small-body">
                  ${body.substring(0, MAX_BODY_LENGTH)}
                  ${body.length > MAX_BODY_LENGTH ? "..." : ""}
              </div>
              <div class="notes__small-updated">
                  ${updated.toLocaleString(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
              </div>
          </div>
      `;
  }

  updateNoteList(notes: Note[]) {
    const notesListContainer = this.root.querySelector(".notes__list");

    if (notesListContainer) {
        // Empty list
        notesListContainer.innerHTML = "";
      

      for (const note of notes) {
        const html = this._createListItemHTML(
          note.id,
          note.title,
          note.body,
          new Date(note.updated)
        );

        notesListContainer && notesListContainer.insertAdjacentHTML("beforeend", html);
      }

      // Add select/delete events for each list item
      const notesList = notesListContainer.querySelectorAll(".notes__list-item") as NodeListOf<HTMLElement>
      notesList.forEach((noteListItem) => {
          noteListItem.addEventListener("click", () => {
            this.onNoteSelect(noteListItem.dataset.noteId);
          });

          noteListItem.addEventListener("dblclick", () => {
            const doDelete = confirm("确认要删除该笔记吗?");

            if (doDelete) {
              this.onNoteDelete(noteListItem.dataset.noteId);
            }
          });
        });
      }
  }

  updateActiveNote(note: Note) {
    const noteTitleEl = this.root.querySelector(".notes__title") as HTMLInputElement
    noteTitleEl.value = note.title;
    const notesBodyEl = this.root.querySelector(".notes__body") as HTMLInputElement
    notesBodyEl.value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    const notesListItemEl = this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
    notesListItemEl && notesListItemEl.classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible: boolean) {
    const notesPreviewEl = this.root.querySelector(".notes__preview") as HTMLElement;
    if (notesPreviewEl) {
      notesPreviewEl.style.visibility = visible ? "visible" : "hidden";
    }
  }
}
