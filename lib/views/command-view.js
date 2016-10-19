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
      mouse: true,
      left: "top",
      height: "10%",
      width: "75%",
      border: {
        type: "line"
      }
    });

    this.textbox = blessed.textbox({
      parent: this.form,
      name: 'sql',
      inputOnFocus: true,
      value: '',
      left: 0,
      top: 0
    });

    this.form.on('submit', function(data){

      options.dashboard.onEvent({ type: "stdout", data: "running sql..." });

      const connection = self.db
        .setConfig(config)
        .connect()
        .then((connection)=>{
          return self.db.doSql(data.sql, connection)
            .then((result)=>{
              options.dashboard.onEvent({ type: "stdout", data: result });
            });
        });
    });

    options.parent.append(this.form);
  }
}

module.exports = CommandView;
