CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INTEGER(11)AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30),
	price INTEGER(11),
	stock_quantity INTEGER(11),
	PRIMARY KEY (item_id)
);

INSERT INTO products
	(product_name, department_name, price, stock_quantity) values
    ("running shoes", "footwear", 100, 15),
    ("apple watch", "technology", 300, 25),
    ("iPad Air", "technology", 400, 50),
    ("echo dot", "technology", 50, 1000), 
    ("protein powder", "nutrition", 40, 100),
    ("Astrophysics", "books", 10, 20),
    ("fruit loops", "food", 5, 100),
    ("shaving blades", "grooming", 20, 200),
    ("quest bars", "nutrition", 100, 100),
    ("light bulbs", "utilities", 10, 250);
    
    
SELECT * FROM products;

