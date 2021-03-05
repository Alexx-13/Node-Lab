const fs = require("fs")

const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
  
  
const logger = (request, response, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds()
        
    let method = request.method
    let url = request.url
    let status = response.statusCode
    const start = process.hrtime()
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)
    let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`
    console.log(log)

    fs.appendFile(__dirname + '/logs.txt', log + "\n", err => {
        if (err) {
        console.log(err)
        }
    })
    
    next()
};

export default logger