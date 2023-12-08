import { components, paths } from "./openapi.js";

export type Application = components["schemas"]["Application"];
export type ApplicationStatus = components["schemas"]["ApplicationStatus"];

export type ApplicationListRequestQuery =
    paths["/applications"]["get"]["parameters"]["query"];
export type ApplicationListResponseBody =
    paths["/applications"]["get"]["responses"]["200"]["content"]["application/json"];

export type ApplicationGetItemRequestParams =
    paths["/applications/{address}"]["get"]["parameters"]["path"];
export type ApplicationGetItemResponseBody =
    | paths["/applications/{address}"]["get"]["responses"]["200"]["content"]["application/json"]
    | paths["/applications/{address}"]["get"]["responses"]["400"]["content"]["application/json"]
    | paths["/applications/{address}"]["get"]["responses"]["404"]["content"]["application/json"];

export type ApplicationPutItemRequestParams =
    paths["/applications/{address}"]["put"]["parameters"]["path"];
export type ApplicationPutItemRequestBody =
    paths["/applications/{address}"]["put"]["requestBody"]["content"]["application/json"];
export type ApplicationPutItemResponseBody =
    | paths["/applications/{address}"]["put"]["responses"]["200"]["content"]["application/json"]
    | paths["/applications/{address}"]["put"]["responses"]["400"]["content"]["application/json"]
    | paths["/applications/{address}"]["put"]["responses"]["409"]["content"]["application/json"];

export type ApplicationDeleteItemRequestParams =
    paths["/applications/{address}"]["delete"]["parameters"]["path"];
export type ApplicationDeleteItemResponseBody =
    | paths["/applications/{address}"]["delete"]["responses"]["202"]["content"]["application/json"]
    | paths["/applications/{address}"]["delete"]["responses"]["204"]["content"]["application/json"]
    | paths["/applications/{address}"]["delete"]["responses"]["400"]["content"]["application/json"]
    | paths["/applications/{address}"]["delete"]["responses"]["404"]["content"]["application/json"];
