import request from "supertest";
import app from "./testApp";
import { resetDB, closeDB } from "./utils";

beforeAll(async () => {
    await resetDB();

    await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@email.com", password: "password123" })
        .expect(201);
});

afterAll(async () => {
    await closeDB();
});

describe("Auth routes", () => {
    it("signup", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({ email: "newuser@email.com", password: "password123" })
            .expect(201);

        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe("newuser@email.com");
    });

    it("login", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@email.com", password: "password123" })
            .expect(200);

        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe("test@email.com");
    });

    it("invalid input", async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({ email: "invalid-email", password: "123" })
            .expect(400);
    });

    it("unauthorized", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "doesnotexist@email.com", password: "password123" })
            .expect(401);

        expect(res.body.error).toBe("Invalid credentials");
    });

    it("incorrect password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@email.com", password: "wrongpassword" })
            .expect(401);

        expect(res.body.error).toBe("Invalid credentials");
    });
});
