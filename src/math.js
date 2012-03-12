global = this

class Math
  @PI: global.Math.PI
  @PI2: @PI / 2
  @degToRad: (degrees) -> degrees * @PI / 180;
  @invSqrt: 1 / global.Math.sqrt;

class Quaternion
  @fromAngles: (yaw, roll, pitch) -> new Quaternion().fromAngles(yaw, roll, pitch)
  @fromAxis: (angel, axis) -> new Quaternion().fromAxis(angel, axis)
  @fromMatrix: (m) -> new Quaternion().fromMatrix(m)

  constructor: (x, y, z, w) ->
    if x instanceof Quaternion
      @x = x.x
      @y = x.y
      @z = x.z
      @w = x.w
    else
      @x = x || 0
      @y = y || 0
      @z = z || 0
      @w = w || 1

  set: (q) ->
    @x = q.x
    @y = q.y
    @z = q.z
    @w = q.w

  norm: -> @w * @w + @x * @x + @y * @y + @z * @z

  normalize: ->
    mag = global.Math.sqrt(@w * @w + @x * @x + @y * @y + @z * @z)
    @w *= mag
    @x *= mag
    @y *= mag
    @z *= mag
    return this

  conjugate: -> new Quaternion(-@x, -@y, -@z, -@w)

  multiply: (p) ->
    if p instanceof Quaternion
      new Quaternion(
         @x * p.w + @y * p.z - @z * p.y + @w * p.x
        -@x * p.z + @y * p.w + @z * p.x + @w * p.y
         @x * p.y - @y * p.x + @z * p.w + @w * p.z
        -@x * p.x - @y * p.y - @z * p.z + @w * p.w
        )
    else if p instanceof Math.Vector
      if p.elements[0] == 0 && p.elements[1] == 0 && p.elements[2] == 0
        new Math.Vector()
      else
        vx = p.elements[0]
        vy = p.elements[1]
        vz = p.elements[2]
        new Math.Vector([
          @w * @w * vx + 2 * @y * @w * vz - 2 * @z * @w * vy + @x * @x * vx + 2 * @y * @x * vy + 2 * @z * @x * vz - @z * @z * vx - @y * @y * vx
          2 * @x * @y * vx + @y * @y * vy + 2 * @z * @y * vz + 2 * @w * @z * vx - @z * @z * vy + @w * @w * vy - 2 * @x * @w * vz - @x * @x * vy
          2 * @x * @z * vx + 2 * @y * @z * vy + @z * @z * vz - 2 * @w * @y * vx - @y * @y * vz + 2 * @w * @x * vy - @x * @x * vz + @w * @w * vz
          ])
    else
      throw new Error('Illegal Argument', p)

  fromAxis: (angel, axis) ->
    angel = Math.degToRad(angel)
    angel *= 0.5
    axis = new Math.Vector(axis.elements || axis).normalize()
    sin = global.Math.sin(angel)
    @x = axis.elements[0] * sin
    @y = axis.elements[1] * sin
    @z = axis.elements[2] * sin
    @w = global.Math.cos(angel)
    return this

  toAxis: ->
    sqrLength = @x * @x + @y * @y + @z * @z
    if sqrLength == 0
      [
        0
        new Math.Vector([1, 0, 0])
      ]
    else
      invLength = 1 / global.Math.sqrt(sqrLength)
      [
        2 * global.Math.acos(@w)
        new Math.Vector([@x * invLength, @y * invLength, @z * invLength])
      ]

  fromAngles: (yaw, roll, pitch) ->
    angle = Math.degToRad(pitch) * 0.5
    sinPitch = global.Math.sin(angle)
    cosPitch = global.Math.cos(angle)
    angle = Math.degToRad(roll) * 0.5
    sinRoll = global.Math.sin(angle)
    cosRoll = global.Math.cos(angle)
    angle = Math.degToRad(yaw) * 0.5
    sinYaw = global.Math.sin(angle)
    cosYaw = global.Math.cos(angle)

    cosRollXcosPitch = cosRoll * cosPitch
    sinRollXsinPitch = sinRoll * sinPitch
    cosRollXsinPitch = cosRoll * sinPitch
    sinRollXcosPitch = sinRoll * cosPitch

    @w = cosRollXcosPitch * cosYaw - sinRollXsinPitch * sinYaw
    @x = cosRollXcosPitch * sinYaw + sinRollXsinPitch * cosYaw
    @y = sinRollXcosPitch * cosYaw + cosRollXsinPitch * sinYaw
    @z = cosRollXsinPitch * cosYaw - sinRollXcosPitch * sinYaw
    this.normalize()

  toAngles: ->
    sqw = @w * @w
    sqx = @x * @x
    sqy = @y * @y
    sqz = @z * @z
    unit = sqx + sqy + sqz + sqw

    test = @x * @y + @z * @w;
    if test > 0.499 * unit
      [
        0
        2 * global.Math.atan2(@x, @w)
        Math.PI2
      ]
    else if test < -0.499 * unit
      [
        0
        -2 * global.Math.atan2(@x, @w)
        -Math.PI2
      ]
    else
      [
        global.Math.atan2(2 * @x * @w - 2 * @y * @z, -sqx + sqy - sqz + sqw)
        global.Math.atan2(2 * @y * @w - 2 * @x * @z, sqx - sqy - sqz + sqw)
        global.Math.asin(2 * test / unit)
      ]

  fromMatrix: (m) ->
    e = m.elements
    t = e[0] + e[5] + e[10];
    if t >= 0
      s = global.Math.sqrt(t + 1)
      @w = 0.5 * s
      s = 0.5 / s
      @x = (e[6] - e[9]) * s
      @y = (e[8] - e[2]) * s
      @z = (e[1] - e[4]) * s
    else if (e[0] > e[5]) and (e[0] > e[10])
      s = global.Math.sqrt(1.0 + e[0] - e[5] - e[10])
      @x = s * 0.5
      s = 0.5 / s
      @y = (e[1] + e[4]) * s
      @z = (e[8] + e[2]) * s
      @w = (e[6] - e[9]) * s
    else if e[5] > e[10]
      s = global.Math.sqrt(1.0 + e[5] - e[0] - e[10])
      @y = s * 0.5
      s = 0.5 / s
      @x = (e[1] + e[4]) * s
      @z = (e[6] + e[9]) * s
      @w = (e[8] - e[2]) * s
    else
      s = global.Math.sqrt(1.0 + e[10] - e[0] - e[5])
      @z = s * 0.5
      s = 0.5 / s
      @x = (e[8] + e[2]) * s
      @y = (e[6] + e[9]) * s
      @w = (e[1] - e[4]) * s
    return this

  toMatrix: ->
    norm = this.norm()
    s = if norm == 1 then 2 else if norm > 0 then 2 / norm else 0
    xs = @x * s;
    ys = @y * s;
    zs = @z * s;
    xx = @x * xs;
    xy = @x * ys;
    xz = @x * zs;
    xw = @w * xs;
    yy = @y * ys;
    yz = @y * zs;
    yw = @w * ys;
    zz = @z * zs;
    zw = @w * zs;
    new Math.Matrix([
      1 - (yy + zz),     (xy + zw),     (xz - yw), 0
          (xy - zw), 1 - (xx + zz),     (yz + xw), 0
          (xz + yw),     (yz - xw), 1 - (xx + yy), 0
                  0,             0,             0, 1
      ])

(this.d3 || this.d3 = {}).Math = Math
(this.d3 || this.d3 = {}).Math.Vector = d3.vectemp
delete d3.vectemp
(this.d3 || this.d3 = {}).Math.Matrix = d3.mattemp
delete d3.mattemp
(this.d3 || this.d3 = {}).Math.Quaternion = Quaternion

