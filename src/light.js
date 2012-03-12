class AmbientLight
  constructor: (color) ->
    @color = color

  getColor: -> @color

class DirectionalLight extends AmbientLight
  constructor: (color, direction) ->
    super(color)
    @direction = new d3.Math.Vector(direction).normalize().scale(-1).elements

  getDirection: -> @direction

class LightParser
  constructor: (@factory) ->

  parse: (core, data) ->
    d3.Core.trace('Parsing light', data)
    switch data.mode
      when 'ambient' 
        new AmbientLight(data.color)
      when 'directional' 
        new DirectionalLight(data.color, data.direction)

(this.d3 || this.d3 = {}).AmbientLight = AmbientLight
(this.d3 || this.d3 = {}).DirectionalLight = DirectionalLight
(this.d3 || this.d3 = {}).LightParser = LightParser

