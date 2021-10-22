import express from 'express'
const app = express()
import conn from './connection.js'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import bcrypt, { hash } from 'bcrypt'
const saltRounds = 10

const port = 3000

let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'exmaple29@email.com',
    pass: 'password',
  },
})

//send mail
app.get('/sendMail', function (req, res) {
  console.log('sending email..')

  const mailOptions = {
    from: 'example29@email.com', // Sender address
    to: req.query.to, // recipients
    subject: 'test mail from Nodejs', // Subject line
    text: 'Successfully! received mail using nodejs', // Plain text body
  }
  console.log(mailOptions)
  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('mail has been sent')
      console.log(info)
    }
  })
})

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/get', async (req, res) => {
  let response
  await conn.query(
    'SELECT first_name, last_name, user_name, contact_no, dob, email FROM users ORDER BY id ASC',
    [],
    (err, result) => {
      if (err) {
        console.log(err.message)
        response = err.message
      } else {
        response = result.rows
      }
      res.send(response)
    }
  )
})

app.post('/getByUsername', async (req, res) => {
  const { user_name } = req.body
  await conn.query(
    'SELECT * FROM users  WHERE user_name = $1',
    [user_name],
    (err, result) => {
      if (err) {
        console.log(err)
        return false
      } else {
        res.send(result.rows)
      }
    }
  )
})

app.post('/add', async (req, res) => {
  let { first_name, last_name, user_name, contact_no, dob, email, password } =
    req.body
  let response
  console.log(req.body)
  let hashPassword = await bcrypt.hash(req.body.password, saltRounds)
  console.log(hashPassword)
  await conn.query(
    'INSERT INTO users (first_name, last_name, user_name, contact_no, dob, email, password ) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [first_name, last_name, user_name, contact_no, dob, email, hashPassword],
    (err, result) => {
      if (err) {
        console.log(err)
        response = 'failed'
      } else {
        response = 'ADDED SUCCESSFULLY'
      }
      res.send(response)
      console.log(response)
    }
  )
})

app.post('/update', async (req, res) => {
  let response
  const { first_name, last_name, user_name, contact_no, dob, email } = req.body
  await conn.query(
    'UPDATE users  SET first_name = $2, last_name = $3, contact_no = $4, dob = $5, email =$6 WHERE user_name = $1',
    [user_name, first_name, last_name, contact_no, dob, email],
    (err, result) => {
      if (err) {
        console.log(err)
        response = 'failed'
      } else {
        response = 'Updated Successfully'
      }
      res.send(response)
      console.log(response)
    }
  )
})

app.delete('/delete', async (req, res) => {
  let response
  const { first_name, last_name, user_name, contact_no, dob, email, password } =
    req.body
  await conn.query('DELETE FROM fees  WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.log(err)
      response = 'failed'
    } else {
      response = 'Deleted Successfully'
    }
    res.send(response)
    console.log(response)
  })
})

//send mail
app.post('/sendEmail', function (req, res) {
  console.log('sending email..')
  const { to } = req.body
  const mailOptions = {
    from: 'example@email.com', // Sender address
    to: to, // recipients
    subject: 'test mail from Nodejs', // Subject line
    text: 'Successfully! received mail using nodejs', // Plain text body
  }
  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('mail has been sent.')
    }
  })
})

app.post('/login', async (req, res) => {
  const { user_name, password } = req.body
  await conn.query(
    'SELECT password FROM users  WHERE user_name = $1',
    [user_name],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        bcrypt
          .compare(password, result.rows[0].password)
          .then((response) => {
            res.send(response)
          })
          .catch((err) => console.error(err.message))
      }
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})
