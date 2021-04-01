var mysql = require('mysql')
const WebSocket = require('ws');
var mqtt = require('mqtt');
var mqttcli = mqtt.connect('koderman.net:1883')

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
    var userID;
    wsConnection.on('message', function incoming(message) {
    //console.log(`server received: ${message}`);
    
    let messObj = JSON.parse(message)


    if(messObj.objType === `loginInfo`)
    {
    //console.log(user);
    let sql = "SELECT * FROM user WHERE username=? AND password = ?";
    let inserts = [messObj.username, messObj.password];
    sql = mysql.format(sql,inserts);
   // console.log(sql);
    con.query(sql, function(err,result,fields){
        if (err) throw err;
        console.log(result);

        console.log(userID);
        if(result.length == 0)
            {
                console.log(`[\x1b[31mWARN\x1b[37m] Username or password is incorrect, attempted from: ${wsConnection._socket.remoteAddress}`);
                wsConnection.send(`Username or password is incorrect`);
                //wsConnection.close();
                userID = result[0].id;
            }
        else
        {
            console.log(`[\x1b[32mOK\x1b[37m] Login success, from: ${wsConnection._socket.remoteAddress}`)
            wsConnection.send(`Login success`)
        }
        });

    sql = `SELECT un.mac, un.type FROM user us JOIN unit un ON (un.userId=us.id) WHERE us.id = 1`;
    console.log(sql);
    con.query(sql, function(err,result,fields){
        if (err) {console.log(err); /*throw err*/};
        console.log(result);
        //ws.send(JSON.stringify(result));
        });
    }
    else if(messObj.objType===`debugMessage`)
        console.log(messObj.message);
    else if(messObj.objType===`mqttReq`)
    {
        // Handle mqtt stuff
    }

   
    //let sql:
});
    


});
