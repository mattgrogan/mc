import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
//import ffmpeg from "@motion-canvas/ffmpeg";

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        "./src/utils/utilsDemoProject.ts",
        "./src/coordinates.ts",
        "./src/regression440_demo.ts",
        "./src/play_all_day_demo.ts",
        "./src/scenes/play_all_day/play_all_day.ts",
        "./src/example.ts",
        "./src/rolltext.ts",
        "./src/regression440.ts",
        "./src/plotting.ts",
        "./src/scenes/tpd_no_replacement/tpd_no_replacement_demo.ts",
        "./src/scenes/tpd_no_replacement/tpd_no_replacement.ts",
        "./src/scenes/boxcars/boxcars_demo.ts",
        "./src/scenes/boxcars/boxcars.ts",
        "./src/scenes/sixeight_lowroller/sixeight_lowroller_demo.ts",
        "./src/scenes/sixeight_lowroller/sixeight_lowroller.ts",
        "./src/scenes/skill66/skill66_demo.ts",
        "./src/scenes/skill66/skill66.ts",
        "./src/components/plot/plotProject.ts",
      ],
    }),
    //ffmpeg(),
  ],
});
