const Product = require('../models/Product');

// 1. ADD Product (With Image Upload)
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            // 🎯 H4 Fix: Cloudinary URL
            imageUrl = req.file.path;
        }

        const product = await Product.create({ name, description, price: Number(price), category, stock: Number(stock), image: imageUrl });
        res.status(201).json({ message: 'Product added', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. GET All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. DELETE Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addProduct, getAllProducts, updateProduct, deleteProduct };