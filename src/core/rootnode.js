d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;
  var Matrix4 = d3.Math.Matrix4;
  var Quaternion4 = d3.Math.Quaternion4;

  m.Class('RootNode', d3.Node, {
    lights: null,
    
    construct: function() {
      this.SUPER();
      this.lights = [];
    },

    getLights: function() {
      return this.lights;
    },
    
    addLight: function(light) {
      this.lights.push(light);
    },
    
    render: function(gl, mvMatrix, pMatrix) {
      var context = {};
      context.lights = this.lights;
      this.SUPER(gl, context, mvMatrix, pMatrix);
    }
  });
});
