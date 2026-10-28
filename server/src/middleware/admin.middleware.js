

const adminMiddleware = (req, res, next) => {
    try {
        // check if the user is an admin
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    }catch (error) {
        return res.status(500).json({ message: 'An error occurred while checking admin privileges.' });
    }
}

export default adminMiddleware;