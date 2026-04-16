export type Role = 'student' | 'teacher' | 'company'

export interface MockUser {
  id: string
  name: string
  handle: string
  role: Role
  avatarUrl?: string
  email?: string
  headline: string
  location?: string
  bio: string
  skills: string[]
  connections: number
}

/** Minimal author on feed cards */
export interface FeedAuthor {
  id: string
  name: string
  handle: string
  role: Role
  headline: string
}

export interface FeedPost {
  id: string
  author: FeedAuthor
  type: 'project_update' | 'collaboration' | 'gig'
  title: string
  body: string
  timestamp: string
  likes: number
  comments: number
  tags?: string[]
}

export interface TrendingProject {
  id: string
  name: string
  owner: string
  stars: number
  description: string
}

export interface MentorPreview {
  id: string
  name: string
  role: Role
  specialty: string
  students: number
}

export interface RepoProject {
  id: string
  name: string
  description: string
  tags: string[]
  stars: number
  forks: number
  contributors: number
  language?: string
  updatedAt: string
}

export interface ProjectDetail extends RepoProject {
  readme: string
  owner: MockUser
  collaborators: { name: string; role: Role; avatar?: string }[]
}

export interface GigListing {
  id: string
  title: string
  company: string
  companyRole: Role
  budget: string
  skills: string[]
  postedAt: string
  applicants: number
}

export const MOCK_ME: MockUser = {
  id: 'user-1',
  name: 'Jordan Lee',
  handle: 'jordan-lee',
  role: 'student',
  headline: 'Aerospace engineering · Autonomous systems',
  location: 'Bengaluru, IN',
  bio: 'Building open-source flight stacks and swarm coordination for research drones. Looking for mentors in controls and computer vision.',
  skills: ['PX4', 'ROS 2', 'Python', 'CAD', 'Computer Vision'],
  connections: 428,
}

export const MOCK_MENTOR_PROFILE: MockUser = {
  id: 'user-mentor-1',
  name: 'Dr. Priya Nair',
  handle: 'priya-nair',
  role: 'teacher',
  headline: 'Professor · UAS Lab · Guidance & navigation',
  location: 'Chennai, IN',
  bio: '15+ years in UAS research. Advising students on autonomy stacks, certification, and field testing.',
  skills: ['Controls', 'MATLAB', 'Gazebo', 'Certification', 'Mentorship'],
  connections: 2104,
}

export const MOCK_COMPANY_PROFILE: MockUser = {
  id: 'user-corp-1',
  name: 'Skyforge Dynamics',
  handle: 'skyforge-dynamics',
  role: 'company',
  headline: 'Enterprise drone mapping & BVLOS operations',
  location: 'Hyderabad, IN',
  bio: 'We deploy long-range surveying fleets for infra & agriculture. Hiring autonomy and GCS engineers.',
  skills: ['BVLOS', 'Mapping', 'Fleet Ops', 'Compliance'],
  connections: 8920,
}

export const MOCK_FEED: FeedPost[] = [
  {
    id: 'fp-1',
    author: {
      id: 'a1',
      name: 'Aria Kovacs',
      handle: 'aria-k',
      role: 'student',
      headline: 'Swarm routing',
    },
    type: 'project_update',
    title: 'Shipped v0.3 of OrbitMesh — mesh networking for drone swarms',
    body: 'Latency dropped 22% in field tests. Next: add leader election and publish ROS 2 bridge.',
    timestamp: '2h ago',
    likes: 86,
    comments: 14,
    tags: ['Swarm', 'ROS 2'],
  },
  {
    id: 'fp-2',
    author: {
      id: MOCK_MENTOR_PROFILE.id,
      name: MOCK_MENTOR_PROFILE.name,
      handle: MOCK_MENTOR_PROFILE.handle,
      role: MOCK_MENTOR_PROFILE.role,
      headline: MOCK_MENTOR_PROFILE.headline,
    },
    type: 'collaboration',
    title: 'Open office hours — autopilot tuning',
    body: 'Friday 4–6pm IST. Bring logs from SITL or hardware-in-the-loop benches. Limited slots.',
    timestamp: '5h ago',
    likes: 214,
    comments: 31,
    tags: ['Office hours', 'Controls'],
  },
  {
    id: 'fp-3',
    author: {
      id: MOCK_COMPANY_PROFILE.id,
      name: MOCK_COMPANY_PROFILE.name,
      handle: MOCK_COMPANY_PROFILE.handle,
      role: MOCK_COMPANY_PROFILE.role,
      headline: MOCK_COMPANY_PROFILE.headline,
    },
    type: 'gig',
    title: 'RFP: BVLOS corridor modelling for solar farms',
    body: 'Seeking a small team for 10-week sprint — path planning + regulatory documentation.',
    timestamp: '1d ago',
    likes: 56,
    comments: 9,
    tags: ['BVLOS', 'Contract'],
  },
]

export const MOCK_SUGGESTED: MockUser[] = [
  {
    id: 's1',
    name: 'Mateo Silva',
    handle: 'mateo-s',
    role: 'student',
    headline: 'Computer vision for landing',
    bio: '',
    skills: ['OpenCV', 'C++'],
    connections: 340,
  },
  {
    id: 's2',
    name: 'Neha Verma',
    handle: 'neha-v',
    role: 'teacher',
    headline: 'Rotor dynamics & testing',
    bio: '',
    skills: ['Testing', 'CFD'],
    connections: 890,
  },
  {
    id: 's3',
    name: 'Vertex Aerial',
    handle: 'vertex-aerial',
    role: 'company',
    headline: 'Inspection robotics',
    bio: '',
    skills: ['Enterprise', 'LiDAR'],
    connections: 1200,
  },
]

export const MOCK_TRENDING: TrendingProject[] = [
  {
    id: 'bladeguard',
    name: 'bladeguard',
    owner: 'hoverctl',
    stars: 842,
    description: 'Lightweight blade damage detection using audio + IMU fusion.',
  },
  {
    id: 'triangulation',
    name: 'triangulation',
    owner: 'openfield',
    stars: 621,
    description: 'GPS-denied localization toolkit for multi-rotor racing.',
  },
  {
    id: 'sitl-pack',
    name: 'sitl-pack',
    owner: 'nalanda-uas',
    stars: 403,
    description: 'One-click SITL profiles for Indian wind & monsoon conditions.',
  },
]

/** Home feed: each item is a project posted by a user (LinkedIn-style). */
export interface ProjectFeedItem {
  id: string
  projectSlug: string
  projectTitle: string
  description: string
  tags: string[]
  author: FeedAuthor
  likes: number
  comments: number
  timestamp: string
}

export const MOCK_PROJECT_FEED: ProjectFeedItem[] = [
  {
    id: 'pf-1',
    projectSlug: 'seed-project-orbitmesh',
    projectTitle: 'OrbitMesh Swarm Routing',
    description:
      'Decentralized mesh layer for multi-UAV coordination with predictable latency bounds and ROS 2 bridge.',
    tags: ['AI', 'Drone', 'Navigation', 'Simulation'],
    author: {
      id: 'a1',
      name: 'Aria Kovacs',
      handle: 'aria-k',
      role: 'student',
      headline: 'Swarm routing · MSc',
    },
    likes: 86,
    comments: 14,
    timestamp: '2h ago',
  },
  {
    id: 'pf-2',
    projectSlug: 'autopilot-lab-sitl',
    projectTitle: 'Autopilot Lab SITL Profiles',
    description:
      'Reproducible SITL benches for monsoon wind — shareable configs for student cohorts.',
    tags: ['Simulation', 'SITL', 'Teaching'],
    author: {
      id: MOCK_MENTOR_PROFILE.id,
      name: MOCK_MENTOR_PROFILE.name,
      handle: MOCK_MENTOR_PROFILE.handle,
      role: 'teacher',
      headline: MOCK_MENTOR_PROFILE.headline,
    },
    likes: 214,
    comments: 31,
    timestamp: '5h ago',
  },
  {
    id: 'pf-3',
    projectSlug: 'bvlos-solar-corridor',
    projectTitle: 'BVLOS Solar Farm Corridor',
    description:
      'Path planning + documentation pack for long-range inspection contracts.',
    tags: ['BVLOS', 'AI', 'Operations'],
    author: {
      id: MOCK_COMPANY_PROFILE.id,
      name: MOCK_COMPANY_PROFILE.name,
      handle: MOCK_COMPANY_PROFILE.handle,
      role: 'company',
      headline: MOCK_COMPANY_PROFILE.headline,
    },
    likes: 56,
    comments: 9,
    timestamp: '1d ago',
  },
]

export interface ActiveCollaborator {
  id: string
  name: string
  role: Role
  activeOn: string
}

export const MOCK_ACTIVE_COLLABORATORS: ActiveCollaborator[] = [
  { id: 'ac1', name: 'Sofia Ren', role: 'student', activeOn: 'orbit-mesh' },
  { id: 'ac2', name: 'Marcus Wei', role: 'teacher', activeOn: 'bladeguard' },
  { id: 'ac3', name: 'AeroLink Systems', role: 'company', activeOn: 'fleet-telemetry' },
]

export interface TeacherDirectoryEntry {
  id: string
  name: string
  expertise: string
  experience: string
  skills: string[]
}

export const MOCK_TEACHERS: TeacherDirectoryEntry[] = [
  {
    id: 't1',
    name: 'Dr. Priya Nair',
    expertise: 'Guidance, navigation, certification',
    experience: '15+ yrs · 200+ mentored students',
    skills: ['Controls', 'Safety', 'MATLAB'],
  },
  {
    id: 't2',
    name: 'James Okonkwo',
    expertise: 'Perception & edge ML on drones',
    experience: '12 yrs · ex-automotive vision',
    skills: ['ONNX', 'ROS 2', 'CUDA'],
  },
  {
    id: 't3',
    name: 'Elena Marquez',
    expertise: 'Field testing & regulatory safety cases',
    experience: '10 yrs · BVLOS programs EU/US',
    skills: ['Testing', 'Compliance', 'Ops'],
  },
]

export const MOCK_MENTORS: MentorPreview[] = [
  {
    id: 'm1',
    name: 'Dr. Priya Nair',
    role: 'teacher',
    specialty: 'GNC · Certification',
    students: 48,
  },
  {
    id: 'm2',
    name: 'James Okonkwo',
    role: 'teacher',
    specialty: 'Perception · Edge ML',
    students: 36,
  },
  {
    id: 'm3',
    name: 'Elena Marquez',
    role: 'teacher',
    specialty: 'Field testing · Safety cases',
    students: 52,
  },
]

export const MOCK_PROFILE_REPOS: RepoProject[] = [
  {
    id: 'r1',
    name: 'orbit-mesh',
    description: 'Decentralized gossip layer for swarm coordination.',
    tags: ['TypeScript', 'Swarm', 'ROS 2'],
    stars: 312,
    forks: 48,
    contributors: 6,
    language: 'TypeScript',
    updatedAt: '3d ago',
  },
  {
    id: 'r2',
    name: 'wind-grove-sitl',
    description: 'Monsoon wind profiles for SITL in APAC regions.',
    tags: ['Python', 'SITL'],
    stars: 128,
    forks: 21,
    contributors: 4,
    language: 'Python',
    updatedAt: '1w ago',
  },
  {
    id: 'r3',
    name: 'landing-icu',
    description: 'ONNX model for vision-based precision landing.',
    tags: ['ONNX', 'CV'],
    stars: 94,
    forks: 11,
    contributors: 3,
    language: 'C++',
    updatedAt: '2w ago',
  },
]

export const MOCK_ACTIVITY = [
  { id: 'act-1', text: 'Starred hoverctl/bladeguard', time: 'Yesterday' },
  { id: 'act-2', text: 'Opened issue #44 on orbit-mesh', time: '3d ago' },
  { id: 'act-3', text: 'Connected with Dr. Priya Nair', time: '1w ago' },
]

export const MOCK_GIGS: GigListing[] = [
  {
    id: 'g1',
    title: 'Autonomy stack hardening for BVLOS pilot',
    company: 'Skyforge Dynamics',
    companyRole: 'company',
    budget: '₹18L – ₹24L',
    skills: ['PX4', 'STANAG', 'C++'],
    postedAt: '2d ago',
    applicants: 14,
  },
  {
    id: 'g2',
    title: 'ROS 2 bridge for existing GCS (Qt)',
    company: 'Horizon Field Robotics',
    companyRole: 'company',
    budget: '₹9L – ₹12L',
    skills: ['ROS 2', 'Qt', 'C++'],
    postedAt: '4d ago',
    applicants: 27,
  },
  {
    id: 'g3',
    title: 'Dataset labeling — monsoon debris (50k frames)',
    company: 'MonsoonVision',
    companyRole: 'company',
    budget: '₹4L – ₹6L',
    skills: ['CVAT', 'Python', 'QA'],
    postedAt: '1w ago',
    applicants: 41,
  },
]

const README_TEMPLATE = (name: string) => `# ${name}

## Overview
Open-source flight tooling for research and production teams.

## Getting started
\`\`\`bash
git clone https://github.com/dronehub/${name.replace(/\s+/g, '-').toLowerCase()}.git
pnpm install
pnpm dev
\`\`\`

## Contributing
PRs welcome — please open an issue first for larger changes.

## License
MIT
`

const PROJECT_PRESETS: Record<string, Partial<ProjectDetail> & { owner: MockUser }> = {
  'seed-project-orbitmesh': {
    name: 'OrbitMesh Swarm Routing',
    description:
      'Routing and telemetry platform for multi-drone missions with mesh networking and ROS 2 bridge.',
    tags: ['AI', 'Drone', 'Navigation', 'Simulation'],
    owner: MOCK_ME,
  },
  'autopilot-lab-sitl': {
    name: 'Autopilot Lab SITL Profiles',
    description:
      'Reproducible SITL benches for monsoon wind — shareable configs for student cohorts.',
    tags: ['Simulation', 'SITL', 'Teaching'],
    owner: MOCK_MENTOR_PROFILE,
  },
  'bvlos-solar-corridor': {
    name: 'BVLOS Solar Farm Corridor',
    description:
      'Path planning + documentation pack for long-range inspection contracts.',
    tags: ['BVLOS', 'AI', 'Operations'],
    owner: MOCK_COMPANY_PROFILE,
  },
}

export function getMockProject(id: string): ProjectDetail {
  const slug = id || 'demo-repo'
  const preset = PROJECT_PRESETS[slug]
  const title = preset?.name
    ? preset.name
    : slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

  const owner = preset?.owner ?? MOCK_ME

  return {
    id: slug,
    name: title || 'Demo Repository',
    description:
      preset?.description ??
      'Precision autonomy stack with hardware-in-the-loop tests and reproducible SITL profiles.',
    tags: preset?.tags ?? ['Autonomy', 'ROS 2', 'Safety'],
    stars: 428 + (slug.length % 200),
    forks: 36 + (slug.length % 80),
    contributors: 8,
    language: 'TypeScript',
    updatedAt: '2d ago',
    readme: README_TEMPLATE(title || 'Demo Repository'),
    owner,
    collaborators: [
      { name: owner.name, role: owner.role },
      { name: 'Dr. Priya Nair', role: 'teacher' },
      { name: 'Skyforge Dynamics', role: 'company' },
    ],
  }
}
