mod utils;
mod routes;
mod runner;

use std::sync::Arc;

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
		.route("/runner", routing::get(routes::runner))
		.with_state(shared_app_state);

	let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
	axum::serve(listener, app).await.unwrap();
}
