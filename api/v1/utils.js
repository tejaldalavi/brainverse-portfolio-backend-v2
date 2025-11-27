const pool = require("../config/database").default;
const moment = require("moment");
const getCurrentDate = () => {
        const objectDate = new Date();
        const day = objectDate.getDate();
        const month = objectDate.getMonth() + 1;
        const year = objectDate.getFullYear();
        const dateString = `${year}-${month <= 9 ? `0${month}` : month}-${day <= 9 ? `0${day}` : day}`
    return dateString;
}

const updateDate =async(taskId)=>{
    const getQuery=`SELECT * FROM subTask WHERE taskId=${taskId}`;
    const getAllSubTask=await pool.query(getQuery);

    const getTaskQuery=`SELECT * FROM task WHERE id=${taskId}`;
    const getTask=await pool.query(getTaskQuery);

    let startD=moment(getTask[0][0].startDate) ;
    let dueD=moment(getTask[0][0].dueDate);
    
    const strFormat = "YYYY-MM-DD";
    getAllSubTask[0].forEach(e => {
    const currentStartDate = moment(e.startDate, strFormat);
    const currentDueDate = moment(e.dueDate, strFormat);

        if (currentStartDate.isBefore(startD)) {
            startD = currentStartDate;
        }
        if (currentDueDate.isAfter(dueD)) {
            dueD = currentDueDate;
        }
    });
    startD = startD.format(strFormat);
    dueD = dueD.format(strFormat)

    const updateTask=`UPDATE task SET startDate="${startD}",dueDate="${dueD}" WHERE id=${taskId}`;
    await pool.query(updateTask);

}
module.exports = {getCurrentDate,updateDate}