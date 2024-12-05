import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TicketMetricsBarChart = ({ data, title }) => {
  const formattedData = data.map((item) => ({
    name: item.label,
    count: item.value,
    fill: item.color,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>{title}</h2>
      <ResponsiveContainer>
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketMetricsBarChart;
