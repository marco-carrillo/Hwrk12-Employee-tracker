//**************************************************************/
//  The following function allows user to view all employees   */
//**************************************************************/

let table_view=require('../common/table-view');

module.exports = async function view_roles(connection,inquirer){

sql='SELECT ee.id,ee.first_name,ee.last_name,rl.title,rl.salary,dp.name as "Department name" '+ 
            'FROM employee ee ' +
            'LEFT JOIN role rl ON rl.id=ee.role_id '+
            'LEFT JOIN department dp ON dp.id=rl.department_id '+
            'ORDER BY ee.id ASC;'
    
    db_name='employees'
    await table_view(connection,inquirer,sql,db_name);
}