import { createClient } from "../http/client";
import { UserResource } from "./UserResource";
import { AxiosInstance } from "axios";
import { EngineResource } from "./EngineResource";
import { GenerationResource } from "./GenerationResource";

/**
 * The client to access Stability.ai API
 */
export class StabilityClient {
  /**
   * Axios client to access the API, you probably won't need to use it directly except for accessing an API that
   * hasn't been defined here yet.
   */
  public readonly http: AxiosInstance;
  /**
   * User resource
   */
  public readonly user = new UserResource(this);
  /**
   * Engine resource
   */
  public readonly engine = new EngineResource(this);
  /**
   * Generation resource
   */
  public readonly generation = new GenerationResource(this);

  /**
   * DreamStudio API Key. You can view yours at
   * <a href="https://beta.dreamstudio.ai/membership?tab=apiKeys">https://beta.dreamstudio.ai/membership?tab=apiKeys</a>
   * @param apiKey
   * @link https://beta.dreamstudio.ai/membership?tab=apiKeys
   */
  constructor(private readonly apiKey: string) {
    this.http = createClient(apiKey);
  }
}
