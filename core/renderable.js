d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;

  m.Class('Renderable', d3.Node, {
    mesh: null,
    
    construct: function(mesh) {
      this.SUPER();
      this.mesh = mesh;
    },
    
    render: function(gl, mvMatrix, pMatrix) {
      this.SUPER(gl, mvMatrix, pMatrix);
      this.mesh.render(gl, mvMatrix, pMatrix);
    }
  });
});
