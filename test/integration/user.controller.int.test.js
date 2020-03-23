const request = require('supertest');
const app = require("../../app");
const newUser = require("../mock-data/new-user");

const endpointUrl = "/user/";

//first user that we get from the DB
let firstUser, newUserID;
const nonExistingUserID = "fe77693279112a2d90af4d62";
const testData = {name: "IntegrationTest", surname: "Integration", email: "mail@mail.com"};

describe('endpointUrl', function () {
    it("GET" + endpointUrl, async () => {
        const response = await request(app)
            .get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].surname).toBeDefined();
        expect(response.body[0].email).toBeDefined();
        //initializing the first user in first test
        firstUser = response.body[0];
    });
    it("GET by id" + endpointUrl + ":userID", async () => {
        const response = await request(app)
            .get(endpointUrl + firstUser._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(firstUser.name);
        expect(response.body.surname).toBe(firstUser.surname);
        expect(response.body.email).toBe(firstUser.email);
    });
    it("GET user by id doesn't exist" + endpointUrl + ":userID", async () => {
        const response = await request(app)
            .get(endpointUrl + nonExistingUserID);
        expect(response.statusCode).toBe(404);
    });
    it("POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.surname).toBe(newUser.surname);
        expect(response.body.email).toBe(newUser.email);
        newUserID = response.body._id;
    });
    it("POST should return error 500 on malformed data with POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({name: "TestIntegration_1"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            "message": "User validation failed: email: Path `email` is required., surname: Path `surname` is required.",
        });
    });
    it("PUT" + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + newUserID)
            .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(testData.name);
        expect(response.body.surname).toBe(testData.surname);
        expect(response.body.email).toBe(testData.email);

    });
    it("PUT should return 404" + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + nonExistingUserID)
            .send(testData);
        expect(response.statusCode).toBe(404);
    });
    it("DELETE", async () => {
        const response = await request(app)
            .delete(endpointUrl + newUserID)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(testData.name);
        expect(response.body.surname).toBe(testData.surname);
        expect(response.body.email).toBe(testData.email);
    });
    it("DELETE 404", async () => {
        const response = await request(app)
            .delete(endpointUrl + nonExistingUserID)
            .send();
        expect(response.statusCode).toBe(404);
    });
});
