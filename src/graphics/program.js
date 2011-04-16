d3.Module('d3', function(m) {
  
  var Matrix3 = d3.Math.Matrix3;
  var Matrix4 = d3.Math.Matrix4;
  
  m.Class('Program', d3.Resource, {
    program: null,
    attributes: null,
    uniforms: null,
    
    construct: function(url) {
      this.SUPER(url);
    },
    
    create: function(gl, callback, context) {
      this.get(function(descr) {
        if (d3.isString(descr)) {
          descr = JSON.parse(descr);
        }
        this._loadShader(descr.vertex, descr.fragment, function(vSource, fSource) {
          this._compile(gl, vSource, fSource);

          this.attributes = descr.attributes;
          for (var i in this.attributes) {
            this.attributes[i] = gl.getAttribLocation(this.program, this.attributes[i]);
          }
          
          this.uniforms = descr.uniforms;
          for (var i in this.uniforms) {
            this.uniforms[i] = gl.getUniformLocation(this.program, this.uniforms[i]);
          }
          
          d3.error();
          callback.call(context, this);
        });
      });
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
        throw new Error('Linking of shader failed');
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

    use: function(gl, context, config, mvMatrix, pMatrix) {
      gl.useProgram(this.program);
      d3.error();
      
      for (var i in config.entries) {
        if (typeof(this.attributes[i]) != 'undefined') {
          gl.enableVertexAttribArray(this.attributes[i]);
          gl.vertexAttribPointer(this.attributes[i], config.entries[i].size, 
              gl.FLOAT, false, config.offset, config.entries[i].offset);
          d3.error();
        }
      }
      
      this.uniforms['tex0'] && gl.uniform1i(this.uniforms['tex0'], 0);
      if (context.lights && context.lights.length > 0) {
        this.uniforms['lighting'] && gl.uniform1i(this.uniforms['lighting'], 1);
        for (var idx in context.lights) {
          var light = context.lights[idx];
          if (light.getDirection() != null) {
            this.uniforms['ligth0-direction'] && gl.uniform3fv(this.uniforms['ligth0-direction'], light.getDirection());
            this.uniforms['light0-color'] && gl.uniform3fv(this.uniforms['light0-color'], light.getColor());
            if (this.uniforms['normal']) {
              var normalMatrix = Matrix3.create();
              Matrix4.toInverseMat3(mvMatrix, normalMatrix);
              Matrix3.transpose(normalMatrix);
              gl.uniformMatrix3fv(this.uniforms['normal'], false, normalMatrix);
            }
          } else {
            this.uniforms['ambient'] && gl.uniform3fv(this.uniforms['ambient'], light.getColor());
          }
        }
      } else {
        this.uniforms['lighting'] && gl.uniform1i(this.uniforms['lighting'], 0);
      }
      gl.uniformMatrix4fv(this.uniforms['model-view'], false, mvMatrix);
      gl.uniformMatrix4fv(this.uniforms['projection'], false, pMatrix);
    },
    
    clear: function(gl, context, config) {
      for (var i in config.entries) {
        if (typeof(this.attributes[i]) != 'undefined') {
          gl.disableVertexAttribArray(this.attributes[i]);
          d3.error();
        }
      }
    }
  });
});
