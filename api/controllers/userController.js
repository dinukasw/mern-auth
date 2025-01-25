import errorHandler from "../utils/error.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const test = (req, res) => {
    res.json({
        message: "API is working...",
    });
};


//update user
export const updateUser = async (req, res,next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account!"));
    }

    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profileImg: req.body.profileImg,
            },
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
