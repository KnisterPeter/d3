d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;
  var Matrix4 = d3.Math.Matrix4;

  m.Class('Renderable', {
    mesh: null,
    pos: Vector3.create(),
    
    construct: function(mesh) {
      this.mesh = mesh;
    },
    
    setPosition: function(vec) {
      Vector3.set(vec, this.pos);
    },
    
    render: function(gl, mvMatrix, pMatrix) {
      Matrix4.translate(mvMatrix, this.pos);
      this.mesh.render(gl, mvMatrix, pMatrix);
    }
  });
});
