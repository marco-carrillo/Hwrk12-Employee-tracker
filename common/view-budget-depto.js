/**********************************************************************/
//  The following function allows user to view budget by department   */
//*********************************************************************/

let budget_view=require('./table-view');

module.exports = async function view_roles(connection,inquirer){
    sql= 'SELECT DISTINCT dp.name, sum(rl.salary) AS budget ' +
                'FROM employee ee ' +
                'LEFT JOIN role rl ON rl.id=ee.role_id ' +
                'LEFT JOIN department dp ON dp.id=rl.department_id ' +
                'GROUP BY dp.name ' +
                'ORDER BY budget DESC;'

    db_name='employees'
    await budget_view(connection,inquirer,sql,db_name);
}
