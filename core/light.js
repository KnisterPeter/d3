d3.Module('d3', function(m) {
  var Vector3 = d3.Math.Vector3;
  
  m.Class('Light', {
    color: null,
    direction: null,
    
    construct: function(color, direction) {
      this.setColor(color);
      direction && this.setDirection(direction);
    },
    
    getColor: function() {
      return this.color;
    },
    
    setColor: function(color) {
      this.color = Vector3.create(color);
    },
    
    getDirection: function() {
      return this.direction;
    },
    
    setDirection: function(direction) {
      this.direction = Vector3.create(direction);
      Vector3.normalize(this.direction);
      Vector3.scale(this.direction, -1);
    }
  });
});
