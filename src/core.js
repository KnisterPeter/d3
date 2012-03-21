global = this

class Core
  @level = 
    trace: true
    debug: true
  @trace: -> @_log('TRACE', Array.prototype.slice.call(arguments, 0))
  @debug: -> @_log('DEBUG', Array.prototype.slice.call(arguments, 0))
  @_log: (level, args) ->
    args.unshift('DEBUG')
    console.log.apply(console, args)

  @isString: (arg) -> typeof(arg) == "string"

  constructor: (canvas, options) ->
    @canvas = document.getElementById(canvas)
    if options?.fullscreen
      document.getElementsByTagName('body')[0].style.margin = 0
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
      @canvas.setAttribute('width', global.innerWidth)
      @canvas.setAttribute('height', global.innerHeight)
    options?.renderer?.width = @canvas.getAttribute('width')
    options?.renderer?.height = @canvas.getAttribute('height')
    @parserFactory = new ParserFactory()
    @libraries = {}
    @root = this.createRoot()
    this.createRenderer(options.renderer.type, options.renderer)

  createRoot: ->
    root = new d3.Node()
    root.addLight(new d3.AmbientLight([0, 0, 0]))
    root.addLight(new d3.DirectionalLight([0, 0, 0], [0, 0, 0]))
    return root

  getRoot: -> @root
  createRenderer: (type, options) -> @renderer = new (d3[type + 'Renderer'])(@canvas, options)
  getRenderer: -> @renderer
  addLibrary: (name, library) -> @libraries[name] = library
  getLibrary: (name) -> 
    if @libraries[name]
      @libraries[name]
    else
      throw new d3.Error("Unknown Library " + name)
  load: (path, callback) -> @parserFactory.load(this, path, callback)
  render: -> 
    @renderer.render(new RenderContext(), @root)

  run: (callback) ->
    main = (timestamp) ->
      callback(timestamp)
      requestAnimationFrame(main)
    requestAnimationFrame(main)

class RenderContext
  constructor: ->
    @attributes = {}
    @stack = []
  push: -> 
    state = {}
    for k, v of @attributes
      state[k] = v
    @stack.push(state)
  pop: -> 
    state = @stack.pop()
    for k, v of state
      @attributes[k] = v
  get: (name) -> @attributes[name]
  set: (name, value) -> @attributes[name] = value

class ParserFactory
  constructor: ->
    @parsers = {}

  load: (core, path, callback) ->
    d3.Core.debug('Loading', path)
    xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.onreadystatechange = (e) =>
      if xhr.readyState == 4
        if xhr.status == 200
          callback(this.parse(core, JSON.parse(xhr.responseText)))
        else
          throw xhr.statusText
    xhr.send()

  parse: (core, data) ->
    type = data.type + 'Parser'
    if not @parsers[type]
      @parsers[type] = new (this._resolveType(type))(this)
    @parsers[type].parse(core, data)

  _resolveType: (name) ->
    current = global
    (current = current[part]) for part in name.split('.')
    return current

class Library
  constructor: ->
    @programs = {}
    @renderables = {}
    @nodes = {}

  addProgram: (program) -> @programs[program.getName()] = program
  getProgram: (name) -> @programs[name]
  addRenderable: (renderable) -> @renderables[renderable.getName()] = renderable
  getRenderable: (name) -> @renderables[name]
  addNode: (node) -> @nodes[node.getName()] = node
  getNode: (name) -> 
    return @nodes[name] if @nodes[name]
    for nodeName, node of @nodes
      result = node.getChild(name)
      return result if result
    return null

class LibraryParser
  constructor: (@factory) ->

  parse: (core, data) ->
    d3.Core.trace('Parsing library', data.name)
    library = new Library()
    core.addLibrary(data.name, library)
    library.addProgram(@factory.parse(core, program)) for program in data.programs if data.programs
    library.addRenderable(@factory.parse(core, renderable)) for renderable in data.renderables
    library.addNode(@factory.parse(core, node)) for node in data.nodes
    return library

class Error
  constructor: (@message, @cause) ->
  toString: -> @message + if @cause then "\n" + @cause else ""

(this.d3 || this.d3 = {}).Core = Core
(this.d3 || this.d3 = {}).Library = Library
(this.d3 || this.d3 = {}).LibraryParser = LibraryParser
(this.d3 || this.d3 = {}).Error = Error
this.requestAnimationFrame = this.requestAnimationFrame || this.webkitRequestAnimationFrame || this.mozRequestAnimationFrame

