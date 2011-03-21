d3.Module('d3', function(m) {
  m.Class('Program', d3.Resource, {
    program: null,
    attributes: null,
    uniforms: null,
    
    construct: function(url) {
      this.SUPER(url);
    },
    
    create: function(gl, callback) {
      this.get(function(descr) {
        if (d3.isString(descr)) {
          descr = JSON.parse(descr);
        }
        this._loadShader(descr.vertex, descr.fragment, function(vSource, fSource) {
          this._compile(gl, vSource, fSource);

          this.attributes = descr.attributes;
          for (var i in this.attributes) {
            this.attributes[i] = gl.getAttribLocation(this.program, this.attributes[i]);
            gl.enableVertexAttribArray(this.attributes[i]);
          }
          
          this.uniforms = descr.uniforms;
          for (var i in this.uniforms) {
            this.uniforms[i] = gl.getUniformLocation(this.program, this.uniforms[i]);
          }

          callback();
        });
      });
      return this;
    },
    
    _loadShader: function(vertex, fragment, callback) {
      d3.Resource.load(vertex, function(vSource) {
        d3.Resource.load(fragment, function(fSource) {
          callback.call(this, vSource, fSource);
        }, this);
      }, this);
    },
    
    _compile: function(gl, vSource, fSource) {
      var vShader = this._createShader(gl, 'vertex', vSource);
      var fShader = this._createShader(gl, 'fragment', fSource);
      
      this.program = gl.createProgram();
      gl.attachShader(this.program, vShader);
      gl.attachShader(this.program, fShader);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error('Failed to link shader program');
      }
    },
    
    _createShader: function(gl, type, source) {
      var shader = gl.createShader(
          type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    },

    use: function(gl, config, mvMatrix, pMatrix) {
      gl.useProgram(this.program);
      for (var i in config.entries) {
        gl.vertexAttribPointer(this.attributes[i], config.entries[i].size, 
            gl.FLOAT, false, config.offset, config.entries[i].offset);
      }
      gl.uniformMatrix4fv(this.uniforms['model-view'], false, mvMatrix);
      gl.uniformMatrix4fv(this.uniforms['projection'], false, pMatrix);
    }
  });
});
