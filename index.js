var mysql = require('mysql')
const WebSocket = require('ws');

var con = mysql.createConnection({
    host: "localhost",
    user: "server",
    password: "password",
    database: "website"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("[\x1b[32mOK\x1b[37m] Connected to database!");
});

const ws = new WebSocket.Server({port:8088});

ws.on('connection', function connection(wsConnection) {

    wsConnection.on('message', function incoming(message) {
    //console.log(`server received: ${message}`);
    let user = JSON.parse(message);
    //console.log(user);
    let sql = "SELECT * FROM user WHERE username=? AND password = ?";
    let inserts = [user.username, user.password];
    sql = mysql.format(sql,inserts);
   // console.log(sql);
    con.query(sql, function(err,result,fields){
        if (err) throw err;
         //console.log(result);
        if(result.length == 0)
            {
                console.log(`[\x1b[31mWARN\x1b[37m] Username or password is incorrect, attempted from: ${wsConnection._socket.remoteAddress}`);
                wsConnection.send(`Username or password is incorrect`);
                wsConnection.close();
            }
        else
        {
            console.log(`[\x1b[32mOK\x1b[37m] Login success, from: ${wsConnection._socket.remoteAddress}`)
            wsConnection.send(`Login success`)
        }
        });
    });

});
