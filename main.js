d3.Module('d3', function(m) {
  m.Class('Main', {
    canvas: null,
    renderer: null,

    construct: function(id) {
      if (id) {
        this.canvas = document.getElementById(id);
      } else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.getElementsByTagName('body')[0].appendChild(this.canvas);
      }
      
      this.renderer = new d3.Renderer(this.canvas);
    },
    
    getRenderer: function() {
      return this.renderer;
    }
  });
  
  m.bind = function(func, context) {
    return function() { func.apply(context, arguments); };
  };
  m.isString = function(o) { return typeof(o) == 'string'; };
});
