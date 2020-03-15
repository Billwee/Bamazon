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

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  menu();
});

//END
function end() {
  console.log('\nLOGGING OUT AS MANAGER\n');
  connection.end();
}

function menu() {
  inquirer
    .prompt([
      {
        name: 'selection',
        type: 'list',
        message: `\n     ***MANAGER MENU***\n`,
        choices: [
          '1) View Products for Sale',
          '2) View Low Inventory',
          '3) Add to Inventory',
          '4) Add New Product'
        ]
      }
    ])
    .then(answers => {
      let x = answers.selection.charAt(0);
      console.log(x);
      switch (x) {
        case '1':
          showProducts();
          break;
        case '2':
        //do something
      }
    });
}

function showProducts() {
  connection.query('SELECT * FROM products', function(err, res) {
    console.log(`\nViewing products for sale.\n`);
    if (err) throw err;

    var table = new Table({
      head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
    });
    res.forEach(element => {
      table.push([
        element.item_id,
        element.product_name,
        element.price,
        element.stock_quantity
      ]);
    });

    console.log(table.toString());

    inquirer
      .prompt([
        {
          name: 'confirm',
          type: 'confirm',
          message: '\nWould you like to return to the main menu?',
          default: true
        }
      ])
      .then(answer => {
        if (answer.confirm) {
          menu();
        } else {
          end();
        }
      });
  });
}
