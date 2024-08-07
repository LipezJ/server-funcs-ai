mod utils;
mod routes;
mod runner;

use std::{net::SocketAddr, sync::Arc};
use dotenv::dotenv;
use axum::{http::Method, routing, Router};
use libsql::Database;
use utils::create_db;
use tower_http::cors::{CorsLayer, Any};

const TIMEOUT: u64 = 100;
const POOL_SIZE: u32 = 100;
const HEAP_LIMITS: (usize, usize) = (1000000, 2000000);

struct AppState {
	db: Database
}

#[tokio::main]
async fn main() {
	dotenv().ok();
	runner::init_ejecutor();
	tracing_subscriber::fmt::init();

	let db = create_db().await;

	let shared_app_state = Arc::new(AppState { db });

	let cors = CorsLayer::new()
    .allow_methods(vec![Method::GET, Method::POST])
		.allow_headers(Any)
    .allow_origin(Any);

	let app = Router::new()
		.route("/runner", routing::get(routes::runner_get))
		.route("/runner", routing::post(routes::runner_post))
		.with_state(shared_app_state)
		.layer(cors);

	let port = std::env::var("PORT").unwrap_or("8080".to_string());
	let port = port.parse::<u16>().unwrap();

	println!("Listening on port {}", port);
	serve(app, port).await;
	println!("Server stopped");
}

async fn serve(app: Router, port: u16) {
	let addr = SocketAddr::from(([0, 0, 0, 0], port));
	let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
	axum::serve(listener, app).await.unwrap();
}
