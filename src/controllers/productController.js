const Product = require('../models/productModel');


exports.getAllProducts = async (req, res, next) => {
    try {
        // For public (mobile) show only available products
        const onlyAvailable = req.query.admin === 'true' ? false : true;
        const filter = onlyAvailable ? { available: true } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json({ products });
    } catch (err) { next(err); }
};

exports.getAllProductsAdmin = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ products });
    } catch (err) {
        next(err);
    }
};


exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (err) { next(err); }
};


exports.createProduct = async (req, res, next) => {
    try {
        const { name, price, available } = req.body;
        const product = await Product.create({ name, price, available });
        res.status(201).json({ product });
    } catch (err) { next(err); }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const updates = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (err) { next(err); }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) { next(err); }
};