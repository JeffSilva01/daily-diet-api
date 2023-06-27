import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, replay) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const password_hash = await hash(password, 6)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password_hash,
    })

    return replay.status(201).send()
  })
  app.get('/', async () => {
    const users = await knex('users').select()

    return {
      users,
    }
  })
}
