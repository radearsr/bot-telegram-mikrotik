const RosApi = require('node-routeros').RouterOSAPI;

const conn = new RosApi({
    host: '192.168.20.1',
    user: 'admin',
    password: '1234',
});

conn.connect()
    .then(() => {
        // Connection successful
        // Let's add an IP address to ether2
        conn.write('/ip/address/add', [
            '=interface=ether2',
            '=address=192.168.90.1',
        ])
            .then((data) => {
              console.log('192.168.90.1 added to ether2!', data);
            })
            .catch((err) => {
                // Oops, got an error
                console.log("Error Catch");
                console.log(err);
            })
            .finally(() => {
              conn.close();
            });
    })
    .catch((err) => {
        console.log(err);
    });