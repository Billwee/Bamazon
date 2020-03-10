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
  order();
});

//END
function end() {
  console.log('Thank you for stopping in! Goodbye.');
  connection.end();
}

//BUY PRODUCTS
function showProducts() {
  connection.query('SELECT * FROM products', function(err, res) {
    console.log(`\nHere's what we have for sale today!\n`);
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

//ORDER PRODUCTS
function order() {
  connection.query('SELECT item_id FROM products', function(err, res) {
    if (err) throw err;
    // console.log(res);
    inquirer
      .prompt([
        {
          name: 'buy',
          message:
            "Please enter the Item ID of the item you want ot purchase\n Type 'End' to not buy anything\n\n",
          validate: function(input) {
            let match = false;
            if (input.toLowerCase() === 'end') {
              return true;
            }
            res.forEach(element => {
              if (input === element.item_id) {
                match = true;
              }
            });
            return match;
          }
        }
      ])
      .then(answers => {
        if (answers.buy.toLowerCase() === 'end') {
          return end();
        }
        end();
      });
  });

  //   {
  //     type: 'number',
  //     name: 'quantity',
  //     message: 'How many would you like to buy?'
  //   }
  // ])
  // .then(answers => {
  //   if answers
  //   connection.query('SELECT * FROM products', function(err, res) {
  //     if (err) throw err;

  //     res.forEach((element, idx) => {
  //       element.item_id;
  //       obj['Product Name'] = element.product_name;
  //       obj['Price'] = element.price;
  //       data.push(obj);
  //     });
  //     console.table(data);
  // });
  // });
}
