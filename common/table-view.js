


//***************************************************************/
//  The following function allows user to view all departments
//***************************************************************/

module.exports = async function view_content(connection,inquirer,sql,db_name){
    try{
        //******************************************************************************/
        // Loading all of the departments existing in the table to the list of choices
        //******************************************************************************/
        let cTable = require('console.table');
        let results=await connection.promise().query(sql);

        //******************************************************************************/
        // If no records are returned, then will exit since there is nothing to modify.  
        // will use inquirer to send message and pause execution until user press enter.
        //******************************************************************************/
        if (results[0].length<1){
            let questions=[{type:'input',message:'\x1b[41m'+`No ${db_name} to view.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        }

        console.log('');
        console.log('');
        console.table(results[0]);

        questions=[{type:'input',message:'\x1b[44m'+`Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
        return;
    }catch(error) {console.log(error)}
}
