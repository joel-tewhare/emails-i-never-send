import { useQuery } from '@tanstack/react-query'
import { EmailReview } from '@/models/email-review'

export default function Review() {
  const { data } = useQuery<EmailReview>({
    queryKey: ['emailReview'],
    enabled: false,
  })

  if (!data) {
    return <div>No review data available</div>
  }

  return (
    <div>
      <p>{data.review}</p>
    </div>
  )
}
