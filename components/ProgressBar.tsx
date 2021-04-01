import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

export interface DefaultProps {
  total: number;
  current: number;
  size?: string;
}

function ProgressBarComponent({ total, current, size }: DefaultProps) {
  const percent = ((current / total) * 100).toFixed(2);

  return (
    <ProgressBar
      bgColor={"#2a9d8f"}
      height={size}
      completed={parseFloat(percent)}
    />
  );
}

export default ProgressBarComponent;
