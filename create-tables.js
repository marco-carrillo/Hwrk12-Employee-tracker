//***************************************************************************/
//  This function will create the tables for the Employee management system */
//***************************************************************************/

// SQL for table department
sql ='DROP TABLE IF EXISTS department;'
sql ='CREATE TABLE department ('  +
            'id INTEGER AUTO_INCREMENT,' +
            'name VARCHAR(30) NOT NULL,'  +
            'PRIMARY KEY (id));'

//  SQL for table role
sql ='DROP TABLE IF EXISTS role;'
sql ='CREATE TABLE role (' +
            'id INTEGER AUTO_INCREMENT,' +
            'title VARCHAR(30) NOT NULL,' +
            'salary DECIMAL (10,2),' +
            'department_id INTEGER,' +
            'PRIMARY KEY (id),' +
            'FOREIGN KEY (department_id) REFERENCES department (id));'

// SQL for table employee
sql ='DROP TABLE IF EXISTS employee;'
sql ='CREATE TABLE employee ('  +
            'id INTEGER AUTO_INCREMENT,'  +
            'first_name VARCHAR(30) NOT NULL,'  +
            'last_name VARCHAR(30) NOT NULL,'  +
            'role_id INTEGER,'  +
            'manager_id INTEGER NULL,'  +
            'PRIMARY KEY (id),'  +
            'FOREIGN KEY (role_id) REFERENCES role (id),'  +
            'FOREIGN KEY (manager_id) REFERENCES employee (id));'

