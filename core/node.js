d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;
  var Matrix4 = d3.Math.Matrix4;

  m.Class('Node', {
    pos: null,
    children: null,
    
    construct: function() {
      this.pos = Vector3.create();
      this.children = [];
    },
    
    setPosition: function(vec) {
      Vector3.set(vec, this.pos);
    },
    
    addChild: function(child) {
      d3.assert(child instanceof d3.Node, 'Only d3.Node could be child');
      this.children.push(child);
    },
    
    render: function(gl, mvMatrix, pMatrix) {
      Matrix4.translate(mvMatrix, this.pos);
      this.children.forEach(function(child) {
        child.render(gl, Matrix4.create(mvMatrix), pMatrix);
      }, this);
    }
  });
});
