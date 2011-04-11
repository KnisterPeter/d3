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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }, this);
      this.img.src = data.ref;
    },
    
    use: function(gl) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
  });
});
