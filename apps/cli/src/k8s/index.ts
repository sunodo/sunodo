import {
    KubernetesObject,
    KubernetesObjectApi,
    V1EndpointSliceList,
    V1Status,
} from "@kubernetes/client-node";
import yaml from "js-yaml";

export type Service = {
    name: string;
    status: "running" | "starting";
    version: string;
    url?: string;
};

export const apply = async (
    client: KubernetesObjectApi,
    specString: string,
    namespace?: string,
): Promise<KubernetesObject[]> => {
    const specs = yaml.loadAll(specString) as KubernetesObject[];
    const validSpecs = specs.filter((o) => o && o.metadata && o.metadata.name);
    return Promise.all(
        validSpecs.map(async (spec) => {
            spec.metadata = spec.metadata || {};
            spec.metadata.namespace = namespace || spec.metadata.namespace; // modify namespace
            spec.metadata.annotations = spec.metadata.annotations || {};
            delete spec.metadata.annotations[
                "kubectl.kubernetes.io/last-applied-configuration"
            ];
            spec.metadata.annotations[
                "kubectl.kubernetes.io/last-applied-configuration"
            ] = JSON.stringify(spec);
            try {
                await client.read({
                    ...spec,
                    metadata: {
                        name: spec.metadata?.name!,
                        namespace: spec.metadata?.namespace!,
                    },
                });
                const response = await client.patch(
                    spec,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    {
                        headers: {
                            "Content-Type": "application/merge-patch+json",
                        },
                    },
                );
                return response.body;
            } catch (e) {
                try {
                    const response = await client.create(spec);
                    return response.body;
                } catch (err) {
                    throw new Error(
                        `Error applying ${spec.kind}/${spec.metadata.name}`,
                        {
                            cause: err,
                        },
                    );
                }
            }
        }),
    );
};

export const delete_ = async (
    client: KubernetesObjectApi,
    specString: string,
    namespace?: string,
): Promise<(V1Status | undefined)[]> => {
    const specs = yaml.loadAll(specString) as KubernetesObject[];
    const validSpecs = specs.filter((o) => o && o.metadata && o.metadata.name);
    return Promise.all(
        validSpecs.map(async (spec) => {
            spec.metadata = spec.metadata || {};
            spec.metadata.namespace = namespace || spec.metadata.namespace; // modify namespace
            try {
                await client.read({
                    ...spec,
                    metadata: {
                        name: spec.metadata?.name!,
                        namespace: spec.metadata?.namespace!,
                    },
                });
                const response = await client.delete(spec);
                return response.body;
            } catch (e) {
                // does not exist, do nothing
            }
        }),
    );
};

export const isServiceReady = (endpointList: V1EndpointSliceList): boolean => {
    // get flattened list of endpoints from the list
    const endpoints = endpointList.items.map((slice) => slice.endpoints).flat();

    // check if any endpoint is ready
    const ready = endpoints.some(
        (endpoint) => endpoint && endpoint.conditions?.ready,
    );

    return ready;
};

export const findServicesByLabel = (
    objects: KubernetesObject[],
    labels: Record<string, string>,
): KubernetesObject[] => {
    return objects.filter((object) => {
        if (object.kind === "Service") {
            const objectLabels = object.metadata?.labels;
            if (objectLabels) {
                const match = Object.entries(labels).map(([key, value]) => {
                    return objectLabels[key] === value;
                });
                return match.every((v) => v);
            } else {
                return false;
            }
        }
        return false;
    });
};
