import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { describe, beforeAll, afterAll, beforeEach, it } from 'vitest'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meals', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '12345678',
      })
      .expect(201)

    const responseCreateSession = await request(app.server)
      .post('/sessions')
      .send({
        email: 'john.doe@gmail.com',
        password: '12345678',
      })

    const token = responseCreateSession.body.token

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Nostrud non consequat.',
        description: 'Pariatur Lorem voluptate velit cupidatat esse.',
        date: new Date(),
        isDiet: true,
      })
      .expect(201)
  })
})
