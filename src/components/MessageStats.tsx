import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Button } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type MessageStatsProps = {
  socket: any;
};

const MessageStats: React.FC<MessageStatsProps> = ({ socket }) => {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [messageCounts, setMessageCounts] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false); 

  useEffect(() => {
    const handleMessage = () => {
      if (!isPaused) {
        const currentTimestamp = new Date().toLocaleTimeString();
        setTimestamps((prev) => [...prev.slice(-9), currentTimestamp]); 
        setMessageCounts((prev) => [...prev.slice(-9), (prev[prev.length - 1] || 0) + 1]); 
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, isPaused]); 

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Messages Over Time",
        data: messageCounts,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Message Activity" },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Messages" }, beginAtZero: true },
    },
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev); 
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h5>Message Statistics</h5>
      <Line data={data} options={options} />
      <Button onClick={handlePauseResume} style={{ marginTop: "10px" }}>
        {isPaused ? "Resume Updates" : "Pause Updates"}
      </Button>
    </div>
  );
};

export default MessageStats;
