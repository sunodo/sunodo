"use client";
import { UnixFS } from "@helia/unixfs";
import { UnixFSEntry } from "ipfs-unixfs-exporter";
import { CID } from "multiformats/cid";
import { useEffect, useState } from "react";
import { Hash, bytesToHex } from "viem";

import { useHelia } from "./helia";

export type CartesiMachineEntry = Pick<
    UnixFSEntry,
    "cid" | "depth" | "name" | "path" | "size" | "type"
>;

export type CartesiMachineData = {
    loading: boolean;
    location?: string;
    error?: string;
    hash?: Hash;
    entries: CartesiMachineEntry[];
};

const hexFetch = async (fs: UnixFS, cid: CID): Promise<Hash | undefined> => {
    for await (const buf of fs.cat(cid, { length: 32 })) {
        return bytesToHex(buf, { size: 32 });
    }
    return;
};

const carFetch = async (fs: UnixFS, cid: CID): Promise<UnixFSEntry[]> => {
    const entries: UnixFSEntry[] = [];
    for await (const entry of fs.ls(cid)) {
        entries.push(entry);
    }
    return entries;
};

const safeParseCID = (str: string): CID | undefined => {
    try {
        return CID.parse(str);
    } catch (e) {
        return;
    }
};

export const useCartesiMachine = (cidString: string): CartesiMachineData => {
    const { fs } = useHelia();
    const [data, setData] = useState<CartesiMachineData>({
        entries: [],
        loading: false,
    });

    useEffect(() => {
        if (cidString && fs) {
            const cid = safeParseCID(cidString);
            if (!cid) {
                setData({ entries: [], error: "Invalid CID", loading: false });
                return;
            }
            setData({ entries: [], loading: true });
            carFetch(fs, cid)
                .then((entries) => {
                    const hashEntry = entries.find(
                        ({ name }) => name === "hash",
                    );
                    if (hashEntry) {
                        hexFetch(fs, hashEntry.cid)
                            .then((hash) => {
                                setData({
                                    entries,
                                    error: undefined,
                                    hash,
                                    loading: false,
                                    location: cidString,
                                });
                            })
                            .catch((error) => {
                                const message =
                                    error instanceof Error
                                        ? error.message
                                        : "Unknown IPFS error while reading hash";
                                setData({
                                    entries: [],
                                    error: message,
                                    loading: false,
                                });
                            });
                        return;
                    } else {
                        setData({
                            entries,
                            loading: false,
                            location: cidString,
                        });
                    }
                })
                .catch((error) => {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Unknown IPFS error";
                    setData({ entries: [], error: message, loading: false });
                });
        }
    }, [cidString, fs]);

    return data;
};
