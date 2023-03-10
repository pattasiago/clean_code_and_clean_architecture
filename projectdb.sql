DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS coupon;

CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(200) NOT NULL,
  price Number NOT NULL,
  height Number NOT NULL,
  width Number NOT NULL,
  depth Number NOT NULL,
  weight Number NOT NULL,
  currency VARCHAR(3) NOT NULL
);

CREATE TABLE coupon (
  code VARCHAR(10) PRIMARY KEY NOT NULL,
  percentage NUMBER NOT NULL,
  expiry REAL NOT NULL
);

insert into product (description, price, height, width, depth, weight, currency) values ('camera', 10, 20, 15, 10, 1, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('guitarra', 25, 100, 30, 10, 3, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('geladeira', 12, 200, 100, 50, 40, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('invalid weight', 12, 5, 32, 21, -5, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('invalid depth', 12, 5, 32, -21, 5, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('invalid width', 12, 5, -32, 21, 5, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('invalid height', 12, -5, 32, 21, 5, "BRL");
insert into product (description, price, height, width, depth, weight, currency) values ('geladeira em dolar', 12, 200, 100, 50, 40, "USD");


insert into coupon (code, percentage, expiry) values ('VALE10', 10,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('INVALID-1', -1,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('INVALID101', 101,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('EXPIRED', 15,  DATE('now','-1 day'));
