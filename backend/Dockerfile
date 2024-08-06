FROM debian:bookworm-slim AS runtime

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY ./target/release/v8-function-runner /usr/local/bin

ENTRYPOINT ["/usr/local/bin/v8-function-runner"]