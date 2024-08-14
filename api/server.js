const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const app = express();
dotenv.config();

//database variables
const databaseName = "week5_revision";
const usersTB = "Users";
const expenseTB = "Expenses";
const expenseCategories = "categories";

//create middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//create database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err)=>{
    if(err) return console.log(err);
    console.log("Database connected");
    database();
});

//create database
const database = ()=>{
  const createDb = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  db.query(createDb, (err, result)=>{
    if(err) return console.log(err);
    console.log("database has been created ", result);
    useDb();
  });
};

//use database 
const useDb = ()=>{
    const useDatabase = `USE ${databaseName}`;
    db.query(useDatabase, (err)=>{
        if(err) return console.log(err);
        console.log('database changed...');
        usersTable();
        expensesTable();
    });
};

//create users Table
const usersTable = ()=>{
    const userDetails = `CREATE TABLE IF NOT EXISTS ${usersTB} (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(200) NOT NULL UNIQUE, 
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) `;
     db.query(userDetails, (err, result)=>{
        if(err) return console.log(err);
        console.log(`${usersTB} table has been created`);
     });
};


const expensesTable = ()=>{
  const expenseDetails = `CREATE TABLE IF NOT EXISTS ${expenseTB} (
  expense_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  category_id INT,
  amount DECIMAL(10,2) NOT NULL, 
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY(user_id) REFERENCES ${usersTB}(user_id),
  FOREIGN KEY(category_id) REFERENCES  ${expenseCategories}(category_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  // query
  db.query(expenseDetails, (err, result)=>{
    if(err) return console.log(err);
    console.log('expenses Table created succuessfully');
  });
};


//create categories table
const categoriesTable = ()=>{
  const categories = `CREATE TABLE IF NOT EXISTS ${expenseCategories} (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  category_name VARCHAR(150) NOT NULL, 
  FOREIGN KEY(user_id) REFERENCES ${usersTB}(user_id),
  )`;
};