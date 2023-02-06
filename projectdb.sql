DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS coupon;

CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(200) NOT NULL,
  price Number NOT NULL
);

CREATE TABLE coupon (
  code VARCHAR(10) PRIMARY KEY NOT NULL,
  percentage Number NOT NULL
);

insert into product (description, price) values ('lencol', 10);
insert into product (description, price) values ('toalha', 25);
insert into product (description, price) values ('fronha', 12);


insert into coupon (code, percentage) values ('VALE10', 10);
insert into coupon (code, percentage) values ('INVALID-1', -1);
insert into coupon (code, percentage) values ('INVALID101', 101);
