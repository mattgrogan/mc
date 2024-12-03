import { makeProject } from "@motion-canvas/core";
import "./global.css";

import plotExample from "./components/plotting/plotExample?scene";
import coordinateExample from "./components/plotting/coordinateExample?scene";
import scr from "./components/plotting/scrollable?scene";

export default makeProject({
  scenes: [coordinateExample, plotExample, scr],
});
