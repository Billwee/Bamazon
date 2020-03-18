var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  password: 'B0otcamp!',
  database: 'bamazon'
});

// After connecting, showProducts and order functions are ran.
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  showProducts();
  order();
});

//This function closes the connection
function end() {
  console.log('Thank you for stopping in! Goodbye.');
  connection.end();
}

// This function queries the database and returns a table of the
// products using the cli-table package. I didn't like how
// console.table() adds an index column, so i went with cli-table.
function showProducts() {
  connection.query('SELECT * FROM products', function(err, res) {
    console.log(`\nHere's what we have for sale today!\n`);
    if (err) throw err;

    var table = new Table({
      head: ['Item ID', 'Product Name', 'Price']
    });
    res.forEach(element => {
      table.push([element.item_id, element.product_name, element.price]);
    });

    console.log(table.toString());
  });
}

// This function uses inquirer to take the item number and quantity inputs
// from the user. If the user types 'End" the end function is called and
// the connection is closed. The item ID input also has a validation which
// will only let the user enter a valid item ID before asking for a quantity.
// Once both are entered, the database is queried and tells the user too many
// units were requested if the enter more than the stock quantity. If not then
// they're thanked for their purchase, told how much they spent and the
// database is updated. Either way the showProducts and order functions are called
// again after 5 seconds.
function order() {
  connection.query('SELECT item_id FROM products', function(err, res) {
    var item;
    if (err) throw err;
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
        item = answers.buy;
        inquirer
          .prompt([
            {
              type: 'number',
              name: 'quantity',
              message: 'How many would you like to buy?'
            }
          ])
          .then(answers2 => {
            connection.query(
              `SELECT * FROM products WHERE item_id = ${item}`,
              function(err, res) {
                if (answers2.quantity > res[0].stock_quantity) {
                  console.log(
                    `\nSorry, There are only ${res[0].stock_quantity} of those left. Please try again`
                  );
                  setTimeout(function() {
                    return showProducts(), order();
                  }, 3000);
                } else {
                  let newTotal = res[0].stock_quantity - answers2.quantity;
                  connection.query(
                    `UPDATE products SET stock_quantity = ${newTotal} WHERE item_id = ${item}`,
                    function(err, res) {}
                  );
                  console.log(
                    `\nThank you for your purchase
                      \nYou spent $${res[0].price * answers2.quantity}
                      \nReturning to storefront in 5 seconds`
                  );
                  setTimeout(function() {
                    return showProducts(), order();
                  }, 5000);
                }
              }
            );
          });
      });
  });
}
