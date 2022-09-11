import { Request, Response } from 'express'
import httpErrorHandler from '../handlers/http_error.handler'

import UserServices from '../services/user.services'

const userServices = new UserServices()

const getUsersCtrl = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userServices.getAllUsers()

    if (!allUsers.length) {
      return res.status(204).json({
        message: 'Not exist users'
      })
    }
    res.status(200).json(allUsers)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const getUserCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const user = await userServices.getUserByUId(userId)

    if (!user) {
      return res.status(204).json({
        message: 'Not exist user'
      })
    }

    res.status(200).json(user)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const createUserCtrl = async (req: Request, res: Response) => {
  try {
    const user = await userServices.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    console.log(error)
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const editUserCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const user = await userServices.editUser(userId, req.body)
    res.status(202).json(user)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const deleteUserCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const user = await userServices.deactiveUser(userId)
    res.json(user)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

export {
  getUsersCtrl,
  getUserCtrl,
  createUserCtrl,
  editUserCtrl,
  deleteUserCtrl
}
