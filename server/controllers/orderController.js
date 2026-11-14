const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); 

// @desc    Place an Order (Buy Product)
// @route   POST /api/users/order
const placeOrder = async (req, res) => {
    try {
        // 🎯 Frontend se ab productId aur shippingAddress dono aayenge
        const { productId, shippingAddress } = req.body; 

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock <= 0) return res.status(400).json({ message: 'Product is out of stock' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.walletBalance < product.price) {
            return res.status(400).json({ message: 'Insufficient wallet balance. Please recharge.' });
        }

        // Wallet se paise deduct karein
        user.walletBalance -= product.price;
        await user.save();

        // Stock kam karein
        product.stock -= 1;
        await product.save();

        // Order create karein (Real Address ke sath)
        const order = await Order.create({
            userId: user._id,
            products: [{ 
                productId: product._id, 
                quantity: 1, 
                price: product.price 
            }],
            totalAmount: product.price,
            shippingAddress: shippingAddress, // 🎯 Real Address save hua
            paymentStatus: 'Paid',
            orderStatus: 'Processing'
        });

        res.status(201).json({ 
            message: 'Order placed successfully!', 
            order,
            newBalance: user.walletBalance 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Orders
// @route   GET /api/users/my-orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('products.productId', 'name image price') 
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders };