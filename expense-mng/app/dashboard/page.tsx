"use client";

import LineGraph from "@/components/LineGraph";
import { getTransactionsAsSuperuser } from "@/lib/pocketbaseServer";
import { useEffect, useState, useCallback } from "react";
import { BalanceProvider } from "@/components/balanceContext";
import WelcomeBoard from "@/components/WelcomeBoard";
import DoughnutChart from "@/components/DoughnutChart";
import Table from "@/components/Table";

// Tipo compatibile con LineGraph per le transazioni
type Row = { id: string; amount: number; title: string; category: string; created?: string };

export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]); 
  
  // Fetch dati iniziali al mount del componente
  useEffect(() => {
    fetchData();
  }, []);

  // Funzione per recuperare tutte le transazioni da PocketBase
  const fetchData = useCallback(async () => {
    const data = await getTransactionsAsSuperuser();
    setRows(data);
  }, []);

  return (
    <>
      {/* Provider context per balance condiviso */}
      <BalanceProvider>
        {/* Grid principale 2-colonne per componenti principali */}
        <div className="grid grid-cols-2 auto-rows-min w-full p-8 gap-8 col-span-2">
          <WelcomeBoard/>
          <LineGraph rows={rows} />
          <Table 
            rows={rows} 
            maxHeight="120" 
            colSpan="2" 
            onTransactionsChange={setRows} 
          />
        </div>
        
        {/* Grid secondaria 1-colonna per grafici doughnut */}
        <div className="grid grid-cols-1 auto-rows-min w-full p-8 gap-8 col-span-1">
          <DoughnutChart type="expenses"/>
          <DoughnutChart type="incomes"/>
        </div>
      </BalanceProvider>
    </>
  );
}
