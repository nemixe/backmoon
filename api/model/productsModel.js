const mongoose = require('mongoose')

const schemaProducts = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  category: { type: String, required: true },
  productImage: { type: String, required: true }
})

module.exports = mongoose.model('Products', schemaProducts)