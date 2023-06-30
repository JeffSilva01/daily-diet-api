import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import { usersRoutes } from './routes/usersRoutes'
import { sessionRoutes } from './routes/sessionRoutes'
import { env } from './env'
import { mealsRoutes } from './routes/mealsRoutes'
import { metricsRoutes } from './routes/metricsRoutes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(sessionRoutes, {
  prefix: '/sessions',
})

app.register(mealsRoutes, {
  prefix: '/meals',
})

app.register(metricsRoutes, {
  prefix: '/metrics',
})
