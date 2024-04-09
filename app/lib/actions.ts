'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = {
    customerId: String(formData.get('customerId')),
    amount: Number(formData.get('amount')),
    status: String(formData.get('status')),
  };
  // Test it out:
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  //   refresh cache
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = {
    customerId: String(formData.get('customerId')),
    amount: Number(formData.get('amount')),
    status: String(formData.get('status')),
  };
  // Test it out:
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  //   refresh cache
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
