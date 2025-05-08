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
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          category_id: string
          title: string
          description: string
          priority: string
          completed: boolean
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          title: string
          description?: string
          priority: string
          completed?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          title?: string
          description?: string
          priority?: string
          completed?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}