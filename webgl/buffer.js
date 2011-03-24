d3.Module('d3', function(m) {
  m.Class('Buffer', {
    vertices: null,
    indices: null,
    xyz: false,
    rgba: false,
    config: null,
    
    construct: function(gl, type, data) {
      this.vertices = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);
      this.indices = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

      var itemSize = type.length;
      this.config = {
          offset: itemSize * 4,
          items: data.indices.length,
          entries: {}
      };

      if (type == 'xyz') {
        this.config.entries.position = this._createEntry(3, 0*4);
      } else if (type == 'xyzrgba') {
        this.config.entries.position = this._createEntry(3, 0*4);
        this.config.entries.color = this._createEntry(4, 3*4);
      }
    },
    _createEntry: function(size, offset) { return { size: size, offset: offset}; },

    getConfig: function() {
      return this.config;
    },
    
    prepare: function(gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    },
    
    render: function(gl) {
      gl.drawElements(gl.TRIANGLE_STRIP, this.config.items, gl.UNSIGNED_SHORT, 0);
    }
  });
});
