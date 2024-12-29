import { View2D, makeScene2D } from "@motion-canvas/2d";
import {
  FullSceneDescription,
  ThreadGenerator,
  ThreadGeneratorFactory,
  ValueDispatcher,
} from "@motion-canvas/core";

type CyclicConfig<T> = (params: T) => CyclicConfig<T>;

export function parametrize<T>(scene: FullSceneDescription, params: T) {
  const typeScene = scene as FullSceneDescription<CyclicConfig<T>>;
  let newScene = {
    ...typeScene,
    config: typeScene.config(params),
    onReplaced: new ValueDispatcher(scene),
  };

  typeScene.onReplaced.subscribe((value) => {
    newScene.onReplaced.current = {
      ...newScene,
      config: value.config(params),
    };
  }, false);

  return newScene;
}

export function makeParametrizedScene<T>(
  factory: (view: View2D, params: T) => ThreadGenerator
) {
  return makeScene2D(
    ((params: T) =>
      function* (view: View2D) {
        yield* factory(view, params);
      }) as unknown as ThreadGeneratorFactory<View2D>
  );
}
