//*************************************************************/
//  The following function deletes from departments table     */
//*************************************************************/

let department_delete=require('../common/record-delete');

module.exports = async function delete_department(connection,inquirer){
    let sql1='SELECT name FROM department ORDER BY name ASC';    // How to retrieve records to be deleted
    let dtable='department';                                     // Table is departments 
    let foreign=true;                                            // Department ID is a foreign key for role
    let sql2='SELECT COUNT(*) AS nr_rcds FROM role ' +          // SQL to determine if there are referenced records in table employee
                     'WHERE department_id= (SELECT id FROM department WHERE name="'
    let fdelete='name';                                          // field used in SQL DELETE statement
    await department_delete(connection,inquirer,sql1,dtable,foreign,sql2,fdelete);
}
