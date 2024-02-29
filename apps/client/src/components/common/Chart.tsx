import { useId } from "react";
import { Box, BoxProps, useToken } from "@chakra-ui/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ComponentProps } from "@/types/common";

export type ChartDataObject = { [K in string]: string | number };

export type ChartProps = ComponentProps<BoxProps, { data?: ChartDataObject[]; aspect?: number }>;

export function Chart({ data = [], aspect = 4.875, ...props }: ChartProps) {
  const linearId = useId();

  const [colorS2Indigo100, colorS2Indigo600, colorS2Gray200, colorS2Gray900] = useToken("colors", [
    "s2.purple.200",
    "s2.purple.800",
    "s2.gray.200",
    "s2.gray.900"
  ]);

  const [fontSizeXs, fontSizeSm] = useToken("fontSizes", ["xs", "sm"]);

  const [key, value] = Object.keys(data?.[0] ?? {});

  const axisStyle = { fontSize: fontSizeXs, color: colorS2Gray900 };

  return (
    <Box
      position="relative"
      {...props}
    >
      <ResponsiveContainer
        width="100%"
        aspect={aspect}
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={linearId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop stopColor={colorS2Indigo100} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey={key}
            tickLine={false}
            style={axisStyle}
            tickMargin={5}
            hide
          />
          <YAxis
            dataKey={value}
            tickLine={false}
            style={axisStyle}
            tickMargin={6}
            hide
          />
          <CartesianGrid stroke={colorS2Gray200} />
          <Tooltip contentStyle={{ fontSize: fontSizeSm, textTransform: "capitalize" }} />
          <Area
            type="linear"
            dataKey={value}
            stroke={colorS2Indigo600}
            fillOpacity={1}
            fill={`url(#${linearId})`}
            strokeWidth={2}
            strokeOpacity={1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
