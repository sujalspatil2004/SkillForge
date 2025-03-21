import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '

    if (!token) {
        return res.status(401).json({ message: "Token is not in correct format, authorization denied" });
    }

    console.log('Token received:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification error:', error);
        res.status(400).json({ message: "Invalid token" });
    }
};

export default authMiddleware;