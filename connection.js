import pg from 'pg'
const { Pool } = pg

const CONFIG = {
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  max: 100,
}

const pool = new Pool(CONFIG)

export default {
  query: (text, params, callback) => pool.query(text, params, callback)
}