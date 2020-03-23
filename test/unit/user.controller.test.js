const UserController = require("../../controllers/user.controller");
const UserModel = require("../../model/user.model");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/new-user");
const allUsers = require("../mock-data/all-users");
const userByID = require("../mock-data/user-by-id");

jest.mock("../../model/user.model");

let req, res, next;
const userID = "5e77791a47488e3c849d0cf0";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.body = newUser;
    req.params.userID = userID;
    next = jest.fn();
})

describe('UserController.deleteUser', () => {
    it("should have deleteUser function", () => {
        expect(typeof UserController.deleteUser).toBe("function");
    });
    it("should delete with UserModel.findByIdAndDelete", async () => {
        await UserController.deleteUser(req, res, next);
        expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(userID);
    });
    it("should return http code 200 if succeded", async () => {
        UserModel.findByIdAndDelete.mockReturnValue({});
        await UserController.deleteUser(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({});
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with deleting"};
        const rejectedPromise = Promise.reject(errorMessage);
        UserModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await UserController.deleteUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should retirn 404 if requested user doesn't exist", async () => {
        UserModel.findByIdAndDelete.mockReturnValue(null);
        await UserController.deleteUser(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe('UserController.updateUser', () => {
    beforeEach(() => {
        req.params.userID = userID;
        req.body = newUser;
    });
    it("should have updateUser function", () => {
        expect(typeof UserController.updateUser).toBe("function");
    });
    it("should update with UserModel.findByIdAndUpdate", async () => {
        await UserController.updateUser(req, res, next);
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(userID, newUser, {
            new: true, useFindAndModify: false
        });
    });
    it("should return a response with json data and http code 200", async () => {
        UserModel.findByIdAndUpdate.mockReturnValue(newUser);
        await UserController.updateUser(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newUser);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByIdAndUpdate"};
        const rejectPromise = Promise.reject(errorMessage);
        UserModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await UserController.updateUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        UserModel.findByIdAndUpdate.mockReturnValue(null);
        await UserController.updateUser(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('UserController.getUserByID', () => {
    it("should have getUserByID function", () => {
        expect(typeof UserController.getUserByID).toBe("function");
    });
    it("should call UserModel.findById() with route parameters", async () => {
        req.params.userID = userID;
        await UserController.getUserByID(req, res, next);
        expect(UserModel.findById).toBeCalledWith(userID);
    });
    it("should return json body and response code 200", async () => {
        UserModel.findById.mockReturnValue(userByID);
        await UserController.getUserByID(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(userByID);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByID"};
        const rejectPromise = Promise.reject(errorMessage);
        UserModel.findById.mockReturnValue(rejectPromise);
        await UserController.getUserByID(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        UserModel.findById.mockReturnValue(null);
        await UserController.getUserByID(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('UserController.getAllUsers', () => {
    it("should have a getUser function", () => {
        expect(typeof UserController.getAllUsers).toBe("function");
    });
    it("should call UserModel.find()", async () => {
        await UserController.getAllUsers(req, res, next);
        expect(UserModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with status 200 and all users", async () => {
        UserModel.find.mockReturnValue(allUsers);
        await UserController.getAllUsers(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allUsers);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with finding"};
        const rejectPromise = Promise.reject(errorMessage);
        UserModel.find.mockReturnValue(rejectPromise);
        await UserController.getAllUsers(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('UserController.createUser', () => {
    beforeEach(() => {
        res.body = newUser;
    });
    it("should have a create a user function", () => {
        expect(typeof UserController.createUser).toBe("function");
    });
    it("should call UserModel.create", () => {
        UserController.createUser(req, res, next);
        expect(UserModel.create).toBeCalledWith(newUser);
    });
    it("should return 201 response code", async () => {
        await UserController.createUser(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled).toBeTruthy();
    });
    it("should return json body in response", async () => {
        UserModel.create.mockReturnValue(newUser);
        await UserController.createUser(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newUser);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        UserModel.create.mockReturnValue(rejectedPromise);
        await UserController.createUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

