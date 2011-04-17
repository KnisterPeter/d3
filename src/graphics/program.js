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
        var num = 0;
        for (var idx in context.lights) {
          var light = context.lights[idx];
          if (light.getPosition() != null) {
            var prefix = 'light' + num;
            this.uniforms[prefix + '-position'] && gl.uniform3fv(this.uniforms[prefix + '-position'], light.getPosition());
            this.uniforms[prefix + '-color'] && gl.uniform3fv(this.uniforms[prefix + '-color'], light.getColor());
            num++;
          } else if (light.getDirection() != null) {
            this.uniforms['directional-direction'] && gl.uniform3fv(this.uniforms['directional-direction'], light.getDirection());
            this.uniforms['directional-color'] && gl.uniform3fv(this.uniforms['directional-color'], light.getColor());
          } else {
            this.uniforms['ambient-color'] && gl.uniform3fv(this.uniforms['ambient-color'], light.getColor());
          }
        }
        this.uniforms['numLights'] && gl.uniform1i(this.uniforms['numLights'], num);
        if (this.uniforms['normal']) {
          var normalMatrix = Matrix3.create();
          Matrix4.toInverseMat3(mvMatrix, normalMatrix);
          Matrix3.transpose(normalMatrix);
          gl.uniformMatrix3fv(this.uniforms['normal'], false, normalMatrix);
        }
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
        "ambient-color": "uAmbientColor",
        "directional-direction": "uDirectionalDirection",
        "directional-color": "uDirectionalColor",
        "numLights": "uNumLights",
        "light0-position": "uLight[0].position",
        "light0-direction": "uLight[0].direction",
        "light0-color": "uLight[0].color",
        "light1-position": "uLight[1].position",
        "light1-direction": "uLight[1].direction",
        "light1-color": "uLight[1].color",
        "light2-position": "uLight[2].position",
        "light2-direction": "uLight[2].direction",
        "light2-color": "uLight[2].color",
        "light3-position": "uLight[3].position",
        "light3-direction": "uLight[3].direction",
        "light3-color": "uLight[3].color",
        "light4-position": "uLight[4].position",
        "light4-direction": "uLight[4].direction",
        "light4-color": "uLight[4].color",
        "light5-position": "uLight[5].position",
        "light5-direction": "uLight[5].direction",
        "light5-color": "uLight[5].color",
        "light6-position": "uLight[6].position",
        "light6-direction": "uLight[6].direction",
        "light6-color": "uLight[6].color",
        "light7-position": "uLight[7].position",
        "light7-direction": "uLight[7].direction",
        "light7-color": "uLight[7].color",
        
        "texturing": "uTexturing",
        "tex0": "uSampler"
      },
      "vertexSource": [
          "struct light {",
          "  vec3 position;",
          "  vec3 direction;",
          "  vec3 color;",
          "};",
          "",
          "attribute vec3 aVertexPosition;",
          "attribute vec3 aVertexNormal;",
          "attribute vec4 aVertexColor;",
          "attribute vec2 aTextureCoord;",
          "",
          "uniform mat4 uMVMatrix;",
          "uniform mat3 uNMatrix;",
          "uniform mat4 uPMatrix;",
          "",
          "const int MAX_LIGHTS = 8;",
          "uniform bool uLighting;",
          "uniform vec3 uAmbientColor;",
          "uniform vec3 uDirectionalDirection;",
          "uniform vec3 uDirectionalColor;",
          "uniform int uNumLights;",
          "uniform light uLight[MAX_LIGHTS];",
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
          "    vLightWeighting = vec3(0, 0, 0);",
          "    vec3 transformedNormal = uNMatrix * aVertexNormal;",
          "    vLightWeighting += (uDirectionalColor * max(dot(transformedNormal, uDirectionalDirection), 0.0));",
          "    for (int i = 0; i < MAX_LIGHTS; i++) {",
          "      if (i < uNumLights) {",
          "        vec3 lightDirection = normalize(uLight[i].position - mvPosition.xyz);",
          "        float lightWeighting = max(dot(transformedNormal, lightDirection), 0.0);",
          "        vLightWeighting += uLight[i].color * lightWeighting;",
          "      }",
          "    }",
          "    vLightWeighting = uAmbientColor + vLightWeighting;",
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
