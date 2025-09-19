import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function VitalSignsChart({ data }) {

    const formatTime = (timestamp) => {
    if (!timestamp) return '';

    if (/^\d{2}:\d{2}:\d{2}/.test(timestamp)) {
        return timestamp.slice(0, 8);
    }

    if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString('pt-BR', { hour12: false });
    }

    if (typeof timestamp === 'string' && timestamp.includes('.')) {
        return timestamp.split('.')[0];
    }
    return timestamp;
  };

  const chartData = {
    labels: data.map(row => formatTime(row.timestamp)),
    datasets: [
      {
        label: 'Freq. Cardíaca (bpm)',
        data: data.map(row => row.hr),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'SpO2 (%)',
        data: data.map(row => row.spo2),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Temperatura (°C)',
        data: data.map(row => row.temp),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        yAxisID: 'yTemp',
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histórico de Sinais Vitais',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Horário'
        },
        ticks: {
          callback: function(value, index, ticks) {
            return chartData.labels[index];
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Batimentos / SpO2'
        }
      },
      yTemp: { 
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Temperatura (°C)'
        },
        grid: {
          drawOnChartArea: false, 
        },
        ticks: {
          callback: function(value) {
            return value + '°C'
          }
        }
      }
    }
  };

  return (
    <div className="card chart-card">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default VitalSignsChart;