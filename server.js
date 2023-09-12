const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./connection');

db.connect((err) => {
    if(err){
      console.log(err);
    }
    console.log('MySql Connected');
  });

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Select an option.',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
            .then(userChoice)
    })
};

function userChoice(answer) {
    switch (answer.action) {
        case 'View all departments':
            return viewAll('department');
        case 'View all roles':
            return viewAll('roles');
        case 'View all employees':
            return viewAll('employees');
        case 'Add a department':
            return addDepartment();
        case 'Add a role':
            return addRole();
        case 'Add an employee':
            return addEmployee();
        case 'Update an employee':
            return updateEmployee();
    }
};

function viewAll(table) {
    const query = `SELECT * FROM ${table};`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    })
}

function addDepartment(){
    inquirer.prompt({
            type: 'input',
            message: 'Department name: ',
            name: 'departmentName'
        })
    .then(answer => {
        db.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}");`)
    })};