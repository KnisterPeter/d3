new d3.Main(function(main, renderer) {
  renderer.createMesh('../resources/mesh2.mesh', function(mesh) {
    renderer.createMaterial('../shader/pnt/pnt.material', function(mat) {
      mesh.setMaterial(mat);
      
      var r1 = new d3.Renderable(mesh);
      r1.setPosition([0, 0.0, -5.0]);
      // Ambient Light
      r1.addLight(new d3.Light([0.5, 0.6, 0.8]));
      // Directional Light
      r1.addLight(new d3.Light([0.2, 1, 0.2], [-1, -1, 1]));
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
    }, this);
  }, this);
});
