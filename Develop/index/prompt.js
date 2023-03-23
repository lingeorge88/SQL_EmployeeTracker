const mysql = require('mysql2');
const inquirer = require('inquirer');

// establish a connection to your MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '83202310',
  database: 'company_db'
});

// define the questions for Inquirer
const questions = [
  {
    type: 'list',
    name: 'options',
    message: `Welcome to this command line application, please choose from the following options: `,
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
  }
];

// prompt the user with the questions
inquirer.prompt(questions).then(async (answers) => {
  if (answers.options === 'view all departments') {
    // execute an SQL query to retrieve all departments
    connection.query('SELECT * FROM department', function(err, results){
      console.log(results);
    });
  }
}).catch((error) => {
  console.error(error);
});