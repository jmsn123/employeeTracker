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
                "Update employee",
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
                case "Add employee":
                    addEmp();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add department":
                    addDept();
                    break;
                case "Update employee":
                    updateRole();
                    break;
            }
        });
}

function viewAllEmp() {
    // construct our sql query
    let sql =
        `SELECT emp.id, emp.first_name, emp.last_name, dep.name FROM employee AS emp INNER JOIN department AS dep ON  emp.id = dep.id`
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
    return deptSet;
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

function viewAllByDepartment() {
    let sql = " SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role on employee.id = role.id JOIN department on role.department_id = department.id "

    connection.query(sql, (err, res) => {
        console.table("res", res)
        main()
    })
}



function addDept() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Please add your department"
    }]).then((response) => {
        let sql = "INSERT INTO department SET ?"
        connection.query(sql, { name: response.name }, (err, res) => {
            if (err) throw err
            console.table("res", res);
            main();

        })
    })
}

function updateRole() {
    const sql = `SELECT employee.first_name,employee.last_name,role.title FROM employee INNER JOIN role on role.id = employee.role_id; SELECT title FROM roles`
    connection.query(sql, (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            name: 'employee',
            type: 'list',
            choices: function() {
                let usersArray = res[0].map(user => user.first_name)
                console.log(res);
                return usersArray
            },
            message: "Who would you like to update "
        }, {
            name: "updatedRole",
            type: 'list',
            choices: function() {
                let usersArray = res[1].map(role => role.title)
                return usersArray;
            }
        }]).then(response => {
            console.log(response)
        })
    })
}

function addRole() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Please add your Role"
    }, {
        name: "salary",
        type: "input",
        message: "Please put in your salary "
    }]).then((response) => {
        let sql = "INSERT INTO role SET ?"
        connection.query(sql, { name: response.name, salary: response.salary }, (err, res) => {
            if (err) throw err
            console.table("res", res);
            main();

        })
    })
}

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
            message: "What is the role?",
            choices: roles(),
        },
        {
            name: "dept",
            type: "list",
            message: "What is the department that you are assigned to?",
            choices: department(),
        },
    ]).then((response) => {
        console.log(response)
    })
}