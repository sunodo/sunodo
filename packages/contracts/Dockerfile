FROM scratch

WORKDIR /opt/cartesi/share/deployments

# copy deployments of testnets from cartesi/deployments
# TODO: when we deploy sunodo's contracts to testnets we will change this
COPY --from=cartesi/deployments:0.9.0 /opt/cartesi/share/deployments .

# copy deployment of localhost
COPY ./export/abi/localhost.json .

# copy anvil dumped state
COPY ./build/anvil_state.json .
