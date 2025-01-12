import React from 'react';
import { DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardCard from './DashboardCard';

export default function FinancialSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = React.useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSummary() {
      if (!user) return;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type')
        .eq('user_id', user.id)
        .gte('transaction_date', startOfMonth.toISOString());

      if (!error && data) {
        const income = data
          .filter((t) => t.transaction_type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = data
          .filter((t) => t.transaction_type === 'debit')
          .reduce((sum, t) => sum + t.amount, 0);

        setSummary({
          income,
          expenses,
          balance: income - expenses,
        });
      }
      setLoading(false);
    }

    fetchSummary();
  }, [user]);

  return (
    <DashboardCard title="Monthly Summary" icon={DollarSign}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-lg font-semibold text-green-600">
              ${summary.income.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              ${summary.expenses.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p
              className={`text-lg font-semibold ${
                summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${summary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}