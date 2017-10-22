/**
 * @author Ice Zero
 * @description Asynchronous Module Definition for EMACScript5
 */
(function (global) {
  'use strict';

      // cache all the loaded modules
  var moduleCache = {},
      //initScriptNum = document.scripts.length,

      // get script url via module name
      getUrl = function (moduleUrl) {

        // FIXME: improve RegExp
        // TODO: change to use absolute url for cache a module that is expressed by different url
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

        // get absolute url
        // _script.src

        document.getElementsByTagName('body')[0].appendChild(_script);
      },

      loadDependency = function (name, callback) {
        var _module;

        // if cached
        if (_module = moduleCache[name]) {

          // while loaded
          if (_module.state === 'loaded') {

            // while loaded, pass the one object
            // FIXME: any problem?
            setTimeout(callback(_module.exports), 0);
          } else {
            _module.callbacks.push(callback);
          }
        } else {

          // if module haven't cached, load it
          moduleCache[name] = {
            name: name,
            state: 'loading',
            exports: callback,
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
      createModule = function (name, params, callback) {
        var _module, fn;

        if (_module = moduleCache[name]) {

          // let module turn to loaded state
          _module.state = 'loaded';

          // while callback exists, pass the module object
          // FIXME: what to throw
          try {
            _module.exports = callback.apply(callback, params);
          } catch (e) {
            console.log(e);
          }
          while (fn = _module.callbacks.shift()) {

            // export the module object to callbacks
            fn(_module.exports);
          }
        } else {

          // module not cached
          // FIXME: what error
          try {
            callback && callback.apply(callback, params);
          } catch (e) {
            console.log(e);
          }
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
        dependencies = args[args.length - 1] instanceof Array ? args.pop() : [],
        depsLength,

        // if args.length is 0, name is null
        // FIXME: what if the second argument is not Array or Function ?
        name = args.length ? args[0] : null,

        // save modules in dependencies and pass parameters to callback
        params = [],

        countLoadingDeps = 0,

        depsIndex = 0;

    if(depsLength = dependencies.length) {

      // load each dependency
      while (depsIndex < depsLength) {

        // set a closure to save the function scope, especially the variable depsIndex
        (function (depsIndex) {
          countLoadingDeps++;

          // load one module and pass the module object
          loadDependency(dependencies[depsIndex], function (currentDependency) {
            countLoadingDeps--;

            // pass the module object according to read order
            params[depsIndex] = currentDependency;

            // while all the dependencies loaded
            if (!countLoadingDeps) {
              createModule(name, params, callback);
            }
          });
        })(depsIndex);

        depsIndex++;
      }
    } else {

      // while there is no dependency, generate it directly
      createModule(name, [], callback);
    }
  };
})((function () {
  'use strict';

  // cache define as a global function
  return typeof self === 'undefined' ? global : self;
})());
