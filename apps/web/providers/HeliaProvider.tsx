import { unixfs, UnixFS } from "@helia/unixfs";
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createHelia, Helia } from "helia";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";

export type HeliaContextType = {
    helia: Helia | null;
    fs: UnixFS | null;
    error: boolean;
    starting: boolean;
};

export const HeliaContext = createContext<HeliaContextType>({
    helia: null,
    fs: null,
    error: false,
    starting: true,
});

export const HeliaProvider = ({ children }: { children: ReactNode }) => {
    const [helia, setHelia] = useState<Helia | null>(null);
    const [fs, setFs] = useState<UnixFS | null>(null);
    const [starting, setStarting] = useState(true);
    const [error, setError] = useState(false);

    const startHelia = useCallback(async () => {
        if (helia) {
            console.info("helia already started");
        } else if (window.helia) {
            console.info("found a windowed instance of helia, populating ...");
            setHelia(window.helia);

            // Type error below:
            // Argument of type null is not assignable to parameter of type Blockstore
            setFs(unixfs(window.helia));
            setStarting(false);
        } else {
            try {
                console.info("starting helia");
                const blockstore = new IDBBlockstore("helia-blocks");
                const datastore = new IDBDatastore("helia-data");

                await Promise.all([blockstore.open(), datastore.open()]);
                const helia = await createHelia({ blockstore, datastore });
                setHelia(helia);
                setFs(unixfs(helia));
                setStarting(false);
            } catch (e) {
                console.error(e);
                setError(true);
            }
        }
    }, []);

    useEffect(() => {
        startHelia();
    }, []);

    return (
        <HeliaContext.Provider
            value={{
                helia,
                fs,
                error,
                starting,
            }}
        >
            {children}
        </HeliaContext.Provider>
    );
};
