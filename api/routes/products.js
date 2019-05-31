const express = require('express')
const multer = require('multer')

const authHelper = require('../../helper/authHelper')
const productController = require('../controller/productsController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error(500), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})

const router = express.Router()

router.get('/', productController.get_all)

router.get('/:productID', productController.get_by_id)

router.post('/', upload.single('productImage'), productController.insert)

router.patch('/:productID', authHelper, productController.patch_by_id)

router.delete('/:productID', productController.delete_by_id)

module.exports = router