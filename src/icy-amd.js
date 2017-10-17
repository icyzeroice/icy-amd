/**
 * @author Ice Zero
 * @namespace AMD
 * @description Asynchronous Module Definition
 */
(function (AMD) {
  'use strict';

  // save the created modules
  let moduleCache = {},

      // get relative url of module
      getUrl = (moduleUrl) => String(moduleUrl).replace(/\.js$/g, '') + '.js';

      // load module from src
      loadScript = function (src) {
        let _script = document.createElement('script');
        _script = {
          type: 'text/javascript',
          charset: 'utf8',
          async: true,
          src: src
        };
        // TODO: better loading ways? considering different environment?
        document.getElementsByTagName('head')[0].appendChild(_script);
      },

      setModule = function () {

      },

      /**
       * @param {String} moduleUrl --where to load module
       * @param {Function} callback --execute callback when module loaded
       */
      loadModule = function (moduleUrl, callback) {

        // dependencies
        let _module;

        // module cached
        if (moduleCache[moduleUrl]) {
          _module = moduleCache[moduleUrl];
          if (_module.status === 'loaded') {
            setTimeout(callback(_module.args), 0);
          } else {
            // cache the callback until module loaded
            _module.onlaod.push(callback);
          }
        } else {
          // if module has not cached yet, start caching it
          moduleCache[moduleUrl] = {
            moduleUrl: moduleUrl,
            status: 'loading',
            args: null,
            // onlaod: Array
            onlaod: [callback]
          };

          // load file matching url
          loadScript(getUrl(moduleUrl));
        }
      };

  /**
   * @param {String} exportName --define the name of this module
   * @param {Array} modDeps --the dependencies of this module
   * @param {Function} modConstructor --the module constructor
   */
  AMD.module = function () {

    // turn arguments Object into Array
    let args = [].slice.call(argumentns),

        // get the last argument as constructor
        modConstructor = args.pop(),

        // does modDeps exist ?
        modDeps = (args.length && args[arguments.length - 1] instanceof Array) ? args.pop() : [],

        // does exportName exist ?
        exportName = args.length ? args.pop() : null,

        //
        params = [],

        // get the length of dependencies
        modLength = modDeps.length,

        // count the loaded module
        i = 0;

    if (modLength) {
      while (i < modLength) {
        // use Anonymous Function to save field i
        (function (i) {
          loadModule(modDeps[i], function (mod) {
            params[i] = mod;

          })
        })();
      }
    }
  };



})((function () {
  'use strict';

  // expose AMD to global
  return window.AMD = {};
})());
