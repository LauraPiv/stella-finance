"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { unlockAchievements } from "@/lib/achievements";

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
  const installments = Math.max(1, Number(formData.get("installments")) || 1);

  if ((kind !== "income" && kind !== "expense") || !amount || amount <= 0 || !occurredOn) {
    return { error: "Preencha o tipo, o valor e a data da transação." };
  }

  const baseRow = {
    user_id: user.id,
    kind,
    amount,
    description,
    account_id: accountId,
    card_id: cardId,
    category_id: categoryId,
    is_recurring: isRecurring,
  };

  const rows =
    kind === "expense" && installments > 1
      ? (() => {
          const installmentGroupId = crypto.randomUUID();
          return Array.from({ length: installments }, (_, i) => {
            const date = new Date(`${occurredOn}T00:00:00`);
            date.setMonth(date.getMonth() + i);
            return {
              ...baseRow,
              occurred_on: date.toISOString().slice(0, 10),
              installment_group_id: installmentGroupId,
              installment_number: i + 1,
              installment_total: installments,
            };
          });
        })()
      : [{ ...baseRow, occurred_on: occurredOn }];

  const { error } = await supabase.from("transactions").insert(rows);

  if (error) {
    return { error: "Não foi possível salvar a transação. Tente novamente." };
  }

  await unlockAchievements(supabase, user.id);

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

  const { count } = await supabase
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name,
    target_amount: targetAmount,
    target_date: targetDate,
    priority: count ?? 0,
  });

  if (error) {
    return { error: "Não foi possível criar a meta. Tente novamente." };
  }

  await unlockAchievements(supabase, user.id);

  revalidatePath("/dashboard/goals");
}

export async function contributeToGoal(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const amount = Number(formData.get("amount"));
  if (!amount || amount <= 0) {
    return { error: "Informe um valor válido." };
  }

  const { data: goal } = await supabase
    .from("goals")
    .select("current_amount")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goal) {
    return { error: "Meta não encontrada." };
  }

  const { error } = await supabase
    .from("goals")
    .update({ current_amount: goal.current_amount + amount })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Não foi possível registrar o aporte. Tente novamente." };
  }

  await unlockAchievements(supabase, user.id);

  revalidatePath("/dashboard/goals");
}

export async function moveGoalPriority(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: goals } = await supabase
    .from("goals")
    .select("id, priority")
    .eq("user_id", user.id)
    .order("priority", { ascending: true });

  if (!goals) return;

  const index = goals.findIndex((g) => g.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= goals.length) return;

  const current = goals[index];
  const neighbor = goals[swapIndex];

  await supabase.from("goals").update({ priority: neighbor.priority }).eq("id", current.id);
  await supabase.from("goals").update({ priority: current.priority }).eq("id", neighbor.id);

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
