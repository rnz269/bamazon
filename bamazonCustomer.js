var mysql = require("mysql");
var inquirer = require("inquirer");

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
		console.log("connected as id " + connection.threadId);
	}
});

function viewProducts() {
var sqlStatement = "SELECT * FROM products";
	
connection.query(sqlStatement, function(error, response) {
	if(error) {
		console.log(error);
	} else {
		console.log(response);
		takeOrder();
	}
})
};

function takeOrder() {
inquirer.prompt([
{
	name: "id",
	message: "Enter the ID of the product you would like to purchase",
	type: "input"
},
{
	name: "quantity",
	message: "Enter the quantity you would like to purchase",
	type: "input"
}
]).then(function(answers) {
	var sqlCheckProduct = "SELECT * FROM products WHERE item_id = ?";
	connection.query(sqlCheckProduct, [answers.id], function(error, response) {
		if(error) {
			console.log(error);
		} else {
			if (answers.quantity > response[0].stock_quantity) {
				console.log("Insufficient quantity!");
			} else {
				// Subtract the quantity remaining in SQL database
				var sqlReduceQuantity = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
				connection.query(sqlReduceQuantity,[answers.quantity, answers.id], function(error, response){
					if(error) {
						console.log(error);
					} else {
						// console.log(response);
					}
				})
				console.log("The total cost of your order was: " + answers.quantity * response[0].price);
			}
		}
	})
})
};

viewProducts();
