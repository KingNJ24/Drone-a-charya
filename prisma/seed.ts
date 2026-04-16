import {
  ConnectionStatus,
  PrismaClient,
  RequestStatus,
  RequestType,
  Role,
  Visibility,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('DroneHub123!', 10)

  const student = await prisma.user.upsert({
    where: { email: 'jordan@dronehub.dev' },
    update: {},
    create: {
      name: 'Jordan Lee',
      email: 'jordan@dronehub.dev',
      password,
      role: Role.STUDENT,
      bio: 'Student builder focused on drone navigation and simulation.',
      skills: ['ROS 2', 'Simulation', 'Computer Vision'],
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'priya@dronehub.dev' },
    update: {},
    create: {
      name: 'Dr. Priya Nair',
      email: 'priya@dronehub.dev',
      password,
      role: Role.TEACHER,
      bio: 'Teacher and mentor for guidance, control, and safety systems.',
      skills: ['Controls', 'Navigation', 'Safety'],
    },
  })

  const company = await prisma.user.upsert({
    where: { email: 'hello@skyforge.dev' },
    update: {},
    create: {
      name: 'Skyforge Dynamics',
      email: 'hello@skyforge.dev',
      password,
      role: Role.COMPANY,
      bio: 'Commercial drone operator building production autonomy.',
      skills: ['BVLOS', 'AI', 'Operations'],
    },
  })

  const project = await prisma.project.upsert({
    where: { id: 'seed-project-orbitmesh' },
    update: {},
    create: {
      id: 'seed-project-orbitmesh',
      title: 'OrbitMesh Swarm Routing',
      description: 'Routing and telemetry platform for multi-drone missions.',
      tags: ['AI', 'Drone', 'Navigation', 'Simulation'],
      authorId: student.id,
      repoLink: 'https://github.com/dronehub/orbitmesh',
      visibility: Visibility.PUBLIC,
      starsCount: 48,
    },
  })

  await prisma.like.upsert({
    where: { userId_projectId: { userId: teacher.id, projectId: project.id } },
    update: {},
    create: { userId: teacher.id, projectId: project.id },
  })

  await prisma.comment.createMany({
    data: [
      {
        userId: teacher.id,
        projectId: project.id,
        content: 'Strong simulation setup. Add a safety-case summary next.',
      },
      {
        userId: company.id,
        projectId: project.id,
        content: 'Interested in testing this in a real inspection workflow.',
      },
    ],
  })

  await prisma.collaborationRequest.createMany({
    data: [
      {
        senderId: student.id,
        receiverId: teacher.id,
        type: RequestType.MENTORSHIP,
        message: 'Could you review our controller tuning plan?',
        status: RequestStatus.PENDING,
      },
      {
        senderId: company.id,
        receiverId: student.id,
        type: RequestType.COLLABORATION,
        message: 'Would you like to collaborate on route optimization experiments?',
        status: RequestStatus.ACCEPTED,
      },
    ],
  })

  await prisma.connection.createMany({
    data: [
      {
        senderId: student.id,
        receiverId: teacher.id,
        status: ConnectionStatus.ACCEPTED,
      },
      {
        senderId: student.id,
        receiverId: company.id,
        status: ConnectionStatus.PENDING,
      },
    ],
  })

  const gig = await prisma.gig.create({
    data: {
      companyId: company.id,
      title: 'Simulation Toolkit Contributor',
      description: 'Build SITL scenarios and testing fixtures for production drone software.',
      budget: '$4,000 fixed project',
      requiredSkills: ['Simulation', 'Safety', 'Drone'],
    },
  })

  await prisma.application.create({
    data: {
      userId: student.id,
      gigId: gig.id,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
