export type ServiceStatus = {
    ID: string;
    Name: string;
    Image: string;
    Command: string;
    Project: string;
    Service: string;
    Created: number;
    State: string;
    Status: string;
    Health: string;
    ExitCode: number;
    Publishers: ServicePublisher[];
};

export type ServicePublisher = {
    URL: string;
    TargetPort: number;
    PublishedPort: number;
    Protocol: string;
};

export type PsResponse = ServiceStatus[];
