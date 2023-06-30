import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { knex } from '../database'

export async function sessionRoutes(app: FastifyInstance) {
  app.post('/', async (request, replay) => {
    const createUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .where({
        email,
      })
      .select()
      .first()

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new Error('Invalid credentials')
    }

    const token = await replay.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return replay.status(200).send({ token })
  })
}
