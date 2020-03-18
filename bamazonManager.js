var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

process.setMaxListeners(50);

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

function returnQuestion() {
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
      switch (x) {
        case '1':
          showProducts();
          break;
        case '2':
          lowInventory();
          break;
        case '3':
          addInventory();
          break;
        case '4':
          addProduct();
      }
    });
}

function showProducts() {
  connection
    .query('SELECT * FROM products', function(err, res) {
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
    })
    .on('end', function() {
      returnQuestion();
    });
}

function lowInventory() {
  connection
    .query('SELECT * FROM products WHERE stock_quantity < 6', function(
      err,
      res
    ) {
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
    })
    .on('end', function() {
      returnQuestion();
    });
}

function addInventory() {
  let newTotal;
  connection.query('SELECT * FROM products', function(err, res) {
    inquirer
      .prompt([
        {
          name: 'selection',
          message: 'Enter Item ID of product',
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
        },
        {
          name: 'quantity',
          type: 'number',
          message: 'How many would you like to add?'
        }
      ])
      .then(answer => {
        connection
          .query(
            `SELECT * FROM products WHERE item_id = ${answer.selection}`,
            function(err, res) {
              newTotal = res[0].stock_quantity + answer.quantity;
              connection.query(
                `UPDATE products SET stock_quantity = ${newTotal} WHERE item_id = ${answer.selection}`,
                function(err, res) {}
              );
            }
          )
          .on('end', function() {
            console.log(
              `\nStock quantity of item #${answer.selection} is now ${newTotal}\n`
            );
            returnQuestion();
          });
      });
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'item_id',
        message: 'Enter new product Item ID number'
      },
      {
        name: 'product_name',
        message: 'Enter the new product name'
      },
      {
        name: 'department_name',
        message: 'Enter the department of new product '
      },
      {
        name: 'price',
        type: 'number',
        message: 'Enter the new product price'
      },
      {
        name: 'stock_quantity',
        type: 'number',
        message: 'Enter the stock quantity of new product'
      }
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO products SET ?',
        {
          item_id: parseInt(answer.item_id),
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: parseInt(answer.price),
          stock_quantity: parseInt(answer.stock_quantity)
        },
        function(err, res) {
          if (err) throw err;
          showProducts();
        }
      );
    });
}
