import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, replay) => {
    await request.jwtVerify()

    const userId = request.user.sub

    const meals = await knex('meals').where({ user_id: userId }).select()

    return replay.status(200).send({
      meals,
    })
  })

  app.get('/:id', async (request, replay) => {
    await request.jwtVerify()

    const updateMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealsParamsSchema.parse(request.params)

    const userId = request.user.sub

    const meals = await knex('meals').where({ user_id: userId, id }).select()

    return replay.status(200).send({
      meals,
    })
  })

  app.post('/', async (request, replay) => {
    await request.jwtVerify()

    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string().default(new Date().toString()),
      isDiet: z.boolean().default(false),
    })

    const { name, description, date, isDiet } = createMealsBodySchema.parse(
      request.body,
    )

    const userId = request.user.sub

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      date,
      is_diet: isDiet,
    })

    return replay.status(201).send()
  })

  app.put('/:id', async (request, replay) => {
    await request.jwtVerify()

    const updateMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealsParamsSchema.parse(request.params)

    const updateMealsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      date: z.string().default(new Date().toString()).optional(),
      isDiet: z.boolean().default(false).optional(),
    })

    const { name, description, date, isDiet } = updateMealsBodySchema.parse(
      request.body,
    )

    const userId = request.user.sub

    await knex('meals')
      .where({ id, user_id: userId })
      .update({
        name,
        description,
        date,
        is_diet: isDiet,
      })
      .select()

    return replay.status(204).send()
  })

  app.delete('/:id', async (request, replay) => {
    await request.jwtVerify()

    const deleteMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteMealsParamsSchema.parse(request.params)

    const userId = request.user.sub

    await knex('meals').where({ id, user_id: userId }).delete()

    return replay.status(204).send()
  })
}
