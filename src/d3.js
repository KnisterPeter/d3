var files = [
  'core/class.js', 
  'core/math.js', 
  'core/main.js', 
  'core/typefactory.js', 
  'core/node.js', 
  'core/resource.js', 
  'core/scene.js', 
  'core/input.js', 
  'graphics/renderable.js',
  'graphics/material.js', 
  'graphics/light.js', 
  'graphics/mesh.js', 
  'graphics/buffer.js', 
  'graphics/renderer.js', 
  'graphics/program.js', 
  'graphics/texture.js'
];
var html = [];
for (var idx in files) {
  var file = (__d3path || '') + files[idx];
  html.push('<script type="text/javascript" src="' + file + '"></script>');
}
document.write(html.join(''));
