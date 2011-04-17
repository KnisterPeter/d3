d3.Module('d3', function(m) {
  m.Class('TypeFactory', {
    construct: function() {
    },
    
    create: function(gl, data, callback, context) {
      switch (data.type) {
        case 'node':
          this._setupNode(gl, new d3.Node(), data, callback, context);
          break;
        case 'renderable':
          (new d3.Mesh(data['mesh-ref'])).create(gl, function(mesh) {
            this._setupNode(gl, new d3.Renderable(mesh), data, callback, context);
          }, this);
          break;
        default:
          throw new Error('Unknown type');
      }
    },
    
    _setupNode: function(gl, node, data, callback, context) {
      node.setPosition(data.position);
      node.setRotation(data.rotation);
      node.setScale(data.scale);
      //node.addLight(new d3.Light(data.light));
      
      if (data.children) {
        var n = data.children.length;
        var loaded = function(child) {
          node.addChild(child);
          --n;
          if (n == 0) {
            callback.call(context, node);
          }
        };
        for (var idx in data.children) {
          this.create(gl, data.children[idx], loaded, this);
        }
      } else {
        callback.call(context, node);
      }
    }
  });
});
