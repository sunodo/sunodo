import { SecretService } from "../secret";
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
    mockReset(envVarSecretService);
});

export const envVarSecretService = mockDeep<SecretService>();
