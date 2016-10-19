"use strict"

const Promise = require('bluebird'),
    Tedious = require('tedious').Connection,
    Request = require('tedious').Request;

/**
 * Connection Module.
 * @author daithi coombes <webeire@gmail.com>
 */
class Database{

    /**
     * Constructor.
     * @param Object config The config object.
     */
    constructor(config){
        this.config = config
    }

    connect(){

        const self = this,
            config = self.getConfig(),
            _connection = new Tedious(config);

        return new Promise((resolve, reject)=>{

            _connection.on('connect', err => {
                if(err) return reject(err);

                return resolve(_connection);
            });

            _connection.on('error', err => {

                return reject(err);
            });
        });
    }

    doSql(sql, connection){

        return new Promise((resolve, reject)=>{

            const request = new Request(sql, err => {
                if(err) return Promsie.reject(err);

                return resolve(response);
            });
            let result = "",
                response = [],
                rowCount = 0;

            request.on('row', columns => {

                const row = {};

                columns.forEach(column => {
                    if (column.metadata && column.metadata.colName)
                        row[column.metadata.colName] = column.value;
                });

                rowCount++;
                response.push(row);
            });

            connection.execSql(request);
        });
    }

    /**
     * Get config.
     * @return Object returns current config.
     */
    getConfig(){
        return this.config;
    }

    /**
     * setConfig.
     * @param Object config The config object.
     * @return Connection returns self for chaining.
     */
    setConfig(config){
        this.config = config
        return this;
    }
}

module.exports = Database
