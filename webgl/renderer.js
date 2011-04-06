d3.Module('d3', function(m) {
  var Matrix4 = d3.Math.Matrix4;

  m.Class('Renderer', {
    gl: null,
    root: null,
    mvMatrix: null,
    pMatrix: null,
    
    construct: function(canvas) {
      try {
        this.gl = canvas.getContext('experimental-webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
      } catch (e) {
      }
      if (!this.gl) {
        throw new Error('Failed to initialize WebGL');
      }
      
      this.root = new d3.Node();
      this.updateViewport();
      
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clearDepth(1);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
    },

    getRoot: function() {
      return this.root;
    },
    
    setRoot: function(root) {
      this.root = root;
    },
    
    createBuffer: function(type, vertices) {
      return new d3.Buffer(this.gl, type, vertices);
    },
    
    createMaterial: function(url, callback, context) {
      (new d3.Material(url)).create(this.gl, callback, context);
    },
    
    createProgram: function(url, callback, context) {
      (new d3.Program(url)).create(this.gl, callback, context);
    },
    
    createMesh: function(url, callback, context) {
      (new d3.Mesh(url)).create(this.gl, callback, context);
    },
    
    createScene: function(url, typeFactory, callback, context) {
      (new d3.Scene(url, typeFactory)).create(this.gl, callback, context);
    },
    
    updateViewport: function() {
      this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
      this.pMatrix = Matrix4.create();
      Matrix4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 10000.0, this.pMatrix);
      this.mvMatrix = Matrix4.create();
    },
    
    renderFrame: function(animLoop, context) {
      var time = new Date().getTime();
      var tick = d3.bind(function() {
        animLoop.call(context, new Date().getTime() - time);
        time = new Date().getTime();
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        Matrix4.identity(this.mvMatrix);
        this.root.render(this.gl, Matrix4.create(this.mvMatrix), this.pMatrix);
    
        this.requestAnimFrame(tick);
      }, this);
      this.requestAnimFrame(tick);
    },
    
    requestAnimFrame: function(callback) {
      (window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame)
          (callback);
    }
  });
});
