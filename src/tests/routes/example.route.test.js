import request from "supertest";
import app from "../../app";

describe("Test example route", () => {
  it("Should get the greeting", async () => {
    const result = await request(app).get("/").send();

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ greeting: "Hello World!" });
  });
});
