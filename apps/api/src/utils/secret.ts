export interface SecretService {
    getSecretValue(ref: string): string | undefined;
}

export class EnvVarSecretService implements SecretService {
    getSecretValue(ref: string): string | undefined {
        return process.env[ref];
    }
}

export const envVarSecretService = new EnvVarSecretService();
// TODO: implement awsSecretService
// TODO: implement vaultSecretService
