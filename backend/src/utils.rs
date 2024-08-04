use std::{fmt, str::FromStr, sync::Arc};
use libsql::{params, Builder, Database};
use serde::{de, Deserialize, Deserializer};

use crate::AppState;

pub fn empty_string_as_none<'de, D, T>(de: D) -> Result<Option<T>, D::Error>
where
	D: Deserializer<'de>,
	T: FromStr,
	T::Err: fmt::Display,
{
	let opt = Option::<String>::deserialize(de)?;
	match opt.as_deref() {
		None | Some("") => Ok(None),
		Some(s) => FromStr::from_str(s).map_err(de::Error::custom).map(Some),
	}
}

pub async fn create_db() -> Database {
	let db = Builder::new_remote(
		std::env::var("LIBSQL_URL").unwrap(), 
		std::env::var("LIBSQL_AUTH_TOKEN").unwrap()
	)
		.build()
		.await
		.unwrap();

	return db;
}
pub enum ResponseType {
	JSON,
	HTML
}

impl FromStr for ResponseType {
	type Err = String;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		match s {
			"json" => Ok(ResponseType::JSON),
			"html" => Ok(ResponseType::HTML),
			_ => Err("Invalid response type".to_string())
		}
	}
}

pub struct CodeResponseDB {
	pub code: String,
	pub response_type: ResponseType 
}

pub async fn get_code_from_db(id: String, state: Arc<AppState>) -> Result<CodeResponseDB, String> {
	let conn = state.db.connect().unwrap();

	let result = conn.query(
		"SELECT code, type from functions WHERE func_id = ?1", params![id]
	).await;

	match result {
		Ok(mut rows) => {
			let row = rows.next().await.unwrap().unwrap();

			let code: String = row.get(0).unwrap();
			let response_type: String = row.get(1).unwrap();
			let response_type = ResponseType::from_str(&response_type).unwrap();

			return Ok(CodeResponseDB { code, response_type });
		},
		Err(_) => {
			return Err("The code could not be queried in the database".to_string());
		}
	};
}
