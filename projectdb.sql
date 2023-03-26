DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS coupon;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_products;

CREATE TABLE orders (
  id VARCHAR(32) PRIMARY KEY,
  cpf INTEGER NOT NULL,
  freight REAL NOT NULL,
  total REAL NOT NULL,
  coupon VARCHAR(10) REFERENCES coupon(code),
  coupon_valid BOOLEAN,
  date datetime default (STRFTIME('%Y-%m-%d', 'NOW')),
  serial_number text NOT NULL
);

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
  expiry datetime NOT NULL
);


CREATE TABLE order_products (
  id_order VARCHAR(32) NOT NULL REFERENCES orders(id),
  id_product INTEGER NOT NULL REFERENCES product(id),
  qty INTEGER NOT NULL CHECK(qty > 0),
  price Number NOT NULL CHECK(qty > 0),
  -- FOREIGN KEY (id_order) REFERENCES orders(id),
  -- FOREIGN KEY (id_product) REFERENCES product(id),
  CONSTRAINT fk_order_products_unique UNIQUE (id_order, id_product)
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
