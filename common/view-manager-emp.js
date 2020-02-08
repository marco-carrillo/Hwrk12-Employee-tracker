/**********************************************************************/
//  The following function allows user to view budget by department   */
//*********************************************************************/

let budget_view=require('./table-view');

module.exports = async function view_manager(connection,inquirer){
sql=`SELECT CONCAT(m.first_name,' ',m.last_name) AS Manager,e.id, e.first_name, e.last_name  `+
            'FROM employee e '+
            'LEFT JOIN employee m on m.id=e.manager_id '+
            'GROUP BY manager '+
            'ORDER BY manager;'
    
    db_name='employees'
    await budget_view(connection,inquirer,sql,db_name);
}