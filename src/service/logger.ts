const fs = require("fs")

const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
  
  
const logger = (request, response, next) => {
    const current_datetime = new Date();
    const formatted_date =
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
        
    const method = request.method
    const url = request.url
    const status = response.statusCode
    const start = process.hrtime()
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)
    const log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`
    console.log(log)

    const logPath = process.cwd()  + '/logs'
    
    if (fs.existsSync(logPath)) {
        fs.appendFile(logPath + '/logs.txt', log + "\n", err => {
            if (err) {
            console.log(err)
            }
        })
    } else {
        fs.mkdir(logPath, (err) => {
            if (err) {
                throw new err
            } else {
                fs.appendFile(process.cwd() + '/logs/logs.txt', log + "\n", err => {
                    if (err) {
                    console.log(err)
                    }
                })
            }
        })
    }

    next()
};

export default logger