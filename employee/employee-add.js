//************************************************************************************************/
//  Adding employee with foreign key.  It will first ask the user to enter a                     */
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
        // Getting all of the existing employees, so that they can be used as 
        // potential managers for the new employee.  The list could be empty and that is OK
        // since an employee can not have a manager.
        //*************************************************************************************/
        rawdata= await connection.promise().query(`SELECT CONCAT(first_name,' ',last_name) AS name FROM employee ORDER BY name ASC`);
        let manager_available=false;
        let managers=[];
        let answ_mgr='';
        let employee_has_manager=false;
        if(rawdata[0].length===0){manager_available=false;}
        else {
            manager_available=true;
            rawdata[0].forEach(manager=>{managers.push(manager.name)});
        };

        do {
            //*****************************************************************************************/
            // Asking for data to be entered.  No validation, validation is done after getting name  */
            //****************************************************************************************/
            exists =false;
            let questions=[{type:'input',message:`First name of employee..........:`,name:'first'},
                           {type:'input',message:`Last name of employee...........:`,name:'last'},
                           {type:'list' ,message:`Enter the employee's role.......:`,name:'role',choices:roles}];
            answers = await inquirer.prompt(questions);

            //******************************************************************************************/
            // If there are managers, will ask whether the employee will have one.  If yes, asks who   */
            //******************************************************************************************/
            if(manager_available===true){
                let questions=[{type:'list' ,message:`Will this employee have a manager?....:`,name:'has_manager',choices:['Yes','No']}];
                let has_mgr = await inquirer.prompt(questions);

                if (has_mgr.has_manager==='Yes'){
                    let questions=[{type:'list' ,message:`Enter the employee's manager.....:`,name:'manager',choices: managers}];
                    answ_mgr = await inquirer.prompt(questions);
                    employee_has_manager=true;
                   };
            };

            //*******************************************************************/
            // checking if name exists.  If it does, it throws warning message  */
            //*******************************************************************/
            let sql=`SELECT * FROM employee WHERE CONCAT(first_name,' ',last_name)="`+answers.first+' '+answers.last+'"';
            results=await connection.promise().query(sql);
            if (results[0].length>0){
                exists=true
                console.log('\x1b[41m',`Employee ${answers.first} ${answers.last} already exists in the database`,'\x1b[0m');
            };

            //********************************************************************************************/
            // total name (first +last) needs to be at least 5 characters long.  Throws error otherwise  */
            //********************************************************************************************/
            if (answers.first.length+answers.last.length<5){
                    console.log('\x1b[41m',`Employee ${answers.first} ${answers.last} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
                }
        } while (exists||(answers.first.length+answers.last.length)<5);

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
            sql=`SELECT id FROM employee WHERE CONCAT(first_name,' ',last_name)="${answ_mgr.manager}"`
            let which_mgr = await connection.promise().query(sql);

            //********************************************************/
            // creates the SQL to insert this record into the table  */
            //********************************************************/
            sql=`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES("${answers.first}","${answers.last}",${which_role[0][0].id},${which_mgr[0][0].id})`;
        } else {
            //***************************************************************************/
            // creates the SQL to insert this record into the table, without a manager  */
            //***************************************************************************/
            sql=`INSERT INTO employee (first_name,last_name,role_id) VALUES("${answers.first}","${answers.last}",${which_role[0][0].id})`;
        };
        console.log(sql);
        await connection.promise().query(sql);

        //******************************************/
        // Final message that role has been added  */
        //******************************************/
        questions=[{type:'input',message:'\x1b[44m'+`Added employee ${answers.first} ${answers.last} to the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
    }catch(error){console.log(error)}
};
