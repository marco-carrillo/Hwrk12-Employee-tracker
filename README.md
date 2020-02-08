# Purpose of the application

The employee manaement system applicaton is a CLI application that interfaces with MySQ server.  Overall, this application allows to manage all of the employees, roles, and departments within an organization.

The main menu is organized into 5 areas, each one discusssed below:

![Main menu](./picsandgifs/mainmenu.png)

## Department Management

This option allows to 1) Add, 2) Edit, 3) View, and 4) Delete departments to the system.

To effectively use this application, departments must first be added, since they are the building blocks for the database structure.  A department ID is needed to add roles, and roles are needed to add employees.  

1. add    :  Will add a department.  Department will need to be at least 5 characters long to be valid. 
2. edit   :  Will change the name of a department to one at least 5 characters long.  The new name will be searched to avoid duplicates.
3. delete :  Will delete a record.  Before doing so, the system will check that the record is not a foreign key for a role.  If it is, will provide a message and refuse to delete.
4. view   :  Will view all departments.

##  Role Management

This option allows to 1) Add, 2) Edit (including change of department), 3) View, and 4) Delete roles to the system.

To be able to add a role, a department must exists (since it is a foreign key to the role table).  If there are no departments, the application will ask the user to add one before proceeding.  A role will be needed prior to adding departments.  

1. add    :  Will add a role.  Role name needs to be at least 5 characters long to be valid, the salary needs to be at least $1,000.  The application will get a list of all departments and the user will have to choose from that list, where this role belongs.
2. edit   :  Will change the name of a role, salary and department.  Same validations done as if adding a new role.  New role name will be searched in the table to avoid duplicates.
3. delete :  Will delete a record.  Before doing so, the system will check that the record is not a foreign key for an employee.  If it is, will provide a message and refuse to delete.
4. view   :  Will view all roles.

##  Employee Management

This option allows to 1) Add, 2) Edit (including changing of manager and role), 3) View, and 4) Delete employees to the system.

To be able to add an employee, at least one role must exist (since role is a foreign key to the employee table).  If there are no roles, the application will ask the user to add one before proceeding.

1. add    :  Will add a department.  Employee first + last name length shoiuld be at least 5 characters long to be valid. The application will get a list of roles from which the user will choose, and will ask if the user will have a manager.  If yes, a list of all existing employees, will be shown to select who will be the manager. 
2. edit   :  Will change the name of an employee, role, and manager. For the role, a list of all roles will be presented.  For the manager, a list of all employees, excluding the employee of course, will be presented.
3. delete :  Will delete a record.  Before doing so, it will check that the employee is not a manager for another employee, otherwise will refuse to delete.
4. view   :  Will view all employees, role, department, salary and manager.

## View employees by manager

User can see all of the employees sorted by manager.  Employees without a manager, will be shown first (top hierarchy), and then managers will be sorted alphabetically by first + last name.

![Main menu](./picsandgifs/employeebymgr.png)

##  View budget by department

Users can request to see a list of all departments that have employees, and how much budget has been allocated.  The budget will be the addition of all of the employee's salaries for that department.

![Main menu](./picsandgifs/budgetbydepto.png)

##  Overall application demonstration

![GIF of input](./picsandgifs/demo.gif)
