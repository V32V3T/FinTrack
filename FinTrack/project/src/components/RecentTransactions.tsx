import React from 'react';
import { Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import DashboardCard from './DashboardCard';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

export default function RecentTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (*)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(5);

      if (!error && data) {
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    }

    fetchTransactions();
  }, [user]);

  return (
    <DashboardCard title="Recent Transactions" icon={Receipt}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{transaction.categories.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  transaction.transaction_type === 'credit'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.transaction_type === 'credit' ? '+' : '-'}$
                {transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent transactions</p>
      )}
    </DashboardCard>
  );
}