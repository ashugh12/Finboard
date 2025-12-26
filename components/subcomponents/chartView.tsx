import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { getValue } from "@/utils/getValue";
import { Widget } from "@/types/widget";

export function ChartView({
  widget,
  data,
  previewFields,
}: {
  widget: Widget;
  data: any;
  previewFields?: string[];
}) {
  const path = previewFields?.[0] ?? widget.fields[0]?.path;
  const points = getValue(data, path);

  if (!Array.isArray(points)) {
    return <p className="text-sm text-gray-500">No chart data</p>;
  }

  return (
    <LineChart width={350} height={200} data={points}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#4f46e5"
        dot={false}
      />
    </LineChart>
  );
}
