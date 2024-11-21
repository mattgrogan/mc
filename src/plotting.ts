import { makeProject } from "@motion-canvas/core";

import plotExample from "./components/plotting/plotExample?scene";
import coordinateExample from "./components/plotting/coordinateExample?scene";

export default makeProject({
  scenes: [coordinateExample, plotExample],
});
