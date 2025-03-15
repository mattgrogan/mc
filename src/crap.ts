import {makeProject} from '@motion-canvas/core';

import crap from './scenes/crap_win?scene';
import crap_win_horizontal from './scenes/crap_win_horizontal?scene';

export default makeProject({
  scenes: [crap_win_horizontal, crap],
});
