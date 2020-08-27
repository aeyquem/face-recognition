BEGIN TRANSACTION;

CREATE TABLE users (
	id serial NOT NULL,
	"name" varchar(100) NULL,
	email text NULL,
	entries int8 NULL DEFAULT 0,
	joined timestamp NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

COMMIT;