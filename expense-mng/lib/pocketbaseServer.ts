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

  // Recupera tutte le transazioni ordinate per data creazione (più recenti prima)
  const records = await pb
    .collection("Transactions")
    .getFullList<{ id: string; amount: number; title: string; category: string }>({
      sort: "-created",
    });

  return records;
}

export async function createTransactionAsSuperuser(
  amount: number,
  title: string,
  category: string,
) {
  await authAdmin();
  try {
    // Crea nuova transazione nella collezione Transactions
    const record = await pb.collection("Transactions").create<{
      id: string;
      amount: number;
      title: string;
      category: string;
    }>({
      amount,
      title,
      category,
    });
    return record;
  } catch (err: any) {
    // Logga errori di creazione con dettagli response se disponibile
    console.error("PB create error:", err?.response ?? err);
    throw err;
  }
}

export async function deleteTransactionAsSuperuser(id: string) {
  await authAdmin();
  // Elimina transazione specifica usando l'ID
  await pb.collection("Transactions").delete(id);
}

export async function updateTransactionAsSuperuser(
  id: string,
  data: { amount: number; title: string; category: string },
) {
  await authAdmin();

  // Aggiorna transazione esistente con nuovi dati
  const record = await pb.collection("Transactions").update<{
    id: string;
    amount: number;
    title: string;
    category: string;
  }>(id, data);

  return record;
}

export async function getUserBalance() {
  await authAdmin();
  
  // Recupera il primo record userData (l'ultimo creato) per il balance corrente
  const record = await pb.collection('userData').getFirstListItem<{ balance: number }>( '', {
    sort: '-created',
  });

  return record.balance;
}

export async function updateUserBalance(delta: number) {
  await authAdmin();
  
  try {
    // Recupera record userData corrente con typing completo
    const record = await pb.collection('userData').getFirstListItem<{ 
      id: string;
      balance: number;
    }>('',
      { sort: '-created' }
    );
    
    // Calcola e aggiorna il nuovo balance sommando delta
    const newBalance = record.balance + delta;
    const updatedRecord = await pb.collection('userData').update<{ id: string; balance: number }>(record.id, {
      balance: newBalance
    });
    
    return updatedRecord.balance;
  } catch (error: any) {
    if (error.status === 404) {
      // Se non esiste userData, crea il primo record con balance iniziale = delta
      const newRecord = await pb.collection('userData').create<{ id: string; balance: number }>({
        balance: delta
      });
      return newRecord.balance;
    }
    
    // Logga altri errori e li rilancia
    console.error('updateUserBalance error:', error);
    throw error;
  }
}

export async function deleteAllTransactionsAsSuperuser() {
  await authAdmin();
  
  // Elimina tutte le transazioni in batch
  const records = await pb.collection('Transactions').getFullList();
  for (const record of records) {
    await pb.collection('Transactions').delete(record.id);
  }
  
  // Resetta balance utente a 0 (update se esiste, altrimenti create)
  try {
    const userData = await pb.collection('userData').getFirstListItem('');
    await pb.collection('userData').update(userData.id, { balance: 0 });
  } catch {
    await pb.collection('userData').create({ balance: 0 });
  }
}
