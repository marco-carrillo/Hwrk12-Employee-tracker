//*******************************************************/
//  The following function deletes from roles table     */
//*******************************************************/

let role_delete=require('../common/record-delete');

module.exports = async function view_roles(connection,inquirer){
    let sql1='SELECT title AS name FROM role ORDER BY title ASC';   // How to retrieve records to be deleted
    let dtable='role';                                              // Table is role 
    let foreign=true;                                               // Table is a foreign key to employee
    let sql2='SELECT COUNT(*) AS nr_rcds FROM employee ' +          // SQL to determine if there are referenced records in table employee
                     'WHERE role_id= (SELECT id FROM ROLE WHERE title="'
    let fdelete='title';                                            // Field used in SQL DELETE statement
    await role_delete(connection,inquirer,sql1,dtable,foreign,sql2,fdelete);
}
