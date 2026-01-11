"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo, useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Row = { id: string; amount: number; title: string; category: string; created?: string };

export default function LineGraph({ rows }: { rows: Row[] }) {
  const [updateKey, setUpdateKey] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const lightColor= "hsl(150, 70%, 45%)"
  const darkColor= "hsl(60, 100%, 50%)"

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    
    checkTheme(); // Initial check
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  // Update key when rows OR theme change
  useEffect(() => {
    console.log('ROWS FULLY CHANGED:', rows.length);
    setUpdateKey(prev => prev + 1);
  }, [rows, isDarkTheme]);

  const chartData = useMemo(() => {
    // Theme-specific colors (HARD-CODED - Chart.js requirement)
    const colors = isDarkTheme 
      ? {
          line: darkColor,     // Bright green on dark
          fill: darkColor,
          point: darkColor,
        }
      : {
          line: lightColor,     // Muted green on light
          fill: lightColor,
          point: lightColor,
        };

    const sortedChronological = [...rows]
      .sort((a, b) => new Date(a.created || 0).getTime() - new Date(b.created || 0).getTime())
      .slice(-7);
    
    const labels = sortedChronological.map(row => 
      row.title.length > 12 ? `${row.title.substring(0, 12)}...` : row.title
    );
    
    const transactionAmounts = sortedChronological.map(row => row.amount);
    const dataPoints = [0];
    let runningTotal = 0;
    
    sortedChronological.forEach(row => {
      runningTotal += row.amount;
      dataPoints.push(runningTotal);
    });
    dataPoints.shift();

    return {
      labels,
      datasets: [{
        label: "Balance Evolution",
        data: dataPoints,
        transactionData: sortedChronological,
        transactionAmounts,
        borderColor: colors.line,
        backgroundColor: colors.fill,
        tension: 0,
        fill: true,
        pointBackgroundColor: colors.point,
        pointBorderColor: isDarkTheme ? '#111' : '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    };
  }, [rows, isDarkTheme]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkTheme ? '#ffffff' : '#111111',
        titleFont: { size: 14, weight: 'bold' },
        bodyColor: isDarkTheme ? '#e5e7eb' : '#374151',
        bodyFont: { size: 13 },
        borderColor: isDarkTheme ? darkColor : lightColor,
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        padding: 16,
        callbacks: {
          title: (context) => {
            const dataset = context[0].dataset as any;
            const row = dataset.transactionData[context[0].dataIndex];
            return row.title;
          },
          label: (context) => {
            const dataset = context.dataset as any;
            const row = dataset.transactionData[context.dataIndex];
            const isIncome = row.amount >= 0;
            const type = isIncome ? 'Income' : 'Expense';
            const formattedAmount = new Intl.NumberFormat('en-EU', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 2,
            }).format(Math.abs(row.amount));
            return `${type}: ${formattedAmount}`;
          },
          afterLabel: (context) => {
            const dataset = context.dataset as any;
            const row = dataset.transactionData[context.dataIndex];
            return `Category: ${row.category}`;
          },
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { 
          color: isDarkTheme ? 'hsla(0, 0%, 10%, 0.3)' : 'hsla(0, 0%, 90%, 0.3)' 
        },
        ticks: { display: false }
      },
      x: {
        ticks: { 
          color: isDarkTheme ? 'hsla(0, 0%, 95%, 0.7)' : 'hsla(0, 0%, 20%, 0.7)',
          maxTicksLimit: 7,
          font: { size: 11 }
        },
        grid: { display: false },
        grace: '5%'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8
      }
    },
    animation: false
  };

  return (
    <div className="bg-background w-full shadow-sm p-6 rounded-3xl col-span-2 h-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-subheader">
            Balance Evolution
          </span>
          <span className="block text-base font-semibold text-header">
            Last 7 transactions
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Line key={updateKey} data={chartData} options={options} />
      </div>
    </div>
  );
}
