d3.Module('d3', function(m) {
  m.Class('Mesh', d3.Resource, {
    buffer: null,
    material: null,
    
    construct: function(resource) {
      this.SUPER(resource);
    },
    
    create: function(gl, callback, context) {
      this.get(function(data) {
        if (d3.isString(data)) {
          data = JSON.parse(data);
          this.buffer = new d3.Buffer(gl, data.buffer.type, data.buffer.data);
          if (data['material-ref']) {
            var matDescr = data['material-ref'];
          } else if (data['material']) {
            var matDescr = data['material'];
          }
          this.material = (new d3.Material(matDescr)).create(gl, function() {
            callback.call(context);
          });
        } else {
          this.buffer = data.buffer;
          this.material = data.material;
          callback.call(context);
        }
      });
      return this;
    },
    
    render: function(gl, mvMatrix, pMatrix) {
      this.material.apply(gl, this.buffer.getConfig(), mvMatrix, pMatrix);
      this.buffer.render(gl);
    }
  });
});
