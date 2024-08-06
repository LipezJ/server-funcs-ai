FROM rustlang/rust:nightly as builder

WORKDIR /usr/src/app

COPY . .

RUN rustup default nightly

RUN cargo build --release

FROM ubuntu:22.04

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser

WORKDIR /home/appuser

COPY --from=builder /usr/src/app/target/release/v8-function-runner .

RUN chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 8080
ENV PORT 8080

CMD ["./v8-function-runner"]
