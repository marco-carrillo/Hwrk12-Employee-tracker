//************************************************************************************************/
//  Modifying employee with foreign key.  It will first ask the user to enter a                     */
//  valid record name.  Validation will include 1) first and last name greater than 3 characters
//  and 2) first and last name combination not already in table to avoid duplicates.                                                           */
//************************************************************************************************/
module.exports=async function role_add(connection,inquirer,questions){
    try{

        //*******************************************************************************/
        // Validating that there are foreign key records.  If there are not, it exits.
        // If there are, moves its values into the questions to be asked
        //*******************************************************************************/
        let rawdata= await connection.promise().query('SELECT title FROM role ORDER BY title ASC');
        if(rawdata[0].length===0){
            let questions=[{type:'input',message:'\x1b[41m'+`To add an employee, a role is required.  Add a role before adding an employee...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        };

        let roles=[];
        let exists=false;
        rawdata[0].forEach(role=>roles.push(role.title));

        //**************************************************************************************/
        // Getting all of the existing employees, so that user can determina which one will
        // be modified.  If there are no managers, then it exits.
        //*************************************************************************************/
        rawdata= await connection.promise().query(`SELECT CONCAT(first_name,' ',last_name) AS name FROM employee ORDER BY name ASC`);
        let managers=[];
        let sql='';
        let employee_has_manager=false;
        if(rawdata[0].length===0){
            let questions=[{type:'input',message:'\x1b[41m'+`To add an employee, a role is required.  Add a role before adding an employee...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        };

        //************************************************************************/
        // Now it will ask the user to choose which employee will be modified
        //************************************************************************/
        let employees=[];
        rawdata[0].forEach(employee=>employees.push(employee.name));
        let questions=[{type:'list',message:`Which employee will be modified...`,name:'name',choices:employees}];
        which_emp = await inquirer.prompt(questions);  // which_emp.name has name of employee being modified

        do {
            //*****************************************************************************************/
            // Asking for data to be entered.  No validation, validation is done after getting name  */
            //****************************************************************************************/
            exists =false;
            let questions=[{type:'input',message:`First name of employee..........:`,name:'first'},
                           {type:'input',message:`Last name of employee...........:`,name:'last'},
                           {type:'list' ,message:`Enter the employee's role.......:`,name:'role',choices:roles}];
            answers = await inquirer.prompt(questions); 

            //*****************************************************************************************/
            // Now, will get manager's available.  This is equal to all of the employee tables
            // except the role being modified.  Then ask the user if 1) employee will have a manager
            // and if so, it will ask to identify which one from our list.
            //*****************************************************************************************/
            sql=`SELECT CONCAT(first_name,' ',last_name) AS name FROM employee WHERE CONCAT(first_name,' ',last_name)<>"${which_emp.name}"`;
            let mgrs=await connection.promise().query(sql);
            if(mgrs[0].length>0){
                questions=[{type:'list',message:'Does this employee has a manager?...',name:'has_mgr',choices:['Yes','No']}];
                has_mgr=await inquirer.prompt(questions);
                
                if(has_mgr.has_mgr==='Yes'){
                    mgrs[0].forEach(manager=>managers.push(manager.name));
                    questions=[{type:'list',message: 'Enter the employee manager.....',name:'manager',choices:managers}];
                    manager= await inquirer.prompt(questions);  // manager.manager is name of manager
                    employee_has_manager=true;
                };
            };

            //*******************************************************************/
            // checking if name exists.  If it does, it throws warning message  */
            //*******************************************************************/
            sql=`SELECT CONCAT(first_name,' ',last_name) AS name FROM employee WHERE CONCAT(first_name,' ',last_name)="`+answers.first+' '+answers.last+'"';
            console.log(sql);
            results=await connection.promise().query(sql);
            if (results[0].length>0){
                //******************************************************************************/
                // If there are records, it checks that it is not the name of the employee     */
                // currently being modified.  If it is, it is OK since the employee name might */ 
                // not have changed, but his manager or the role could have.                   */
                //******************************************************************************/
                let duplicate=[];
                results[0].forEach(record=>duplicate.push(record.name));
                if(duplicate.length>1||duplicate[0]!==which_emp.name){
                    exists=true
                    console.log('\x1b[41m',`Employee ${answers.first} ${answers.last} already exists in the database`,'\x1b[0m');
                };
            };

            //********************************************************************************************/
            // total name (first +last) needs to be at least 5 characters long.  Throws error otherwise  */
            //********************************************************************************************/
            if ((answers.first.length+answers.last.length)<5){
                    console.log('\x1b[41m',`Employee ${answers.first} ${answers.last} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
                };

        } while (exists||(answers.first+answers.last)<5);

        //************************************************************/
        // Getting the ID that corresponds to the role chosen  */
        //************************************************************/
        sql=`SELECT id FROM role WHERE title="${answers.role}"`
        let which_role = await connection.promise().query(sql);

        //****************************************************************************/
        // Finalizing the query based on whether there will be a manager available   */
        //****************************************************************************/

        if(employee_has_manager===true){
            //*********************************************************/
            // Getting the ID that corresponds to the manager chosen  */
            //*********************************************************/
            sql=`SELECT id FROM employee WHERE CONCAT(first_name,' ',last_name)="${manager.manager}"`
            let which_mgr = await connection.promise().query(sql);

            //********************************************************/
            // creates the SQL to insert this record into the table  */
            //********************************************************/
            sql=`UPDATE employee SET first_name="${answers.first}",last_name="${answers.last}",role_id=${which_role[0][0].id},manager_id=${which_mgr[0][0].id} `+
                `WHERE CONCAT(first_name,' ',last_name)="${which_emp.name}"`;
        } else {
            //***************************************************************************/
            // creates the SQL to insert this record into the table, without a manager  */
            //***************************************************************************/
            sql=`UPDATE employee SET first_name="${answers.first}",last_name="${answers.last}",role_id=${which_role[0][0].id} `+
                `WHERE CONCAT(first_name,' ',last_name)="${which_emp.name}"`;
        };
        console.log(sql);
        await connection.promise().query(sql);

        //******************************************/
        // Final message that role has been added  */
        //******************************************/
        questions=[{type:'input',message:'\x1b[44m'+`Modified employee ${answers.first} ${answers.last} to the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
    }catch(error){console.log(error)}
};
