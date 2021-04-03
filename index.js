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
    var userID = null;
    wsConnection.on('message', async function incoming(message) {
    //console.log(`server received: ${message}`);
    
    let messObj = JSON.parse(message)


    if(messObj.objType === `loginInfo`)
    {
        //console.log(user);
        let sql = "SELECT * FROM user WHERE username=? AND password = ?";
        let inserts = [messObj.username, messObj.password];
        sql = mysql.format(sql,inserts);
    // console.log(sql);
        con.query(sql, function (err,result,fields){
            if (err) 
                throw err;
            console.log(result);

            if(result[0].username === messObj.username && result[0].password === messObj.password)
            {
                console.log(`[\x1b[32mOK\x1b[37m] Login success, from: ${wsConnection._socket.remoteAddress}`)
                wsConnection.send(`Login success`)
                userID = result[0].id;
                console.log(userID);
            }
            else if (result.length == 0)
            {
                console.log(`[\x1b[31mWARN\x1b[37m] Username or password is incorrect, attempted from: ${wsConnection._socket.remoteAddress}`);
                wsConnection.send(`Username or password is incorrect`);
                //wsConnection.close();
            }

        console.log(`userID: ${userID}`);
        if(userID !== undefined && userID !== null)
        {
            sql = `SELECT un.mac, un.type FROM user us JOIN unit un ON (un.userId=us.id) WHERE us.id = ?`;
            let sql2 = `SELECT un.mac, un.type FROM user us JOIN unit un ON (un.userId=us.id) WHERE us.id = 1`;
            inserts = [userID];
            console.log(`user id: ${userID}`);
            sql = mysql.format(sql,inserts);
            console.log(sql);
            con.query(sql,function(err,result,fields){
                if (err) {console.log(err); /*throw err*/};
                console.log(result);
                let data = {
                    type: "deviceList",
                    data: result,
                }
                wsConnection.send(JSON.stringify(data));
                });
        }
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
