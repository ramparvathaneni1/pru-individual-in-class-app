const request = require("supertest");
const { app, server } = require("../index");

// Test BucketList API
describe("Test all BucketList API paths", () => {
  test("It should respond with 'Yo! Waadup?'", async () => {
    const response = await request(app).get("/");
    const expectedGreeting = "Yo! Waadup?";
    expect(response.text).toBe(expectedGreeting);
  });
});



afterAll((done) => {
  // Closing the connection allows Jest to exit successfully.
  server.close();
  done();
});
