/*
 * # Semantic - Progress
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.progress = function(parameters) {
  var
    $allModules    = $(this),

    moduleSelector = $allModules.selector || '',

    hasTouch       = ('ontouchstart' in document.documentElement),
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.progress.settings, parameters)
          : $.extend({}, $.fn.progress.settings),

        className       = settings.className,
        metadata        = settings.metadata,
        namespace       = settings.namespace,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $bar            = $(this).find(selector.bar),
        $progress       = $(this).find(selector.progress),
        $label          = $(this).find(selector.label),

        element         = this,
        instance        = $module.data(moduleNamespace),
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing progress', settings);
          module.read.metadata();
          module.set.initials();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of progress', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous dropdown for', $module);
          $module
            .removeData(moduleNamespace)
          ;
          instance = undefined;
        },

        complete: function() {
          if(module.percent === undefined || module.percent < 100) {
            module.set.percent(100);
          }
        },

        read: {
          metadata: function() {
            if( $module.data(metadata.percent) ) {
              module.verbose('Current percent value set from metadata');
              module.percent = $module.data(metadata.percent);
            }
            if( $module.data(metadata.total) ) {
              module.verbose('Total value set from metadata');
              module.total = $module.data(metadata.total);
            }
            if( $module.data(metadata.value) ) {
              module.verbose('Current value set from metadata');
              module.value = $module.data(metadata.value);
            }
          },
          currentValue: function() {
            return (module.value !== undefined)
              ? module.value
              : false
            ;
          }
        },

        increment: function(incrementValue) {
          var
            total          = module.total || false,
            edgeValue,
            startValue,
            newValue
          ;
          if(total) {
            startValue     = module.value || 0;
            incrementValue = incrementValue || 1;
            newValue       = startValue + incrementValue;
            edgeValue      = module.total;
            module.debug('Incrementing value by', incrementValue, startValue, edgeValue);
            if(newValue > edgeValue ) {
              module.debug('Value cannot decrement above total', edgeValue);
              newValue = edgeValue;
            }
            module.set.progress(newValue);
          }
          else {
            startValue     = module.percent || 0;
            incrementValue = incrementValue || module.get.randomValue();
            newValue       = startValue + incrementValue;
            edgeValue      = 0;
            module.debug('Incrementing percentage by value', incrementValue, startValue);
            if(newValue < edgeValue ) {
              module.debug('Value cannot decrement below zero');
              newValue = edgeValue;
            }
            module.set.progress(newValue);
          }
        },
        decrement: function(decrementValue) {
          var
            total          = module.total || false,
            startValue,
            newValue
          ;
          if(total) {
            startValue     =  module.value   || 0;
            decrementValue = -decrementValue || -1;
            newValue       =  startValue + decrementValue;
            module.debug('Decrementing value by', decrementValue, startValue);
            if(newValue > module.total ) {
              newValue = module.total;
            }
            module.set.progress(newValue);
          }
          else {
            startValue     =  module.percent || 0;
            decrementValue = -decrementValue || -module.get.randomValue();
            newValue       =  startValue + decrementValue;
            module.debug('Decrementing percentage by value', decrementValue, startValue);
            module.set.progress(newValue);
          }
        },

        get: {
          text: function(templateText) {
            var
              value   = module.value || 0,
              total   = module.total || 0,
              percent = module.percent || 0
            ;
            templateText = templateText || '';
            templateText = templateText
              .replace('{value}', value)
              .replace('{total}', total)
              .replace('{percent}', percent)
            ;
            module.debug('Adding variables to progress bar text', templateText);
            return templateText;
          },
          randomValue: function() {
            module.debug('Generating random increment percentage');
            return Math.floor((Math.random() * settings.random.max) + settings.random.min);
          },
          percent: function() {
            return module.percent || 0;
          },
          value: function() {
            return module.value || false;
          },
          total: function() {
            return module.total || false;
          }
        },

        is: {
          success: function() {
            return $module.hasClass(className.success);
          },
          warning: function() {
            return $module.hasClass(className.warning);
          },
          error: function() {
            return $module.hasClass(className.error);
          }
        },

        set: {
          barWidth: function(value) {
            $bar
              .css('width', value + '%')
            ;
          },
          initials: function() {
            if(settings.value) {
              module.verbose('Current value set in settings', settings.value);
              module.value = settings.value;
            }
            if(settings.total) {
              module.verbose('Current total set in settings', settings.total);
              module.total = settings.total;
            }
            if(settings.percent) {
              module.verbose('Current percent set in settings', settings.percent);
              module.percent = settings.percent;
            }
            if(module.percent) {
              module.set.percent(module.percent);
            }
            else if(module.value) {
              module.set.progress(module.value);
            }
          },
          percent: function(percent) {
            percent = (typeof percent == 'string')
              ? +(percent.replace('%', ''))
              : percent
            ;
            if(percent > 0 && percent < 1) {
              module.verbose('Module percentage passed as decimal, converting');
              percent = percent * 100;
            }
            // round percentage
            if(settings.precision === 0) {
              percent = Math.round(percent);
            }
            else {
              percent = Math.round(percent * (10 * settings.precision) / (10 * settings.precision) );
            }
            module.percent = percent;
            if(module.total) {
              module.value = Math.round( (percent / 100) * module.total);
            }
            module.set.barWidth(percent);
            module.set.barLabel();
            if(percent === 100 && settings.autoSuccess && !(module.is.warning() || module.is.error())) {
              module.debug('Automatically triggering success at 100%');
              module.set.success();
            }
            else if(settings.text.active) {
              module.set.label(settings.text.active);
            }
            $.proxy(settings.onChange, element)(percent, module.value, module.total);
          },
          label: function(text) {
            text = text || '';
            if(text) {
              text = module.get.text(text);
              module.debug('Setting label to text', text);
              $label.text(text);
            }
          },
          barLabel: function(text) {
            if(text !== undefined) {
              $progress.text( module.get.text(text) );
            }
            else if(settings.label == 'ratio' && module.total) {
              module.debug('Adding ratio to bar label');
              $progress.text( module.get.text(settings.text.ratio) );
            }
            else if(settings.label == 'percent') {
              module.debug('Adding percentage to bar label');
              $progress.text( module.get.text(settings.text.percent) );
            }
          },
          success : function(text) {
            text = text || settings.text.success;
            module.debug('Setting success state');
            $module.addClass(className.success);
            $module.removeClass(className.warning);
            $module.removeClass(className.error);
            module.complete();
            if(text) {
              module.set.label(text);
            }
          },
          warning : function(text) {
            text = text || settings.text.warning;
            module.debug('Setting warning state');
            $module.addClass(className.warning);
            $module.removeClass(className.success);
            $module.removeClass(className.error);
            module.complete();
            if(text) {
              module.set.label(text);
            }
          },
          error : function(text) {
            text = text || settings.text.error;
            module.debug('Setting error state');
            $module.addClass(className.error);
            $module.removeClass(className.success);
            $module.removeClass(className.warning);
            module.complete();
            if(text) {
              module.set.label(text);
            }
          },
          total: function(totalValue) {
            module.total = totalValue;
          },
          progress: function(value) {
            var
              numericValue = (typeof value === 'string')
                ? (value.replace(/[^\d.]/g, '') !== '')
                  ? +(value.replace(/[^\d.]/g, ''))
                  : false
                : value,
              percentComplete
            ;
            if(!numericValue) {
              module.error(error.nonNumeric);
            }
            if(module.total) {
              module.value    = numericValue;
              percentComplete = (numericValue / module.total) * 100;
              module.debug('Calculating percent complete from total', percentComplete);
              module.set.percent( percentComplete );
            }
            else {
              percentComplete = numericValue;
              module.debug('Setting value to exact percentage value', percentComplete);
              module.set.percent( percentComplete );
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Element'        : element,
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.progress.settings = {

  name        : 'Progress',
  namespace   : 'progress',

  debug       : false,
  verbose     : true,
  performance : true,

  random      : {
    min : 1,
    max : 3
  },

  label       : 'percent',
  autoSuccess : true,
  precision   : 1,

  percent     : false,
  total       : false,
  value       : false,

  onChange    : function(percent, value, total){},

  error    : {
    method     : 'The method you called is not defined.',
    nonNumeric : 'Progress value is non numeric'
  },

  regExp: {
    variable: /\{\$*[A-z0-9]+\}/g
  },

  metadata: {
    percent : 'percent',
    total   : 'total',
    value   : 'value'
  },


  selector : {
    bar      : '> .bar',
    label    : '> .label',
    progress : '.bar > .progress'
  },

  text : {
    active  : false,
    error   : false,
    success : false,
    warning : false,
    percent : '{percent}%',
    ratio   : '{value} of {total}'
  },

  className : {
    error   : 'error',
    success : 'success',
    warning : 'warning'
  }

};


})( jQuery, window , document );