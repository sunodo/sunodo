ARG SUNODO_ANVIL_VERSION=3.0.0
FROM sunodo/anvil:${SUNODO_ANVIL_VERSION}

WORKDIR /usr/share/sunodo
COPY entrypoint.sh /
COPY build/anvil_state.json .
COPY export/abi/localhost.json .

ENTRYPOINT ["/entrypoint.sh"]
CMD ["anvil", "--load-state", "/usr/share/sunodo/anvil_state.json"]
