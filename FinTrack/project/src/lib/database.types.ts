export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: 'expense' | 'income'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'expense' | 'income'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'expense' | 'income'
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          description: string | null
          transaction_type: 'debit' | 'credit'
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          description?: string | null
          transaction_type: 'debit' | 'credit'
          transaction_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          description?: string | null
          transaction_type?: 'debit' | 'credit'
          transaction_date?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          budget_limit: number
          period: 'monthly' | 'yearly'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          budget_limit: number
          period: 'monthly' | 'yearly'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          budget_limit?: number
          period?: 'monthly' | 'yearly'
          created_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          target_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string
          created_at?: string
        }
      }
    }
  }
}