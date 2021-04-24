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
    console.log("print here", setRoles())
        // setRoles()
    main();
});

function setRoles() {
    let roleSet = [];

    let sql = "SELECT * FROM role";
    connection.query(sql, function(err, res) {
        if (err) throw err;
        // for (let i = 0; i < res.length; i++) {
        //     roleSet.push(res[i]);
        //     // console.log("roles", roleSet);
        // }
        const roles = res.map(role => role.title)
        console.log(roles)
        return roles

    });

}