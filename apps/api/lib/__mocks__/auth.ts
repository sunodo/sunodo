import { beforeEach } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import { AuthService } from "../auth";

beforeEach(() => {
    mockReset(authService);
});

const authService = mock<AuthService>();
export default authService;
