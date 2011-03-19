var d3 = d3 || {};
(function() {
  var Matrix4 = d3.Math.Matrix4;
  
  var DEFAULT_VSHADER = [
    'attribute vec3 aVertexPosition;',
    'attribute vec4 aVertexColor;',
    'uniform mat4 uMVMatrix;',
    'uniform mat4 uPMatrix;',
    'varying vec4 vColor;',
    'void main(void) {',
      'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
      'vColor = aVertexColor;',
    '}'
    ].join('\n');

  var DEFAULT_FSHADER = [
     '#ifdef GL_ES',
     '  precision highp float;',
     '#endif',
     'varying vec4 vColor;',
     'void main(void) {',
       'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
       'gl_FragColor = vColor;',
     '}'
     ].join('\n');

  var gl = null;
  var defaultProgram = null;
  var pMatrix = null;
  
  d3.Renderer = function(canvas) {
    try {
      gl = canvas.getContext('experimental-webgl');
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
      throw new Error('Failed to initialize WebGL');
    }
    
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    this.defaultProgram = this.createProgram(DEFAULT_VSHADER, DEFAULT_FSHADER);
    gl.useProgram(this.defaultProgram);
    
    pMatrix = Matrix4.create();
    Matrix4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);
  };

  d3.Renderer.prototype.__createShader = function(type, source) {
   var shader = gl.createShader(
       type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
     throw new Error(gl.getShaderInfoLog(shader));
   }
   return shader;
  };

  d3.Renderer.prototype.createProgram = function(vSource, fSource) {
   var vShader = this.__createShader('vertex', vSource);
   var fShader = this.__createShader('fragment', fSource);
   var program = gl.createProgram();
   gl.attachShader(program, vShader);
   gl.attachShader(program, fShader);
   gl.linkProgram(program);
   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
     throw new Error('Failed to link shader program');
   }
   
   program.vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');
   gl.enableVertexAttribArray(program.vertexPositionAttribute);
   program.vertexColorAttribute = gl.getAttribLocation(program, 'aVertexColor');
   gl.enableVertexAttribArray(program.vertexColorAttribute);
   program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
   program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
   
   return program;
  };

  d3.Renderer.prototype.createBufferXYZRGBA = function(vertices) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    buffer.itemSize = 7;
    buffer.numItems = vertices.length / buffer.itemSize;
    return buffer;
  };

  d3.Renderer.prototype.renderFrame = function(renderable) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvMatrix = Matrix4.create();
    Matrix4.identity(mvMatrix);
    renderable.render(gl, Matrix4.create(mvMatrix), pMatrix);
  };
})();
