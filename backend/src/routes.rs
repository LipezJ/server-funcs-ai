use std::sync::Arc;

use axum::{extract::State, response::{Html, IntoResponse}, Json};
use base64::prelude::*;
use serde::Deserialize;
use axum::extract::Query;
use serde_json::json;

use crate::{runner, AppState, TIMEOUT};
use crate::utils::{empty_string_as_none, get_code_from_db, ResponseType};

#[derive(Debug, Deserialize)]
pub struct GetFunctionParams {
	#[serde(default, deserialize_with = "empty_string_as_none")]
	props: Option<String>,
	id: String,
	decode: Option<bool>
}

#[axum::debug_handler]
pub async fn runner_get(
	Query(params): Query<GetFunctionParams>,
	State(shared_app_state): State<Arc<AppState>>
) -> impl IntoResponse {
	let id = params.id;

	let code_response = match get_code_from_db(id, shared_app_state).await {
		Ok(code) => code,
		Err(error) => return Json(json!({ "error": error })).into_response()
	};

	let args = match params.props {
		Some(mut args) => {
			if params.decode.unwrap_or(false) {
				let decode_args = BASE64_STANDARD
					.decode(args)
					.unwrap_or(b"{}".to_vec());
		
				args = String::from_utf8(decode_args).unwrap();
			}
			args
		},
		None => "{}".to_string()
	};

	match runner::run(code_response.code, args, TIMEOUT) {
		Ok(value) => {
			match code_response.response_type {
				ResponseType::JSON => Json(json!(value)).into_response(),
				ResponseType::HTML => Html(value).into_response()
			}
		},
		Err(error) => Json(json!({ "error": error })).into_response()
	}
}

#[derive(Deserialize)]
pub struct PostFunctionParams {
	id: String
}

#[axum::debug_handler]
pub async fn runner_post(
	Query(params): Query<PostFunctionParams>,
	State(shared_app_state): State<Arc<AppState>>,
	body: String
)	-> impl IntoResponse {

	let id = params.id;

	let code_response = match get_code_from_db(id, shared_app_state).await {
		Ok(code) => code,
		Err(error) => return Json(json!({ "error": error })).into_response()
	};

	match runner::run(code_response.code, body, TIMEOUT) {
		Ok(value) => {
			match code_response.response_type {
				ResponseType::JSON => Json(json!(value)).into_response(),
				ResponseType::HTML => Html(value).into_response()
			}
		},
		Err(error) => Json(json!({ "error": error })).into_response()
	}
}
