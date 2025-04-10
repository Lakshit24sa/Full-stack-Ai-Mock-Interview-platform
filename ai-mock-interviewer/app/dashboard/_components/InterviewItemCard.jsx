import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router = useRouter();
    const onStart = ()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }
    const onFeedbackPress = ()=>{
        router.push('/dashboard/interview/'+interview.mockId+'/feedback')
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview?.jsonExperience} Years of Experience</h2>
        <h2 className='text-sm text-gray-500'>Created At {interview.createdAt}</h2>
        <div className='flex justify-between'>
            
            <Button size="sm" variant="outline" onClick = {onStart}>Feedback</Button>
            <Button size="sm" onClick={onFeedbackPress}>Start</Button>
        </div>
    </div>
  )
}

export default InterviewItemCard
