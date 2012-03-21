class Node
  constructor: (@name) ->
    @position = new d3.Math.Vector()
    @orientation = new d3.Math.Quaternion()
    @scale = new d3.Math.Vector([1, 1, 1])
    @parent = null
    @children = []
    @lights = []

  getName: -> @name
  setRenderable: (@renderable) ->
  getRenderable: -> @renderable
  setParent: (node) -> @parent = node

  addChild: (node) ->
    node.setParent(this)
    @children.push(node)

  getChild: (name) ->
    return this if name == @name
    for child in @children
      result = child.getChild(name)
      return result if result
    return null

  addLight: (light) -> @lights.push(light)
  removeLight: (light) -> @lights = (element for element in @lights when element isnt light)

  setPosition: (v) -> @position.setElements(v)
  setOrientation: (q) -> 
    if q instanceof d3.Math.Quaternion
      @orientation.set(q)
    else if q instanceof d3.Math.Vector
      @orientation.set(d3.Math.Quaternion.fromAngles(q.elements[0], q.elements[1], q.elements[2]))
    else
      @orientation.set(d3.Math.Quaternion.fromAngles(q[0], q[1], q[2]))
  setScale: (v) -> @scale.setElements(v)

  move: (vector) -> @position.add(@orientation.multiply(new d3.Math.Vector(vector)))
  pitch: (angle) -> @orientation = @orientation.multiply(d3.Math.Quaternion.fromAxis(angle, [1, 0, 0]))
  yaw:  (angle) -> @orientation = @orientation.multiply(d3.Math.Quaternion.fromAxis(angle, [0, 1, 0]))
  roll: (angle) -> @orientation = @orientation.multiply(d3.Math.Quaternion.fromAxis(angle, [0, 0, 1]))

  render: (context, renderer, mvMatrix) ->
    context.push()

    pointLights = []
    for light in @lights
      if light instanceof d3.PointLight
        pointLights.push(light)
      else if light instanceof d3.DirectionalLight
        context.set('directional', light)
      else
        context.set('ambient', light)
    context.set('point', pointLights)

    mvMatrix = mvMatrix.dup()
    mvMatrix.multiply(d3.Math.Matrix.make(@orientation, @position, @scale))
    @renderable.render(context, renderer, mvMatrix) if @renderable
    for child in @children
      child.render(context, renderer, mvMatrix)
    context.pop()

class NodeParser
  constructor: (@factory) ->

  parse: (core, data) ->
    d3.Core.trace('Parsing node', data.name)
    try
      node = new Node(data.name)
      node.setPosition(data.position) if data.position
      node.setOrientation(data.orientation) if data.orientation
      node.setScale(data.scale) if data.scale
      node.addChild(@factory.parse(core, child)) for child in data.children if data.children
      node.addLight(@factory.parse(core, light)) for light in data.lights if data.lights
      if data.renderable
        renderable = data.renderable
        if d3.Core.isString(renderable)
          [library, name] = renderable.split(':')
          node.setRenderable(core.getLibrary(library).getRenderable(name))
        else
          node.setRenderable(@factory.parse(core, renderable))
      return node
    catch error
      throw new d3.Error("Failed to parse node " + name, error)

(this.d3 || this.d3 = {}).Node = Node
(this.d3 || this.d3 = {}).NodeParser = NodeParser

