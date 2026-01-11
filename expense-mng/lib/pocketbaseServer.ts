// lib/pocketbaseServer.ts
"use server";

import PocketBase from "pocketbase";

// Inizializza il client PocketBase con l'URL dal config o fallback locale
const pb = new PocketBase(process.env.POCKETBASE_URL || "http://127.0.0.1:8090");

// Autentica l'admin superuser con credenziali dall'ambiente
async function authAdmin() {
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL as string,
    process.env.PB_ADMIN_PASSWORD as string,
  );
}

export async function getTransactionsAsSuperuser() {
  await authAdmin();

  // Recupera tutte le transazioni ordinate per datetime field (più recenti prima)
  const records = await pb
    .collection("Transactions")
    .getFullList<{
      id: string; 
      amount: number; 
      title: string; 
      category: string;
      date: string; // ISO datetime string from PocketBase
    }>({
      sort: "-date",
    });

  return records;
}

export async function createTransactionAsSuperuser(
  amount: number,
  title: string,
  category: string,
  date: string, // "YYYY-MM-DD" from HTML date input
) {
  await authAdmin();
  try {
    // Convert YYYY-MM-DD to ISO datetime for PocketBase datetime field
    const isoDateTime = date ? `${date}T00:00:00Z` : new Date().toISOString();
    
    // Crea nuova transazione nella collezione Transactions con datetime field
    const record = await pb.collection("Transactions").create<{
      id: string;
      amount: number;
      title: string;
      category: string;
      date: string; // PocketBase stores as ISO datetime string
    }>({
      amount,
      title,
      category,
      date: isoDateTime,
    });
    return record;
  } catch (err: any) {
    console.error("PB create error:", err?.response ?? err);
    throw err;
  }
}

export async function deleteTransactionAsSuperuser(id: string) {
  await authAdmin();
  await pb.collection("Transactions").delete(id);
}

export async function updateTransactionAsSuperuser(
  id: string,
  data: { 
    amount: number; 
    title: string; 
    category: string;
    date: string; // "YYYY-MM-DD" from UI
  },
) {
  await authAdmin();

  // Convert YYYY-MM-DD to ISO datetime for PocketBase datetime field
  const isoDateTime = data.date ? `${data.date}T00:00:00Z` : new Date().toISOString();

  // Aggiorna transazione esistente con nuovi dati
  const record = await pb.collection("Transactions").update<{
    id: string;
    amount: number;
    title: string;
    category: string;
    date: string; // ISO datetime from PocketBase
  }>(id, {
    amount: data.amount,
    title: data.title,
    category: data.category,
    date: isoDateTime,
  });

  return record;
}

export async function getUserBalance() {
  await authAdmin();
  
  const record = await pb.collection('userData').getFirstListItem<{ balance: number }>( '', {
    sort: '-created',
  });

  return record.balance;
}

export async function updateUserBalance(delta: number) {
  await authAdmin();
  
  try {
    const record = await pb.collection('userData').getFirstListItem<{ 
      id: string;
      balance: number;
    }>('',
      { sort: '-created' }
    );
    
    const newBalance = record.balance + delta;
    const updatedRecord = await pb.collection('userData').update<{ id: string; balance: number }>(record.id, {
      balance: newBalance
    });
    
    return updatedRecord.balance;
  } catch (error: any) {
    if (error.status === 404) {
      const newRecord = await pb.collection('userData').create<{ id: string; balance: number }>({
        balance: delta
      });
      return newRecord.balance;
    }
    
    console.error('updateUserBalance error:', error);
    throw error;
  }
}

export async function deleteAllTransactionsAsSuperuser() {
  await authAdmin();
  
  const records = await pb.collection('Transactions').getFullList();
  for (const record of records) {
    await pb.collection('Transactions').delete(record.id);
  }
  
  try {
    const userData = await pb.collection('userData').getFirstListItem('');
    await pb.collection('userData').update(userData.id, { balance: 0 });
  } catch {
    await pb.collection('userData').create({ balance: 0 });
  }
}
