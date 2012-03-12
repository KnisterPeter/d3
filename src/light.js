class AmbientLight
  constructor: (color) ->
    @color = color

  getColor: -> @color

class DirectionalLight extends AmbientLight
  constructor: (color, direction) ->
    super(color)
    @direction = new d3.Math.Vector(direction).normalize().scale(-1).elements

  getDirection: -> @direction

(this.d3 || this.d3 = {}).AmbientLight = AmbientLight
(this.d3 || this.d3 = {}).DirectionalLight = DirectionalLight

