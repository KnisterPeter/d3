var config = {
  input: {
    preventDefaults: false
  }
};
new d3.Main(config, function(main, renderer) {
  renderer.createMesh('../resources/mesh1.mesh', function(mesh) {
    var r1 = new d3.Renderable(mesh);
    r1.setPosition([-2, 0.0, -7.0]);
    renderer.getRoot().addChild(r1);

    var r2 = new d3.Renderable(mesh);
    r2.setPosition([2, 0.0, -7.0]);
    renderer.getRoot().addChild(r2);
    
    var last = 0;
    renderer.renderFrame(function(time) {
      var now = new Date().getTime();
      if (last != 0) {
        var elapsed = now - last;
        r1.yaw(90 * elapsed / 1000);
        r2.pitch(90 * elapsed / 1000);
      }
      last = now;
    }, this);
  });
});
