import { StabilityClient } from "./StabilityClient";

describe("EngineResource", function () {
  const client = new StabilityClient(process.env.STABILITY_API_KEY);

  it("should list", async function () {
    const res = await client.engine.list();
    expect(res.data).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);
  });
});
