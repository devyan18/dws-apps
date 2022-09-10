import { Router } from 'express'
import { readdirSync } from 'fs'

const PATH_ROUTER = `${__dirname}/`

const router = Router()

const truncFileName = (fileName: string) => {
  const file = fileName.split('.').shift()
  return file
}

readdirSync(PATH_ROUTER).filter((fileName) => {
  const nameTruncked = truncFileName(fileName)

  if (nameTruncked !== 'index') {
    import(`./${nameTruncked}`).then((route) => {
      router.use(`/${nameTruncked}`, route.router)
      console.log(`Route: /${nameTruncked} loaded`)
    })
  }
})

export default router
