import { getTransactionsAsSuperuser } from "@/lib/pocketbaseServer";
import Table from "@/components/Table";
import { BalanceProvider } from "@/components/balanceContext";

export default async function Home() {
  // Recupera tutte le transazioni dal server (Server Component)
  const rows = await getTransactionsAsSuperuser();

  return (
    <BalanceProvider>
      {/* Grid full-width per visualizzazione tabella transazioni */}
      <div className="grid grid-cols-3 auto-rows-max w-full p-8 gap-8 col-span-3">
        <Table rows={rows} height="260" colSpan="3"/>
      </div>
    </BalanceProvider>
  );
}
