"use client";

import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  ChartOptions 
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState, useCallback } from 'react';
import { getTransactionsAsSuperuser } from '@/lib/pocketbaseServer';
import { useBalance } from "@/components/balanceContext";

ChartJS.register(ArcElement, Tooltip);

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    hoverOffset: number;
  }>;
}

type ChartType = 'expenses' | 'incomes';

interface DoughnutChartProps {
  type: ChartType;
}

export default function DoughnutChart({ type }: DoughnutChartProps) {
  const [chartData, setChartData] = useState<ChartData>({ 
    labels: [], 
    datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 4 }] 
  });
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  const { balance, loading: balanceLoading } = useBalance();

  // Rileva cambiamenti tema tramite MutationObserver su HTML root
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  // Colori base per tema (TODO: completare valori X)
  const lightColor = "hsl(150, 90%, X)";
  const darkColor = "hsl(60, 70%, X)";

  // Genera palette gradienti adattiva al tema (10 tonalità)
  const getDoughnutColors = () => {
    // Seleziona colore base in base al tema corrente
    const baseColor = isDarkTheme ? darkColor : lightColor; 
    
    // Gradiente con opacità decrescente per effetto sfumato
    const alphaSteps = ["50%", "45%", "40%", "35%", "30%", "25%", "20%", "15%", "10%", "5%"];
    
    // Crea 10 varianti hsla con alpha decrescente
    return alphaSteps.map((a, i) => {
      return baseColor.replace("X", a);
    });
  };

  // Fetch transazioni e aggrega per categoria (ultimi 30 giorni)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const transactions = await getTransactionsAsSuperuser();
      
      // Filtra transazioni degli ultimi 30 giorni
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      const recentTransactions = transactions.filter((t: any) => {
        const createdDate = new Date(t.created);
        const isRecent = createdDate.getTime() >= oneMonthAgo.getTime();
        const isMatchingType = type === 'expenses' ? t.amount < 0 : t.amount >= 0;
        return isRecent && isMatchingType;
      });

      // Aggrega importi per categoria
      const categoryTotals: Record<string, number> = {};
      recentTransactions.forEach((t: any) => {
        const category = t.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
      });

      const labels = Object.keys(categoryTotals);
      const amounts = Object.values(categoryTotals) as number[];

      const data: ChartData = {
        labels,
        datasets: [{
          data: amounts,
          backgroundColor: getDoughnutColors(), // Colori adattivi al tema
          borderWidth: 0,
          hoverOffset: 8,
        }]
      };

      // Gestisce caso no data
      setChartData(labels.length > 0 ? data : { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 4 }] });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [type, isDarkTheme]); // Dipende da tipo grafico e tema

  // Fetch iniziale dati
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh dati quando cambia balance (transazioni modificate)
  useEffect(() => {
    if (!balanceLoading && !loading) {
      const timer = setTimeout(() => fetchData(), 100);
      return () => clearTimeout(timer);
    }
  }, [balance, balanceLoading, fetchData]);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%', // Dimensione foro centrale
    layout: {
      padding: 8
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkTheme ? '#ffffff' : '#111111',
        titleFont: { size: 15, weight: 'bold' as const },
        titleSpacing: 2,
        bodyColor: isDarkTheme ? 'hsla(0, 0%, 90%, 0.95)' : 'hsla(0, 0%, 20%, 0.95)',
        bodyFont: { size: 14, weight: 'normal' as const },
        bodySpacing: 6,
        borderColor: isDarkTheme ? darkColor : lightColor,
        borderWidth: 2,
        cornerRadius: 16,
        padding: 18,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            const formattedValue = new Intl.NumberFormat('en-EU', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(context.parsed);
            
            return [
              `${formattedValue}`,
              `${percentage}% of total`
            ];
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    }
  };

  const title = type === 'expenses' ? 'Spending Breakdown' : 'Income Breakdown';

  return (
    <div className="bg-background w-full p-6 shadow-sm rounded-3xl min-h-141 h-141 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-subheader">
            {title}
          </span>
          <span className="block text-base font-semibold text-header">
            Last 30 days
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        {loading ? (
          // Spinner di caricamento
          <div className="flex flex-col items-center text-body">
            <div className="w-12 h-12 border-4 border-background-light border-t-accent rounded-full animate-spin"></div>
            <span className="mt-4">Loading...</span>
          </div>
        ) : chartData.labels.length > 0 ? (
          // Grafico doughnut con dati
          <div className="w-full h-full flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
        ) : (
          // Stato vuoto con icona € stilizzata
          <div className="flex flex-col items-center text-body">
            <div className="w-20 h-20 bg-background-light rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">€</span>
            </div>
            <span>No {type} this month</span>
          </div>
        )}
      </div>
    </div>
  );
}
