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
        this._loadShader(descr, function(vSource, fSource) {
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
    
    _loadShader: function(descr, callback) {
      if (descr.vertexSource && descr.fragmentSource) {
        callback.call(this, 
            descr.vertexSource .join('\n'), descr.fragmentSource.join('\n'));
      } else {
        d3.Resource.load(descr.vertex, function(vSource) {
          d3.Resource.load(descr.fragment, function(fSource) {
            callback.call(this, vSource, fSource);
          }, this);
        }, this);
      }
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
          d3.error('Failed to set program attribute "' + i + '"');
        }
      }
      
      if (context.texturing) {
        this.uniforms['texturing'] && gl.uniform1i(this.uniforms['texturing'], 1);
        this.uniforms['tex0'] && gl.uniform1i(this.uniforms['tex0'], 0);
      } else {
        this.uniforms['texturing'] && gl.uniform1i(this.uniforms['texturing'], 0);
      }
      this._setupLights(gl, context, mvMatrix);
      gl.uniformMatrix4fv(this.uniforms['model-view'], false, mvMatrix);
      gl.uniformMatrix4fv(this.uniforms['projection'], false, pMatrix);
    },
    
    _setupLights: function(gl, context, mvMatrix) {
      if (context.lights && context.lights.length > 0) {
        this.uniforms['lighting'] && gl.uniform1i(this.uniforms['lighting'], 1);
        for (var idx in context.lights) {
          var light = context.lights[idx];
          if (light.getDirection() != null) {
            this.uniforms['ligth0-direction'] && gl.uniform3fv(this.uniforms['ligth0-direction'], light.getDirection());
            this.uniforms['light0-color'] && gl.uniform3fv(this.uniforms['light0-color'], light.getColor());
          } else if (light.getPosition() != null) {
            this.uniforms['ligth0-position'] && gl.uniform3fv(this.uniforms['ligth0-position'], light.getPosition());
            this.uniforms['light0-color'] && gl.uniform3fv(this.uniforms['light0-color'], light.getColor());
          } else {
            this.uniforms['ambient'] && gl.uniform3fv(this.uniforms['ambient'], light.getColor());
          }
        }
        if (this.uniforms['normal']) {
          var normalMatrix = Matrix3.create();
          Matrix4.toInverseMat3(mvMatrix, normalMatrix);
          Matrix3.transpose(normalMatrix);
          gl.uniformMatrix3fv(this.uniforms['normal'], false, normalMatrix);
        }
      } else {
        this.uniforms['lighting'] && gl.uniform1i(this.uniforms['lighting'], 0);
      }
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

  d3.Program.DEFAULT = null;
  d3.Program.DEFAULT_DESCR = {
      "attributes": {
        "position": "aVertexPosition",
        "normal": "aVertexNormal",
        "color": "aVertexColor",
        "tex0": "aTextureCoord"
      },
      "uniforms": {
        "model-view": "uMVMatrix",
        "normal": "uNMatrix",
        "projection": "uPMatrix",
        
        "lighting": "uLighting",
        "ambient": "uAmbientColor",
        "ligth0-position": "uLightPosition",
        "ligth0-direction": "uLightDirection",
        "light0-color": "uLightColor",
        
        "texturing": "uTexturing",
        "tex0": "uSampler"
      },
      "vertexSource": [
          "attribute vec3 aVertexPosition;",
          "attribute vec3 aVertexNormal;",
          "attribute vec4 aVertexColor;",
          "attribute vec2 aTextureCoord;",
          "",
          "uniform mat4 uMVMatrix;",
          "uniform mat3 uNMatrix;",
          "uniform mat4 uPMatrix;",
          "",
          "uniform bool uLighting;",
          "uniform vec3 uAmbientColor;",
          "uniform vec3 uLightPosition;",
          "uniform vec3 uLightDirection;",
          "uniform vec3 uLightColor;",
          "",
          "varying vec4 vColor;",
          "varying vec2 vTextureCoord;",
          "varying vec3 vLightWeighting;",
          "",
          "void main(void) {",
          "  vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);",
          "  gl_Position = uPMatrix * mvPosition;",
          "  vTextureCoord = aTextureCoord;",
          "  vColor = aVertexColor;",
          "",
          "  if (uLighting) {",
          "    vec3 transformedNormal = uNMatrix * aVertexNormal;",
          "    if (uLightPosition != vec3(0, 0, 0)) {",
          "      vec3 lightDirection = normalize(uLightPosition - mvPosition.xyz);",
          "      float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);",
          "      vLightWeighting = uAmbientColor + uLightColor * directionalLightWeighting;",
          "    } else {",
          "      float directionalLightWeighting = max(dot(transformedNormal, uLightDirection), 0.0);",
          "      vLightWeighting = uAmbientColor + uLightColor * directionalLightWeighting;",
          "    }  ",
          "  } else {",
          "    vLightWeighting = vec3(1, 1, 1);",
          "  }",
          "}"
      ],
      "fragmentSource": [
          "#ifdef GL_ES",
          "  precision highp float;",
          "#endif",
          "",
          "varying vec4 vColor;",
          "varying vec2 vTextureCoord;",
          "varying vec3 vLightWeighting;",
          "",
          "uniform bool uTexturing;",
          "uniform sampler2D uSampler;",
          "",
          "void main(void) {",
          "  vec4 textureColor;",
          "  if (uTexturing) {",
          "    textureColor = texture2D(uSampler, vTextureCoord);",
          "  } else {",
          "    textureColor = vec4(1, 1, 1, 1);",
          "  }",
          "  vec4 color = textureColor * vColor;",
          "  gl_FragColor = vec4(color.rgb * vLightWeighting, color.a);",
          "}"
      ]
    };
});
