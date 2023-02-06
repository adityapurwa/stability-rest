import { StabilityClient } from "./StabilityClient";

describe("UserResource", function () {
  const client = new StabilityClient(process.env.STABILITY_API_KEY);

  it("should get account", async function () {
    const res = await client.user.account();
    expect(res.data.id).toBeDefined();
  });
  it("should get balance", async function () {
    const res = await client.user.balance();
    expect(res.data.credits).toBeDefined();
    expect(res.data.credits).not.toBeNaN();
  });
});
