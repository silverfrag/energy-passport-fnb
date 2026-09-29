export type DrinkCategory = 'WAKE' | 'FOCUS' | 'REFRESH'

export interface Product {
  id: string
  slug: string
  name: string
  category: DrinkCategory
  short_description: string | null
  description: string | null
  price: number | null
  caffeine_mg: number | null
  image_url: string | null
  active: boolean
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MicroAction {
  id: string
  slug: string
  category: DrinkCategory
  title: string
  duration_minutes: number
  description: string | null
  steps: ActionStep[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface ActionStep {
  order: number
  text: string
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface StateCheckin {
  id: string
  user_id: string
  fatigue_level: 1 | 2 | 3 | 4 | 5
  desired_state: DrinkCategory
  recommended_product_id: string | null
  recommended_action_id: string | null
  created_at: string
}

export interface ConsumptionLog {
  id: string
  user_id: string
  product_id: string
  caffeine_mg_snapshot: number | null
  source: 'qr_scan' | 'manual'
  state_checkin_id: string | null
  consumed_at: string
  created_at: string
  // Joined fields
  product?: Product
}

export interface RecommendationEvent {
  id: string
  user_id: string
  state_checkin_id: string | null
  product_id: string | null
  micro_action_id: string | null
  created_at: string
}

export interface RecommendationInput {
  fatigueLevel: 1 | 2 | 3 | 4 | 5
  desiredState: DrinkCategory
}

export interface RecommendationResult {
  recommendedCategory: DrinkCategory
  recommendedProduct: Product | null
  microAction: MicroAction | null
  explanation: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      micro_actions: {
        Row: MicroAction
        Insert: Omit<MicroAction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MicroAction, 'id' | 'created_at'>>
      }
      state_checkins: {
        Row: StateCheckin
        Insert: Omit<StateCheckin, 'id' | 'created_at'>
        Update: Partial<Omit<StateCheckin, 'id' | 'created_at'>>
      }
      consumption_logs: {
        Row: ConsumptionLog
        Insert: Omit<ConsumptionLog, 'id' | 'created_at'>
        Update: never
      }
      recommendation_events: {
        Row: RecommendationEvent
        Insert: Omit<RecommendationEvent, 'id' | 'created_at'>
        Update: never
      }
      admin_users: {
        Row: { user_id: string; created_at: string }
        Insert: { user_id: string }
        Update: never
      }
    }
  }
}
