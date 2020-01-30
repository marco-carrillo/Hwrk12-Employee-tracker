//******************************/
// Installing dependencies
//******************************/

let mysql=require('mysql');
const inquirer=require('inquirer');

//*****************************/
//  Connecting to the server
//*****************************/

//connecting to the local server
let connection=mysql.createConnection({
    host:  'localhost',
    user:  'root',
    password: 'mydogandcat',
    database: 'employee_system'
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected');
});

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

(async function(){
    console.log('just entered')

    try {
        let all_options=['Department management','Role management','Employee-management','Exit'];    // main menu choices
        let all_actions=['Add','Edit','Delete','Main menu'];
        do {
            //************************************************ */
            // Main menu -> Displaying options for main menu   */
            //************************************************ */

            process.stdout.write('\033c');
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');
            console.log('*****                                                                                       *****');  
            console.log('*****                           EMPLOYEE MANAGEMENT SYSTEM 5.1(C)                           *****');  
            console.log('*****                                                                                       *****');  
            console.log('*****                                        *****                                          *****');  
            console.log('*****                                   *******     ***                                     *****');  
            console.log('*****                                ********     ********                                  *****');  
            console.log('*****                              *********     **********                                 *****');  
            console.log('*****                              *******     *************                                *****');  
            console.log('*****                              *****     ***************                                *****');  
            console.log('*****                                *     ***************                                  *****');  
            console.log('*****                                   ***************                                     *****');  
            console.log('*****                                        *****                                          *****');  
            console.log('*****                                                                                       *****');  
            console.log('*****                DELIVERING SOUND EMPLOYEE MANAGEMENT SYSTEMS SINCE 1875                *****');  
            console.log('*****                                                                                       *****');  
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');

            //************************************************ */
            // Main menu -> Displaying options for main menu   */
            //************************************************ */
            let questions=[{type:'list',message:`What would you like to do today? `,choices: all_options,name:'response_chosen'}];
            answers=await inquirer.prompt(questions);

            //**************************************************************/
            // If the choice is not to exit, then show actions available   */
            //**************************************************************/
            if(answers.response_chosen!==all_options[3]){
                let questions=[{type:'list',message:`Actions.... `,choices: all_actions,name:'action_chosen'}];
                actions=await inquirer.prompt(questions);
            };


            //*************************************************************** */
            // Now, it will either do one of the following three options      */
            // 1.  Manage departments                                         */
            // 2.  Manage roles                                               */
            // 3.  Manage employees                                           */
            // 4.  Exit the application                                       */
            //*************************************************************** */

            switch (answers.response_chosen) {
            case all_options[0]:                        // Manage departments
                switch(actions.action_chosen){
                    case all_actions[0]:                // Manage departments - add
                        data=await inquirer.prompt(questions_depto())
                        break;
                    case all_actions[1]:                // Manage departments - edit
                        break;
                    case all_actions[2]:                // Manage departments - delete
                        break;
                };
                break;
            case all_options[1]:                        // Manage roles
                switch(actions.action_chosen){
                    case all_actions[0]:                // Manage roles - add
                        break;
                    case all_actions[1]:                // Manage roles - edit
                        break;
                    case all_actions[2]:                // Manage roles - delete
                        break;
                };
                break;
            case all_options[2]:                        // Manage employees
                switch(actions.action_chosen){
                    case all_actions[0]:                // Manage employees - add
                        break;
                    case all_actions[1]:                // Manage employees - edit
                        break;
                    case all_actions[2]:                // Manage employees - delete
                        break;
                };
            };

        } while (answers.response_chosen!==all_options[3]);

    } catch(error) {console.log('Error while running application: ',error)};
})();  // End async function
