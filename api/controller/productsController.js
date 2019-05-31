const mongoose = require('mongoose')
const fs = require('fs')
const productModel = require('../model/productsModel')

module.exports = {
  get_all: (req, res, next) => {
    productModel.find()
      .select('_id name category productImage')
      .exec()
      .then(results => {
        const response = {
          count: results.length,
          data: results.map(result => {
            return {
              id: result._id,
              name: result.name,
              category: result.category,
              productImage: result.productImage,
              request: {
                type: 'GET',
                url: 'http://localhost:8080/products/' + result.id
              }
            }
          })
        }
        res.status(200).json(response)
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
  },

  get_by_id: (req, res, next) => {
    const id = req.params.productID
    Product.findById(id)
      .exec()
      .then(result => {
        if (result) {
          const response = {
            _id: result._id,
            name: result.name,
            category: result.category,
            request: {
              type: 'GET',
              url: 'http://localhost:8080/products'
            }
          }
          res.status(200).json(response)
        } else {
          res.status(404).json({ message: "Item not found!" })
        }
      }).catch(err => {
        res.status(500).json({ error: err })
      })
  },

  insert: (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      category: req.body.category,
      productImage: req.file.path
    })
    product.save().then(result => {
      const response = {
        message: 'Data created',
        payload: result,
        request: {
          type: 'GET',
          url: 'http://localhost:8080/products/' + result._id
        }
      }
      res.status(201).json(response)
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
  },

  patch_by_id: (req, res, next) => {
    Product.update({ _id: req.params.productID }, { $set: req.body })
      .exec()
      .then(result => {
        console.log(result)
        res.status(200).json(result)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
      })
  },

  delete_by_id: (req, res, next) => {
    Product.findById(req.params.productID)
      .exec()
      .then(result => {
        fs.unlink(result.productImage, err => {
          if (err) throw err
          console.log(result.productImage, 'successfuly deleted!')
        })
        Product.deleteOne({ _id: req.params.productID })
          .exec()
          .then(result => {
            console.log(result)
            res.status(200).json(result)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
          })
      })
      .catch(err => res.status(500).json({ error: err }))
  }
}