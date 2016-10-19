"use strict";

const passnewCluster="***********",
    usernewCluster="**************";

module.exports = {
    server: '****************',
    userName: usernewCluster,
    password: passnewCluster,
    options: {
        encrypt: true,
        database: '***************',
        port: 1444,
        maxResponseRowCount: 1000,
        minConnections: 5,
        maxConnection: 10,
        timeout: 60 * 1000,
    },
};
