d3.Module('d3', function(m) {
  m.Class('Material', d3.Resource, {
    data: null,
    program: null,
    
    construct: function(url) {
      this.SUPER(url);
    },
    
    create: function(gl, callback) {
      this.get(function(data) {
        if (d3.isString(data)) {
          data = JSON.parse(data);
        }
        this.data = data;
        if (this.data['program-ref']) {
          this.program = (new d3.Program(this.data['program-ref'])).create(gl, callback);
        } else if (this.data['program']) {
          this.program = (new d3.Program(this.data['program'])).create(gl, callback);
        }
      });
      return this;
    },
    
    apply: function(gl, config, mvMatrix, pMatrix) {
      this.program.use(gl, config, mvMatrix, pMatrix);
    }
  });
});
