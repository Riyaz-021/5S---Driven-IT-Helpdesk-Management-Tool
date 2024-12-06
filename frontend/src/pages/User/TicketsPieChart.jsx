import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const TicketsPieChart = ({ stats }) => {
  // Prepare data for the pie chart
  const data = [
    { name: "Total Tickets", value: stats.totalTickets, color: "#3498db" },
    { name: "Pending Tickets", value: stats.pendingTickets, color: "#f1c40f" },
    {
      name: "Resolved Tickets",
      value: stats.resolvedTickets,
      color: "#2ecc71",
    },
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Overview of Tickets</h3>
      <center>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </center>
    </div>
  );
};

export default TicketsPieChart;
