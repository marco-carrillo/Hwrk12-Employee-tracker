//*********************************************************/
//  The following function allows user to add roles
//*********************************************************/

let table_view=require('../common/record-fk-add');

module.exports = async function add_roles(connection,inquirer){

    //*******************************************************************************/
    // Validating that there are foreign key records.  If there are not, it exits.
    // If there are, moves its values into the questions to be asked
    //*******************************************************************************/
    let rawdata= await connection.promise().query('SELECT name FROM department ORDER BY name ASC');
    if(rawdata[0].length===0){
        let questions=[{type:'input',message:'\x1b[41m'+`To add a role, a department is required.  Add a deparment before adding a role...`+'\x1b[0m',name:'dummy'}];
        answersd = await inquirer.prompt(questions);
        return;
    };

    //**********************************/
    // preparing questions to ask user
    //**********************************/
    let deptos=[];
    rawdata.forEach(depto=>deptos.push(depto.name));

    let questions=[{type:'input',message:`Enter the title of the role..........:`,name:'description'},
                   {type:'input',message:`Enter the salary for the role........:`,name:'salary'},
                   {type:'list' ,message:`Enter the department for the role....:`,name:'depto',choices:deptos}];

    //******************************************************/
    // preparing all other values to be passed to function
    //******************************************************/
    let foreign= true;
    let sqlf='SELECT * FROM role ORDER BY title ASC';
    let sql='SELECT * from department WHERE name= ?'
    let sql2='INSERT INTO department SET name=?'

    //*****************************/
    // making the call to program 
    //*****************************/
    await table_view(connection,inquirer,questions,foreign,sqlf,sql,sql2);
}
