//***************************************************************/
//  The following function allows user to view all departments
//***************************************************************/

let table_view=require('../common/table-view');

module.exports = async function view_departments(connection,inquirer){
    sql=`SELECT id, name AS "Department name" FROM department ORDER BY id ASC`;
    db_name='departments'
    await table_view(connection,inquirer,sql,db_name);

}
