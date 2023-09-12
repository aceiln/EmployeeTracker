const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./connection');

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('MySql Connected');
    start()
});

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Select an option.',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
    })

        .then(handleUserResponse);
};

function handleUserResponse(answer) {
    switch (answer.action) {
        case 'View all departments':
            return viewAll('department');
        case 'View all roles':
            return viewAll('role');
        case 'View all employees':
            return viewAll('employee');
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

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Department name: ',
        name: 'departmentName'
    })
        .then(answer => {
            db.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}");`)
            console.log('wow what a nerdy department name');
            start();
        })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Employee first name: ',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Employee last name: ',
            name: 'last_name'
        },
        {
            type: 'input',
            message: 'Role ID: ',
            name: 'role_id'
        },
        {
            type: 'input',
            message: 'Manager ID: ',
            name: 'manager_id'
        }
    ])
        .then(answer => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${answer.first_name}","${answer.last_name}","${answer.role_id}","${answer.manager_id}");`)
            console.log('wow what a nerd');
            start();
        })
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Role name: ',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Salary total: ',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'Department ID: ',
            name: 'department_id'
        }
    ])
        .then(answer => {
            db.query(`INSERT INTO role (title, salary, department_id)
        VALUES ("${answer.title}","${answer.salary}","${answer.department_id}");`)
            console.log('wow what a nerd');
            start();
        })
};

async function updateEmployee() {
    const query = `SELECT * FROM employee`;

    p = []

    console.log(db.query(`SELECT * FROM role`, (err, role) => {
        p = role
    }));

    db.query(query, (err, employee) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employees role do you want to update?',
                choices: employee.map(employee => employee.last_name)
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is their new role id?',
                choices: p.map(r => r.title)
            }
        ])
            .then(answer => {
                const query = `UPDATE employee SET role_id = ${answer.role} WHERE employee.last_name = ${answer.employee}`;
                db.query(query, (err, result) => {
                    start();
                });
            });
    });
}