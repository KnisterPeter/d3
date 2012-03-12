class Mesh
  constructor: (@name) ->
  getName: -> @name
  setVertices: (@vertices) ->
  setProgram: (@program) ->
  setTexture: (@texture) ->
  setMaterial: (@material) ->
  render: (context, renderer, mvMatrix) -> renderer.draw(context, mvMatrix, @vertices, @texture, @program, @material)

class MeshParser
  constructor: (@factory) ->

  parse: (core, data) ->
    d3.Core.trace('Parsing mesh', data.name)
    mesh = new Mesh(data.name)
    mesh.setVertices(core.getRenderer().createBuffer(data.buffer))
    # TODO: Enable multi texture
    mesh.setTexture(core.getRenderer().createTexture(data.material.textures[0])) if data?.material?.textures?[0]
    mesh.setMaterial(data.material) if data?.material

    opts = {}
    opts.color = true if 'vc' in data?.buffer?.type
    opts.tex0 = true if data?.material?.textures?[0] and 't0' in data?.buffer?.type
    opts.lighting = true if data?.material?.lighting and 'vn' in data?.buffer?.type

    if data.program
      [library, name] = data.program.split(':')
      mesh.setProgram(core.getLibrary(library).getProgram(name).compile(core.getRenderer(), opts))
    else
      mesh.setProgram(core.getRenderer().getDefaultProgram().compile(core.getRenderer(), opts))
    return mesh

(this.d3 || this.d3 = {}).Mesh = Mesh
(this.d3 || this.d3 = {}).MeshParser = MeshParser

