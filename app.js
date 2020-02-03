///********************************** */
//  Install dependencies 
//********************************** */
let inquirer=require('inquirer');
let mysql=require('mysql2');
require('events').EventEmitter.defaultMaxListeners = Infinity;

//*******************************/
//  connecting to local server 
//*******************************/
let connection = mysql.createConnection({
    host: "localhost",           // local host name
    port: 3306,                  // Your port; if not 3306
    user: "root",                // Your username
    password: "mydogandcat",     // Your password
    database: "employee_system"      // Database we will be connecting to
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    main_menu();                      // If connection successfully, then go to start function
  });

//************************************************************************************************************/
//  Departments - Adding.  This function will add a new department.  It will first ask the user to enter a
//  valid department name.  Validation will include 1) greater than 3 characters, and 2) Not in the 
//  table already to avoid duplicates.
//************************************************************************************************************/
async function department_add(){
    try{
        do {

            // Asking name of department.  No validation, validation is done after getting name
            exists =false;
            let questions=[{type:'input',message:`Enter the name of the department...`,name:'department_name'}];
            answers = await inquirer.prompt(questions);

            // checking if department exist.  If it does, it throws warning message
            results=await connection.promise().query('SELECT * from department where name= ?',[answers.department_name]);
            if (results[0].length>0){
                exists=true
                console.log('\x1b[41m',`Department ${answers.department_name} already exists in the database`,'\x1b[0m')
            };

            // Department needs to be at least 5 characters long.  Throws error otherwise
            if (answers.department_name.length<5){
                console.log('\x1b[41m',`Department name ${answers.department_name} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
            }

        } while (exists||answers.department_name.length<5);

        // Inserting record into the table and provides a message.  Using Inquirer to pause execution only.
        let query = await connection.promise().query("INSERT INTO department SET name=?",[answers.department_name]);
        let questions=[{type:'input',message:'\x1b[44m'+`Added department ${answers.department_name} to the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);

    }catch(error){console.log(error)}
};

//**********************************************************************************************************/
//  Departments - Editing :  This function will query all of the departments available and will present
//  them to the user.  User can only add its name.  Upon providing a new name, the system will
//  validate it that 1) is at least 5 characters long, 2) doesn't already exist in the system
//**********************************************************************************************************/
async function department_edit(){
    try{

        // Loading all of the departments existing in the table to the list of choices
        results=await connection.promise().query('SELECT * from department order by name asc');

        // If no records are returned, then will exit since there is nothing to modify.  
        // will use inquirer to send message and pause execution until user press enter.
        if (results[0].length<1){
            let questions=[{type:'input',message:'\x1b[41m'+`No departments to edit.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        }

        // Places all of the results into a list so that the user can choose, which one will be modified
        let options_depto=[];
        for (let i=0;i<results[0].length;i++){options_depto[i]=results[0][i].name;};

        let questions=[{type:'list',message:`Department to edit?... `,choices: options_depto,name:'depto_to_modify'}];
        console.log('');
        console.log('');
        depto_answers=await inquirer.prompt(questions);

        //  Now, it will ask what is the new name for the department
        do {

            // Asking name of department.  No validation, validation is done after getting name
            exists =false;
            let question2=[{type:'input',message:`Enter the NEW name of the department...`,name:'department_name'}];
            answers = await inquirer.prompt(question2);

            // checking if department exist.  If it does, it throws warning message
            let results2=await connection.promise().query('SELECT * from department where name= ?',[answers.department_name]);

            if (results2[0].length>0){
                exists=true;
                console.log('\x1b[41m',`Department ${answers.department_name} already exists in the database`,'\x1b[0m')
            };

            // Department needs to be at least 5 characters long.  Throws error otherwise
            if (answers.department_name.length<5){
                console.log('\x1b[41m',`Department name ${answers.department_name} is invalid.  Needs to be at least 5 characters long`,'\x1b[0m');
            }

        } while (exists||answers.department_name.length<5);

        console.log('exited validation loop');
        // Updating record into the table and provides a message.  Using Inquirer to pause execution only.
        let sql=`UPDATE department SET name="${answers.department_name}" where name="${depto_answers.depto_to_modify}"`
        let query = await connection.promise().query(sql);
        questions=[{type:'input',message:'\x1b[44m'+`Changed department name from ${depto_answers.depto_to_modify} to ${answers.department_name}.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);

    }catch(error){console.log(error)}
}

//*************************************************************************************************/
//  Departments - Deleting.  The following function loads all of the departments from the table,
//  and then lets the user select which one will be deleted. 
//*************************************************************************************************/
async function department_delete(){
    try{

        // Loading all of the departments existing in the table to the list of choices
        results=await connection.promise().query('SELECT * from department order by name asc');

        // If no records are returned, then will exit since there is nothing to modify.  
        // will use inquirer to send message and pause execution until user press enter.
        if (results[0].length<1){
            let questions=[{type:'input',message:'\x1b[41m'+`No departments to delete.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        }

        // Places all of the results into a list so that the user can choose, which one will be modified
        let options_depto=[];
        for (let i=0;i<results[0].length;i++){options_depto[i]=results[0][i].name;};

        let questions=[{type:'list',message:`Department to delete?... `,choices: options_depto,name:'depto_to_delete'}];
        console.log('');
        console.log('');
        depto_answers=await inquirer.prompt(questions);

        // Deleting record from the table and provides a message.  Using Inquirer to pause execution only.
        let sql=`DELETE FROM department where name="${depto_answers.depto_to_delete}"`;
        console.log(sql);
        let query = await connection.promise().query(sql);

        questions=[{type:'input',message:'\x1b[44m'+`Deleted department ${depto_answers.depto_to_delete} from the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);

    }catch(error){console.log(error)}
    // questions=[{type:'input',message:'\x1b[44m'+`Deleted department ${depto_answers.depto_to_delete} from the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
    // answersd = await inquirer.prompt(questions);
}

//***************************************************************/
//  The following function allows user to view all departments
//***************************************************************/
async function view_departments(){
    try{
        return;
    }catch(error) {console.log(error)}
}

//*******************************************************************************/
//  The following function allows user to view all employees by manager
//*******************************************************************************/
async function view_employees_by_manager(){
    try{
        return
    }catch(error) {console.log(error)}
}

//************************************************************************/
//  The following function allows user to view budgets  by department
//************************************************************************/
async function view_budget_by_department(){
    try{
        return;
    }catch(error) {console.log(error)}
}

//***************************************************/
//  Creating the main menu for the user to choose
//***************************************************/
async function main_menu(){
    console.log('just entered')

    try {
        let all_options=['1. Department management','2. Role management','3. Employee-management',
                         '4. View Employees by Manager','5. View budget by department','6. Exit'];    // main menu choices
        let all_actions=[];
        do {
            //************************************************ */
            // Main menu -> Displaying options for main menu   */
            //************************************************ */

            // process.stdout.write('\033c');
            process.stdout.write('\033c');  // Clearing screen
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');
            console.log('*************************************************************************************************');
            console.log('*****                                                                                       *****');  
            console.log('*****                     EMPLOYEE MANAGEMENT SYSTEM 5.1(C) Platinum                        *****');  
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
            area=await inquirer.prompt(questions);

            //***********************************************************************************************************/
            // If the choice is to manage departments, roles or employees then choose whether to add, modify or delete  */
            //***********************************************************************************************************/
            if(area.response_chosen!==all_options[3]&&area.response_chosen!==all_options[4]&&area.response_chosen!==all_options[5]){

                let prefix='';
                switch (area.response_chosen) {
                    case all_options[0]:
                        prefix='Department - ';
                        break;
                    case all_options[1]:
                        prefix='Role - ';
                        break;
                    case all_options[2]:
                        prefix='Employee - ';
                        break;
                }

                all_actions=[prefix+'Add',prefix+'Edit',prefix+'Delete',prefix+'View','Main menu'];
                let questions=[{type:'list',message:`Actions.... `,choices: all_actions,name:'action_chosen'}];
                actions=await inquirer.prompt(questions);
            };

            //*************************************************************** */
            // Now, it will either do one of the following three options      */
            // 1.  Manage departments   (add, edit, delete)                   */
            // 2.  Manage roles         (add, edit, delete)                   */
            // 3.  Manage employees     (add, edit, delete)                   */
            // 4.  View employees by manager                                  */
            // 5.  View budget by department                                  */
            // 6.  Exit the application (add, edit, delete)                   */
            //*************************************************************** */

            switch (area.response_chosen) {
                case all_options[0]:                        // Manage departments
                    switch(actions.action_chosen){
                        case all_actions[0]:                // Manage departments - add
                            await department_add();
                            break;
                        case all_actions[1]:                // Manage departments - edit
                            await department_edit();
                            break;
                        case all_actions[2]:                // Manage departments - delete
                            await department_delete();
                            break;
                        case all_actions[3]:                // Manage departments - View
                            view_departments();
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
                    break;
                case all_options[3]:                        // View employees by manager
                    view_employees_by_manager();
                    break;
                case all_options[4]:                        // View budget by department
                    view_budget_by_department();
                    break;
                case all_options[5]:                        // Exit
                    connection.end();
                    break;
            };

        } while (area.response_chosen!==all_options[5]);

    } catch(error) {console.log('Error while running application: ',error)};
};  // End async function
