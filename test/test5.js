new d3.Main(function(main, renderer) {
  renderer.createMesh('../resources/mesh2.mesh', function(mesh) {

    // Ambient Light
    renderer.getRoot().addLight(new d3.Light([0.2, 0.2, 0.2]));
    
    // Point Light 1
    var point = new d3.Light([1, 1, 0]);
    point.setPosition([-5, 0, 0]);
    renderer.getRoot().addLight(point);

    // Point Light 2
    var point = new d3.Light([0, 0, 1]);
    point.setPosition([5, 0, -5]);
    renderer.getRoot().addLight(point);
    
    var r1 = new d3.Renderable(mesh);
    r1.setPosition([0, 0, -10]);
    renderer.getRoot().addChild(r1);
    
    var last = 0;
    renderer.renderFrame(function(time) {
      var now = new Date().getTime();
      if (main.getInput().isKeyPressed(d3.Input.KEY_UP)) {
        r1.yaw(5);
      }
      if (main.getInput().isKeyPressed(d3.Input.KEY_DOWN)) {
        r1.yaw(-5);
      }
      if (main.getInput().isKeyPressed(d3.Input.KEY_LEFT)) {
        r1.pitch(5);
      }
      if (main.getInput().isKeyPressed(d3.Input.KEY_RIGHT)) {
        r1.pitch(-5);
      }
      if (main.getInput().isKeyPressed(d3.Input.KEY_PAGE_UP)) {
        r1.roll(5);
      }
      if (main.getInput().isKeyPressed(d3.Input.KEY_PAGE_DOWN)) {
        r1.roll(-5);
      }
      last = now;
    }, this);
  });
});
