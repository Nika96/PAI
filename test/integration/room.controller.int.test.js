const request = require('supertest');
const app = require("../../app");
const newRoom = require("../mock-data/new-room");

const endpointUrl = "/room/";

let newRoomID, firstRoom;

const nonExistingRoomID = "fe77693279112a2d90af4d62";
const testData = {number: 1, capacity: 100, price: 1000};

describe('endpointUrl', () => {
    it("POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newRoom);
        expect(response.statusCode).toBe(201);
        expect(response.body.number).toBe(newRoom.number);
        expect(response.body.capacity).toBe(newRoom.capacity);
        expect(response.body.price).toBe(newRoom.price);
        newRoomID = response.body._id;
    });
    it("POST should return 500 on malformed data with POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({number: 12});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            "message": "Room validation failed: price: Path `price` is required., capacity: Path `capacity` is required."
        });
    });
    it("GET" + endpointUrl, async () => {
        const response = await request(app)
            .get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].number).toBeDefined();
        expect(response.body[0].capacity).toBeDefined();
        expect(response.body[0].price).toBeDefined();
        //initializing the first room in first test
        firstRoom = response.body[0];
    });
    it("GET by id" + endpointUrl + ":roomID", async () => {
        const response = await request(app)
            .get(endpointUrl + firstRoom._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.number).toBe(firstRoom.number);
        expect(response.body.price).toBe(firstRoom.price);
        expect(response.body.capacity).toBe(firstRoom.capacity);
    });
    it("GET room by id doesn't exist" + endpointUrl + ":roomID", async () => {
        const response = await request(app)
            .get(endpointUrl + nonExistingRoomID);
        expect(response.statusCode).toBe(404);
    });
    it("PUT" + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + newRoomID)
            .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.number).toBe(testData.number);
        expect(response.body.price).toBe(testData.price);
        expect(response.body.capacity).toBe(testData.capacity);
    });
    it("PUT should return 404" + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + nonExistingRoomID)
            .send(testData);
        expect(response.statusCode).toBe(404);
    });
    it("DELETE", async () => {
        const response = await request(app)
            .delete(endpointUrl + newRoomID)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.number).toBe(testData.number);
        expect(response.body.capacity).toBe(testData.capacity);
        expect(response.body.price).toBe(testData.price);
    });
    it("DELETE 404", async () => {
        const response = await request(app)
            .delete(endpointUrl + nonExistingRoomID)
            .send();
        expect(response.statusCode).toBe(404);
    });
});
