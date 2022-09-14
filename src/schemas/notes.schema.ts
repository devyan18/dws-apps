import { z } from 'zod'

const noteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string()
})

export default noteSchema
