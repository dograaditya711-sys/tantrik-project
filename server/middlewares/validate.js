// 🎯 SECURITY FIX (H5): Input validation middleware
const validate = (schema) => (req, res, next) => {
    // abortEarly: false matlab saari errors ek saath milengi
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return res.status(400).json({ message: errorMessage });
    }

    // 🎯 Mass Assignment Protection: 
    // req.body ko Joi ke cleaned 'value' se replace kar rahe hain.
    // Isse koi bhi extra field (jaise role: 'admin' ya walletBalance: 9999) reject/strip ho jayegi.
    req.body = value;
    next();
};

module.exports = validate;