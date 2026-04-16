import { redirect } from 'next/navigation'

/** Legacy URL — canonical route is `/dashboard/mentors`. */
export default function MentorConnectRedirectPage() {
  redirect('/dashboard/mentors')
}
