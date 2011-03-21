d3.Module('d3', function(m) {
  m.Class('Buffer', {
    buf: null,
    xyz: false,
    rgba: false,
    config: null,
    
    construct: function(gl, type, data) {
      this.buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

      var itemSize = type.length;
      this.config = {
          offset: itemSize * 4,
          items: data.length / itemSize,
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
    
    render: function(gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.drawArrays(gl.TRIANGLES, 0, this.config.items);
    }
  });
});
