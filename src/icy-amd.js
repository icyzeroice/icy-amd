/**
 * @author Ice Zero
 * @namespace AMD
 * @description Asynchronous Module Definition
 */
(function (AMD) {
  'use strict';

  // save the created modules
  let moduleCache = {};

  /**
   * @param {String} exportName --define the name of this module
   * @param {Array} modDeps --the dependencies of this module
   * @param {Function} modConstructor --the module constructor
   */
  AMD.module = function () {

    // turn arguments Object into Array
    let args = [].slice.call(arguments),
        // get the last argument as constructor
        modConstructor = args.pop(),
        // does modDeps exist ?
        modDeps = (args.length && args[arguments.length - 1] instanceof Array) ? args.pop() : [],
        // does exportName exist ?
        exportName = args.length ? args.pop() : null,
        param = [];

    
        
  }

})((function () {
  'use strict';

  // expose AMD to global
  return window.AMD = {};
})());