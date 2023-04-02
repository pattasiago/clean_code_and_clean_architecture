drop table IF EXISTS item;
drop table IF EXISTS orders;
drop table IF EXISTS coupon;
drop table IF EXISTS product;

create table product (
	id_product integer,
	description text,
	price numeric,
	width integer,
	height integer,
	length integer,
	weight numeric,
	currency text
);

insert into product (id_product, description, price, width, height, length, weight, currency) values (1, 'A', 1000, 100, 30, 10, 3, 'BRL');
insert into product (id_product, description, price, width, height, length, weight, currency) values (2, 'B', 5000, 50, 50, 50, 22, 'BRL');
insert into product (id_product, description, price, width, height, length, weight, currency) values (3, 'C', 30, 10, 10, 10, 0.9, 'BRL');
insert into product (id_product, description, price, width, height, length, weight, currency) values (4, 'D', 30, -10, 10, 10, 0.9, 'BRL');
insert into product (id_product, description, price, width, height, length, weight, currency) values (5, 'A', 1000, 100, 30, 10, 3, 'USD');

create table coupon (
	code text,
	percentage numeric,
	expire_date timestamp
);

insert into coupon (code, percentage, expire_date) values ('VALE20', 20, '2023-10-01T10:00:00');
insert into coupon (code, percentage, expire_date) values ('VALE10', 10, '2022-10-01T10:00:00');

create table orders (
	id_order text,
	cpf text,
	code text,
	total numeric,
	freight numeric
);

create table item (
	id_order text,
	id_product integer,
	price numeric,
	quantity integer
);
