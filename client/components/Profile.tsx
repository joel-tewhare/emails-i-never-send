import { Button } from '@/components/ui/button'
import { getProfile } from '../apis/users'
import { useQuery } from '@tanstack/react-query'

export default function Profile() {
  const { data, isPending, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  if (!data) {
    return <div>No data available</div>
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex h-screen flex-row flex-wrap items-center justify-center gap-4">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="icons graphic"
        />
        <div className="flex h-[500px] w-[400px] flex-col items-center border border-email-charcoal p-4">
          <h1 className="my-6 w-full text-center text-3xl font-bold">
            Your Profile
          </h1>
          <div className="ml-10 mt-6 w-full text-left">
            <h2 className="my-3 text-xl">Username</h2>
            <p className="text-lg italic">{data.username}</p>
            <h2 className="my-3 text-xl">Full Name</h2>
            <p className="text-lg italic">{`${data.firstName} ${data.lastName}`}</p>
          </div>
          <Button className="mt-24 rounded-xl bg-email-charcoal px-4 py-3 text-lg text-email-white hover:bg-email-charcoal/80 hover:shadow-md">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
