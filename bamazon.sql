DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
  id INT NOT NULL
  AUTO_INCREMENT,
item_id VARCHAR
  (30),
product_name VARCHAR
  (30),
department_name VARCHAR
  (30),
price INT,
stock_quantity INT,
PRIMARY KEY
  (id)
);

  INSERT INTO products
    (item_id, product_name, department_name, price, stock_quantity)
  VALUES
    ("2352", "Laptop", "Electronics", 700, 26),
    ("1902", "Acoustic Guitar", "Instruments", 1200, 4),
    ("0832", "Bike", "Sporting Goods", 400, 124),
    ("1475", "Golf Club", "Sporting Goods", 209, 32),
    ("2362", "Tires", "Automotive", 240, 49),
    ("7895", "Flat Screen TV", "Electronics", 1499, 23),
    ("1328", "Jeans", "Clothing", 32, 93),
    ("8391", "Diapers", "Baby", 24, 202),
    ("8745", "Dog Food", "Pets", 30, 637),
    ("9278", "Cat Food", "Pets", 2, 1234);

  SELECT *
  FROM products

