import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import scene from "./scene?scene";
import sonic_scene from "./sonic_scene?scene";

export default makeProject({
  scenes: [scene, sonic_scene],
});
