import { z } from 'zod'

const bookSchema = z.object({
  name: z.string().min(1).max(100),
  describe: z.string().min(1).max(1000)
})

export default bookSchema
