import app from "../src/app";
import request from "supertest";

describe("API Tests", () => {
  it("return", async () => {
    const res = await request(app).get("/").send();
    expect(res.statusCode).toEqual(200);
  });
});
