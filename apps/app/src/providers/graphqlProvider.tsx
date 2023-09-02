import { FC } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

export type GraphQLProviderProps = {
    children?: React.ReactNode;
};

const GraphQLProvider: FC<GraphQLProviderProps> = (props) => {
    // TODO: change according to selected chain
    const client = new Client({
        url: "http://localhost:4350/graphql",
        exchanges: [cacheExchange, fetchExchange],
    });
    return <Provider value={client}>{props.children}</Provider>;
};

export default GraphQLProvider;
