d3.Module('d3', function(m) {
  m.Class('Buffer', {
    data: null,
    vertices: null,
    indices: null,
    xyz: false,
    rgba: false,
    config: null,
    
    construct: function(gl, type, data) {
      this.data = data;
      this.vertices = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);
      this.indices = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

      var itemSize;
      this.config = {
          items: data.indices.length,
          entries: {}
      };
      if (type == 'p') {
        itemSize = 3;
        this.config.entries.position = this._createEntry(3, 0*4);
      } else if (type == 'pc') {
        itemSize = 7;
        this.config.entries.position = this._createEntry(3, 0*4);
        this.config.entries.color = this._createEntry(4, 3*4);
      } else if (type == 'pt') {
        itemSize = 5;
        this.config.entries.position = this._createEntry(3, 0*4);
        this.config.entries.tex0 = this._createEntry(2, 3*4);
      } else if (type == 'pnt') {
        itemSize = 8;
        this.config.entries.position = this._createEntry(3, 0*4);
        this.config.entries.normal = this._createEntry(3, 3*4);
        this.config.entries.tex0 = this._createEntry(2, 6*4);
      }
      this.config.offset = itemSize * 4;
    },
    _createEntry: function(size, offset) { return { size: size, offset: offset}; },

    getConfig: function() {
      return this.config;
    },
    
    prepare: function(gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data.indices), gl.STATIC_DRAW);
    },
    
    render: function(gl) {
      gl.drawElements(gl.TRIANGLES, this.config.items, gl.UNSIGNED_SHORT, 0);
    }
  });
});
