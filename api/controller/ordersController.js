const mongoose = require('mongoose')

const ordersModel = require('../model/ordersModel')
const productsModel = require('../model/productsModel')

module.exports = {
  get_all: (req, res, next) => {
    ordersModel.find()
      .select('_id productID quantity')
      .populate('productID', '_id name category')
      .exec()
      .then(results => {
        if (!results.length) {
          return res.status(204).json({ message: 'No content inserted' })
        }
        const response = {
          count: results.length,
          orders: results.map(result => {
            let productID
            if (result.productID) {
              productID = {
                productID: result.productID._id || null,
                name: result.productID.name || null,
                category: result.productID.category || null,
                request: {
                  type: 'GET',
                  url: 'http://localhost:8080/products/' + result.productID._id || null
                }
              }
            } else {
              productID = result.productID
            }
            return {
              id: result._id,
              product: productID,
              quantity: result.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:8080/orders/' + result._id
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
    const id = req.params.orderID
    ordersModel.findById(id)
      .populate('productID')
      .exec()
      .then(result => {
        if (result) {
          let productID
          if (result.productID) {
            productID = {
              productID: result.productID._id || null,
              name: result.productID.name || null,
              category: result.productID.category || null,
              request: {
                type: 'GET',
                url: 'http://localhost:8080/products/' + result.productID._id || null
              }
            }
          } else {
            productID = result.productID
          }
          console.log(productID)
          const response = {
            id: result._id,
            product: productID,
            quantity: result.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:8080/orders'
            }
          }
          res.status(200).json(response)
        } else {
          res.status(404).json({ message: "Item not found!" })
        }
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
  },

  insert: (req, res, next) => {
    const orders = new ordersModel({
      _id: new mongoose.Types.ObjectId(),
      productID: req.body.productID,
      quantity: req.body.quantity
    })
    orders.save()
      .then(result => {
        productsModel.findById(req.body.productID)
          .exec()
          .then(pResult => {
            if (!pResult) {
              return res.status(404).json({ message: "Invalid ProductID" })
            }
            const response = {
              message: "Order was created successfuly",
              order: {
                id: result._id,
                productID: result.productID,
                quantity: result.quantity
              }
            }
            res.status(201).json(response)
          })
          .catch(err => {
            res.status(500).json({ error: err })
          })
      }).catch(err => {
        res.status(500).json({ error: err })
      })
  },

  delete: (req, res, next) => {
    ordersModel.deleteOne({ _id: req.params.orderID })
      .exec()
      .then(result => {
        const response = {
          message: "OrderID " + req.params.orderID + " Successfuly Deleted",
          order: result
        }
        res.status(200).json(response)
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
  }
}