var files = [
  'core/class.js', 
  'core/math.js', 
  'core/main.js', 
  'core/typefactory.js', 
  'core/node.js', 
  'core/renderable.js',
  'core/resource.js', 
  'core/material.js', 
  'core/light.js', 
  'core/mesh.js', 
  'core/scene.js', 
  'core/input.js', 
  'webgl/buffer.js', 
  'webgl/renderer.js', 
  'webgl/program.js', 
  'webgl/texture.js'
];
var html = [];
for (var idx in files) {
  var file = (__d3path || '') + files[idx];
  html.push('<script type="text/javascript" src="' + file + '"></script>');
}
document.write(html.join(''));
