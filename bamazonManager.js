var mysql = require("mysql");
var inquirer = require("inquirer");

var userState = {
	proxy: 0
};

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db"
});

connection.connect(function(err){
	if(err) {
		console.log(err);
	} else {
		// console.log("connected as id " + connection.threadId);
	}
});


inquirer.prompt([
{
	name: "choice",
	message: "Please choose what you wish to do",
	type: "list",
	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
}
]).then(function(answers) {
	if (answers.choice === "View Products for Sale") {
		viewProducts();
	} else if (answers.choice === "View Low Inventory") {
		viewLowInventory();
	} else if (answers.choice === "Add to Inventory") {
		addToInventory();
	} else if (answers.choice === "Add New Product") {
		addNewProduct();
	}
});

function viewProducts() {
var sqlStatement = "SELECT * FROM products";
	
connection.query(sqlStatement, function(error, response) {
	if(error) {
		console.log(error);
	} else {
		console.log(response);
		// If a manager selects viewProducts, I don't want the restockThisProduct function to be called. 
		// But if the manager selects addToInventory, the viewProducts will be called, triggering the restockThisProduct function to be called as desired.
		// Solved this by creating a proxy variable and using a conditional check on this proxy.
		if(userState.proxy === 1) {
			userState.proxy = 0;
			restockThisProduct();
		}
	}
})
};


function viewLowInventory() {
var sqlStatement = "SELECT * FROM products WHERE stock_quantity < ?";

connection.query(sqlStatement, [5], function(error, response) {
	if(error) {
		console.log(error);
	} else {
		console.log(response);
	}
})
};

function addToInventory() {
viewProducts();
userState.proxy = 1;
}

function restockThisProduct() {
	inquirer.prompt([
{
	name: "id",
	message: "Enter the ID of the product you would like to restock",
	type: "input"
},
{
	name: "quantity",
	message: "Enter the quantity you would like to add of this item",
	type: "input"
}
]).then(function(answers){
var sqlStatement = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
connection.query(sqlStatement, [answers.quantity, answers.id], function(error, response) {
	if(error) {
		console.log(error);
	} else {
		var sqlNewQuantity = "SELECT * FROM products WHERE item_id = ?";
		connection.query(sqlNewQuantity, [answers.id], function(error, response) {
			if(error){
				console.log(error);
			} else {
			console.log("The new quantity of that item is: " + response[0].stock_quantity);
		}
		})
		
	}
})
})
};

function addNewProduct() {
	inquirer.prompt([
{
	name: "productName",
	message: "Enter the product name of the new item",
	type: "input"
},
{
	name: "departmentName",
	message: "Enter the department name to which the product belongs",
	type: "input"
},
{
	name: "price",
	message: "Enter the price of the new product",
	type: "input"
},
{
	name: "stockQuantity",
	message: "Enter the quantity of the new product",
	type: "input"
}
]).then(function(answers){
	var newProductName = answers.productName;
	var newDepartmentName = answers.departmentName;
	var newPrice = answers.price;
	var newQuantity = answers.stockQuantity;
	// For some reason couldn't store inquirer responses into an object (newProduct)...
	// var newProduct = {answers.productName, answers.departmentName, answers.price, answers.stockQuantity}; 
	var newProduct = {product_name: newProductName, department_name: newDepartmentName, price: newPrice, stock_quantity: newQuantity};
	var sqlStatement = 'INSERT INTO products SET ?';
	connection.query(sqlStatement, newProduct, function(error, response){
		if(error){
			console.log(error);
		} else {
			console.log(response);
		}
	})
}
)};
