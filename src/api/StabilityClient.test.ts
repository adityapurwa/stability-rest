import { StabilityClient } from "./StabilityClient";

describe("StabilityClient", function () {
  it("should create http client", function () {
    const client = new StabilityClient(process.env.STABILITY_API_KEY);
    expect(client.http).toBeTruthy();
  });
  it("should load resources", function () {
    const client = new StabilityClient(process.env.STABILITY_API_KEY);
    expect(client.user).toBeTruthy();
  });
});
