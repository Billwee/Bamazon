# Bamazon

## Overview

I've created a storefront that is accessed separately by Customers and Management. Customers can check out products and make purchases which will deplete the quantity of the item. While Management can check inventory, add inventory, and add new items to the store.

## Before You Begin

- You'll need to copy the contents of bamazon.sql and create a database with it

- Make sure you npm install the MySQL and Inquirer npm packages in your files

## Customer Experience

- Upon loading, the user will be shown a table of the current inventory of the store. Information includes Item ID, Product Name, and Price.

- The user is then asked to enter the Item ID of the product they wish to purchase. The app will only accept valid Item IDs.

- The user can also type "End" here to exit the store.

- Then the app asks how many they would like to purchase. If the number entered is more than the current stock of the product, the app will inform the user, tell them how many are in stock, then reload the storefront to make another purchase

## Manager Experience

- The app first loads a menu for the user to choose from

  1. View Products for Sale
  2. View Low Inventory
  3. Add to Inventory
  4. Add New Product

- After selecting the appropriate function is loaded.

- Functions do as follows:

  1.  Queries the database and loads the contents into a readable table
  2.  Queries the database and loads items which have a quantity lower than five into a table and displays it
  3.  Uses inquirer to take user input and adds inventory to the items in the database. The app will only accept item numbers that exist in the database.
  4.  Uses inquirer to take user input and load it into the database to create a new product.

  ## Video Demonstration

  You can watch an overview of the application by [Clicking Here](https://drive.google.com/file/d/1dm2BeRJXAfVoIIFvlknwkwlhSe0siIt0/view)
