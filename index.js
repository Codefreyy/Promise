// const fs = require('fs')
// fs.readFile('./data/data.json', 'utf-8', function(err, data) {
//     if(err) {
//         console.log(err);
//         return
//     }
//     console.log(data);
// })

const fs = require('fs')
const util = require('./util')
const fsFunctions = util.promisifyAll(fs)

fsFunctions.readFileAsync('./data/data.json', 'utf-8').then((res)=> {
    console.log('res', res);
}, (reason)=> {
    console.log('reason', reason);
})