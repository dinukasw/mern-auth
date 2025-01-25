import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, "access denied"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(errorHandler(403, "token is not valid"));
        }

        req.user = decoded;
        next();
    });
};
