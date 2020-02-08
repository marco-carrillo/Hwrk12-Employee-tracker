//************************************************************************************************/
//  Adding record with foreign key.  It will first ask the user to enter a                       */
//  valid record name.  Validation will include 1) greater than 5 characters, and 2) Not in the  */
//  table already to avoid duplicates.                                                           */
//  Parameters:  connection, inquirer passed from main, required by system                       */
//               sqlf:  SQL to ensure there are foreign keys available                           */
//************************************************************************************************/
module.exports=async function role_add(connection,inquirer,questions,foreign, sqlf){
    try{

        do {
            //*****************************************************************************************/
            // Asking for data to be entered.  No validation, validation is done after getting name  */
            //****************************************************************************************/
            exists =false;
            answers = await inquirer.prompt(questions);

            //******************************************************************/
            // checking if role exist.  If it does, it throws warning message  */
            //******************************************************************/
            results=await connection.promise().query('SELECT * from role where title= ?',[answers.role_title]);
            if (results[0].length>0){
                exists=true
                console.log('\x1b[41m',`Role ${answers.role_title} already exists in the database`,'\x1b[0m')
            };

            //*************************************************************************/
            // title needs to be at least 5 characters long.  Throws error otherwise  */
            //*************************************************************************/
        if (answers.role_title.length<5){
                console.log('\x1b[41m',`Role name ${answers.role_title} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
            }

        } while (exists||answers.role_title.length<5);

        //************************************************************/
        // Getting the ID that corresponds to the department chosen  */
        //************************************************************/
        sql=`SELECT id FROM department WHERE name="${answers.role_depto}"`
        let query = await connection.promise().query(sql);

        //************************************************/
        // Inserting the ID into the department chosen   */
        //************************************************/
        sql=`INSERT INTO role (title,salary,department_id) VALUES("${answers.role_title}",${answers.role_salary},${query[0][0].id})`;
        query = await connection.promise().query(sql);

        //******************************************/
        // Final message that role has been added  */
        //******************************************/
        let questions2=[{type:'input',message:'\x1b[44m'+`Added role ${answers.role_name} to the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
    }catch(error){console.log(error)}
};
