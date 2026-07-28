"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string } | undefined;

const ACCOUNT_TYPES = [
  "conta_corrente",
  "poupanca",
  "carteira",
  "investimento",
  "outro",
] as const;

export async function createAccount(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const initialBalance = Number(formData.get("initial_balance") ?? 0);

  if (!name || !ACCOUNT_TYPES.includes(type as (typeof ACCOUNT_TYPES)[number])) {
    return { error: "Preencha o nome e o tipo da conta." };
  }

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    type,
    initial_balance: Number.isFinite(initialBalance) ? initialBalance : 0,
  });

  if (error) {
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  revalidatePath("/dashboard/accounts");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("accounts").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/accounts");
}

export async function createCard(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const accountId = (formData.get("account_id") as string) || null;
  const closingDay = formData.get("closing_day")
    ? Number(formData.get("closing_day"))
    : null;
  const dueDay = formData.get("due_day") ? Number(formData.get("due_day")) : null;
  const creditLimit = formData.get("credit_limit")
    ? Number(formData.get("credit_limit"))
    : null;

  if (!name) {
    return { error: "Dê um nome para o cartão." };
  }

  const { error } = await supabase.from("cards").insert({
    user_id: user.id,
    name,
    account_id: accountId,
    closing_day: closingDay,
    due_day: dueDay,
    credit_limit: creditLimit,
  });

  if (error) {
    return { error: "Não foi possível criar o cartão. Tente novamente." };
  }

  revalidatePath("/dashboard/accounts");
}

export async function deleteCard(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("cards").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/accounts");
}

export async function createTransaction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const kind = formData.get("kind") as string;
  const amount = Number(formData.get("amount"));
  const description = (formData.get("description") as string)?.trim() || null;
  const occurredOn = formData.get("occurred_on") as string;
  const accountId = (formData.get("account_id") as string) || null;
  const cardId = (formData.get("card_id") as string) || null;
  const categoryId = (formData.get("category_id") as string) || null;
  const isRecurring = formData.get("is_recurring") === "on";

  if ((kind !== "income" && kind !== "expense") || !amount || amount <= 0 || !occurredOn) {
    return { error: "Preencha o tipo, o valor e a data da transação." };
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    kind,
    amount,
    description,
    occurred_on: occurredOn,
    account_id: accountId,
    card_id: cardId,
    category_id: categoryId,
    is_recurring: isRecurring,
  });

  if (error) {
    return { error: "Não foi possível salvar a transação. Tente novamente." };
  }

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
}

export async function createGoal(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const targetAmount = Number(formData.get("target_amount"));
  const targetDate = formData.get("target_date") as string;

  if (!name || !targetAmount || targetAmount <= 0 || !targetDate) {
    return { error: "Preencha o nome, o valor e o prazo da meta." };
  }

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name,
    target_amount: targetAmount,
    target_date: targetDate,
  });

  if (error) {
    return { error: "Não foi possível criar a meta. Tente novamente." };
  }

  revalidatePath("/dashboard/goals");
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/goals");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
}
