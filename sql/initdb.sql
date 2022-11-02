CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE todo (
    id UUID DEFAULT uuid_generate_v4(),
    todo_text TEXT NOT NULL,
    author TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
)