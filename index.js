const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Be sure to update with your own MySQL password!
    password: "Babytroy12",
    database: "employeeDB",
});
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // roles();
    main();
});

function getEmployees() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your user name?",
                name: "username",
            },
            {
                type: "input",
                message: "What is your salary?",
                name: "salary",
            },
            {
                type: "input",
                message: "Department",
                name: "role",
            },
        ])
        .then((response) => {
            console.log(response);
            createEmployee(response);
        });
}

function main() {
    inquirer
        .prompt({
            name: "mainprompt",
            type: "list",
            message: "Choose from the following below",
            choices: [
                "View all employees",
                "View all employees by role",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add role",
                "Add department",
            ],
        })
        .then((ans) => {
            switch (ans.mainprompt) {
                case "View all employees":
                    viewAllEmp();
                    break;
                case "View all employees by role":
                    viewAllByRoles();
                    break;
                case "View all employees by department":
                    viewAllByDepartment();
                    break;
                case "View all employees by manager":
                    viewAllByManager();
                    break;
                case "Add employee":
                    addEmp();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add department":
                    addDept();
                    break;
            }
        });
}

function viewAllEmp() {
    // construct our sql query
    let sql =
        " SELECT emp.id, emp.first_name, emp.last_name, role.title, department.name department, role.salary, concat(m.first_name, ' ', m.last_name) manager FROM employee emp LEFT JOIN employee m ON emp.manager_id = m.id INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC ";
    // make query
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        main();
    });
}

function roles() {
    let roleSet = [];
    let sql = " SELECT * FROM role";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleSet.push(res[i].title);
        }
    });
    return roleSet;
}

function department() {
    let deptSet = [];
    let sql = " SELECT * FROM department";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            deptSet.push(res[i].title);
        }
    });
    return roleSet;
}

function viewAllByRoles() {
    let sql =
        "SELECT emp.id,emp.first_name, emp.last_name,role.title FROM employee emp INNER JOIN role on emp.role_id = role.id ";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        main();
    });
}

function viewAllByDepartment() {}

function viewAllByManager() {}

function addDept() {}

function addRole() {}

function addEmp() {
    inquirer.prompt([{
            name: "firstName",
            type: "input",
            message: "please input First Name",
        },
        {
            name: "lastName",
            type: "input",
            message: "please input Last Name",
        },
        {
            name: "role",
            type: "list",
            message: "What is the role",
            choices: roles(),
        },
        {
            name: "dept",
            type: "list",
            message: "What is the department that you are assigned to",
            choices: department(),
        },
    ]);
}