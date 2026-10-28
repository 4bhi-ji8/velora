import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    // get token from HTTP authorization header
    const authHeader = req.headers.authorization;

    // checks if the header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mesage: 'access denied' });
    }

    // extract the actual token string by splitting "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // verify the token using the secret key from .env file
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // attach the decoded user data
    req.user = decodedPayload;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
export default authMiddleware;
