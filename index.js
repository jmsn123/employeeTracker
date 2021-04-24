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
    // console.log("print here", setRoles())
    // setRoles()
    main();
});

async function main() {
    const ans = await inquirer.prompt({
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
    });

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
            updateEmployee();
            break;
    }
}
let roleArr = [];

function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    });
    return roleArr;
}

function updateEmployee() {
    let sql =
        "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        // could log response here with
        inquirer
            .prompt([{
                    name: "lastName",
                    type: "rawlist",
                    choices: function() {
                        var lastName = [];
                        for (var i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    },
                    message: "What is the Employee's last name? ",
                },
                {
                    name: "updatedRole",
                    type: "list",
                    choices: selectRole(),
                    message: "please Select new role ",
                },
            ])
            .then((val) => {
                let roleId = selectRole().indexOf(val.updatedRole) + 1;
                console.log(val);
                let data = [roleId, val.lastName];

                connection.query(
                    "UPDATE employee SET role_id = ?   WHERE last_name = ? ",
                    data,
                    function(err) {
                        if (err) throw err;
                        console.table(val);
                        main();
                    }
                );
            });
    });
}

function viewAllEmp() {
    // construct our sql query
    let sql = `SELECT emp.id, emp.first_name, emp.last_name, dep.name FROM employee AS emp INNER JOIN department AS dep ON  emp.id = dep.id`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        main();
    });
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
    let sql =
        " SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role on employee.id = role.id JOIN department on role.department_id = department.id ";

    connection.query(sql, (err, res) => {
        console.table("res", res);
        main();
    });
}
var managersArr = [];

function selectManager() {
    connection.query(
        "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managersArr.push(res[i].first_name);
            }
        }
    );
    return managersArr;
}

function addEmp() {
    inquirer
        .prompt([{
                name: "firstname",
                type: "input",
                message: "Enter their first name ",
            },
            {
                name: "lastname",
                type: "input",
                message: "Enter their last name ",
            },
            {
                name: "role",
                type: "list",
                message: "What is their role? ",
                choices: selectRole(),
            },
            {
                name: "choice",
                type: "rawlist",
                message: "Whats their managers name?",
                choices: selectManager(),
            },
        ])
        .then((val) => {
            let id = selectRole().indexOf(val.role) + 1;
            let managerId = selectManager().indexOf(val.choice) + 1;
            console.log(managerId);
            connection.query(
                `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?,?,?)`, [val.firstname, val.lastname, id, managerId]
            );
            console.log("employee added");
            main();
        });
}

function addDept() {
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "Please add your department",
        }, ])
        .then((response) => {
            let sql = "INSERT INTO department SET ?";
            connection.query(sql, { name: response.name }, (err, res) => {
                if (err) throw err;
                console.table("res", res);
                main();
            });
        });
}
// console.log(setRoles())

function userRole() {
    let roleSet = [];

    let sql = "SELECT * FROM role";
    connection.query(sql, function(err, res) {
        if (err) throw err;

        let roles;
        roles = res.map((role) => {
            roleSet.push(role.title);
        });
    });
    return roleSet;
}

function user() {
    const sql = `SELECT employee.first_name,employee.last_name,role.title FROM employee INNER JOIN role on role.id = employee.role_id; `;

    connection.query(sql, (err, res) => {
        if (err) throw err;

        let usersArray = res.map((user) => user.first_name);
        // console.log("rehhhhhs", res);
        console.log(usersArray);
        setRoles(usersArray);
    });
}

function updateRole(user, setRoles) {
    // const roles = await connection.query(`SELECT title FROM roles`)
    // console.log("beee", setRoles())                        let sql = "SELECT * FROM role";
    let sql = "SELECT * FROM role";

    connection.query(sql, function(err, res) {
        if (err) throw err;

        inquirer
            .prompt([, ])
            .then((response) => {
                let id = userRole();
                console.log(id);
                console.log(response);
                let sql = "UPDATE employee SET role_id = ? WHERE last_name = ?";
                connection.query(
                    sql, [last_name, response.lastName], {
                        role_id: id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.table("response", response);
                    }
                );
            })
            .catch((err) => {
                console.log("object");
                console.log(err);
            });
    });

    function addRole() {
        connect;
        inquirer
            .prompt([{
                    name: "name",
                    type: "input",
                    message: "Please add your Role",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "Please put in your salary ",
                },
                {
                    name: "dept",
                    type: "list",
                    choices: function() {
                        let choiceArray = results[1].map(
                            (choice) => choice.department_name
                        );
                        return choiceArray;
                    },
                    message: "Please put in your salary ",
                },
            ])
            .then((response) => {
                let sql = "INSERT INTO role SET ?";
                connection.query(
                    sql, { title: response.name, salary: response.salary },
                    (err, res) => {
                        if (err) throw err;
                        console.table("res", res);
                        main();
                    }
                );
            });
    }

    function addEmp() {
        inquirer
            .prompt([{
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
                    choices: selectRole(),
                },
                {
                    name: "dept",
                    type: "list",
                    message: "What is the department that you are assigned to?",
                    choices: department(),
                },
            ])
            .then((response) => {
                let sql = "INSERT INTO employee SET ? ";
                connection.query(
                    sql, {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: response.role8,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("ew", res);
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }
}