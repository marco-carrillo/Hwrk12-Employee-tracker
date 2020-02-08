//***********************************************************************************/
//  Record - Deleting.  The following function loads all of the records from a table,
//  and then lets the user select which one will be deleted. 
//  also, checks another table for potential records
//  parameters:  connection, inquirer are objects required.
//               sql1    =SQL to figure out if there are records to delete and which ones
//               dtable  = Name of the table from where we will delte
//               foreign = boolean, whether to check for another table
//               sql2    =SQL to run to figure out if there are child records
//               fdelete = field to be used to build the query to delete the record
//***********************************************************************************/
module.exports=async function record_delete(connection,inquirer,sql1,dtable,foreign,sql2,fdelete){
    try{
        //**************************************************************************** */
        // Loading all of the departments existing in the table to the list of choices
        //**************************************************************************** */
        results=await connection.promise().query(sql1);

        //**************************************************************************** */
        // If no records are returned, then will exit since there is nothing to modify.  
        // will use inquirer to send message and pause execution until user press enter.
        //**************************************************************************** */
        if (results[0].length<1){
            let questions=[{type:'input',message:'\x1b[41m'+`No ${dtable}departments to delete.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
            answersd = await inquirer.prompt(questions);
            return;
        }

        //*************************************************************************************************/
        // Places all of the results into a list so that the user can choose, which one will be modified
        //*********************************************************************************************** */
        let options_rcd=[];
        for (let i=0;i<results[0].length;i++){options_rcd[i]=results[0][i].name;};

        let questions=[{type:'list',message:`${dtable} to delete?... `,choices: options_rcd,name:'to_delete'}];
        console.log('');
        console.log('');
        rcd_answers=await inquirer.prompt(questions);
        
        //********************************************************************************************** */
        // Will check that there are no child records in other related tables.  If there are, 
        // they need to be eliminated first, and then the record can be deleted.
        //********************************************************************************************** */
        if(foreign===true){

            let sql3=sql2+rcd_answers.to_delete+'");'             // Checks for child records 
            let frg_rcds = await connection.promise().query(sql3);   // executing SQL

            if (frg_rcds[0][0].nr_rcds===0){   // This means, there are no records
                    //************************************************************************************************** */
                    // Deleting record from the table and provides a message.  Using Inquirer to pause execution only.
                    //************************************************************************************************** */
                    let sql=`DELETE FROM ${dtable} WHERE ${fdelete}="${rcd_answers.to_delete}"`;
                    let query = await connection.promise().query(sql);

                    questions=[{type:'input',message:'\x1b[44m'+`Deleted "${rcd_answers.to_delete}" from the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
                    answersd = await inquirer.prompt(questions);
            } else {
                questions=[{type:'input',message:'\x1b[41m'+`There are ${frg_rcds[0][0].nr_rcds} record that reference this record.  Please delete them before deleting the ${dtable}. Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
                answersd = await inquirer.prompt(questions);
            }
        } else {    // if there are not foreign keys 
                    //************************************************************************************************** */
                    // Deleting record from the table and provides a message.  Using Inquirer to pause execution only.
                    //************************************************************************************************** */
                    let sql=`DELETE FROM ${dtable} WHERE ${fdelete}="${rcd_answers.to_delete}"`;
                    let query = await connection.promise().query(sql);

                    questions=[{type:'input',message:'\x1b[44m'+`Deleted "${rcd_answers.to_delete}" from the table.  Press the enter key to continue...`+'\x1b[0m',name:'dummy'}];
                    answersd = await inquirer.prompt(questions);
        }
    }catch(error){console.log(error)}
}