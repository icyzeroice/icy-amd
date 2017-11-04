define(['./event', './dom'], function (events, dom) {

  console.log(events);
  events.a();
  events.b();
  dom();

  // return the function or class you want to export
  return this;
});
