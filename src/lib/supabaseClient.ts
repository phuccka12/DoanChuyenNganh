import { createClient } from '@supabase/supabase-js'

// TẠM THỜI ĐIỀN TRỰC TIẾP KEY VÀO ĐÂY ĐỂ KIỂM TRA
const supabaseUrl = "https://lokmevfmqpxavtrjbkte.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxva21ldmZtcXB4YXZ0cmpia3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjk4MzcsImV4cCI6MjA2ODkwNTgzN30.4ShqyqnKqdXG-XSkdPUZBSKh9aFMu0th5WBGxQn9r5Q"

// Dòng này giữ nguyên
export const supabase = createClient(supabaseUrl, supabaseAnonKey)