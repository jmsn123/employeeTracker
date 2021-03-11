const mysql = require("mysql");
const inquirer = require("inquirer");

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
const createEmployee = (response) => {
    console.log("Inserting a new employee...\n");
    const query = connection.query(
        "INSERT INTO employee SET ?", {
            first_name: response.username,
            last_name: response.salary,
            role_id: response.role,
        },
        (err, res) => {
            console.log(res);
            if (err) throw err;

            console.log(`${res.affectedRows} product inserted!\n`);
            // Call updateProduct AFTER the INSERT completes
            // updateProduct();
        }
    );
};

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
        .prompt([
            [
                "View all employees",
                "View all employees by role",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add role",
                "Add department",
            ],
        ])
        .then((ans) => {
            switch (ans.action) {
                case "View all employees":
                    viewAllEmp();
                    break;
                case "View all employees by role":
                    break;
                case "View all employees by department":
                    break;
                case "View all employees by manager":
                    break;
                case "Add employee":
                    break;
            }
        });
}
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    getEmployees();
});