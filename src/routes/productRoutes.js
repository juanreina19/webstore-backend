const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.get('/', productController.getAllProducts); // public (mobile) - shows only available
router.get('/:id', productController.getProductById);
// admin routes
router.get('/admin/all', protect, adminOnly, productController.getAllProductsAdmin);
router.post('/', protect, adminOnly, productController.createProduct);
router.put('/:id', protect, adminOnly, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);


module.exports = router;