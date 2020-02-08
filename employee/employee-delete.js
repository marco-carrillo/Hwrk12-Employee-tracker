//**********************************************************/
//  The following function deletes from employee table     */
//**********************************************************/

let employee_delete=require('../common/record-delete');

module.exports = async function delete_employee(connection,inquirer){
    let sql1='SELECT CONCAT(first_name," ",last_name) AS name FROM employee ORDER BY name ASC';    // How to retrieve records to be deleted
    let dtable='employee';                                     // Table is employee
    let foreign=true;                                          // Employee does not have a foreign table, yet record could be a manager
    let sql2='SELECT COUNT(*) AS nr_rcds FROM employee ' +     // SQL to determine if there are referenced records in table employee
                     'WHERE manager_id= (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name)="'
    let fdelete='CONCAT(first_name," ",last_name)';            // field used in SQL DELETE statement
    await employee_delete(connection,inquirer,sql1,dtable,foreign,sql2,fdelete);
}
