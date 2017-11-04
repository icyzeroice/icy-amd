define('./event', ['./dom'], function (dom) {


  console.log('this is event module', dom);

  return {
    a: function () { console.log('event.a') },
    b: function () {
      dom();
    }
  };
});
