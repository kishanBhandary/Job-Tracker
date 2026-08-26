import { z } from 'zod'

export const JobApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  jobTitle: z.string().min(1, 'Job Title is required'),
  location: z.string().transform(val => val === '' ? null : val).optional().nullable(),
  jobType: z.string().transform(val => val === '' ? null : val).optional().nullable(),
  salary: z.string().transform(val => val === '' ? null : val).optional().nullable(),
  status: z.enum(['Applied', 'Screening', 'Interview', 'Offer', 'Rejected']),
  appliedDate: z.coerce.date(),
  interviewDate: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.coerce.date().nullable().optional()
  ),
  jobUrl: z.string()
    .transform(val => val === '' ? null : val)
    .refine(val => {
      if (!val) return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, { message: 'Invalid URL (must include http:// or https://)' })
    .optional()
    .nullable(),
  notes: z.string().transform(val => val === '' ? null : val).optional().nullable(),
})

export type JobApplicationInput = z.input<typeof JobApplicationSchema>
