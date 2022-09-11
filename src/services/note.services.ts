import { Note } from '../entities/notes.entity'
import NoteModel from '../models/note.model'

class NoteServices {
  async getAllNotesByFolder (folderId: string, userId: string) {
    const allNotes = await NoteModel.find({ folder: folderId, user: userId })
    return allNotes
  }

  async getNoteByNoteId (noteId: string, userId: string) {
    const note = await NoteModel.findOne({ _id: noteId, user: userId })
    return note
  }

  async createNote ({ title, content, folder }: Note) {
    const note = new NoteModel({ title, content, folder })
    await note.save()
    return note
  }

  async editNote (noteId: string, props: Partial<Note>) {
    const note = await NoteModel.findByIdAndUpdate(noteId, props, { new: true })
    return note
  }

  async deleteNote (noteId: string) {
    const note = await NoteModel.findByIdAndDelete(noteId)
    return note
  }
}

export default NoteServices
