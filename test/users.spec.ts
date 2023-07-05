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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '12345678',
      })
      .expect(201)
  })

  it('should not be possible to create two users with the same email', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '12345678',
      })
      .expect(201)

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '12345678',
      })
      .expect(409)
  })
})
