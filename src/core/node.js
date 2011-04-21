d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;
  var Matrix4 = d3.Math.Matrix4;
  var Quaternion4 = d3.Math.Quaternion4;

  m.Class('Node', {
    position: null,
    rotation: null,
    scale: null,
    parent: null,
    children: null,
    
    construct: function() {
      this.position = Vector3.create();
      this.rotation = Vector3.create();
      this.scale = Vector3.create([1, 1, 1]);
      this.children = [];
    },
    
    setPosition: function(vec) {
      Vector3.set(vec, this.position);
    },
    
    setRotation: function(rot) {
      Vector3.set(rot, this.rotation);
    },
    
    yaw: function(angel) {
      this.rotation[0] += angel;
    },
    
    pitch: function(angel) {
      this.rotation[1] += angel;
    },
    
    roll: function(angel) {
      this.rotation[2] += angel;
    },
    
    setScale: function(vec) {
      Vector3.set(vec, this.scale);
    },
    
    getParent: function() {
      return this.parent;
    },
    
    setParent: function(parent) {
      this.parent = parent;
    },
    
    getChildren: function() {
      return this.children;
    },
    
    addChild: function(child) {
      d3.assert(child instanceof d3.Node, 'Only d3.Node could be child');
      child.setParent(this);
      this.children.push(child);
    },
    
    render: function(gl, context, mvMatrix, pMatrix) {
      Matrix4.translate(mvMatrix, this.position);
      var q = Quaternion4.rotateByAngles(this.rotation[0], this.rotation[1], this.rotation[2]);
      Matrix4.multiply(mvMatrix, Quaternion4.toMat4(q));
      Matrix4.scale(mvMatrix, this.scale);
      
      this.children.forEach(function(child) {
        child.render(gl, d3.clone(context), Matrix4.create(mvMatrix), pMatrix);
      }, this);
    }
  });
});
