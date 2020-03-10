var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  password: 'B0otcamp!',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  showProducts();
  end();
});

//END
function end() {
  console.log('Thank you for stopping in! Goodbye.');
  connection.end();
}

//BUY PRODUCTS
function showProducts() {
  console.log(`\nHere's what we have for sale today!\n`);
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    data = [];
    let obj = {};

    res.forEach((element, idx) => {
      obj = {};
      obj['Item ID'] = element.item_id;
      obj['Product Name'] = element.product_name;
      obj['Price'] = element.price;
      data.push(obj);
    });
    console.table(data);
  });
}
