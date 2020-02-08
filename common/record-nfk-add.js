//************************************************************************************************************/
//  Records - Adding.  This function will add a new department.  It will first ask the user to enter a
//  valid department name.  Validation will include 1) greater than 3 characters, and 2) Not in the 
//  table already to avoid duplicates.
//  Parameters:  connection and inquirer, required, passed from main app
//               questions:  Questions to be asked to gather information to add record
//               sql:   SQL to execute to check if record already exists in table
//               sql2:  SQL to execute to insert the record into the table
//************************************************************************************************************/
module.exports=async function department_add(connection,inquirer,questinfo,sql,sql2){
    try{
        do {

            //*******************************************************************/
            // First, it will retrieve all  records.  If there are no records,  */
            // it will exit 
            //*******************************************************************/
            exists =false;
            answers = await inquirer.prompt(questinfo);

            //*****************************************************************************/
            // checking if record exist.  If it does, it throws warning message and exits
            //*****************************************************************************/
            results=await connection.promise().query(sql,[answers.description]);
            if (results[0].length>0){
                exists=true
                console.log('\x1b[41m',`${answers.description} already exists in the database`,'\x1b[0m')
            };

            // Name needs to be at least 5 characters long.  Throws error otherwise
            if (answers.description.length<5){
                console.log('\x1b[41m',`"${answers.description}" is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
            }

        } while (exists||answers.description.length<5);

        // Inserting record into the table and provides a message.  Using Inquirer to pause execution only.
        let query = await connection.promise().query(sql2,[answers.description]);
        let questions=[{type:'input',message:'\x1b[44m'+`Added ${answers.description} to the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);

    }catch(error){console.log(error)}
};
