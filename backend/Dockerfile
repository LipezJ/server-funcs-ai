FROM rustlang/rust:nightly as builder

WORKDIR /usr/src/app

COPY . .

RUN rustup default nightly

RUN cargo build --release

FROM debian:buster-slim

RUN useradd -m appuser

WORKDIR /home/appuser

COPY --from=builder /usr/src/app/target/release/v8-function-runner .

RUN chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 3000
ENV PORT 3000

CMD ["./v8-function-runner"]
