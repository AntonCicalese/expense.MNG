// lib/pocketbaseServer.ts
"use server";

import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.POCKETBASE_URL || "http://127.0.0.1:8090");

async function authAdmin() {
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL as string,
    process.env.PB_ADMIN_PASSWORD as string,
  );
}

export async function getTransactionsAsSuperuser() {
  await authAdmin();

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
  data: { amount: number; title: string; category: string },
) {
  await authAdmin();

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
  
  const record = await pb.collection('userData').getFirstListItem<{ balance: number }>( '', {
    sort: '-created',
  });

  return record.balance;
}

export async function updateUserBalance(delta: number) {
  await authAdmin();
  
  try {
    // Get current userData record with full typing
    const record = await pb.collection('userData').getFirstListItem<{ 
      id: string;
      balance: number;
    }>('',
      { sort: '-created' }
    );
    
    // Update balance by adding delta
    const newBalance = record.balance + delta;
    const updatedRecord = await pb.collection('userData').update<{ id: string; balance: number }>(record.id, {
      balance: newBalance
    });
    
    return updatedRecord.balance;
  } catch (error: any) {
    if (error.status === 404) {
      // No userData record exists, create one
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
  
  // Delete all transactions
  const records = await pb.collection('Transactions').getFullList();
  for (const record of records) {
    await pb.collection('Transactions').delete(record.id);
  }
  
  // Reset user balance to 0
  try {
    const userData = await pb.collection('userData').getFirstListItem('');
    await pb.collection('userData').update(userData.id, { balance: 0 });
  } catch {
    // If no userData exists, create with balance 0
    await pb.collection('userData').create({ balance: 0 });
  }
}
