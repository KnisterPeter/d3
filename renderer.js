d3.Module('d3', function(m) {
  var Matrix4 = d3.Math.Matrix4;

  m.Class('Renderer', {
    gl: null,
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
      
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clearDepth(1);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      
      pMatrix = Matrix4.create();
      Matrix4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 10000.0, pMatrix);
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
    
    renderFrame: function(renderable) {
      this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      var mvMatrix = Matrix4.create();
      Matrix4.identity(mvMatrix);
      renderable.render(this.gl, Matrix4.create(mvMatrix), pMatrix);
    }
  });
});
