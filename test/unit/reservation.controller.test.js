const ReservationController = require("../../controllers/reservation.controller");
const ReservationModel = require("../../model/reservation.model");
const httpMocks = require("node-mocks-http");
const newReservation = require("../mock-data/new-reservation");
const allReservations = require("../mock-data/all-reservations");
const reservationByID = require("../mock-data/reservation-by-id");

jest.mock("../../model/reservation.model");

let req, res, next;
const reservationID = "5e77791a47488e3c849d0cf0";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.body = newReservation;
    req.params.reservationID = reservationID;
    next = jest.fn();
});

describe('ReservationController.createReservation', () => {
    beforeEach(() => {
        res.body = newReservation;
    });
    it("should have a create a reservation function", () => {
        expect(typeof ReservationController.createReservation).toBe("function");
    });
    it("should call ReservationModel.create", () => {
        ReservationController.createReservation(req, res, next);
        expect(ReservationModel.create).toBeCalledWith(newReservation);
    });
    it("should return 201 response code", async () => {
        await ReservationController.createReservation(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled).toBeTruthy();
    });
    it("should return json body in response", async () => {
        ReservationModel.create.mockReturnValue(newReservation);
        await ReservationController.createReservation(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newReservation);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        ReservationModel.create.mockReturnValue(rejectedPromise);
        await ReservationController.createReservation(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('ReservationController.getAllReservations', () => {
    it("should have a getAllReservations function", () => {
        expect(typeof ReservationController.getAllReservations).toBe("function");
    });
    it("should call UserModel.find()", async () => {
        await ReservationController.getAllReservations(req, res, next);
        expect(ReservationModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with status 200 and all users", async () => {
        ReservationModel.find.mockReturnValue(allReservations);
        await ReservationController.getAllReservations(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allReservations);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with finding"};
        const rejectPromise = Promise.reject(errorMessage);
        ReservationModel.find.mockReturnValue(rejectPromise);
        await ReservationController.getAllReservations(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('ReservationController.getReservationByID', () => {
    it("should have getUserByID function", () => {
        expect(typeof ReservationController.getReservationByID).toBe("function");
    });
    it("should call UserModel.findById() with route parameters", async () => {
        req.params.reservationID = reservationID;
        await ReservationController.getReservationByID(req, res, next);
        expect(ReservationModel.findById).toBeCalledWith(reservationID);
    });
    it("should return json body and response code 200", async () => {
        ReservationModel.findById.mockReturnValue(reservationID);
        await ReservationController.getReservationByID(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(reservationID);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByID"};
        const rejectPromise = Promise.reject(errorMessage);
        ReservationModel.findById.mockReturnValue(rejectPromise);
        await ReservationController.getReservationByID(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        ReservationModel.findById.mockReturnValue(null);
        await ReservationController.getReservationByID(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('ReservationController.updateReservation', () => {
    beforeEach(() => {
        req.params.reservationID = reservationID;
        req.body = newReservation;
    });
    it("should have updateUser function", () => {
        expect(typeof ReservationController.updateReservation).toBe("function");
    });
    it("should update with UserModel.findByIdAndUpdate", async () => {
        await ReservationController.updateReservation(req, res, next);
        expect(ReservationModel.findByIdAndUpdate).toHaveBeenCalledWith(reservationID, newReservation, {
            new: true, useFindAndModify: false
        });
    });
    it("should return a response with json data and http code 200", async () => {
        ReservationModel.findByIdAndUpdate.mockReturnValue(newReservation);
        await ReservationController.updateReservation(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newReservation);
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with findByIdAndUpdate"};
        const rejectPromise = Promise.reject(errorMessage);
        ReservationModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await ReservationController.updateReservation(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should return 404 if requested item doesn't exist", async () => {
        ReservationModel.findByIdAndUpdate.mockReturnValue(null);
        await ReservationController.updateReservation(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
});

describe('ReservationController.deleteReservation', () => {
    it("should have deleteReservation function", () => {
        expect(typeof ReservationController.deleteReservation).toBe("function");
    });
    it("should delete with ReservationModel.findByIdAndDelete", async () => {
        await ReservationController.deleteReservation(req, res, next);
        expect(ReservationModel.findByIdAndDelete).toHaveBeenCalledWith(reservationID);
    });
    it("should return http code 200 if succeded", async () => {
        ReservationModel.findByIdAndDelete.mockReturnValue({});
        await ReservationController.deleteReservation(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({});
    });
    it("should handle errors", async () => {
        const errorMessage = {message: "Error with deleting"};
        const rejectedPromise = Promise.reject(errorMessage);
        ReservationModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await ReservationController.deleteReservation(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should retirn 404 if requested user doesn't exist", async () => {
        ReservationModel.findByIdAndDelete.mockReturnValue(null);
        await ReservationController.deleteReservation(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

