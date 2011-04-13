/**
 * Based on the idea of 
 * http://www.ruzee.com/blog/2008/12/javascript-inheritance-via-prototypes-and-closures
 */
(function() {
  var isFn = function(fn) { return typeof fn == "function"; };

  var module = function(name, closure) {
    var parts = name.split('.');
    var m = window;
    for (var i in parts) {
      m[parts[i]] = m[parts[i]] || {
          Class: function(clazzname, base, decl) {
            if (isFn(base) && base.prototype instanceof d3.lang.Class) {
              m[clazzname] = base.extend(name + '.' + clazzname, decl);
            } else if (clazzname && base && decl) {
              throw new Error('"' + name + '" is unable to extend base class');
            } else {
              m[clazzname] = d3.lang.Class.create(name + '.' + clazzname, base);
            }
          }        
        };
      m = m[parts[i]];
    }
    closure(m); 
  };
  
  module('d3', function(m) {
    m.Module = module;
  });
  
  d3.lang = {};
  d3.lang.Class = function() {};
  d3.lang.Class.create = function(name, decl) {
    var clazz = function(magic) {
      if (magic != isFn && isFn(this.construct)) this.construct.apply(this, arguments);
    };
    clazz.prototype = new this(isFn);
    for (var key in decl) {
      if (key == 'statics' && !isFn(decl[key])) {
        for (key in decl['statics']) {
          clazz[key] = decl['statics'][key];
        }
      } else {
        (function(fn, sfn) {
          clazz.prototype[key] = 
            !isFn(fn) || !isFn(sfn) 
              ? fn 
              : function() { this.SUPER = sfn; return fn.apply(this, arguments); };
        })(decl[key], clazz.prototype[key]);
      }
    }
    clazz.prototype.constructor = clazz;
    clazz.meta = { name: name };
    clazz.prototype.meta = clazz.meta;
    clazz.extend = this.extend || this.create;
    return clazz;  
  };
  
  d3.lang.resolve = function(n) {
    var r = window; 
    var s = n.split('.'); 
    for (var p in s) { r = r[s[p]]; } 
    return r;
  };
})();
