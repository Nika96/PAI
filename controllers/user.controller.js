const UserModel = require("../model/user.model");

exports.createUser = async (req, res, next) => {
    try {
        const createdUser = await UserModel.create(req.body);
        res.status(201).json(createdUser);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await UserModel.find({});
        res.status(200).json(allUsers);
    } catch (err) {
        next(err);
    }
};

exports.getUserByID = async (req, res, next) => {
    try {
        const userByID = await UserModel.findById(req.params.userID);
        if (userByID) {
            res.status(200).json(userByID);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await UserModel
            .findByIdAndUpdate(
                req.params.userID,
                req.body,
                {
                    new: true,
                    useFindAndModify: false
                }
            );
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }

};

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await UserModel
            .findByIdAndDelete(req.params.userID);
        if (deletedUser) {
            res.status(200).json(deletedUser);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};
