import { model, Schema, Types, Document } from 'mongoose'
import { Book } from '../entities/book.entity'
import { INoteModel } from './note.model'
import { IUserModel } from './user.model'

export interface IBookModel extends Document, Book {
  notes: Array<INoteModel | string | Types.ObjectId>
  user: IUserModel,
}

const BookSchema = new Schema<IBookModel>({
  name: {
    type: String,
    required: true
  },
  notes: [{
    type: Types.ObjectId,
    ref: 'Note'
  }],
  user: {
    type: Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('Book', BookSchema)
