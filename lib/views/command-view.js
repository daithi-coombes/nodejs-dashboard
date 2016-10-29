"use strict";

const blessed = require('blessed'),
  contrib = require("blessed-contrib"),
  Database = require('../database.js');

class CommandView{

  constructor(options){

    const self = this,
      config = require('../../config.js');

    this.db = new Database(config);

    this.form = blessed.form({
      top: options.top || "0%",
      label: ` ${options.label} `,
      keys: true,
      mouse: false,
      left: "top",
      height: "10%",
      width: "75%",
      border: {
        type: "line"
      }
    });

    this.textbox = blessed.textbox({
      parent: this.form,
      name: 'cmd',
      inputOnFocus: true,
      mouse: false,
      value: '',
      left: 0,
      top: 0
    });

    this.form.on('submit', function(data){

      // run tests
      if(data.cmd.toLowerCase()==='tests')
        ;// do tests

      // default run sql
      else{
          options.dashboard.onEvent({ type: "stdout", data: "running sql..." });

          const sql = data.cmd.replace(/\s(insert|delete|drop)\s/gi, ' '),
            connection = self.db
                .setConfig(config)
                .connect()
                .then((connection)=>{
                  return self.db.doSql(data.cmd, connection)
                    .then((result)=>{
                      options.dashboard.onEvent({ type: "stdout", data: result });
                    });
                });
      }
    });

    options.parent.append(this.form);
  }
}

module.exports = CommandView;
