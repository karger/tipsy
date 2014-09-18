'use strict';

import Component from '../../component';
import { select } from '../../dom';
import storage from '../../storage';
import TableComponent from '../../components/table/table';

function LogPage() {
  var log = this;

  Component.prototype.constructor.apply(log, arguments);

  // Initially render and then bind the table component.
  log.render().then(function() {
    // Create a scoped table component to show the activity.
    log.table = new TableComponent(select('table', log.el));

    // Add filters.
    log.table.compiled.then(function(template) {
      template.registerFilter('timeSpent', function(val) {
        return moment.duration(val.reduce(function(prev, current) {
          return prev + current.timeSpent;
        }, 0), 'milliseconds').humanize();
      });

      template.registerFilter('lastAccess', function(val) {
        var date = new Date(val[val.length - 1].accessTime).toString();

        return moment(date).format("hA - ddd, MMM Do, YYYY");
      });
    });

    // Render the empty table initially.
    log.table.render();

    // Render with the data found from the log.
    storage.get('log').then(function(log) {
      return { log: log };
    }).then(function(context) {
      log.table.render(context);
    });
  });
}

LogPage.prototype = {
  template: 'pages/log/log.html'
};

LogPage.prototype.__proto__ = Component.prototype;

export default LogPage;
