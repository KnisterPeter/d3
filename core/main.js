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
        this.canvas.style.cursor = 'url(../resources/blank.cur)';
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
  m.isString = function(o) { return typeof(o) == 'string'; };
  m.isFunction = function(f) { return typeof(f) == 'function'; };
});
