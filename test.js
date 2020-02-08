///*************************/
//  Install dependencies   */
//**************************/
let inquirer=require('inquirer');
let mysql=require('mysql2');
let cTable = require('console.table');
require('events').EventEmitter.defaultMaxListeners = Infinity;
let delet=require('./employee/employee-edit')

//*******************************/
//  connecting to local server  */
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
    main();                      // If connection successfully, then go to start function
  });

  async function main(){
      try{

        await delet(connection,inquirer);
        connection.end();
      }catch(error){console.log(error)}
  }
