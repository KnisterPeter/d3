d3.Module('d3', function(m) {
  m.Class('Main', {
    canvas: null,
    renderer: null,

    construct: function(id, callback) {
      if (!callback && d3.isFunction(id)) {
        callback = id;
        id = undefined;
      }
      if (id) {
        this.canvas = document.getElementById(id);
      } else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.getElementsByTagName('body')[0].appendChild(this.canvas);
      }
      
      this.renderer = new d3.Renderer(this.canvas);
      callback(this.renderer);
    }
  });
  
  m.assert = function(e, m) { if (!e) throw new Error(m); };
  m.bind = function(func, context) {
    return function() { func.apply(context, arguments); };
  };
  m.isString = function(o) { return typeof(o) == 'string'; };
  m.isFunction = function(f) { return typeof(f) == 'function'; };
  m.resolve = function(n) {
    var r = window; 
    var s = n.split('.'); 
    for (var p in s) { r = r[s[p]]; } 
    return r;
  };
});
