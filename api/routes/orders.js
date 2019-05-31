const express = require('express')

const orderController = require('../controller/ordersController')
const authRequired = require('../../helper/authHelper')

const router = express.Router()

router.get('/', authRequired, orderController.get_all)

router.get('/:orderID', authRequired, orderController.get_by_id)

router.post('/', authRequired, orderController.insert)

router.delete('/:orderID', authRequired, orderController.delete)

module.exports = router