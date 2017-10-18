AMD.module('./event', ['./dom'], function (dom) {
  let events = {
    // bind ['type'] event to element id with function fn
    on: function (id, type, fn) {
      dom.g(id)['on' + type] = fn;
    }
  }
  return events;
});
