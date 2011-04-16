d3.Module('d3', function(m) {
  m.Class('Texture', {
    texture: null,
    img: null,
    
    construct: function(gl, data) {
      this.texture = gl.createTexture();
      this.img = new Image();
      this.img.onload = d3.bind(function() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        this._setFilter(gl, gl.TEXTURE_MAG_FILTER, data['filter-mag'] || 'nearest');
        this._setFilter(gl, gl.TEXTURE_MIN_FILTER, data['filter-min'] || 'nearest');
        gl.bindTexture(gl.TEXTURE_2D, null);
      }, this);
      this.img.src = data.ref;
    },
    
    _setFilter: function(gl, filter, mode) {
      switch (mode) {
        case 'nearest':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.NEAREST);
          break;
        case 'linear':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.LINEAR);
          break;
        case 'nearest-mipmap-nearest':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.NEAREST_MIPMAP_NEAREST);
          gl.generateMipmap(gl.TEXTURE_2D);
          break;
        case 'linear-mipmap-nearest':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.LINEAR_MIPMAP_NEAREST);
          gl.generateMipmap(gl.TEXTURE_2D);
          break;
        case 'nearest-mipmap-linear':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.NEAREST_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
          break;
        case 'linear-mipmap-linear':
          gl.texParameteri(gl.TEXTURE_2D, filter, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
          break;
      }
    },
    
    use: function(gl) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
  });
});
