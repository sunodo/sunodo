/**
 * Sunodo API
 * v1
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
import * as Oazapfts from "oazapfts/lib/runtime/index.js";
import * as QS from "oazapfts/lib/runtime/query.js";
export const defaults: Oazapfts.RequestOpts = {
    baseUrl: "/",
};
const oazapfts = Oazapfts.runtime(defaults);
export const servers = {};
/**
 * Create application
 */
export function createApplication(
    body?: {
        name?: string;
        org?: string;
    },
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 201;
              data: {
                  name: string;
              };
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        "/apps/",
        oazapfts.json({
            ...opts,
            method: "POST",
            body,
        })
    );
}
/**
 * List applications
 */
export function listApplications(
    {
        org,
    }: {
        org?: string;
    } = {},
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  name: string;
              }[];
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/apps/${QS.query(
            QS.explode({
                org,
            })
        )}`,
        {
            ...opts,
        }
    );
}
/**
 * Get application
 */
export function getApplication(name: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  name: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/apps/${encodeURIComponent(name)}`, {
        ...opts,
    });
}
/**
 * Delete application
 */
export function deleteApplication(name: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 204;
              data: {};
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/apps/${encodeURIComponent(name)}`, {
        ...opts,
        method: "DELETE",
    });
}
/**
 * Create node
 */
export function postAppsByAppNodes(
    app: string,
    body: {
        chain: string;
        contractAddress: string;
        machineSnapshot: string;
        region: string;
        runtime: string;
    },
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 201;
              data: {
                  app: string;
                  chain: string;
                  contractAddress: string;
                  machineSnapshot: string;
                  status: "STARTING" | "READY" | "FAILED";
                  region: string;
                  runtime: string;
              };
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/apps/${encodeURIComponent(app)}/nodes/`,
        oazapfts.json({
            ...opts,
            method: "POST",
            body,
        })
    );
}
/**
 * List nodes
 */
export function getAppsByAppNodes(app: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  app: string;
                  chain: string;
                  contractAddress: string;
                  machineSnapshot: string;
                  status: "STARTING" | "READY" | "FAILED";
                  region: string;
                  runtime: string;
              }[];
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/apps/${encodeURIComponent(app)}/nodes/`, {
        ...opts,
    });
}
/**
 * Get node
 */
export function getAppsByAppNodesAndChain(
    app: string,
    chain: string,
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  app: string;
                  chain: string;
                  contractAddress: string;
                  machineSnapshot: string;
                  status: "STARTING" | "READY" | "FAILED";
                  region: string;
                  runtime: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/apps/${encodeURIComponent(app)}/nodes/${encodeURIComponent(chain)}`, {
        ...opts,
    });
}
/**
 * Delete node
 */
export function deleteAppsByAppNodesAndChain(
    app: string,
    chain: string,
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 204;
              data: {};
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/apps/${encodeURIComponent(app)}/nodes/${encodeURIComponent(chain)}`, {
        ...opts,
        method: "DELETE",
    });
}
/**
 * Login
 */
export function login(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  email: string;
                  subscription?: {
                      url: null | string;
                  };
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >("/auth/login", {
        ...opts,
        method: "POST",
    });
}
/**
 * List supported chains
 */
export function getChains(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: {
            id: number;
            name: string;
            label: string;
            testnet: boolean;
            enabled: boolean;
        }[];
    }>("/chains/", {
        ...opts,
    });
}
/**
 * Create contract
 */
export function createContract(
    body: {
        chain: string;
        address: string;
        templateHash: string;
    },
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 201;
              data: {
                  id: string;
                  chain: string;
                  address: string;
                  templateHash: string;
              };
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        "/contracts/",
        oazapfts.json({
            ...opts,
            method: "POST",
            body,
        })
    );
}
/**
 * List contracts
 */
export function listContracts(
    {
        chain,
    }: {
        chain?: string;
    } = {},
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  id: string;
                  chain: string;
                  address: string;
                  templateHash: string;
              }[];
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/contracts/${QS.query(
            QS.explode({
                chain,
            })
        )}`,
        {
            ...opts,
        }
    );
}
/**
 * Get contract
 */
export function getContract(id: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  id: string;
                  chain: string;
                  address: string;
                  templateHash: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/contracts/${encodeURIComponent(id)}`, {
        ...opts,
    });
}
/**
 * Delete contract
 */
export function deleteContract(id: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 204;
              data: {};
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/contracts/${encodeURIComponent(id)}`, {
        ...opts,
        method: "DELETE",
    });
}
/**
 * Create organization
 */
export function createOrganization(
    body: {
        name: string;
        slug: string;
    },
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 201;
              data: {
                  name: string;
                  slug: null | string;
              };
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        "/orgs/",
        oazapfts.json({
            ...opts,
            method: "POST",
            body,
        })
    );
}
/**
 * List organizations
 */
export function listOrganizations(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  name: string;
                  slug: null | string;
              }[];
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >("/orgs/", {
        ...opts,
    });
}
/**
 * Get organization
 */
export function getOrganization(slug: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  name: string;
                  slug: null | string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/orgs/${encodeURIComponent(slug)}`, {
        ...opts,
    });
}
/**
 * Delete organization
 */
export function deleteOrganization(slug: string, opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<
        | {
              status: 204;
              data: {};
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/orgs/${encodeURIComponent(slug)}`, {
        ...opts,
        method: "DELETE",
    });
}
/**
 * Invite user to organization
 */
export function postOrgsBySlugInvites(
    slug: string,
    body: {
        email: string;
    },
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 201;
              data: {
                  email: string;
              };
          }
        | {
              status: 400;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/orgs/${encodeURIComponent(slug)}/invites/`,
        oazapfts.json({
            ...opts,
            method: "POST",
            body,
        })
    );
}
/**
 * List invites
 */
export function getOrgsBySlugInvites(
    slug: string,
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  email: string;
              }[];
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(`/orgs/${encodeURIComponent(slug)}/invites/`, {
        ...opts,
    });
}
/**
 * Get invite
 */
export function getOrgsBySlugInvitesAndEmail(
    slug: string,
    email: string,
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 200;
              data: {
                  email: string;
              };
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/orgs/${encodeURIComponent(slug)}/invites/${encodeURIComponent(
            email
        )}`,
        {
            ...opts,
        }
    );
}
/**
 * Cancel invite
 */
export function deleteOrgsBySlugInvitesAndEmail(
    slug: string,
    email: string,
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<
        | {
              status: 204;
              data: {};
          }
        | {
              status: 401;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
        | {
              status: 404;
              data: {
                  statusCode: number;
                  error: string;
                  message: string;
              };
          }
    >(
        `/orgs/${encodeURIComponent(slug)}/invites/${encodeURIComponent(
            email
        )}`,
        {
            ...opts,
            method: "DELETE",
        }
    );
}
/**
 * List supported regions
 */
export function getRegions(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: {
            name: string;
        }[];
    }>("/regions/", {
        ...opts,
    });
}
/**
 * Docker registry authentication
 */
export function getRegistryToken(
    service: string,
    {
        clientId,
        offlineToken,
        scope,
        account,
        hostname,
        remoteAddress,
        remotePort,
    }: {
        clientId?: string;
        offlineToken?: string;
        scope?: string;
        account?: string;
        hostname?: string;
        remoteAddress?: string;
        remotePort?: number;
    } = {},
    opts?: Oazapfts.RequestOpts
) {
    return oazapfts.fetchJson<{
        status: 200;
        data: {
            token: string;
            expires_in: number;
            issued_at?: string;
            refresh_token?: string;
        };
    }>(
        `/registry/token${QS.query(
            QS.explode({
                client_id: clientId,
                offline_token: offlineToken,
                service,
                scope,
                account,
                hostname,
                remoteAddress,
                remotePort,
            })
        )}`,
        {
            ...opts,
        }
    );
}
/**
 * List supported runtimes
 */
export function getRuntimes(opts?: Oazapfts.RequestOpts) {
    return oazapfts.fetchJson<{
        status: 200;
        data: {
            name: string;
        }[];
    }>("/runtimes/", {
        ...opts,
    });
}
