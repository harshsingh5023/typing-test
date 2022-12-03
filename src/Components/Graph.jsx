import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";
import { useTheme } from "../Context/ThemeContext";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

const Graph = ({ graphData, type }) => {
  const { theme } = useTheme();

  return (
    <div>
      <Line
        data={{
          labels: graphData.map((i) =>
            type === "date"
              ? i[0].toDate().toLocaleString("en-US", {
                  // weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : i[0] + 1
          ),
          datasets: [
            {
              fill: true,
              backgroundColor: theme.stats,
              borderJoinStyle: "bevel",
              hoverBackgroundColor: theme.title,
              pointBackgroundColor: theme.stats,
              pointHoverRadius: 5,
              borderColor: theme.typeBoxText,
              data: graphData.map((i) => i[1]),
              label: "WPM",
              lineTension: 0.2,
              borderWidth: 1.5,
              pointRadius: 3.5,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              ticks: {
                color: theme.stats,
              },
            },
            y: {
              ticks: {
                color: theme.stats,
              },
            },
          },
        }}
      ></Line>
    </div>
  );
};

export default Graph;
