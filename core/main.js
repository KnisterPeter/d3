d3.Module('d3', function(m) {
  m.Class('Main', {
    canvas: null,
    renderer: null,
    input: null,

    construct: function(config, callback) {
      if (!callback && d3.isFunction(config)) {
        callback = config;
        config = {};
      }
      if (config.id) {
        this.canvas = document.getElementById(config.id);
      } else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', d3.bind(function() {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
          this.renderer.resize(this.canvas.width, this.canvas.height);
        }, this), true);
        this.canvas.style.cursor = 'none';
        document.getElementsByTagName('body')[0].appendChild(this.canvas);
      }

      this.input = new d3.Input(config.input);
      this.renderer = new d3.Renderer(this.canvas);
      callback(this, this.renderer);
    },
    
    getInput: function() {
      return this.input
    }
  });
  
  m.assert = function(e, m) { if (!e) throw new Error(m); };
  m.bind = function(func, context) {
    return function() { func.apply(context, arguments); };
  };
  m.clone = function(o) { c = {}; for (var p in o) { c[p] = o[p]; } return c; };
  m.isString = function(o) { return typeof(o) == 'string'; };
  m.isFunction = function(f) { return typeof(f) == 'function'; };
});
