DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30) UNIQUE NOT NULL
    PRIMARY KEY (id)
)
CREATE TABLE role (
    department_id INT NOT NULL UNSIGNED,
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30),
    salary INT NOT NULL UNSIGNED
    PRIMARY KEY (id)
    FOREIGN key (department_id) REFERENCES department(id)
)
CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL ,
    manager_id INT UNSIGNED,
    PRIMARY KEY (id)
    FOREIGN KEY (role_id) REFERENCES role_id(role_id)
    FOREIGN KEY (manager_id) REFERENCES employee(id)
)
