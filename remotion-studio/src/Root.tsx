import React from "react";
import { Composition, Still, type CalculateMetadataFunction } from "remotion";
import { FPS, H, W, defaultProps, sceneFrames, type ShortProps } from "./common";
import { Short } from "./Short";
import { Thumb } from "./Thumb";

const calculateMetadata: CalculateMetadataFunction<ShortProps> = ({ props }) => ({
  durationInFrames: sceneFrames(props.durations).reduce((a, b) => a + b, 0),
});

export const Root: React.FC = () => (
  <>
    <Composition
      id="Short"
      component={Short}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={300}
      defaultProps={defaultProps}
      calculateMetadata={calculateMetadata}
    />
    <Still id="Thumb" component={Thumb} width={1280} height={720} defaultProps={defaultProps} />
  </>
);
