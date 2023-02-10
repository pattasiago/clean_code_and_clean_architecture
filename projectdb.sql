DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS coupon;

CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(200) NOT NULL,
  price Number NOT NULL,
  height Number NOT NULL,
  width Number NOT NULL,
  depth Number NOT NULL,
  weight Number NOT NULL
);

CREATE TABLE coupon (
  code VARCHAR(10) PRIMARY KEY NOT NULL,
  percentage NUMBER NOT NULL,
  expiry REAL NOT NULL
);

insert into product (description, price, height, width, depth, weight) values ('camera', 10, 20, 15, 10, 1);
insert into product (description, price, height, width, depth, weight) values ('guitarra', 25, 100, 30, 10, 3);
insert into product (description, price, height, width, depth, weight) values ('geladeira', 12, 200, 100, 50, 40);
insert into product (description, price, height, width, depth, weight) values ('invalid weight', 12, 5, 32, 21, -5);
insert into product (description, price, height, width, depth, weight) values ('invalid depth', 12, 5, 32, -21, 5);
insert into product (description, price, height, width, depth, weight) values ('invalid width', 12, 5, -32, 21, 5);
insert into product (description, price, height, width, depth, weight) values ('invalid height', 12, -5, 32, 21, 5);


insert into coupon (code, percentage, expiry) values ('VALE10', 10,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('INVALID-1', -1,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('INVALID101', 101,  DATE('now','+1 day'));
insert into coupon (code, percentage, expiry) values ('EXPIRED', 15,  DATE('now','-1 day'));
