import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const TicketMetricsDonutChart = ({ data }) => {
  const COLORS = ["#3498db", "#f39c12", "#27ae60"]; // Blue, Yellow, Green

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70} // Creates the donut effect
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TicketMetricsDonutChart;
