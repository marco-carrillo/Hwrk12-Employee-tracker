//************************************************************************************************/
//  Modifying role with foreign key.  It will first ask the user to enter a                      */
//  valid record name.  Validation will include 1) greater than 5 characters, and 2) Not in the  */
//  table already to avoid duplicates.                                                           */
//************************************************************************************************/
module.exports=async function role_add(connection,inquirer,questions){
    try{

        //*******************************************************************************/
        // Validating that there are keys to be modified.  If there are not, it exits.
        // If there are, moves its values into the questions to be asked later on
        //*******************************************************************************/
        let rawdata= await connection.promise().query('SELECT title FROM role ORDER BY title ASC');
        if(rawdata[0].length===0){
            let questions=[{type:'input',message:'\x1b[41m'+`There are no roles to be modified......`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        };

        //************************************/
        // Asking which role will be updated
        //************************************/
        let roles=[];
        rawdata[0].forEach(role=>roles.push(role.title));
        let questions=[{type:'list',message:`Select role to modify..........:`,name:'title',choices:roles}];
        record=await inquirer.prompt(questions);

        //*******************************************************************************/
        // Validating that there are foreign key records.  If there are not, it exits.
        // If there are, moves its values into the questions to be asked
        //*******************************************************************************/
        let rawdata2= await connection.promise().query('SELECT name FROM department ORDER BY name ASC');
        if(rawdata2[0].length===0){
            let questions=[{type:'input',message:'\x1b[41m'+`To add a role, a department is required.  Add a deparment before adding a role...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        };
        let deptos=[];
        let exists=false;
        rawdata2[0].forEach(depto=>deptos.push(depto.name));

        do {
            //***********************************************************************************************/
            // First, asking for data to be entered.  No validation, validation is done after getting name  */
            //***********************************************************************************************/
            exists =false;
            let questions=[{type:'input',message:`Enter the title of the role..........:`,name:'title'},
                           {type:'input',message:`Enter the salary for the role........:`,name:'salary'},
                           {type:'list' ,message:`Enter the department for the role....:`,name:'depto',choices:deptos}];

            answers = await inquirer.prompt(questions);

            //******************************************************************/
            // checking if role exist.  If it does, it throws warning message  */
            //******************************************************************/
            results=await connection.promise().query('SELECT * from role where title= ?',[answers.title]);
            if (results[0].length>0){
                exists=true
                console.log('\x1b[41m',`Role ${answers.title} already exists in the database`,'\x1b[0m');
            };

            //*************************************************************************/
            // title needs to be at least 5 characters long.  Throws error otherwise  */
            //*************************************************************************/
            if (answers.title.length<5){
                    console.log('\x1b[41m',`Role name ${answers.role_title} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
                }

            //**************************************************************/
            // Salary needs to be at least 1,000.  Throws error otherwise  */
            //**************************************************************/
            if (answers.salary<1000){
                console.log('\x1b[41m',`Role salary of ${answers.role_title} is invalid.  Needs to be at least $1,000`,'\x1b[0m');
            }

        } while (exists||answers.title.length<5||answers.salary<1000);

        //************************************************************/
        // Getting the ID that corresponds to the department chosen  */
        //************************************************************/
        let sql=`SELECT id FROM department WHERE name="${answers.depto}"`
        let dpid = await connection.promise().query(sql);

        //************************************************/
        // Inserting the ID into the department chosen   */
        //************************************************/
        sql=`UPDATE role SET title="${answers.title}",salary=${answers.salary}, department_id=${dpid[0][0].id} WHERE title="${record.title}"`
        let query = await connection.promise().query(sql);

        //******************************************/
        // Final message that role has been added  */
        //******************************************/
        questions=[{type:'input',message:'\x1b[44m'+`Modified role ${record.title} to ${answers.title}.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
    }catch(error){console.log(error)}
};
