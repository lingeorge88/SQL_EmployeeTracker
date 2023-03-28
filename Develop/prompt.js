const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
// establish a connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '83202310',
  database: 'company_db'
});
console.log(chalk.cyan.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker Version 1.0')));
  console.log(``);
  console.log(`                                                          ` + chalk.greenBright.bold('Created By: George Lin'));
  console.log(``);
  console.log(chalk.cyan.bold(`====================================================================================`));
// define the questions for Inquirer
const questions = [
  {
    type: 'list',
    name: 'options',
    message: `Welcome to this Employee Tracker Version 1.0, please choose from the following options: `,
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
  },
  {
    type: 'input',
    name: 'newDepartmentName',
    message: 'Please enter the name for the new department:',
    when: (answers) => answers.options === 'add a department',
  },
];
const departmentChoices = []; // define department choices array
const roleChoices = [];
const managers =[];
// get department choices
connection.query('SELECT * FROM department', function(err, results) {
  if (err) throw err;

  // add department names to choices array
  results.forEach(result => {
    departmentChoices.push({
      name: result.name,
      value: result.id
    });
  });
});
connection.query('SELECT * FROM role', function(err, results) {
  if (err) throw err;

  // add role titles to roleChoices array
  results.forEach(result => {
    roleChoices.push({
      name: result.title,
      value: result.id,
    });
  });
});
connection.query('SELECT * FROM employee', function(err, results) {
  if (err) throw err;

  // add employee names to choices array
  results.forEach(result => {
    managers.push({
      name: result.first_name + " " + result.last_name,
      value: result.id,
    });
  });
});
const addRoleQuestions = [
  {
    type: 'input',
    name: 'newRoleTitle',
    message: 'Please enter the title for the new role:',
  },
  {
    type: 'input',
    name: 'newRoleSalary',
    message: 'Please enter the salary for the new role:',
  },
  {
    type: 'list',
    name: 'newRoleDepartment',
    message: 'Please select the department for the new role:',
    choices: departmentChoices,
  },
];
const addEmployeeQs =[
  {
    type: 'input',
    name: 'newEmpfirst',
    message: 'Please enter the first name of the employee',
  },
  {
    type: 'input',
    name: 'newEmplast',
    message: 'Please enter the last name of the employee:',
  },
  {
    type: 'list',
    name: 'newEmpRole',
    message: 'Please select the role for the employee',
    choices: roleChoices,
    value: roleChoices.value,
  },
  {
    type: 'list',
    name: 'newEmpManager',
    message: 'Please choose the manager for the new employee:',
    choices: managers,
    value: managers.value,
  },
];
const updateRoleQs = [
  {
    type: 'list',
    name: 'empChoices',
    message: 'Please select the employee whose role you want to update:',
    choices: managers,
    value: managers.value,
  },
  {
    type: 'list',
    name: 'newRole',
    message: 'Please select the role that you want to assign to the employee:',
    choices: roleChoices,
    value: roleChoices.value,
  },
]
// prompt the user with the questions
const init = () => {
  inquirer.prompt(questions).then(async (answers) => {
    if (answers.options === 'view all departments') {
      // execute an SQL query to retrieve all departments
      connection.query('SELECT * FROM department', function(err, results) {
        console.table(results);
        init();
      });
    } else if (answers.options === 'view all roles') {
      connection.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`, function(err, results) {
        console.table(results);
        init();
      });
    } else if (answers.options ==='view all employees') {
      connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name as department, role.salary as salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON role.id = employee.role_id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`, function(err, results) {
        if (err) {
          throw(err);
        }
        console.table(results);
        init();
      });
    } else if (answers.options === 'add a department') {
      // execute an SQL query to add a new department
      const { newDepartmentName } = answers;
      connection.query('INSERT INTO department SET ?', { name: newDepartmentName }, function(err, results) {
        if (err) throw err;
        console.log(`${newDepartmentName} department has been added!`);
        init();
      });
    } else if (answers.options === 'add a role') {
      inquirer.prompt(addRoleQuestions).then(async (roleAnswers) => {
        console.log(roleAnswers);
        const { newRoleTitle, newRoleSalary, newRoleDepartment } = roleAnswers;
        const [result] = await connection.promise().query(
          'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
          [newRoleTitle, newRoleSalary, newRoleDepartment]
        );
        console.log(`New role "${newRoleTitle}" has been added with id ${result.insertId}`);
        init();
      }).catch((error) => {
        console.error(error);
      });
    } else if (answers.options === 'add an employee') {
      inquirer.prompt(addEmployeeQs).then(async (employeeAnswers) => {
        console.log(employeeAnswers);
        const {newEmpfirst, newEmplast, newEmpRole, newEmpManager} = employeeAnswers;
        console.log(newEmpRole);
        const [result] = await connection.promise().query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmpfirst, newEmplast, newEmpRole, newEmpManager]
        );
        console.log(`New employee ${newEmpfirst} ${newEmplast} has been added`);
        init();
      }).catch((error) => {
        console.error(error);
      });
    } else if (answers.options === 'update an employee role') {
      inquirer.prompt(updateRoleQs).then(async (roleAnswers) => {
        console.log(roleAnswers);
        const {empChoices, newRole} = roleAnswers;
        const [result] = await connection.promise().query(
          'UPDATE employee SET role_id = ? WHERE id = ?', [newRole, empChoices]
        );
        console.log(`Employee role updated successfully!`);
        init();
      }).catch((error) => {
        console.error(error);
      });
    }
  });
};

init();