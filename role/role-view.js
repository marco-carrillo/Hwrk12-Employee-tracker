//***********************************************************/
//  The following function allows user to view all roles    */
//***********************************************************/

let table_view=require('../common/table-view');

module.exports = async function view_roles(connection,inquirer){
    sql='SELECT role.id,role.title,role.salary,department.name as "Department Name" ' +
                'FROM role '+
                'LEFT JOIN department ON department.id=role.department_id '+
                'ORDER BY name ASC;'
    db_name='roles'
    await table_view(connection,inquirer,sql,db_name);

}
