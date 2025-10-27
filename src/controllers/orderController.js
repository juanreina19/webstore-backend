const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.createOrder = async (req, res, next) => {
    try {
        const { products } = req.body; // [{ product: id, quantity }]
        if (!products || !Array.isArray(products) || products.length === 0) return res.status(400).json({ message: 'No products' });
        // Optional: validate products exist and calculate total
        let total = 0;
        for (const item of products) {
            const p = await Product.findById(item.product);
            if (!p) return res.status(400).json({ message: `Product ${item.product} not found` });
            total += (p.price || 0) * (item.quantity || 1);
        }
        const order = await Order.create({ user: req.user._id, products, totalPrice: total, status: 'paid' });
        res.status(201).json({ order });
    } catch (err) { next(err); }
};


exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price');
        res.json({ orders });
    } catch (err) { next(err); }
};


exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name price');
        res.json({ orders });
    } catch (err) { next(err); }
};


// Sales stats: total quantities per product grouped by user
exports.getSalesStats = async (req, res, next) => {
    try {
        const agg = await Order.aggregate([
            { $unwind: '$products' },
            {
                $group: {
                    _id: { user: '$user', product: '$products.product' },
                    totalQuantity: { $sum: '$products.quantity' }
                }
            },
            {
                $group: {
                    _id: '$_id.user',
                    products: { $push: { product: '$_id.product', totalQuantity: '$totalQuantity' } }
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, userId: '$user._id', userName: '$user.name', products: 1 } }
        ]);


        // Replace product ids with product names
        const populated = [];
        for (const row of agg) {
            const detailedProducts = [];
            for (const p of row.products) {
                const prod = await Product.findById(p.product).select('name');
                detailedProducts.push({ productId: p.product, productName: prod ? prod.name : 'Deleted product', totalQuantity: p.totalQuantity });
            }
            populated.push({ userId: row.userId, userName: row.userName, sales: detailedProducts });
        }


        res.json({ stats: populated });
    } catch (err) { next(err); }
};