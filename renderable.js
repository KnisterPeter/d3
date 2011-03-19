var d3 = d3 || {};
(function() {
  var Vector3 = d3.Math.Vector3;
  var Matrix4 = d3.Math.Matrix4;

  var buffer = null;
  var program = null;
  var pos = Vector3.create();
  
  d3.Renderable = function(_buffer, _program) {
    buffer = _buffer;
    program = _program;
  };
  
  d3.Renderable.prototype.setPosition = function(vec) {
    Vector3.set(vec, pos);
  };

  d3.Renderable.prototype.render = function(gl, mvMatrix, pMatrix) {
    Matrix4.translate(mvMatrix, pos);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 
        3, gl.FLOAT, false, 4*7, 0*4);
    gl.vertexAttribPointer(program.vertexColorAttribute, 
        4, gl.FLOAT, false, 4*7, 3*4);
    
    gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
    
    gl.drawArrays(gl.TRIANGLES, 0, buffer.numItems);
  };
})();
