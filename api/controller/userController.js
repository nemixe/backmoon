const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../model/userModel')
module.exports = {
  signUp: (req, res, next) => {
    console.log(req.body.password)
    const user = new userModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password
    })
    user.save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          user: result
        })
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
  },

  signIn: (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      res.status(401).json({ message: "field cannot be null" })
    }
    userModel.findOne({ email: req.body.email })
      .exec()
      .then(result => {
        bcrypt.compare(req.body.password, result.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ error: err })
          }
          if (isMatch) {
            const token = jwt.sign({ data: req.body.email }, '1n1p455w0rd', { expiresIn: '1h' })
            return res.status(400).json({
              tokenID: token
            })
          }
          res.status(500).json({ error: err })
        })
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
  }
}