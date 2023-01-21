import axios, { AxiosInstance } from "axios";

export type LoginRequest = {
    refresh_token: string;
};

export type LoginResponse = {
    email: string;
    session: string;
};

export interface Client {
    login(accessToken: string, refreshToken?: string): Promise<LoginResponse>;
}

class DefaultClient implements Client {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
        });
    }

    async login(
        accessToken: string,
        refreshToken?: string | undefined
    ): Promise<LoginResponse> {
        const { data } = await this.client.post<LoginResponse>(
            "/auth/login",
            { refresh_token: refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return data;
    }
}

export const createClient = () => {
    return new DefaultClient(process.env.DEFAULT_API_URL!);
};
