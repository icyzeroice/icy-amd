AMD.module('./dom', function () {
  return {
    // getElementById
    g: function (id) {
      console.log(document.getElementById(id));
      return document.getElementById(id);
    },
    // insert html in element id
    html: function (id, html) {
      if (html) {
        this.g(id).innerHTML = html;
      } else {
        return this.g(id).innerHTML;
      }
    }
  };
});
