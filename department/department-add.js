//*********************************************************/
//  The following function allows user to add departments
//*********************************************************/

let table_view=require('../common/record-nfk-add');

module.exports = async function add_departments(connection,inquirer){
    let questions=[{type:'input',message:`Enter the name of the department...`,name:'description'}];
    let sql='SELECT * from department WHERE name= ?'
    let sql2='INSERT INTO department SET name=?'
    await table_view(connection,inquirer,questions,sql,sql2);
}
