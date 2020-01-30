//*************************************************************************/
//  Aplication main functionality.  Initialization of required variables  *
//*************************************************************************/
const inquirer=require('inquirer');

(async function(){
    console.log('just entered')

    try{

        do {
            //************************************************ */
            // Main menu -> Displaying options for main menu   */
            //************************************************ */
            let questions=[{type:'list',message:`What would you like to do today? `,
                               choices:['Manage Departments','Manage Roles','Manage Employees','Exit'],name:'response'}];

            process.stdout.write('\033c');
            answers=await inquirer.prompt(questions);

            //*************************************************************** */
            // Now, it will do either one of three options based on selection */
            //*************************************************************** */
            questions=[{type:'list',message:`You want to do ${answers.response}, is that correct ? `,
                               choices:['Yes','No'],name:'response'}];
            
            conf=await inquirer.prompt(questions);
        } while (answers.response!=='Exit');


    } catch(error){console.log('Error while running the application:  ',error)};       //  Error handler

})();