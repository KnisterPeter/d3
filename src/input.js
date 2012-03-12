global = this

class Input
  @KEY_ALTGR = 0
  @KEY_TAB = 9
  @KEY_ENTER = 13
  @KEY_SHIFT = 16
  @KEY_STRG = 17
  @KEY_ALT = 18
  @KEY_CAPS = 20
  @KEY_ESC = 27
  @KEY_PAGE_UP = 33
  @KEY_PAGE_DOWN = 34
  @KEY_END = 35
  @KEY_POS1 = 36
  @KEY_LEFT = 37
  @KEY_UP = 38
  @KEY_RIGHT = 39
  @KEY_DOWN = 40
  @KEY_INS = 45
  @KEY_DEL = 46
  @KEY_0 = 48
  @KEY_1 = 49
  @KEY_2 = 50
  @KEY_3 = 51
  @KEY_4 = 52
  @KEY_5 = 53
  @KEY_6 = 54
  @KEY_7 = 55
  @KEY_8 = 56
  @KEY_9 = 57
  @KEY_A = 65
  @KEY_B = 66
  @KEY_C = 67
  @KEY_D = 68
  @KEY_E = 69
  @KEY_F = 70
  @KEY_G = 71
  @KEY_H = 72
  @KEY_I = 73
  @KEY_J = 74
  @KEY_K = 75
  @KEY_L = 76
  @KEY_M = 77
  @KEY_N = 78
  @KEY_O = 79
  @KEY_P = 80
  @KEY_Q = 81
  @KEY_R = 82
  @KEY_S = 83
  @KEY_T = 84
  @KEY_U = 85
  @KEY_V = 86
  @KEY_W = 87
  @KEY_X = 88
  @KEY_Y = 89
  @KEY_Z = 90
  @KEY_WIN = 91
  @KEY_PAD_0 = 96
  @KEY_PAD_1 = 97
  @KEY_PAD_2 = 98
  @KEY_PAD_3 = 99
  @KEY_PAD_4 = 100
  @KEY_PAD_5 = 101
  @KEY_PAD_6 = 102
  @KEY_PAD_7 = 103
  @KEY_PAD_8 = 104
  @KEY_PAD_9 = 105
  @KEY_PAD_MUL = 106
  @KEY_PAD_PLUS = 107
  @KEY_PAD_MINUS = 109
  @KEY_PAD_DIV = 111
  @KEY_F1 = 112
  @KEY_F2 = 113
  @KEY_F3 = 114
  @KEY_F4 = 115
  @KEY_F5 = 116
  @KEY_F6 = 117
  @KEY_F7 = 118
  @KEY_F8 = 119
  @KEY_F9 = 120
  @KEY_F10 = 121
  @KEY_F11 = 122
  @KEY_F12 = 123
  @KEY_PLUS = 187
  @KEY_COMMA = 188
  @KEY_MINUS = 189
  @KEY_DOT = 190

  constructor: (@config) ->
    @keys = []
    global.addEventListener('keydown'
      (e) => this.onKeyDown(e)
      true)
    global.addEventListener('keyup'
      (e) => this.onKeyUp(e)
      true)
    global.addEventListener('mousemove'
      (e) => this.onMouseMove(e)
      true)

  isKeyPressed: (code) -> @keys[code]

  onKeyDown: (e) -> 
    e.preventDefault() if @config.preventDefault
    @keys[e.which] = true

  onKeyUp: (e) ->
    e.preventDefault() if @config.preventDefault
    @keys[e.which] = false

  onMouseMove: (e) ->

(this.d3 || this.d3 = {}).Input = Input

