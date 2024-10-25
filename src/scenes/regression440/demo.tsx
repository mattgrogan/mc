import { Circle, Layout, makeScene2D } from "@motion-canvas/2d";
import { createRef, useLogger } from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import felt from "../../../../assets/Tables/Craps_Table_Steel_Felt.png";

export default makeScene2D(function* (view) {
  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  view.add(
    <Layout ref={container}>
      <CrapsTable
        ref={table}
        position={[0, 0]}
      ></CrapsTable>
    </Layout>
  );

  table().setTableSrc(felt);
});
