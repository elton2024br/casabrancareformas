export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      attraction_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      attraction_reviews: {
        Row: {
          attraction_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          attraction_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          attraction_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attraction_reviews_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      attractions: {
        Row: {
          address: string | null
          category_id: string
          city: string
          created_at: string
          description: string
          facilities: string[] | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          price_range: string | null
          short_description: string
          slug: string
          state: string
          thumbnail: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category_id: string
          city: string
          created_at?: string
          description: string
          facilities?: string[] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          price_range?: string | null
          short_description: string
          slug: string
          state: string
          thumbnail?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string
          city?: string
          created_at?: string
          description?: string
          facilities?: string[] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          price_range?: string | null
          short_description?: string
          slug?: string
          state?: string
          thumbnail?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attractions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "attraction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_words: {
        Row: {
          created_at: string
          created_by: string
          id: string
          word: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          word: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          word?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          image: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          image: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      city_news: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          original_content: string | null
          original_url: string
          published_at: string
          summary: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          original_content?: string | null
          original_url: string
          published_at: string
          summary: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          original_content?: string | null
          original_url?: string
          published_at?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          moderation_date: string | null
          moderator_id: string | null
          status: Database["public"]["Enums"]["content_status"] | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          moderation_date?: string | null
          moderator_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          moderation_date?: string | null
          moderator_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          name: string
          optimization_type: string | null
          preferences: Json | null
          start_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          name: string
          optimization_type?: string | null
          preferences?: Json | null
          start_date: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          name?: string
          optimization_type?: string | null
          preferences?: Json | null
          start_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      itinerary_days: {
        Row: {
          created_at: string | null
          date: string
          day_number: number
          id: string
          itinerary_id: string | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          day_number: number
          id?: string
          itinerary_id?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          day_number?: number
          id?: string
          itinerary_id?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_stops: {
        Row: {
          attraction_id: string | null
          created_at: string | null
          custom_location_address: string | null
          custom_location_latitude: number | null
          custom_location_longitude: number | null
          custom_location_name: string | null
          distance_from_previous: number | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          itinerary_day_id: string | null
          notes: string | null
          start_time: string | null
          stop_order: number
          updated_at: string | null
        }
        Insert: {
          attraction_id?: string | null
          created_at?: string | null
          custom_location_address?: string | null
          custom_location_latitude?: number | null
          custom_location_longitude?: number | null
          custom_location_name?: string | null
          distance_from_previous?: number | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          itinerary_day_id?: string | null
          notes?: string | null
          start_time?: string | null
          stop_order: number
          updated_at?: string | null
        }
        Update: {
          attraction_id?: string | null
          created_at?: string | null
          custom_location_address?: string | null
          custom_location_latitude?: number | null
          custom_location_longitude?: number | null
          custom_location_name?: string | null
          distance_from_previous?: number | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          itinerary_day_id?: string | null
          notes?: string | null
          start_time?: string | null
          stop_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_stops_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "attractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_stops_itinerary_day_id_fkey"
            columns: ["itinerary_day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_messages: {
        Row: {
          category: string | null
          created_at: string
          id: string
          message: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          frequency: Database["public"]["Enums"]["notification_frequency"]
          id: string
          last_notification_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          frequency?: Database["public"]["Enums"]["notification_frequency"]
          id?: string
          last_notification_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          frequency?: Database["public"]["Enums"]["notification_frequency"]
          id?: string
          last_notification_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_provider: boolean | null
          status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_provider?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_provider?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles_backup: {
        Row: {
          account_locked_until: string | null
          avatar_url: string | null
          city: Database["public"]["Enums"]["city"] | null
          cpf_cnpj: string | null
          created_at: string | null
          description: string | null
          document_number: string | null
          full_name: string | null
          id: string | null
          is_provider: boolean | null
          is_verified: boolean | null
          last_failed_attempt: string | null
          last_location_lat: number | null
          last_location_lng: number | null
          last_location_updated: string | null
          phone: string | null
          rating: number | null
          registration_date: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          services: Database["public"]["Enums"]["service_category"][] | null
          status: string | null
          total_reviews: number | null
          updated_at: string | null
          username: string | null
          verification_attempts: number | null
        }
        Insert: {
          account_locked_until?: string | null
          avatar_url?: string | null
          city?: Database["public"]["Enums"]["city"] | null
          cpf_cnpj?: string | null
          created_at?: string | null
          description?: string | null
          document_number?: string | null
          full_name?: string | null
          id?: string | null
          is_provider?: boolean | null
          is_verified?: boolean | null
          last_failed_attempt?: string | null
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_location_updated?: string | null
          phone?: string | null
          rating?: number | null
          registration_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          services?: Database["public"]["Enums"]["service_category"][] | null
          status?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          username?: string | null
          verification_attempts?: number | null
        }
        Update: {
          account_locked_until?: string | null
          avatar_url?: string | null
          city?: Database["public"]["Enums"]["city"] | null
          cpf_cnpj?: string | null
          created_at?: string | null
          description?: string | null
          document_number?: string | null
          full_name?: string | null
          id?: string | null
          is_provider?: boolean | null
          is_verified?: boolean | null
          last_failed_attempt?: string | null
          last_location_lat?: number | null
          last_location_lng?: number | null
          last_location_updated?: string | null
          phone?: string | null
          rating?: number | null
          registration_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          services?: Database["public"]["Enums"]["service_category"][] | null
          status?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          username?: string | null
          verification_attempts?: number | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          description: string
          id: string
          price: number
          provider_id: string
          request_id: string
          status: Database["public"]["Enums"]["request_status"] | null
          timeframe: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          price: number
          provider_id: string
          request_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
          timeframe: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          price?: number
          provider_id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          timeframe?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      proxy_servers: {
        Row: {
          created_at: string | null
          id: string
          last_used: string | null
          status: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          status?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      public_reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          location: string | null
          report_id: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          location?: string | null
          report_id?: string | null
          status?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          location?: string | null
          report_id?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_attachments: {
        Row: {
          created_at: string | null
          file_path: string
          file_type: string
          id: string
          report_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_type: string
          id?: string
          report_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_type?: string
          id?: string
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_attachments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_comments: {
        Row: {
          admin_id: string | null
          comment: string
          created_at: string | null
          id: string
          report_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          comment: string
          created_at?: string | null
          id?: string
          report_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          report_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_comments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          category: Database["public"]["Enums"]["report_category"] | null
          created_at: string | null
          description: string
          id: string
          is_anonymous: boolean
          location: string | null
          reporter_id: string | null
          resolved_at: string | null
          resolver_id: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["report_category"] | null
          created_at?: string | null
          description: string
          id?: string
          is_anonymous?: boolean
          location?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          resolver_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["report_category"] | null
          created_at?: string | null
          description?: string
          id?: string
          is_anonymous?: boolean
          location?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          resolver_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          provider_id: string
          rating: number
          request_id: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          provider_id: string
          rating: number
          request_id: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          provider_id?: string
          rating?: number
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          budget_range: Json | null
          category: Database["public"]["Enums"]["service_category"]
          city: Database["public"]["Enums"]["city"]
          client_id: string
          created_at: string
          description: string
          id: string
          images: string[] | null
          location: string
          status: Database["public"]["Enums"]["request_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_range?: Json | null
          category: Database["public"]["Enums"]["service_category"]
          city: Database["public"]["Enums"]["city"]
          client_id: string
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          location: string
          status?: Database["public"]["Enums"]["request_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_range?: Json | null
          category?: Database["public"]["Enums"]["service_category"]
          city?: Database["public"]["Enums"]["city"]
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          location?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      spending_limits: {
        Row: {
          created_at: string | null
          id: string
          monthly_limit: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          monthly_limit: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          monthly_limit?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_admin_response: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin_response?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin_response?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          resolution_time: number | null
          status: Database["public"]["Enums"]["support_status"] | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resolution_time?: number | null
          status?: Database["public"]["Enums"]["support_status"] | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resolution_time?: number | null
          status?: Database["public"]["Enums"]["support_status"] | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          attraction_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          attraction_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          attraction_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          id: string
          last_seen_at: string | null
          metadata: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_seen_at?: string | null
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_seen_at?: string | null
          metadata?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles_backup: {
        Row: {
          created_at: string | null
          id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          device_info: Json | null
          ended_at: string | null
          id: string
          ip_address: string | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      validation_attempts: {
        Row: {
          attempt_time: string | null
          created_at: string | null
          email: string
          error_message: string | null
          id: string
          proxy_id: string | null
          response_time: number | null
          status: string
        }
        Insert: {
          attempt_time?: string | null
          created_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          proxy_id?: string | null
          response_time?: number | null
          status: string
        }
        Update: {
          attempt_time?: string | null
          created_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          proxy_id?: string | null
          response_time?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_attempts_proxy_id_fkey"
            columns: ["proxy_id"]
            isOneToOne: false
            referencedRelation: "proxy_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone_number: string | null
          preferred_beaches: string[] | null
          registration_number: string | null
          service_description: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone_number?: string | null
          preferred_beaches?: string[] | null
          registration_number?: string | null
          service_description?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          preferred_beaches?: string[] | null
          registration_number?: string | null
          service_description?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: boolean | null
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          is_from_user: boolean
          message: string
          phone_number: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          is_from_user: boolean
          message: string
          phone_number: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          is_from_user?: boolean
          message?: string
          phone_number?: string
        }
        Relationships: []
      }
      whatsapp_users: {
        Row: {
          conversation_context: Json | null
          created_at: string
          last_interaction: string | null
          phone_number: string
          preferences: Json | null
          settings: Json | null
        }
        Insert: {
          conversation_context?: Json | null
          created_at?: string
          last_interaction?: string | null
          phone_number: string
          preferences?: Json | null
          settings?: Json | null
        }
        Update: {
          conversation_context?: Json | null
          created_at?: string
          last_interaction?: string | null
          phone_number?: string
          preferences?: Json | null
          settings?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      __plpgsql_show_dependency_tb: {
        Args:
          | {
              funcoid: unknown
              relid?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
            }
          | {
              name: string
              relid?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
            }
        Returns: {
          type: string
          oid: unknown
          schema: string
          name: string
          params: string
        }[]
      }
      calculate_attraction_rating: {
        Args: { attraction_uuid: string }
        Returns: number
      }
      check_daily_service_requests_limit: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_ordered_proposals: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          category: Database["public"]["Enums"]["proposal_category"]
          status: Database["public"]["Enums"]["proposal_status"]
          created_by: string
          created_at: string
          updated_at: string
          vote_score: number
        }[]
      }
      get_ordered_proposals_by_category: {
        Args: {
          category_filter: Database["public"]["Enums"]["proposal_category"]
        }
        Returns: {
          id: string
          title: string
          description: string
          category: Database["public"]["Enums"]["proposal_category"]
          status: Database["public"]["Enums"]["proposal_status"]
          created_by: string
          created_at: string
          updated_at: string
          vote_score: number
        }[]
      }
      get_proposal_votes: {
        Args: { proposal_uuid: string }
        Returns: {
          upvotes: number
          downvotes: number
        }[]
      }
      get_random_notification_message: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { input_user_id: string }
        Returns: boolean
      }
      is_provider: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_valid_cpf: {
        Args: { cpf: string }
        Returns: boolean
      }
      plpgsql_check_function: {
        Args:
          | {
              funcoid: unknown
              relid?: unknown
              format?: string
              fatal_errors?: boolean
              other_warnings?: boolean
              performance_warnings?: boolean
              extra_warnings?: boolean
              security_warnings?: boolean
              compatibility_warnings?: boolean
              oldtable?: unknown
              newtable?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
              without_warnings?: boolean
              all_warnings?: boolean
              use_incomment_options?: boolean
              incomment_options_usage_warning?: boolean
              constant_tracing?: boolean
            }
          | {
              name: string
              relid?: unknown
              format?: string
              fatal_errors?: boolean
              other_warnings?: boolean
              performance_warnings?: boolean
              extra_warnings?: boolean
              security_warnings?: boolean
              compatibility_warnings?: boolean
              oldtable?: unknown
              newtable?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
              without_warnings?: boolean
              all_warnings?: boolean
              use_incomment_options?: boolean
              incomment_options_usage_warning?: boolean
              constant_tracing?: boolean
            }
        Returns: string[]
      }
      plpgsql_check_function_tb: {
        Args:
          | {
              funcoid: unknown
              relid?: unknown
              fatal_errors?: boolean
              other_warnings?: boolean
              performance_warnings?: boolean
              extra_warnings?: boolean
              security_warnings?: boolean
              compatibility_warnings?: boolean
              oldtable?: unknown
              newtable?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
              without_warnings?: boolean
              all_warnings?: boolean
              use_incomment_options?: boolean
              incomment_options_usage_warning?: boolean
              constant_tracing?: boolean
            }
          | {
              name: string
              relid?: unknown
              fatal_errors?: boolean
              other_warnings?: boolean
              performance_warnings?: boolean
              extra_warnings?: boolean
              security_warnings?: boolean
              compatibility_warnings?: boolean
              oldtable?: unknown
              newtable?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
              without_warnings?: boolean
              all_warnings?: boolean
              use_incomment_options?: boolean
              incomment_options_usage_warning?: boolean
              constant_tracing?: boolean
            }
        Returns: {
          functionid: unknown
          lineno: number
          statement: string
          sqlstate: string
          message: string
          detail: string
          hint: string
          level: string
          position: number
          query: string
          context: string
        }[]
      }
      plpgsql_check_pragma: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      plpgsql_check_profiler: {
        Args: { enable?: boolean }
        Returns: boolean
      }
      plpgsql_check_tracer: {
        Args: { enable?: boolean; verbosity?: string }
        Returns: boolean
      }
      plpgsql_coverage_branches: {
        Args: { funcoid: unknown } | { name: string }
        Returns: number
      }
      plpgsql_coverage_statements: {
        Args: { funcoid: unknown } | { name: string }
        Returns: number
      }
      plpgsql_profiler_function_statements_tb: {
        Args: { funcoid: unknown } | { name: string }
        Returns: {
          stmtid: number
          parent_stmtid: number
          parent_note: string
          block_num: number
          lineno: number
          queryid: number
          exec_stmts: number
          exec_stmts_err: number
          total_time: number
          avg_time: number
          max_time: number
          processed_rows: number
          stmtname: string
        }[]
      }
      plpgsql_profiler_function_tb: {
        Args: { funcoid: unknown } | { name: string }
        Returns: {
          lineno: number
          stmt_lineno: number
          queryids: number[]
          cmds_on_row: number
          exec_stmts: number
          exec_stmts_err: number
          total_time: number
          avg_time: number
          max_time: number[]
          processed_rows: number[]
          source: string
        }[]
      }
      plpgsql_profiler_functions_all: {
        Args: Record<PropertyKey, never>
        Returns: {
          funcoid: unknown
          exec_count: number
          exec_stmts_err: number
          total_time: number
          avg_time: number
          stddev_time: number
          min_time: number
          max_time: number
        }[]
      }
      plpgsql_profiler_install_fake_queryid_hook: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      plpgsql_profiler_remove_fake_queryid_hook: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      plpgsql_profiler_reset: {
        Args: { funcoid: unknown }
        Returns: undefined
      }
      plpgsql_profiler_reset_all: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      plpgsql_show_dependency_tb: {
        Args:
          | {
              fnname: string
              relid?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
            }
          | {
              funcoid: unknown
              relid?: unknown
              anyelememttype?: unknown
              anyenumtype?: unknown
              anyrangetype?: unknown
              anycompatibletype?: unknown
              anycompatiblerangetype?: unknown
            }
        Returns: {
          type: string
          oid: unknown
          schema: string
          name: string
          params: string
        }[]
      }
    }
    Enums: {
      city: "ubatuba" | "caraguatatuba" | "sao_sebastiao"
      content_status: "pending" | "approved" | "rejected"
      notification_frequency: "never" | "daily" | "three_times_day" | "weekly"
      proposal_category:
        | "Infraestrutura"
        | "Educação"
        | "Saúde"
        | "Transporte"
        | "Meio Ambiente"
        | "Cultura"
      proposal_status: "proposta" | "em_analise" | "em_andamento" | "concluida"
      report_category:
        | "irregular_activity"
        | "harassment"
        | "unsafe_conditions"
        | "other"
      report_status: "pending" | "investigating" | "resolved" | "rejected"
      report_type: "suggestion" | "complaint" | "incident" | "other"
      request_status: "pending" | "in_progress" | "completed" | "cancelled"
      service_category:
        | "reforma_geral"
        | "construcao"
        | "pintura"
        | "hidraulica"
        | "eletrica"
        | "alvenaria"
        | "carpintaria"
        | "jardinagem"
      support_status: "pending" | "in_progress" | "resolved"
      user_role: "admin" | "moderator" | "vendor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      city: ["ubatuba", "caraguatatuba", "sao_sebastiao"],
      content_status: ["pending", "approved", "rejected"],
      notification_frequency: ["never", "daily", "three_times_day", "weekly"],
      proposal_category: [
        "Infraestrutura",
        "Educação",
        "Saúde",
        "Transporte",
        "Meio Ambiente",
        "Cultura",
      ],
      proposal_status: ["proposta", "em_analise", "em_andamento", "concluida"],
      report_category: [
        "irregular_activity",
        "harassment",
        "unsafe_conditions",
        "other",
      ],
      report_status: ["pending", "investigating", "resolved", "rejected"],
      report_type: ["suggestion", "complaint", "incident", "other"],
      request_status: ["pending", "in_progress", "completed", "cancelled"],
      service_category: [
        "reforma_geral",
        "construcao",
        "pintura",
        "hidraulica",
        "eletrica",
        "alvenaria",
        "carpintaria",
        "jardinagem",
      ],
      support_status: ["pending", "in_progress", "resolved"],
      user_role: ["admin", "moderator", "vendor", "user"],
    },
  },
} as const
