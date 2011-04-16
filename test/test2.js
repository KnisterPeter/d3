new d3.Main(function(main, renderer) {
  renderer.createScene('../resources/scene1.scene', new d3.TypeFactory(), function(scene) {
    renderer.setRoot(scene.getRoot());
    var last = 0;
    renderer.renderFrame(function(time) {
      var now = new Date().getTime();
      if (last != 0) {
        var elapsed = now - last;
      }
      last = now;
    }, this);
  });
});
