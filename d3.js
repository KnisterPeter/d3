var d3 = d3 || {};
(function() {
  var canvas = null;
  var renderer = null;
  
  d3.Main = function(id) {
    if (id) {
      canvas = document.getElementById(id);
    } else {
      canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.getElementsByTagName('body')[0].appendChild(canvas);
    }
    
    renderer = new d3.Renderer(canvas);
  };

  d3.Main.prototype.getRenderer = function() {
    return renderer;
  };
})();
