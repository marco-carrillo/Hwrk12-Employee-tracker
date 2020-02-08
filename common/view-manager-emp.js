/**********************************************************************/
//  The following function allows user to view budget by department   */
//*********************************************************************/
let budget_view=require('./table-view');

module.exports = async function view_manager(connection,inquirer){
sql=`SELECT CONCAT(m.first_name,' ',m.last_name) AS Manager,e.id, e.first_name, e.last_name,r.title,r.salary,d.name as 'department name'  `+
            'FROM employee e '+
            'LEFT JOIN employee m on m.id=e.manager_id '+
            'LEFT JOIN role r on r.id=e.role_id '+
			'LEFT JOIN department d on d.id=r.department_id '+
            'ORDER BY manager;'
    
    db_name='employees'
    await budget_view(connection,inquirer,sql,db_name);
}