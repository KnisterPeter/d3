class WebGLRenderer
  constructor: (canvas, options) ->
    @gl = this._createGLContext(canvas)
    this.init(options)

  _createGLContext: (canvas) ->
    for name in ['webgl', 'experimental-webgl']
      gl = canvas.getContext(name)
      if gl 
        return gl

  init: (options) ->
    @perspectiveMatrix = this.makePerspective(options)
    d3.Core.debug(@gl.getSupportedExtensions())
    @gl.viewport(0, 0, options.width, options.height)
    @gl.clearColor(0.0, 0.0, 0.0, 1.0)
    @gl.clearDepth(1.0)
    @gl.enable(@gl.DEPTH_TEST)
    @gl.depthFunc(@gl.LEQUAL)

  makePerspective: (options) ->
    @perspectiveMatrix = d3.Math.Matrix.makePerspective(
      options.fov, 
      options.width / options.height, 
      options.near || 0.1, 
      options.far || 1000.0)

  createTexture: (data) ->
    texture = @gl.createTexture()
    texture.image = new Image()
    texture.image.onload = =>
      @gl.bindTexture(@gl.TEXTURE_2D, texture)
      #@gl.pixelStorei(@gl.UNPACK_FLIP_Y_WEBGL, true)
      @gl.texImage2D(@gl.TEXTURE_2D, 0, @gl.RGBA, @gl.RGBA, @gl.UNSIGNED_BYTE, texture.image)
      if data.filter is "nearest"
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.NEAREST)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.NEAREST)
      else if data.filter is "linear"
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.LINEAR)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.LINEAR)
      else if data.filter is "mipmap"
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.LINEAR_MIPMAP_NEAREST)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.LINEAR)
        @gl.generateMipmap(@gl.TEXTURE_2D)
      @gl.bindTexture(@gl.TEXTURE_2D, null)
    texture.image.src = data.name
    return texture

  getDefaultProgram: ->
    @program = new WebGLProgram() if not @program
    return @program

  compileProgram: (data, opts) ->
    d3.Core.trace('Compiling shader', opts)
    vShader = data.vertexShader
    fShader = data.fragmentShader
    if opts.color
      vShader = "#define color\n" + vShader
      fShader = "#define color\n" + fShader
    if opts.tex0
      vShader = "#define tex0\n" + vShader
      fShader = "#define tex0\n" + fShader
    if opts.lighting
      if opts.lighting is "fragment"
        shaderType = "#define light_per_fragment\n"
      else
        shaderType = ""
      vShader = "#define lighting\n" + shaderType + vShader
      fShader = "#define lighting\n" + shaderType + fShader
    program = @gl.createProgram()
    @gl.attachShader(program, this.getShader(@gl.VERTEX_SHADER, vShader))
    @gl.attachShader(program, this.getShader(@gl.FRAGMENT_SHADER, fShader))
    @gl.linkProgram(program)
    if not @gl.getProgramParameter(program, @gl.LINK_STATUS)
      throw "Unable to initialize the shader program."

    program.opts = opts
    @gl.useProgram(program)

    program["aVertexPosition"] = @gl.getAttribLocation(program, "aVertexPosition")
    @gl.enableVertexAttribArray(program["aVertexPosition"])
    if opts.color
      program["aVertexColor"] = @gl.getAttribLocation(program, "aVertexColor")
      @gl.enableVertexAttribArray(program["aVertexColor"])
    if opts.tex0
      program["aTextureCoord0"] = @gl.getAttribLocation(program, "aTextureCoord0")
      @gl.enableVertexAttribArray(program["aTextureCoord0"])
      program.tex0 = @gl.getUniformLocation(program, "uSamplerTex0")
    if opts.lighting
      program["aVertexNormal"] = @gl.getAttribLocation(program, "aVertexNormal")
      @gl.enableVertexAttribArray(program["aVertexNormal"])
      program["uAmbientColor"] = @gl.getUniformLocation(program, "uAmbientColor")
      program["uDiffuseDirection"] = @gl.getUniformLocation(program, "uDiffuseDirection")
      program["uDirectionalColor"] = @gl.getUniformLocation(program, "uDirectionalColor")
      program["uNMatrix"] = @gl.getUniformLocation(program, "uNMatrix")
      for n in [0..WebGLProgram.MAX_LIGHT]
        program["uLight[" + n + "].enabled"] = @gl.getUniformLocation(program, "uLight[" + n + "].enabled")
        program["uLight[" + n + "].pos"] = @gl.getUniformLocation(program, "uLight[" + n + "].pos")
        program["uLight[" + n + "].col"] = @gl.getUniformLocation(program, "uLight[" + n + "].col")

    program.perspectiveMatrix = @gl.getUniformLocation(program, "uPMatrix")
    program.modelViewMatrix = @gl.getUniformLocation(program, "uMVMatrix")

    return program

  getShader: (type, source) ->
    shader = @gl.createShader(type)
    @gl.shaderSource(shader, source)
    @gl.compileShader(shader)
    if not @gl.getShaderParameter(shader, @gl.COMPILE_STATUS)
      throw "An error occurred compiling the shaders: " + @gl.getShaderInfoLog(shader)
    return shader

  createBuffer: (data) ->
    d3.Core.trace('Creating buffers')
    buffer = @gl.createBuffer()
    @gl.bindBuffer(@gl.ARRAY_BUFFER, buffer)
    @gl.bufferData(@gl.ARRAY_BUFFER, new Float32Array(data.vertices), @gl.STATIC_DRAW)

    buffer.indices = @gl.createBuffer()
    buffer.indices.data = data.indices
    @gl.bindBuffer(@gl.ELEMENT_ARRAY_BUFFER, buffer.indices)
    @gl.bufferData(@gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), @gl.STATIC_DRAW)

    buffer.items = data.indices.length

    offset = 0
    for n in data.type
      buffer[n] = offset * 4
      offset += 3 if n is 'vp'
      offset += 3 if n is 'vn'
      offset += 4 if n is 'vc'
      offset += 2 if n is 't0'
    buffer.stride = offset * 4

    return buffer

  render: (context, node) ->
    @gl.clear(@gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT)
    node?.render(context, this, new d3.Math.Matrix())

  draw: (context, mvMatrix, buffer, texture, program, material) ->
    # TODO: Implement proper depth sorted transparency rendering
    if material?.blending
      @gl.enable(@gl.BLEND)
      @gl.disable(@gl.DEPTH_TEST)
      @gl.blendFunc(@gl[material.blending[0].toUpperCase()], @gl[material.blending[1].toUpperCase()])
    else
      @gl.enable(@gl.DEPTH_TEST)
      @gl.disable(@gl.BLEND)

    @gl.useProgram(program)
    @gl.bindBuffer(@gl.ARRAY_BUFFER, buffer)
    @gl.bindBuffer(@gl.ELEMENT_ARRAY_BUFFER, buffer.indices)

    @gl.vertexAttribPointer(program["aVertexPosition"], 3, @gl.FLOAT, false, buffer.stride, buffer['vp'])
    if program.opts.color
      @gl.vertexAttribPointer(program["aVertexColor"], 4, @gl.FLOAT, false, buffer.stride, buffer['vc'])
    if program.opts.tex0
      @gl.vertexAttribPointer(program["aTextureCoord0"], 2, @gl.FLOAT, false, buffer.stride, buffer['t0'])
      @gl.activeTexture(@gl.TEXTURE0)
      @gl.bindTexture(@gl.TEXTURE_2D, texture)
      @gl.uniform1i(program.tex0, 0)
    if program.opts.lighting
      @gl.vertexAttribPointer(program["aVertexNormal"], 3, @gl.FLOAT, false, buffer.stride, buffer['vn'])
      @gl.uniform3fv(program["uAmbientColor"], context.get('ambient').getColor())
      @gl.uniform3fv(program["uDiffuseDirection"], context.get('directional').getDirection())
      @gl.uniform3fv(program["uDirectionalColor"], context.get('directional').getColor())
      @gl.uniformMatrix3fv(program["uNMatrix"], false, mvMatrix.dup().inverse().transpose().mat3())
      for n in [0..WebGLProgram.MAX_LIGHT]
        pointLight = context.get('point')[n]
        if pointLight
          @gl.uniform1i(program["uLight[" + n + "].enabled"], true)
          @gl.uniform3fv(program["uLight[" + n + "].pos"], pointLight.getPosition())
          @gl.uniform3fv(program["uLight[" + n + "].col"], pointLight.getColor())
        else
          @gl.uniform1i(program["uLight[" + n + "].enabled"], false)

    @gl.uniformMatrix4fv(program.perspectiveMatrix, false, @perspectiveMatrix.elements)
    @gl.uniformMatrix4fv(program.modelViewMatrix, false, mvMatrix.elements)

    @gl.drawElements(@gl.TRIANGLES, buffer.items, @gl.UNSIGNED_SHORT, 0)

class WebGLProgram
  @MAX_LIGHT: 8
  @DEFAULT_VERTEX: """
    attribute vec3 aVertexPosition;

#ifdef lighting
#define NUM_LIGHTS #{this.MAX_LIGHT}
    attribute vec3 aVertexNormal;
    uniform vec3 uAmbientColor;
    uniform vec3 uDiffuseDirection;
    uniform vec3 uDirectionalColor;
    uniform mat3 uNMatrix;
    varying vec3 vLightWeighting;
#ifdef light_per_fragment
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;
#else
    struct point_light {
      bool enabled;
      vec3 pos;
      vec3 col;
    };
    uniform point_light uLight[NUM_LIGHTS];
#endif
#endif

#ifdef color
    attribute vec4 aVertexColor;
    varying vec4 vColor;
#endif

#ifdef tex0
    attribute vec2 aTextureCoord0;
    varying vec2 vTextureCoord;
#endif

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main(void) {
      vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
      gl_Position = uPMatrix * mvPosition;
#ifdef color
      vColor = aVertexColor;
#endif
#ifdef tex0
      vTextureCoord = aTextureCoord0;
#endif
#ifdef lighting
      vec3 transformedNormal = uNMatrix * aVertexNormal;
      float weight = max(dot(transformedNormal, uDiffuseDirection), 0.0);
      vLightWeighting = uAmbientColor + uDirectionalColor * weight;

#ifdef light_per_fragment
      vTransformedNormal = transformedNormal;
      vPosition = mvPosition;
#else
      for (int i = 0; i < NUM_LIGHTS; i++) {
        if (uLight[i].enabled) {
          vec3 direction = normalize(uLight[i].pos - mvPosition.xyz);
          weight = max(dot(transformedNormal, direction), 0.0);
          vLightWeighting += uLight[i].col * weight;
        }
      }
#endif
#endif
    }
  """
  @DEFAULT_FRAGMENT: """
    precision mediump float;

#ifdef lighting
#define NUM_LIGHTS #{this.MAX_LIGHT}
    varying vec3 vLightWeighting;
#ifdef light_per_fragment
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;
    struct point_light {
      bool enabled;
      vec3 pos;
      vec3 col;
    };
    uniform point_light uLight[NUM_LIGHTS];
#endif
#endif

#ifdef color
    varying vec4 vColor;
#endif

#ifdef tex0
    varying vec2 vTextureCoord;
    uniform sampler2D uSamplerTex0;
#endif

    void main(void) {
#ifdef color
      gl_FragColor = vColor;
#else
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif
#ifdef tex0
      gl_FragColor = gl_FragColor * texture2D(uSamplerTex0, vec2(vTextureCoord.s, vTextureCoord.t));
#endif
#ifdef lighting
#ifdef light_per_fragment
      vec3 lightWeighting = vLightWeighting;
      for (int i = 0; i < NUM_LIGHTS; i++) {
        if (uLight[i].enabled) {
          vec3 direction = normalize(uLight[i].pos - vPosition.xyz);
          float weight = max(dot(vTransformedNormal, direction), 0.0);
          lightWeighting += uLight[i].col * weight;
        }
      }
      gl_FragColor = vec4(gl_FragColor.rgb * lightWeighting, gl_FragColor.a);
#else
      gl_FragColor = vec4(gl_FragColor.rgb * vLightWeighting, gl_FragColor.a);
#endif
#endif
    }
  """

  constructor: (@data) ->
    @variants = {}
    @data = {} if not @data
    @data.vertexShader = @data.vertexShader?.join("\n") || WebGLProgram.DEFAULT_VERTEX
    @data.fragmentShader = @data.fragmentShader?.join("\n") || WebGLProgram.DEFAULT_FRAGMENT

  getName: -> @data.name

  compile: (renderer, opts) ->
    id = (k + '.' + v for k, v of opts).join(',')
    @variants[id] = renderer.compileProgram(@data, opts) if not @variants[id]
    return @variants[id]

class ProgramParser
  constructor: (@factory) ->

  parse: (core, data) ->
    d3.Core.trace('Parsing program', data.name)
    new WebGLProgram(data)

(this.d3 || this.d3 = {}).WebGLRenderer = WebGLRenderer
(this.d3 || this.d3 = {}).ProgramParser = ProgramParser

