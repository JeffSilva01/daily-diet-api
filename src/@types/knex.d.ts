// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      password_hash: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      date: string
      is_diet: boolean
    }
  }
}
