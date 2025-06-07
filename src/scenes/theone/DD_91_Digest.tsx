import {
  Icon,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  easeOutCubic,
  range,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite, MonoWhite } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import { tw_colors } from "../../tw_colors";

// Import rating data
import houseEdgeData from "./house_edge.v1.json";
import throwHitRateData from "./throw_hit_rate.v1.json";

const TITLE = "Strategy Digest\nOverall Ratings";

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 90,
  fontWeight: 600,
  fill: tw_colors.zinc[100],
};

const RATING_TITLE_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 400,
  fill: Grays.GRAY3,
};

const RATING_VALUE_PROPS: TxtProps = {
  ...MonoWhite,
  fontSize: 100,
  fontWeight: 700,
  fill: Grays.BLACK,
};

const RATING_PERCENT_PROPS: TxtProps = {
  ...MonoWhite,
  fontSize: 50,
  fontWeight: 700,
  fill: Grays.BLACK,
};

const RATING_LABEL_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 600,
  fill: Grays.GRAY3,
};

interface RatingComponentProps {
  title: string;
  value: string;
  label: string;
  stars: number;
  maxStars?: number;
}

function RatingComponent({
  title,
  value,
  label,
  stars,
  maxStars = 5,
}: RatingComponentProps) {
  const starContainer = createRef<Layout>();
  const starRefs = createRefArray<Icon>();

  return (
    <Rect
      direction={"column"}
      width={"100%"}
      height={200}
      gap={15}
      padding={30}
      fill={Grays.WHITE}
      stroke={Grays.GRAY3}
      lineWidth={3}
      radius={15}
      justifyContent={"center"}
      alignItems={"start"}
      opacity={0}
    >
      {/* Title */}
      <Txt
        {...RATING_TITLE_PROPS}
        text={title}
      />

      {/* Value and Label Row */}
      <Layout
        direction={"row"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Layout
          direction={"row"}
          gap={20}
          alignItems={"baseline"}
        >
          <Txt
            {...RATING_VALUE_PROPS}
            text={value}
          />
          <Txt
            {...RATING_LABEL_PROPS}
            text={label}
          />
        </Layout>

        {/* Star Rating */}
        <Layout
          ref={starContainer}
          direction={"row"}
          gap={8}
          alignItems={"center"}
        >
          {range(maxStars).map((index) => (
            <Icon
              ref={starRefs}
              icon="mdi:star"
              size={40}
              color={index < stars ? tw_colors.yellow[400] : Grays.GRAY2}
            />
          ))}
        </Layout>
      </Layout>
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  // Background
  view.fill(tw_colors.slate[900]);

  // Main container
  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={60}
      padding={100}
      layout
    />
  );

  // Title Section
  const titleContainer = createRef<Rect>();
  container().add(
    <Rect
      ref={titleContainer}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      padding={40}
      fill={tw_colors.slate[800]}
      stroke={tw_colors.slate[600]}
      lineWidth={3}
      radius={20}
      opacity={0}
    >
      {TITLE.split("\n").map((line) => (
        <Txt
          {...TITLE_TXT_PROPS}
          text={line}
        />
      ))}
    </Rect>
  );

  // Ratings Container
  const ratingsContainer = createRef<Layout>();
  container().add(
    <Layout
      ref={ratingsContainer}
      direction={"column"}
      width={"80%"}
      gap={30}
      justifyContent={"center"}
      alignItems={"center"}
    />
  );

  // Get house edge data
  const playerData = houseEdgeData.TheOne;
  const houseEdgeRating = playerData.__rating_metadata__.HOUSE_EDGE;

  // Find the rating info for current house edge value
  const currentRating = houseEdgeRating.scale.find(
    (scale: any) =>
      playerData.HOUSE_EDGE >= scale.min &&
      (scale.max === null || playerData.HOUSE_EDGE < scale.max)
  );

  // House Edge Rating Component
  const houseEdgeComponent = createRef<Rect>();

  // Scale configuration - easily adjustable
  const SCALE_CONFIG = {
    width: 600, // Total width of the scale bar
    height: 80, // Height of the scale bar
    pointerSize: 50, // Size of the triangle pointer
    labelFontSize: 48, // Font size for scale labels
    gap: 8, // Gap between pointer and bar
  };

  // Scale setup with proportional widths based on magnitude
  const maxHouseEdge = 20; // 20% maximum
  const scaleData = [
    { color: tw_colors.green[500], min: 0, max: 1, label: "Minimal" }, // 1% range
    { color: tw_colors.blue[500], min: 1, max: 2.5, label: "Low" }, // 1.5% range
    { color: tw_colors.yellow[500], min: 2.5, max: 4, label: "Moderate" }, // 1.5% range
    { color: tw_colors.orange[500], min: 4, max: 7, label: "Elevated" }, // 3% range
    { color: tw_colors.red[500], min: 7, max: 20, label: "Substantial" }, // 13% range
  ];

  // Calculate proportional widths based on range magnitude
  const totalRange = maxHouseEdge;
  const scaleWidths = scaleData.map(
    (tier) => (tier.max - tier.min) / totalRange
  );

  // Calculate position for pointer based on actual value
  const currentHouseEdgePercent = playerData.HOUSE_EDGE * 100;
  let pointerPosition = 0;

  // Find which tier the current value falls into and calculate position
  let cumulativeWidth = 0;
  let found = false;
  
  for (let i = 0; i < scaleData.length; i++) {
    const tier = scaleData[i];
    
    // Check if value falls in this tier (handle edge cases properly)
    const inTier = currentHouseEdgePercent >= tier.min && 
                   (i === scaleData.length - 1 ? 
                    currentHouseEdgePercent <= tier.max : 
                    currentHouseEdgePercent < tier.max);
    
    if (inTier) {
      // Position within this tier
      const positionInTier = (currentHouseEdgePercent - tier.min) / (tier.max - tier.min);
      pointerPosition = cumulativeWidth + (positionInTier * scaleWidths[i]);
      found = true;
      break;
    }
    cumulativeWidth += scaleWidths[i];
  }
  
  // Fallback: if value exceeds our scale, place at the end
  if (!found) {
    pointerPosition = 1.0; // 100% of the way across
  }

  ratingsContainer().add(
    <Rect
      ref={houseEdgeComponent}
      direction={"row"}
      width={"100%"}
      height={300}
      padding={30}
      fill={Grays.WHITE}
      stroke={Grays.GRAY3}
      lineWidth={3}
      justifyContent={"center"}
      alignItems={"center"}
      opacity={0}
    >
      {/* First Column - Value and Title */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={10}
      >
        {/* Value with percent sign */}
        <Layout
          direction={"row"}
          alignItems={"baseline"}
          gap={5}
        >
          <Txt
            {...RATING_VALUE_PROPS}
            text={(playerData.HOUSE_EDGE * 100).toFixed(3)}
          />
          <Txt
            {...RATING_PERCENT_PROPS}
            text="%"
          />
        </Layout>

        {/* Title */}
        <Txt
          {...RATING_TITLE_PROPS}
          text="HOUSE EDGE"
        />
      </Layout>

      {/* Second Column - Rating Label (Centered) */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...RATING_LABEL_PROPS}
          text={currentRating?.label || "Unknown"}
        />
      </Layout>

      {/* Third Column - Visual Scale */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={15}
      >
        {/* Scale Bar Container */}
        <Layout
          direction={"column"}
          alignItems={"center"}
          gap={SCALE_CONFIG.gap}
        >
          {/* Triangle Pointer */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            height={SCALE_CONFIG.pointerSize}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Icon
              icon="mdi:triangle-down"
              size={SCALE_CONFIG.pointerSize}
              color={tw_colors.slate[700]}
              layout={false}
              x={SCALE_CONFIG.width * pointerPosition - SCALE_CONFIG.width / 2}
            />
          </Layout>

          {/* Color Scale Bar */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            height={SCALE_CONFIG.height}
          >
            {scaleData.map((tier, index) => (
              <Rect
                width={SCALE_CONFIG.width * scaleWidths[index]}
                height={SCALE_CONFIG.height}
                fill={tier.color}
                stroke={Grays.WHITE}
                lineWidth={1}
              />
            ))}
          </Layout>

          {/* Scale Labels */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Txt
              {...PoppinsWhite}
              fontSize={SCALE_CONFIG.labelFontSize}
              fill={Grays.GRAY3}
              text="0%"
            />
            <Txt
              {...PoppinsWhite}
              fontSize={SCALE_CONFIG.labelFontSize}
              fill={Grays.GRAY3}
              text="20%"
            />
          </Layout>
        </Layout>
      </Layout>
    </Rect>
  );

  // Throw Hit Rate Rating Component
  const throwHitRateComponent = createRef<Rect>();
  
  // Get throw hit rate data
  const throwPlayerData = throwHitRateData.TheOne;
  const throwHitRateRating = throwPlayerData.__rating_metadata__.THROW_HIT_RATE;
  
  // Find the rating info for current throw hit rate value
  const currentThrowRating = throwHitRateRating.scale.find(
    (scale: any) =>
      throwPlayerData.PCT_WITH_ANY_WIN >= scale.min &&
      throwPlayerData.PCT_WITH_ANY_WIN < scale.max
  );

  // Scale setup for throw hit rate (0-100%)
  const throwMaxRate = 100; // 100% maximum
  const throwScaleData = [
    { color: tw_colors.red[500], min: 0, max: 20, label: "Sparse" },     // 0-20%
    { color: tw_colors.orange[500], min: 20, max: 40, label: "Occasional" }, // 20-40%
    { color: tw_colors.yellow[500], min: 40, max: 60, label: "Steady" },     // 40-60%
    { color: tw_colors.blue[500], min: 60, max: 80, label: "Frequent" },     // 60-80%
    { color: tw_colors.green[500], min: 80, max: 100, label: "Constant" },   // 80-100%
  ];

  // Calculate proportional widths for throw hit rate
  const throwScaleWidths = throwScaleData.map(
    (tier) => (tier.max - tier.min) / throwMaxRate
  );

  // Calculate position for throw hit rate pointer
  const currentThrowRatePercent = throwPlayerData.PCT_WITH_ANY_WIN * 100;
  let throwPointerPosition = 0;
  let throwFound = false;
  
  let throwCumulativeWidth = 0;
  for (let i = 0; i < throwScaleData.length; i++) {
    const tier = throwScaleData[i];
    
    const inTier = currentThrowRatePercent >= tier.min && 
                   (i === throwScaleData.length - 1 ? 
                    currentThrowRatePercent <= tier.max : 
                    currentThrowRatePercent < tier.max);
    
    if (inTier) {
      const positionInTier = (currentThrowRatePercent - tier.min) / (tier.max - tier.min);
      throwPointerPosition = throwCumulativeWidth + (positionInTier * throwScaleWidths[i]);
      throwFound = true;
      break;
    }
    throwCumulativeWidth += throwScaleWidths[i];
  }
  
  if (!throwFound) {
    throwPointerPosition = 1.0;
  }

  ratingsContainer().add(
    <Rect
      ref={throwHitRateComponent}
      direction={"row"}
      width={"100%"}
      height={300}
      padding={30}
      fill={Grays.WHITE}
      stroke={Grays.GRAY3}
      lineWidth={3}
      justifyContent={"center"}
      alignItems={"center"}
      opacity={0}
    >
      {/* First Column - Value and Title */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={10}
      >
        {/* Value with percent sign */}
        <Layout
          direction={"row"}
          alignItems={"baseline"}
          gap={5}
        >
          <Txt
            {...RATING_VALUE_PROPS}
            text={(throwPlayerData.PCT_WITH_ANY_WIN * 100).toFixed(1)}
          />
          <Txt
            {...RATING_PERCENT_PROPS}
            text="%"
          />
        </Layout>

        {/* Title */}
        <Txt
          {...RATING_TITLE_PROPS}
          text="THROW HIT RATE"
        />
      </Layout>

      {/* Second Column - Rating Label (Centered) */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...RATING_LABEL_PROPS}
          text={currentThrowRating?.label || "Unknown"}
        />
      </Layout>

      {/* Third Column - Visual Scale */}
      <Layout
        direction={"column"}
        width={"33.33%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={15}
      >
        {/* Scale Bar Container */}
        <Layout
          direction={"column"}
          alignItems={"center"}
          gap={SCALE_CONFIG.gap}
        >
          {/* Triangle Pointer */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            height={SCALE_CONFIG.pointerSize}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Icon
              icon="mdi:triangle-down"
              size={SCALE_CONFIG.pointerSize}
              color={tw_colors.slate[700]}
              layout={false}
              x={SCALE_CONFIG.width * throwPointerPosition - SCALE_CONFIG.width / 2}
            />
          </Layout>

          {/* Color Scale Bar */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            height={SCALE_CONFIG.height}
          >
            {throwScaleData.map((tier, index) => (
              <Rect
                width={SCALE_CONFIG.width * throwScaleWidths[index]}
                height={SCALE_CONFIG.height}
                fill={tier.color}
                stroke={Grays.WHITE}
                lineWidth={1}
              />
            ))}
          </Layout>

          {/* Scale Labels */}
          <Layout
            direction={"row"}
            width={SCALE_CONFIG.width}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Txt
              {...PoppinsWhite}
              fontSize={SCALE_CONFIG.labelFontSize}
              fill={Grays.GRAY3}
              text="0%"
            />
            <Txt
              {...PoppinsWhite}
              fontSize={SCALE_CONFIG.labelFontSize}
              fill={Grays.GRAY3}
              text="100%"
            />
          </Layout>
        </Layout>
      </Layout>
    </Rect>
  );

  // TODO: Add more rating components here as they become available
  // Example structure for future ratings:
  /*
  ratingsContainer().add(
    <RatingComponent
      title="Volatility"
      value="Medium"
      label="Moderate swings"
      stars={3}
    />
  );
  
  ratingsContainer().add(
    <RatingComponent
      title="Bankroll Safety"
      value="85%"
      label="High survival rate"
      stars={4}
    />
  );
  */

  yield* waitFor(1);

  // Animate title in
  yield* FadeIn(titleContainer(), 0.8, easeOutCubic, [0, -50]);

  yield* waitFor(0.5);

  // Animate house edge rating in
  yield* FadeIn(houseEdgeComponent(), 0.8, easeOutCubic, [0, 50]);

  yield* waitFor(0.5);
  
  // Animate throw hit rate rating in
  yield* FadeIn(throwHitRateComponent(), 0.8, easeOutCubic, [0, 50]);

  yield* waitFor(5);
  yield* waitUntil("end");
});
