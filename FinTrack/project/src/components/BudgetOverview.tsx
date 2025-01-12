import React from 'react';
import { PiggyBank } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import DashboardCard from './DashboardCard';

type Budget = Database['public']['Tables']['budgets']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
  spent?: number;
};

export default function BudgetOverview() {
  const { user } = useAuth();
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchBudgets() {
      if (!user) return;

      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select(`
          *,
          categories (*)
        `)
        .eq('user_id', user.id);

      if (budgetsError || !budgetsData) {
        setLoading(false);
        return;
      }

      // Get current month's transactions for each budget
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'debit')
        .gte('transaction_date', startOfMonth.toISOString());

      const budgetsWithSpent = budgetsData.map((budget) => ({
        ...budget,
        spent: transactionsData
          ?.filter((t) => t.category_id === budget.category_id)
          .reduce((sum, t) => sum + t.amount, 0) || 0,
      }));

      setBudgets(budgetsWithSpent);
      setLoading(false);
    }

    fetchBudgets();
  }, [user]);

  return (
    <DashboardCard title="Budget Overview" icon={PiggyBank}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : budgets.length > 0 ? (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = ((budget.spent || 0) / budget.budget_limit) * 100;
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{budget.categories.name}</span>
                  <span>
                    ${budget.spent?.toFixed(2)} / ${budget.budget_limit.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      percentage >= 100
                        ? 'bg-red-500'
                        : percentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No budgets set</p>
      )}
    </DashboardCard>
  );
}