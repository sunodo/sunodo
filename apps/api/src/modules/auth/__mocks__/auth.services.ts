import { beforeEach } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import { AuthService } from "../auth.services";

beforeEach(() => {
    mockReset(authService);
});

export const authService = mock<AuthService>();
