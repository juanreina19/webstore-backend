const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.post('/', protect, orderController.createOrder); // create order (user)
router.get('/my-orders', protect, orderController.getUserOrders); // user orders
// admin
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.get('/stats', protect, adminOnly, orderController.getSalesStats);


module.exports = router;