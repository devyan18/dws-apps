import BookModel from '../models/book.model'
import UserModel from '../models/user.model'

export const userCreator = async (): Promise<string> => {
  await UserModel.deleteMany({})
  const newUser = new UserModel({
    username: 'tester',
    email: 'tester@gmail.com',
    password: '123456'
  })
  await newUser.save()
  return newUser._id
}

export const bookCreator = async (userId: string, dataBooks: {name:string}[]) => {
  await BookModel.deleteMany({})
  for (const book of dataBooks) {
    const newBook = new BookModel({
      name: book.name,
      user: userId
    })
    await newBook.save()
  }
}
