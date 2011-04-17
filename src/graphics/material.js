d3.Module('d3', function(m) {
  m.Class('Material', d3.Resource, {
    data: null,
    program: null,
    texture: null,
    
    construct: function(url) {
      this.SUPER(url);
    },
    
    create: function(gl, callback, context) {
      this.get(function(data) {
        if (d3.isString(data)) {
          data = JSON.parse(data);
        }
        this.data = data;
        
        var onReady = function(program) {
          this.program = program;
          callback.call(context, this);
        };
        if (this.data['tex0']) {
          this.texture = new d3.Texture(gl, this.data.tex0);
        }
        this._loadProgram(gl, onReady);
      });
    },
    
    _loadProgram: function(gl, onReady) {
      if (this.data['program-ref']) {
        (new d3.Program(this.data['program-ref'])).create(gl, onReady, this);
      } else if (this.data['program']) {
        (new d3.Program(this.data['program'])).create(gl, onReady, this);
      } else {
        if (d3.Program.DEFAULT != null) {
          onReady.call(this, d3.Program.DEFAULT);
        } else {
          (new d3.Program(d3.Program.DEFAULT_DESCR)).create(gl, function(program) {
            d3.Program.DEFAULT = program;
            onReady.call(this, program);
          }, this);
        }
      }
    },
    
    getTexture: function() {
      return this.texture;
    },
    
    setTexture: function(texture) {
      this.texture = texture;
    },
    
    apply: function(gl, context, config, mvMatrix, pMatrix) {
      if (this.data.blend) {
        if (this.data.blend.depth === false) {
          gl.disable(gl.DEPTH_TEST);
        }
        if (this.data.blend.func) {
          gl.enable(gl.BLEND);
          gl.blendFunc(gl[this.data.blend.func[0]], gl[this.data.blend.func[1]]);
          d3.error();
        }
        if (this.data.blend.light === false) {
          delete context.lights;
        }
      }
      context.texturing = this.texture != null;
      this.texture && this.texture.use(gl);
      this.program.use(gl, context, config, mvMatrix, pMatrix);
    },
    
    clear: function(gl, context, config) {
      this.program.clear(gl, context, config);
      if (this.data.blend) {
        if (this.data.blend && this.data.blend.depth === false) {
          gl.enable(gl.DEPTH_TEST);
        }
        if (this.data.blend.func) {
          gl.disable(gl.BLEND);
        }
      }
    }
  });
});
