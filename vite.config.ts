import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import ffmpeg from "@motion-canvas/ffmpeg";

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        "./src/regression440_demo.ts",
        "./src/example.ts",
        "./src/rolltext.ts",
      ],
    }),
    ffmpeg(),
  ],
});
