import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function metricsRoutes(app: FastifyInstance) {
  app.get('/', async (request, replay) => {
    await request.jwtVerify()

    const userId = request.user.sub

    const meals = await knex('meals')
      .where({ user_id: userId })
      .select('is_diet')

    const { mealsWithinTheDiet, offDietMeals, bestSequel } = meals.reduce(
      (acc, item) => {
        if (item.is_diet) {
          acc.mealsWithinTheDiet++
          acc.bestSequel++
        } else {
          acc.offDietMeals++
          acc.oldBestSequel = Math.max(acc.oldBestSequel, acc.bestSequel)
          acc.bestSequel = 0
        }

        return acc
      },
      {
        mealsWithinTheDiet: 0,
        offDietMeals: 0,
        bestSequel: 0,
        oldBestSequel: 0,
      },
    )

    return replay.status(200).send({
      mealsTotals: meals.length,
      mealsWithinTheDiet,
      offDietMeals,
      bestSequel,
    })
  })
}
