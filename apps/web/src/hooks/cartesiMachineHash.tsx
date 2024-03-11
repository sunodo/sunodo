"use client";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";
import { Hash, toHex } from "viem";

export type CarEntry = {
    path: string;
    cid: string;
    size: number;
};

export type CartesiMachineData = {
    loading: boolean;
    location?: string;
    error?: string;
    hash?: Hash;
    entries: CarEntry[];
};

const publicGateway = "https://ipfs.io";

const hexFetcher: Fetcher<Hash, string> = (path: string) =>
    fetch(`${publicGateway}/ipfs/${path}`)
        .then((res) => res.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer))
        .then((bytes) => toHex(bytes));

const carFetcher: Fetcher<CarEntry[], string> = (cid: string) =>
    fetch(`${publicGateway}/ipfs/${cid}?format=dag-json`)
        .then((res) => res.json())
        .then((json) =>
            json.Links.map((link: any) => ({
                cid: link.Hash["/"],
                path: link.Name,
                size: link.Tsize,
            })),
        );

export const useCartesiMachine = (cid: string): CartesiMachineData => {
    const {
        data: entries,
        error: carError,
        isLoading: entriesLoading,
    } = useSWRImmutable(cid, carFetcher);
    const {
        data: hash,
        error: hashError,
        isLoading: hashLoading,
    } = useSWRImmutable(`${cid}/hash`, hexFetcher);

    return {
        loading: hashLoading || entriesLoading,
        location: cid,
        hash: cid ? hash : undefined,
        entries: entries || [],
        error: hashError || carError,
    };
};
