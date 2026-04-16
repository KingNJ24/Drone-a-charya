-- Drone-a-charya Database Schema Migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'company')),
  bio TEXT,
  skills TEXT,
  interests TEXT,
  location VARCHAR(255),
  verified_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Organizations Table (for companies/schools)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('company', 'school', 'institution')),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verified_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Organization Members Table
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, user_id)
);

-- 4. Projects Table (like repos - drone projects/designs)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  thumbnail_url TEXT,
  repository_link TEXT,
  visibility VARCHAR(50) NOT NULL CHECK (visibility IN ('private', 'public', 'school-only')) DEFAULT 'private',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(created_by, slug)
);

-- 5. Project Members Table (collaborators)
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contributor', 'viewer')) DEFAULT 'contributor',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- 6. Files Table (for project files/designs)
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Feed Posts Table (activity feed posts)
CREATE TABLE IF NOT EXISTS feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  visibility VARCHAR(50) NOT NULL CHECK (visibility IN ('public', 'connections-only', 'private')) DEFAULT 'public',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Feed Likes Table
CREATE TABLE IF NOT EXISTS feed_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(feed_id, user_id)
);

-- 9. Feed Comments Table
CREATE TABLE IF NOT EXISTS feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Connections Table (like LinkedIn - network)
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  CHECK (requester_id != receiver_id),
  UNIQUE(requester_id, receiver_id)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('connection_request', 'project_invite', 'feed_like', 'comment', 'project_update')),
  related_id UUID,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Skills Table (drone-specific skills)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  endorsements_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_name)
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_org_members_org ON org_members(org_id);
CREATE INDEX idx_org_members_user ON org_members(user_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_org ON projects(org_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_feeds_user ON feeds(user_id);
CREATE INDEX idx_feeds_visibility ON feeds(visibility);
CREATE INDEX idx_feed_likes_feed ON feed_likes(feed_id);
CREATE INDEX idx_feed_likes_user ON feed_likes(user_id);
CREATE INDEX idx_feed_comments_feed ON feed_comments(feed_id);
CREATE INDEX idx_feed_comments_user ON feed_comments(user_id);
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_skills_user ON skills(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users (public profiles, but limited info)
CREATE POLICY "Users can view public profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for Projects (visibility based)
CREATE POLICY "Projects are visible based on visibility setting" ON projects
  FOR SELECT USING (
    visibility = 'public' 
    OR created_by = auth.uid()
    OR EXISTS(
      SELECT 1 FROM project_members 
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
    OR (visibility = 'school-only' AND EXISTS(
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('student', 'teacher')
    ))
  );

-- RLS Policies for Feeds
CREATE POLICY "Feeds are visible based on visibility setting" ON feeds
  FOR SELECT USING (
    visibility = 'public'
    OR user_id = auth.uid()
    OR (visibility = 'connections-only' AND EXISTS(
      SELECT 1 FROM connections 
      WHERE (requester_id = auth.uid() AND receiver_id = user_id AND status = 'accepted')
         OR (receiver_id = auth.uid() AND requester_id = user_id AND status = 'accepted')
    ))
  );

CREATE POLICY "Users can create own feed posts" ON feeds
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own feed posts" ON feeds
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own feed posts" ON feeds
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for Connections
CREATE POLICY "Users can view their own connections" ON connections
  FOR SELECT USING (requester_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can manage their own connection requests" ON connections
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update connection status" ON connections
  FOR UPDATE USING (requester_id = auth.uid() OR receiver_id = auth.uid());

-- RLS Policies for Notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for Organizations
CREATE POLICY "Organizations are viewable by all" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "Organization owners can update their org" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- RLS Policies for Organization Members
CREATE POLICY "Organization members can view member list" ON org_members
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM org_members om 
    WHERE om.org_id = org_members.org_id AND om.user_id = auth.uid()
  ) OR org_id = (SELECT id FROM organizations WHERE owner_id = auth.uid() LIMIT 1));
