-- ============================================================
-- Feature 003: Personalized Invitations
-- Chạy trong Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Enable pg_trgm extension (cho search theo tên)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Tạo bảng invitations
CREATE TABLE invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  hash text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Index cho lookup nhanh theo hash
CREATE INDEX idx_invitations_hash ON invitations (hash);

-- 4. Bật Row Level Security
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 5. Policies: permissive (tương tự bảng wishes)
CREATE POLICY "invitations_select" ON invitations FOR SELECT USING (true);
CREATE POLICY "invitations_insert" ON invitations FOR INSERT WITH CHECK (true);
CREATE POLICY "invitations_delete" ON invitations FOR DELETE USING (true);

-- 6. Bật Realtime cho bảng invitations
ALTER PUBLICATION supabase_realtime ADD TABLE invitations;
