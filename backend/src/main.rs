mod utils;
mod routes;
mod runner;

use std::{net::SocketAddr, sync::Arc};

use axum::{routing, Router};
use libsql::Database;
use utils::create_db;

const TIMEOUT: u64 = 100;
const POOL_SIZE: u32 = 100;
const HEAP_LIMITS: (usize, usize) = (1000000, 2000000);

struct AppState {
	db: Database
}

#[tokio::main]
async fn main() {
	runner::init_ejecutor();
	tracing_subscriber::fmt::init();

	let db = create_db().await;

	let shared_app_state = Arc::new(AppState { db });

	let app = Router::new()
		.route("/runner", routing::get(routes::runner_get))
		.route("/runner", routing::post(routes::runner_post))
		.with_state(shared_app_state);

	let port = std::env::var("PORT").unwrap_or("8080".to_string());
	let port = port.parse::<u16>().unwrap();

	serve(app, port).await;
}

async fn serve(app: Router, port: u16) {
	let addr = SocketAddr::from(([127, 0, 0, 1], port));
	let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
	axum::serve(listener, app).await.unwrap();
}
