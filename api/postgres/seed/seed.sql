insert into users (name, email, entries, joined)
values ('mike', 'mike@gmail.com', 0, '2016-02-01');

insert into login (hash, email)
values ('$2a$10$ZUzvVsrHDe5L5eP2OC0i5.48yjzhVL7E0wgx7VL5DMyE7xd13eLoS', 'mike@gmail.com')
--hashed password is "password"