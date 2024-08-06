FROM debian:bookworm-slim AS runtime

COPY ./target/release/v8-function-runner /usr/local/bin

ENTRYPOINT ["/usr/local/bin/v8-function-runner"]