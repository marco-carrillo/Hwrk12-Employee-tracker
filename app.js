// Installing dependencies

let mysql=require('mysql');
const inquirer=require('inquirer');

// connecting to the local server
// let connection=mysql.createConnection({
//     host:  'localhost',
//     user:  'root',
//     password: 'mydogandcat',
//     database: 'employee_system'
// });

// connection.connect(function(err){
//     if(err) throw err;
//     console.log('connected');
// });

// // testing the connection by using a query
// connection.query('select * from employee',function(error,results,fields){
//     if (error) throw error;
//     console.log('The solution is:  ',results[0].last_name);
//     console.log('The solution is:  ',results[0].first_name);
//     console.log('The solution is:  ',results[0].role_id);
//     console.log('The solution is:  ',results[0].manager_id);
// });

//***************************************************/
//  Creating the main menu for the user to choose
//***************************************************/

console.log('before entering');

(async function(){
    console.log('just entered')

    try {
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

    } catch(error) {console.log('Error while running application: ',error)};
})();  // End async function
