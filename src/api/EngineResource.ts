import StabilityClient from "./StabilityClient";

export type ListResponse = {
  id: string;
  description: string;
  name: string;
  type: string;
}[];

/**
 * Interface to access the /engines resources
 */
export default class EngineResource {
  /**
   * Initialize a new instance of EngineResource. You probably want to use the StabilityClient instead.
   * @param client
   */
  constructor(private readonly client: StabilityClient) {}

  /**
   * Get the list of available engines/models. You can also use the helpers/engine.ts:WellKnownEngine
   * to get a list of well-known engines without an API call.
   */
  list() {
    return this.client.http.get<ListResponse>("engines/list");
  }
}
