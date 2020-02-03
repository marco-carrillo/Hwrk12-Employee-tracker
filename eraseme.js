///********************************** */
//  Install dependencies 
//********************************** */
const inquirer=require('inquirer');
const mysql=require('mysql2');

//*******************************/
//  connecting to local server 
//*******************************/
const pool = mysql.createPool({
    host: "localhost",           // local host name
    port: 3306,                  // Your port; if not 3306
    user: "root",                // Your username
    password: "mydogandcat",     // Your password
    database: "employee_system", // Database we will be connecting to
    connectionLimit: 10,         // Maximum number of reusable pools
    waitForConnections: true,    // Reuse prior pools
    queueLimit: 0
  });


  async function select_depto(name){
        const result = await pool.promise().query(`SELECT * from department WHERE name ="${name}"`) ;
        console.log('Result is in....',result);
        if (!result[0].length < 1) {
        throw new Error('Post with this id was not found');
        }
        return result[0][0];
  }

  select_depto('HR');
