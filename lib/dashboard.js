"use strict";

const _ = require("lodash");
const blessed = require("blessed");

const StreamView = require("./views/stream-view");
const CommandView = require("./views/command-view");
const EventLoopView = require("./views/eventloop-view");
const MemoryView = require("./views/memory-view");
const CpuView = require("./views/cpu-view");
const EventEmitter = require("events");

class Dashboard {

  constructor(options) {
    this.screen = blessed.screen({
      smartCSR: true,
      title: `${options.appName}`
    });

    this.screen.key(["escape", "q", "C-c"], () => {
      process.exit(0); // eslint-disable-line no-process-exit
    });

    this.eventPump = new EventEmitter();
    this._createView();

  }

  onEvent(event) {
    this.eventPump.emit(event.type, event.data);
    this.screen.render();
  }

  _createView() {
    // fixes weird scrolling issue
    const container = blessed.box({});
    this.screen.append(container);

    const commandView = new CommandView({
        parent: container,
        label: "sql",
        color: "green",
        dashboard: this
    });

    this.screen.key(['escape', 's'], function() {
        // Set the focus on the input.
        commandView.textbox.focus();
    });
    commandView.textbox.key(['enter'], function(){
        commandView.form.submit();
    });

    const stdoutView = new StreamView({
      parent: container,
      label: "stdout",
      color: "green",
      top: "10%"
    });

    this.eventPump.addListener("stdout", stdoutView.onEvent.bind(stdoutView));

    const stderrView = new StreamView({
      parent: container,
      label: "stderr",
      color: "red",
      top: "50%"
    });

    this.eventPump.addListener("stderr", stderrView.onEvent.bind(stderrView));

    const metrics = [MemoryView, CpuView, EventLoopView];

    _.each(metrics, (Metric) => {
      const view = new Metric({ parent: this.screen });
      this.eventPump.addListener("metrics", view.onEvent.bind(view));
    });

    this.screen.render();
  }

}

module.exports = Dashboard;
