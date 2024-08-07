FROM rust:latest as builder

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev \
    pkg-config

RUN rustup default nightly

# Define el directorio de trabajo
WORKDIR /usr/src/myapp

COPY . .

# Define el directorio de trabajo dentro del proyecto
WORKDIR /usr/src/myapp/backend

RUN cargo build --release

# Runtime Stage
FROM ubuntu:22.04

# Instala dependencias mínimas necesarias
RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*
# Configura la zona horaria
ENV TZ=Etc/UTC

RUN useradd -m appuser

COPY --from=builder /usr/src/myapp/backend/target/release/v8-function-runner /usr/local/bin/server

USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["/usr/local/bin/server"]
