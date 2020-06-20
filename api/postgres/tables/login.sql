BEGIN TRANSACTION;

CREATE TABLE login (
	id serial NOT NULL,
	hash varchar(100) NOT NULL,
	email text NOT NULL,
	CONSTRAINT login_pkey PRIMARY KEY (id),
	CONSTRAINT login_un UNIQUE (email)
);

COMMIT;