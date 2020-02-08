
//**********************************************************************************************************/
//  Departments - Editing :  This function will query all of the departments available and will present
//  them to the user.  User can only add its name.  Upon providing a new name, the system will
//  validate it that 1) is at least 5 characters long, 2) doesn't already exist in the system
//**********************************************************************************************************/
module.exports=async function department_edit(connection,inquirer){
    try{

        //*********************************************************************************/
        // Loading all of the departments existing in the table to the list of choices
        //*********************************************************************************/
        results=await connection.promise().query('SELECT * from department order by name asc');

        //*********************************************************************************/
        // If no records are returned, then will exit since there is nothing to modify.  
        // will use inquirer to send message and pause execution until user press enter.
        //*********************************************************************************/
        if (results[0].length<1){
            let questions=[{type:'input',message:'\x1b[41m'+`No departments to edit.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        }

        //************************************************************************************************/
        // Places all of the results into a list so that the user can choose, which one will be modified
        //************************************************************************************************/
        let options_depto=[];
        for (let i=0;i<results[0].length;i++){options_depto[i]=results[0][i].name;};

        let questions=[{type:'list',message:`Department to edit?... `,choices: options_depto,name:'depto_to_modify'}];
        console.log('');
        console.log('');
        depto_answers=await inquirer.prompt(questions);

        //*************************************************************/
        //  Now, it will ask what is the new name for the department
        //*************************************************************/
        do {

            //***********************************************************************************/
            // Asking name of department.  No validation, validation is done after getting name
            //***********************************************************************************/
            exists =false;
            let question2=[{type:'input',message:`Enter the NEW name of the department...`,name:'department_name'}];
            answers = await inquirer.prompt(question2);

            //**************************************************************************/
            // checking if department exist.  If it does, it throws warning message
            //**************************************************************************/
            let results2=await connection.promise().query('SELECT * from department where name= ?',[answers.department_name]);

            if (results2[0].length>0){
                exists=true;
                console.log('\x1b[41m',`Department ${answers.department_name} already exists in the database`,'\x1b[0m')
            };

            //*****************************************************************************/
            // Department needs to be at least 5 characters long.  Throws error otherwise
            //*****************************************************************************/
            if (answers.department_name.length<5){
                console.log('\x1b[41m',`Department name ${answers.department_name} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
            }

        } while (exists||answers.department_name.length<5);

        console.log('exited validation loop');
        //**************************************************************************************************/
        // Updating record into the table and provides a message.  Using Inquirer to pause execution only.
        //**************************************************************************************************/
        let sql=`UPDATE department SET name="${answers.department_name}" where name="${depto_answers.depto_to_modify}"`
        let query = await connection.promise().query(sql);
        questions=[{type:'input',message:'\x1b[44m'+`Changed department name from ${depto_answers.depto_to_modify} to ${answers.department_name}.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);

    }catch(error){console.log(error)}
}
