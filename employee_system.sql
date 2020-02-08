--***************************************************************************/
--  This function will create the tables for the Employee management system */
-- ***************************************************************************/
DROP DATABASE IF EXISTS  employee_system;
CREATE DATABASE employee_system;

-- table department
DROP TABLE IF EXISTS department;
CREATE TABLE department (
            id INTEGER AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            PRIMARY KEY (id));

-- for table role
DROP TABLE IF EXISTS role;
CREATE TABLE role (
            id INTEGER AUTO_INCREMENT,
            title VARCHAR(30) NOT NULL,
            salary DECIMAL (10,2),
            department_id INTEGER,
            PRIMARY KEY (id),
            FOREIGN KEY (department_id) REFERENCES department (id));

--table employee
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
            id INTEGER AUTO_INCREMENT,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INTEGER,
            manager_id INTEGER NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (role_id) REFERENCES role (id),
            FOREIGN KEY (manager_id) REFERENCES employee (id));