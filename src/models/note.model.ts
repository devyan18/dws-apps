import { model, Schema, Types } from 'mongoose'
import { Note } from '../entities/notes.entity'
import { IBookModel } from './book.model'
import { IUserModel } from './user.model'

export interface INoteModel extends Note, Document {
  user: IUserModel,
  book: IBookModel | string | Types.ObjectId
}

const NoteSchema = new Schema<INoteModel>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: Types.ObjectId,
    ref: 'Book'
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('Note', NoteSchema)
