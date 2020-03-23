const RoomController = require("../../controllers/room.controller");
const RoomModel = require("../../model/room.model");
const httpMocks = require("node-mocks-http");
const newRoom = require("../mock-data/new-room");
const allRooms = require("../mock-data/all-rooms");
const roomByID = require("../mock-data/room-by-id");

jest.mock("../../model/room.model");

let res, req, next;
const roomID = "5e77cdad6a55e51018ccc0a6";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.params.roomID = roomID;
    req.body = newRoom;
    next = jest.fn();
})

describe('RoomController.createRoom', () => {
    beforeEach(() => {
        res.body = newRoom;
    });

    it("should have a create a room function", () => {
        expect(typeof RoomController.createRoom).toBe("function");
    });
    it("should call RoomModel.create", () => {
        RoomController.createRoom(req, res, next);
        expect(RoomModel.create).toBeCalledWith(newRoom);
    });
    it("should return 201 response code", async () => {
        await RoomController.createRoom(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled).toBeTruthy();
    });
    it("should return json body in response", async () => {
        RoomModel.create.mockReturnValue(newRoom);
        await RoomController.createRoom(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newRoom);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        RoomModel.create.mockReturnValue(rejectedPromise);
        await RoomController.createRoom(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('RoomController.getAllRooms', () => {
    it("should have getAllRooms function", () => {
        expect(typeof RoomController.getAllRooms).toBe("function");
    });
    it("should call RoomModel.find()", async () => {
        await RoomController.getAllRooms(req, res, next);
        expect(RoomModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with status 200 and all rooms", async () => {
        RoomModel.find.mockReturnValue(allRooms);
        await RoomController.getAllRooms(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allRooms);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with getAllRooms"};
        const rejectPromise = Promise.reject(errorMessage);
        RoomModel.find.mockReturnValue(rejectPromise);
        await RoomController.getAllRooms(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('RoomController.getRoomByID', () => {
    it("should have getRoomByID function", () => {
        expect(typeof RoomController.getRoomByID).toBe("function");
    });
    it("should call rOOMModel.findById() with route parameters", async () => {
        req.params.roomID = roomID;
        await RoomController.getRoomByID(req, res, next);
        expect(RoomModel.findById).toBeCalledWith(roomID);
    });
    it("should return json body and response code 200", async () => {
        RoomModel.findById.mockReturnValue(roomByID);
        await RoomController.getRoomByID(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(roomByID);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByID"};
        const rejectPromise = Promise.reject(errorMessage);
        RoomModel.findById.mockReturnValue(rejectPromise);
        await RoomController.getRoomByID(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        RoomModel.findById.mockReturnValue(null);
        await RoomController.getRoomByID(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('RoomController.updateRoom', () => {
    beforeEach(() => {
        req.params.roomID = roomID;
        req.body = newRoom;
    });
    it("should have updateRoom function", () => {
        expect(typeof RoomController.updateRoom).toBe("function");
    });
    it("should update with RoomModel.findByIdAndUpdate", async () => {
        await RoomController.updateRoom(req, res, next);
        expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith(
            roomID,
            newRoom,
            {
                new: true, useFindAndModify: false
            });
    });
    it("should return a response with json data and http code 200", async () => {
        RoomModel.findByIdAndUpdate.mockReturnValue(newRoom);
        await RoomController.updateRoom(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newRoom);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByIdAndUpdate"};
        const rejectPromise = Promise.reject(errorMessage);
        RoomModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await RoomController.updateRoom(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        RoomModel.findByIdAndUpdate.mockReturnValue(null);
        await RoomController.updateRoom(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('RoomController.deleteRoom', () => {
    it("should have deleteRoom function", () => {
        expect(typeof RoomController.deleteRoom).toBe("function");
    });
    it("should delete with RoomModel.findByIdAndDelete", async () => {
        await RoomController.deleteRoom(req, res, next);
        expect(RoomModel.findByIdAndDelete).toHaveBeenCalledWith(roomID);
    });
    it("should return http code 200 if succeded", async () => {
        RoomModel.findByIdAndDelete.mockReturnValue({});
        await RoomController.deleteRoom(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({});
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with deleting"};
        const rejectedPromise = Promise.reject(errorMessage);
        RoomModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await RoomController.deleteRoom(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should retirn 404 if requested room doesn't exist", async () => {
        RoomModel.findByIdAndDelete.mockReturnValue(null);
        await RoomController.deleteRoom(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
