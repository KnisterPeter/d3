d3.Module('d3', function(m) {
  m.Class('Input', {
    keys: null,
    
    construct: function() {
      this.keys = [];
    
      window.addEventListener('keydown', d3.bind(this.keyDown, this), true);
      window.addEventListener('keyup', d3.bind(this.keyUp, this), true);
      window.addEventListener('mousemove', d3.bind(this.mouseMove, this), true);
    },
  
    isKeyPressed: function(code) {
      return this.keys[code];
    },
  
    keyDown: function(e) {
      e.preventDefault();
      this.keys[e.which] = true;
    },
    keyUp: function(e) {
      e.preventDefault();
      this.keys[e.which] = false;
    },
    mouseMove: function(e) {
    }
  });
  
  d3.Input.KEY_ALTGR = 0;
  d3.Input.KEY_TAB = 9;
  d3.Input.KEY_ENTER = 13;
  d3.Input.KEY_SHIFT = 16;
  d3.Input.KEY_STRG = 17;
  d3.Input.KEY_ALT = 18;
  d3.Input.KEY_CAPS = 20;
  d3.Input.KEY_ESC = 27;
  d3.Input.KEY_PAGE_UP = 33;
  d3.Input.KEY_PAGE_DOWN = 34;
  d3.Input.KEY_END = 35;
  d3.Input.KEY_POS1 = 36;
  d3.Input.KEY_LEFT = 37;
  d3.Input.KEY_UP = 38;
  d3.Input.KEY_RIGHT = 39;
  d3.Input.KEY_DOWN = 40;
  d3.Input.KEY_INS = 45;
  d3.Input.KEY_DEL = 46;
  d3.Input.KEY_0 = 48;
  d3.Input.KEY_1 = 49;
  d3.Input.KEY_2 = 50;
  d3.Input.KEY_3 = 51;
  d3.Input.KEY_4 = 52;
  d3.Input.KEY_5 = 53;
  d3.Input.KEY_6 = 54;
  d3.Input.KEY_7 = 55;
  d3.Input.KEY_8 = 56;
  d3.Input.KEY_9 = 57;
  d3.Input.KEY_A = 65;
  d3.Input.KEY_B = 66;
  d3.Input.KEY_C = 67;
  d3.Input.KEY_D = 68;
  d3.Input.KEY_E = 69;
  d3.Input.KEY_F = 70;
  d3.Input.KEY_G = 71;
  d3.Input.KEY_H = 72;
  d3.Input.KEY_I = 73;
  d3.Input.KEY_J = 74;
  d3.Input.KEY_K = 75;
  d3.Input.KEY_L = 76;
  d3.Input.KEY_M = 77;
  d3.Input.KEY_N = 78;
  d3.Input.KEY_O = 79;
  d3.Input.KEY_P = 80;
  d3.Input.KEY_Q = 81;
  d3.Input.KEY_R = 82;
  d3.Input.KEY_S = 83;
  d3.Input.KEY_T = 84;
  d3.Input.KEY_U = 85;
  d3.Input.KEY_V = 86;
  d3.Input.KEY_W = 87;
  d3.Input.KEY_X = 88;
  d3.Input.KEY_Y = 89;
  d3.Input.KEY_Z = 90;
  d3.Input.KEY_WIN = 91;
  d3.Input.KEY_PAD_0 = 96;
  d3.Input.KEY_PAD_1 = 97;
  d3.Input.KEY_PAD_2 = 98;
  d3.Input.KEY_PAD_3 = 99;
  d3.Input.KEY_PAD_4 = 100;
  d3.Input.KEY_PAD_5 = 101;
  d3.Input.KEY_PAD_6 = 102;
  d3.Input.KEY_PAD_7 = 103;
  d3.Input.KEY_PAD_8 = 104;
  d3.Input.KEY_PAD_9 = 105;
  d3.Input.KEY_PAD_MUL = 106;
  d3.Input.KEY_PAD_PLUS = 107;
  d3.Input.KEY_PAD_MINUS = 109;
  d3.Input.KEY_PAD_DIV = 111;
  d3.Input.KEY_F1 = 112;
  d3.Input.KEY_F2 = 113;
  d3.Input.KEY_F3 = 114;
  d3.Input.KEY_F4 = 115;
  d3.Input.KEY_F5 = 116;
  d3.Input.KEY_F6 = 117;
  d3.Input.KEY_F7 = 118;
  d3.Input.KEY_F8 = 119;
  d3.Input.KEY_F9 = 120;
  d3.Input.KEY_F10 = 121;
  d3.Input.KEY_F11 = 122;
  d3.Input.KEY_F12 = 123;
  d3.Input.KEY_PLUS = 187;
  d3.Input.KEY_COMMA = 188;
  d3.Input.KEY_MINUS = 189;
  d3.Input.KEY_DOT = 190;
});

