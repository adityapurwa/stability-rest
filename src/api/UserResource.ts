import { StabilityClient } from "./StabilityClient";

export interface GetAccountResponse {
  email: string;
  id: string;
  organizations: {
    id: string;
    name: string;
    role: "OWNER" | "MEMBER";
    is_default: boolean;
  }[];
  profile_picture: string;
}

export interface GetBalanceResponse {
  credits: number;
}

/**
 * Interface to access the /user resource.
 */
export class UserResource {
  /**
   * Initialize a new instance of UserResource. You probably want to use the StabilityClient instead.
   * @param client
   */
  constructor(private readonly client: StabilityClient) {}

  /**
   * Get the account associated with the current API key
   */
  account() {
    return this.client.http.get<GetAccountResponse>("user/account");
  }

  /**
   * Get the remaining credits available for this account
   * @param orgId - if specified, it will get the credit for this organization instead of the default account.
   */
  balance(orgId?: string) {
    return this.client.http.get<GetBalanceResponse>("user/balance", {
      headers: {
        Organization: orgId,
      },
    });
  }
}
