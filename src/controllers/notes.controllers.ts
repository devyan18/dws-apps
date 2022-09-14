import { Request, Response } from 'express'
import httpErrorHandler from '../handlers/http_error.handler'
import { IUserModel } from '../models/user.model'
import NoteServices from '../services/note.services'

const noteServices = new NoteServices()

const createNewNoteInBookCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel
    const { bookId } = req.params

    const { title, content } = req.body
    const note = await noteServices.createNote({ title, content, bookId, userId: user._id })

    if (!note) {
      return httpErrorHandler(new Error('Data not found'), res, 404)
    }

    res.status(201).json(note)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const getAllNotesByBookIdCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel

    const { bookId } = req.params

    const notes = await noteServices.getAllNotesByBookId(bookId, user._id)

    if (!notes) {
      return httpErrorHandler(new Error('Data not found'), res, 404)
    }

    res.status(200).json(notes)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const getOneNoteByNoteIdFromBookCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel

    const { bookId, noteId } = req.params

    const note = await noteServices.getNoteByNoteIdFromBook(noteId, bookId, user._id)

    if (!note) {
      return httpErrorHandler(new Error('Data not found'), res, 404)
    }

    res.status(200).json(note)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const editOneNoteCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel

    const { noteId } = req.params

    const { title, content } = req.body

    const note = await noteServices.editNote(noteId, user._id, { title, content })

    if (!note) {
      return httpErrorHandler(new Error('Data not found'), res, 404)
    }

    res.status(202).json(note)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const deleteOneNoteCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel

    const { bookId, noteId } = req.params

    const note = await noteServices.deleteNote(bookId, noteId, user._id)

    if (!note) {
      return httpErrorHandler(new Error('Data not found'), res, 404)
    }

    res.status(202).json(note)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

export {
  createNewNoteInBookCtrl,
  getAllNotesByBookIdCtrl,
  getOneNoteByNoteIdFromBookCtrl,
  editOneNoteCtrl,
  deleteOneNoteCtrl
}
