///*************************/
//  Install dependencies   */
//**************************/
let inquirer=require('inquirer');
let mysql=require('mysql2');
let cTable = require('console.table');
require('events').EventEmitter.defaultMaxListeners = Infinity;

//*******************************/
//  connecting to local server  */
//*******************************/
let connection = mysql.createConnection({
    port: 3306,                  // Local port name
    host: "localhost",           // Local host name
    user: "root",                // Username
    password: "mydogandcat",     // Password
    database: "employee_system"  // Database we will be connecting to
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    main_menu();                      // If connection successfully, then go to start function
  });

//*************************/
//  Referencing modules   */
//*************************/
let print_logo_screen=require('./print_logo');
let department_view  =require('./department/department-view');
let department_add   =require('./department/department-add' );
let department_edit  =require('./department/department-edit');
let department_delete=require('./department/department-delete');

let role_add   = require('./role/role-add');
let role_view  = require('./role/role-view');
let role_edit  = require('./role/role-edit');
let role_delete= require('./role/role-delete');

let employee_add   =require('./employee/employee-add');
let employee_view  =require('./employee/employee-view');
let employee_edit  =require('./employee/employee-edit');
let employee_delete=require('./employee/employee-delete');

let budget_view  =require('./common/view-budget-depto');
let manager_view =require('./common/view-manager-emp');


//*******************************************************************************/
//  Creating the main menu for the user to choose what the program needs to do  */
//*******************************************************************************/
async function main_menu(){
    try {
        let all_options=['1. Department management (add/edit/view/delete)',
                         '2. Role management (add/edit/view/delete)',
                         '3. Employee-management  (add/edit & change manager]/view/delete)',new inquirer.Separator(),
                         '4. View Employees by Manager','5. View budget by department','6. Exit'];    // main menu choices
        let all_actions=[];
        do {
            //****************************************/
            // First pick:  6 different choices      */
            //****************************************/
            print_logo_screen();  // Printing logo
            let questions=[{type:'list',message:`What would you like to do today? `,choices: all_options,name:'response_chosen'}];
            area=await inquirer.prompt(questions);

            //************************************************************************/
            // If the choice is to manage departments, roles or employees then       */
            // will ask user to choose whether to add, modify or delete  them        */
            //************************************************************************/
            if(area.response_chosen===all_options[0]||area.response_chosen===all_options[1]||area.response_chosen===all_options[2]){
                let prefix='';
                switch (area.response_chosen) {
                    case all_options[0]:
                        prefix='Department';
                        break;
                    case all_options[1]:
                        prefix='Role';
                        break;
                    case all_options[2]:
                        prefix='Employee';
                        break;
                };

            //************************************************************************/
            // Based on user response, will construct the right prompt so that the   */
            // user indicates exactly what is the action the system should take      */
            //************************************************************************/
                all_actions=[`A- ${prefix} - Add`,`B- ${prefix} - Edit`,`C- ${prefix} - Delete`,`D- ${prefix} - View`,`E- Main menu`];
                let questions=[{type:'list',message:`Actions.... `,choices: all_actions,name:'action_chosen'}];
                actions=await inquirer.prompt(questions);
            };  

            //*************************************************************** */
            // Now, the following section will orchestrate which functions    */
            // will be called based on user selection, which could be:        */
            // 1.  Manage departments   (add, edit, delete)                   */
            // 2.  Manage roles         (add, edit, delete)                   */
            // 3.  Manage employees     (add, edit, delete)                   */
            // 4.  View employees by manager                                  */
            // 5.  View budget by department                                  */
            // 6.  Exit the application                                       */
            //*************************************************************** */
            switch (area.response_chosen) {
                case all_options[0]:                        // Manage departments
                    switch(actions.action_chosen){
                        case all_actions[0]:                // Manage departments - add
                            await department_add(connection,inquirer);
                            break;
                        case all_actions[1]:                // Manage departments - edit
                            await department_edit(connection,inquirer);
                            break;
                        case all_actions[2]:                // Manage departments - delete
                            await department_delete(connection,inquirer);
                            break;
                        case all_actions[3]:                // Manage departments - View
                            await department_view(connection,inquirer);
                            break;
                    };
                    break;
                case all_options[1]:                        // Manage roles
                    switch(actions.action_chosen){
                        case all_actions[0]:                // Manage roles - add
                            await role_add(connection,inquirer);
                            break;
                        case all_actions[1]:                // Manage roles - edit
                            await role_edit(connection,inquirer);
                        break;
                        case all_actions[2]:                // Manage roles - delete
                            await role_delete(connection,inquirer);
                            break;
                        case all_actions[3]:                // Manage roles - View
                            await role_view(connection,inquirer);
                            break;
                    };
                    break;
                case all_options[2]:                        // Manage employees
                    switch(actions.action_chosen){
                        case all_actions[0]:                // Manage employees - add
                            await employee_add(connection,inquirer);
                            break;
                        case all_actions[1]:                // Manage employees - edit
                            await employee_edit(connection,inquirer);
                            break;
                        case all_actions[2]:                // Manage employees - delete
                            await employee_delete(connection,inquirer);
                            break;
                        case all_actions[3]:                // Manage Employee - View
                            await employee_view(connection,inquirer);
                            break;
                    };
                    break;
                case all_options[4]:                        // View employees by manager
                    await manager_view(connection,inquirer);
                    break;
                case all_options[5]:                        // View budget by department
                    await budget_view(connection,inquirer);
                    break;
                case all_options[6]:                        // Exit
                    connection.end();
                    break;
            };

        } while (area.response_chosen!==all_options[6]);

    } catch(error) {console.log('Error while running application: ',error)};
};  // End async function