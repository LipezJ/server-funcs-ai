CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT,
  image TEXT
);

CREATE TABLE session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE functions (
  func_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT 'async function handler() {return "Hello"};handler;',
  type TEXT NOT NULL DEFAULT 'json',
  FOREIGN KEY (user_id) REFERENCES user(id)
);
