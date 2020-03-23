const request = require('supertest');
const app = require("../../app");
const newReservation = require("../mock-data/new-reservation");

const endpointUrl = "/reservation/";

let firstReservation, newReservationID;
const nonExistingReservationID = "fe77693279112a2d90af4d62";
const testData = {userID: 234, roomNumber: 1, date: "12.12.2020", isReserved: "true"};

describe('endpointUrl', function () {
    it("POST", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newReservation);
        expect(response.statusCode).toBe(201);
        expect(response.body.userID).toBe(newReservation.userID);
        expect(response.body.roomNumber).toBe(newReservation.roomNumber);
        expect(response.body.date).toBe(newReservation.date);
        expect(response.body.isReserved).toBe(newReservation.isReserved);
        newReservationID = response.body._id;
    });
    it("POST should return error 500 on malformed data with POST", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({userID: "TestIntegration_3"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            "message": "Reservation validation failed.",
        });
    });
    it("GET", async () => {
        const response = await request(app)
            .get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].userID).toBeDefined();
        expect(response.body[0].roomNumber).toBeDefined();
        expect(response.body[0].date).toBeDefined();
        expect(response.body[0].isReserved).toBeDefined();
        //initializing the first user in first test
        firstReservation = response.body[0];
    });
    it("GET by id" + endpointUrl + ":reservationID", async () => {
        const response = await request(app)
            .get(endpointUrl + firstReservation._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.userID).toBe(firstReservation.userID);
        expect(response.body.roomNumber).toBe(firstReservation.roomNumber);
        expect(response.body.date).toBe(firstReservation.date);
        expect(response.body.isReserved).toBe(firstReservation.isReserved);
    });
    it("GET reservation by id doesn't exist" + endpointUrl + ":reservationID", async () => {
        const response = await request(app)
            .get(endpointUrl + nonExistingReservationID);
        expect(response.statusCode).toBe(404);
    });
    it("PUT" + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + newReservationID)
            .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.userID).toBe(testData.userID);
        expect(response.body.roomNumber).toBe(testData.roomNumber);
        expect(response.body.date).toBe(testData.date);
        expect(response.body.isReserved).toBe(testData.isReserved);
    });
    it("PUT should return 404", async () => {
        const response = await request(app)
            .put(endpointUrl + nonExistingReservationID)
            .send(testData);
        expect(response.statusCode).toBe(404);
    });
    it("DELETE", async () => {
        const response = await request(app)
            .delete(endpointUrl + newReservationID)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.userID).toBe(testData.userID);
        expect(response.body.roomNumber).toBe(testData.roomNumber);
        expect(response.body.date).toBe(testData.date);
        expect(response.body.isReserved).toBe(testData.isReserved);
    });
    it("DELETE 404", async () => {
        const response = await request(app)
            .delete(endpointUrl + nonExistingReservationID)
            .send();
        expect(response.statusCode).toBe(404);
    });
});
