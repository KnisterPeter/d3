d3.Module('d3', function(m) {
  m.Class('Scene', d3.Resource, {
    root: null,
    typeFactory: null,
    
    construct: function(resource, typeFactory) {
      this.SUPER(resource);
      this.typeFactory = typeFactory;
    },
    
    create: function(gl, callback, context) {
      this.get(function(data) {
        if (d3.isString(data)) {
          this.typeFactory.create(gl, JSON.parse(data), function(root) {
            this.root = root;
            callback.call(context, this);
          }, this);
        } else {
          this.root = data;
          callback.call(context, this);
        }
      });
      return this;
    },
    
    getRoot: function() {
      return this.root;
    }
  });
});
