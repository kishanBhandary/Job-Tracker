'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from './prisma'
import { getCurrentUser } from './auth'
import { JobApplicationSchema, JobApplicationInput } from './validation'

// Authentication helper
async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Create a new job application.
 */
export async function createJobApplication(data: JobApplicationInput) {
  try {
    const user = await requireUser()
    const validatedData = JobApplicationSchema.parse(data)

    const application = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        ...validatedData,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/applications')
    revalidatePath('/dashboard/analytics')
    
    return { success: true, application }
  } catch (error: any) {
    console.error('Create job application error:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', validationErrors: error.flatten().fieldErrors }
    }
    return { error: error.message || 'Failed to save application.' }
  }
}

/**
 * Get all job applications for the current user, with optional search, filtering, and sorting.
 */
export async function getJobApplications(params: {
  search?: string
  status?: string
  sortBy?: 'Newest' | 'Oldest'
} = {}) {
  try {
    const user = await requireUser()
    const { search, status, sortBy = 'Newest' } = params

    // Build the query where clause
    const where: any = {
      userId: user.id,
    }

    if (status && status !== 'All') {
      where.status = status
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: {
        appliedDate: sortBy === 'Newest' ? 'desc' : 'asc',
      },
    })

    return { success: true, applications }
  } catch (error: any) {
    console.error('Get job applications error:', error)
    return { error: error.message || 'Failed to retrieve applications.' }
  }
}

/**
 * Get a specific job application by ID. Verifies ownership.
 */
export async function getJobApplicationById(id: string) {
  try {
    const user = await requireUser()

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: user.id, // Enforce ownership
      },
    })

    if (!application) {
      return { error: 'Application not found or unauthorized' }
    }

    return { success: true, application }
  } catch (error: any) {
    console.error('Get job application by ID error:', error)
    return { error: error.message || 'Failed to retrieve application details.' }
  }
}

/**
 * Update an existing job application. Verifies ownership.
 */
export async function updateJobApplication(id: string, data: JobApplicationInput) {
  try {
    const user = await requireUser()
    const validatedData = JobApplicationSchema.parse(data)

    // First check ownership
    const existing = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existing) {
      return { error: 'Application not found or unauthorized' }
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/applications')
    revalidatePath(`/dashboard/applications/${id}`)
    revalidatePath('/dashboard/analytics')

    return { success: true, application }
  } catch (error: any) {
    console.error('Update job application error:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', validationErrors: error.flatten().fieldErrors }
    }
    return { error: error.message || 'Failed to update application.' }
  }
}

/**
 * Delete a job application. Verifies ownership.
 */
export async function deleteJobApplication(id: string) {
  try {
    const user = await requireUser()

    // First check ownership
    const existing = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existing) {
      return { error: 'Application not found or unauthorized' }
    }

    await prisma.jobApplication.delete({
      where: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/applications')
    revalidatePath('/dashboard/analytics')

    return { success: true }
  } catch (error: any) {
    console.error('Delete job application error:', error)
    return { error: error.message || 'Failed to delete application.' }
  }
}

/**
 * Get dashboard statistics for the authenticated user.
 */
export async function getDashboardStats() {
  try {
    const user = await requireUser()

    // Run aggregations dynamically
    const counts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: {
        userId: user.id,
      },
      _count: {
        id: true,
      },
    })

    // Initialize counts
    let applied = 0
    let screening = 0
    let interview = 0
    let offer = 0
    let rejected = 0

    counts.forEach((item) => {
      const status = item.status.toLowerCase()
      const count = item._count.id
      if (status === 'applied') applied = count
      else if (status === 'screening') screening = count
      else if (status === 'interview') interview = count
      else if (status === 'offer') offer = count
      else if (status === 'rejected') rejected = count
    })

    const total = applied + screening + interview + offer + rejected
    
    // Fetch recent 3 applications
    const recent = await prisma.jobApplication.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        appliedDate: 'desc',
      },
      take: 3,
    })

    return {
      success: true,
      stats: {
        total,
        applied,
        screening,
        interview,
        offer,
        rejected,
      },
      recent,
    }
  } catch (error: any) {
    console.error('Get dashboard stats error:', error)
    return { error: error.message || 'Failed to retrieve dashboard stats.' }
  }
}

/**
 * Get analytics data for the authenticated user.
 */
export async function getAnalyticsStats() {
  try {
    const user = await requireUser()

    // Aggregate counts by status
    const counts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: {
        userId: user.id,
      },
      _count: {
        id: true,
      },
    })

    let total = 0
    let applied = 0
    let screening = 0
    let interview = 0
    let offer = 0
    let rejected = 0

    counts.forEach((item) => {
      const status = item.status.toLowerCase()
      const count = item._count.id
      if (status === 'applied') applied = count
      else if (status === 'screening') screening = count
      else if (status === 'interview') interview = count
      else if (status === 'offer') offer = count
      else if (status === 'rejected') rejected = count
    })

    total = applied + screening + interview + offer + rejected

    // Calculate rates
    const interviewRate = total > 0 ? Math.round(((screening + interview + offer) / total) * 100) : 0
    const offerRate = total > 0 ? Math.round((offer / total) * 100) : 0
    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0

    // Detailed application status breakdown
    const chartData = [
      { status: 'Applied', count: applied, color: '#f3f4f6' },
      { status: 'Screening', count: screening, color: '#eff6ff' },
      { status: 'Interview', count: interview, color: '#fef3c7' },
      { status: 'Offer', count: offer, color: '#ecfdf5' },
      { status: 'Rejected', count: rejected, color: '#fef2f2' },
    ]

    return {
      success: true,
      total,
      rates: {
        interviewRate,
        offerRate,
        rejectionRate,
      },
      chartData,
    }
  } catch (error: any) {
    console.error('Get analytics stats error:', error)
    return { error: error.message || 'Failed to retrieve analytics stats.' }
  }
}
