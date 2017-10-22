/**
 * @author Ice Zero
 * @description Asynchronous Module Definition for EMACScript5
 */
(function (global) {
  'use strict';

      // cache all the loaded modules
  var moduleCache = {},

      moduleLine = [],

      // get script url via module name
      getUrl = function (moduleUrl) {

        // FIXME: improve RegExp
        // make sure of extension name '.js'
        return moduleUrl.replace(/\.js$/, '').concat('.js');
      },

      // insert async script in document
      loadScript = function (scriptUrl) {

        // TODO: add node enviroment
        var _script = document.createElement('script');

        // AMD core operation
        _script.async = true;

        _script.charset = 'utf-8';
        _script.type = 'text/javascript';
        _script.src = scriptUrl;

        document.getElementsByTagName('head')[0].appendChild(_script);
      },

      loadModule = function (name, callback) {
        var _module = moduleCache[name];

        // if cached
        if (_module) {

          // while loaded
          if (_module.state === 'loaded') {
            setTimeout(callback(_module.params), 0);
          } else {
            _module.callbacks.push(callback);
          }
        } else {

          // if module haven't cached
          moduleCache[name] = {
            name: name,
            state: 'loading',
            exports: null,
            callbacks: [callback]
          };

          loadScript(getUrl(name));
        }
      },

      /**
       * @param {String} name
       * @param {Array} params
       * @param {Function} callback
       */
      setModule = function (name, params, callback) {
        var _module = moduleCache[name], fn;

        if (_module) {

          // let module turn to loaded state
          _module.state = 'loaded';

          // while callback exists, pass the module object
          _module.exports = callback ? callback.apply(_module, params) : null;

          while (fn = _module.callbacks.shift()) {

            // export the module object to callbacks
            fn(_module.exports);
          }
        } else {

          // Asynchronous module
          callback && callback.apply(_module, params);
        }

      };

  /**
   * @param {String} name
   * @param {Array} dependencies
   * @param {Function} callback --@param {modules} arguments
   */
  global.define = function () {

    // Object -> Array
    var args = [].splice.call(arguments, 0),

        // weather callback exist or not
        callback = typeof args[args.length - 1] === 'function' ? args.pop() : null,

        // dependencies is Array
        dependencies = args[args.length -1] instanceof Array ? args.pop() : [],
        depsLength,

        // if args.length is 0, name is null
        // FIXME: what if the second argument is not Array or Function ?
        name = args.length ? args[0] : null,

        // save modules in dependencies and pass parameters to callback
        params = [],

        countLoadingDeps = 0,

        currentIndex = 0;

    if(depsLength = dependencies.length) {

      // load each dependency
      while (currentIndex < depsLength) {

        // set a closure to save the function scope, especially the variable currentIndex
        (function (currentIndex) {
          countLoadingDeps++;

          // load one module and pass the module object
          loadModule(dependencies[currentIndex], function (currentModule) {
            countLoadingDeps--;


            params[currentIndex] = currentModule;

            // while all the module loaded
            if (!countLoadingDeps) {
              setModule(name, params, callback);
            }
          });
        })(currentIndex);
        currentIndex++;

      }
    } else {

      // while there is no dependency, generate it directly
      setModule(name, [], callback);
    }
  };
})((function () {
  'use strict';

  // cache define as a global function
  return typeof self === 'undefined' ? global : self;
})());
