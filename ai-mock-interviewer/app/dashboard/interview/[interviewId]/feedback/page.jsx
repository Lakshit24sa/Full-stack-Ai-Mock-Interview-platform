"use client"
import { UserAnsTable } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { db } from '@/utils/db'
import { ChevronsUpDown, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function FeedbackPage({params}) {

    const [feedbackList,setFeedbackList] = useState([]);
    const router = useRouter();
    useEffect(()=>{
        getFeedback();
    },[])
    const getFeedback = async()=>{
        const result = await db.select()
        .from(UserAnsTable)
        .where(eq(UserAnsTable.mockIdRef,params.interviewId))
        .orderBy(UserAnsTable.id_user);

        console.log(result);
        setFeedbackList(result);
    }
  return (
    <div className='p-10'>
        <h2 className='text-2xl font-bold text-green-600'>Congratulations</h2>
        <h2 className='text-1xl font-bold'>Here is your Interview Analysis </h2>
        
        {feedbackList?.length==0 ? 
        <h2 className='font-bold text-xl text-gray-500'> No interview Feedback Found</h2>
        : 
        <>
        <h2 className='text-lg text-primary my-3'>Your overall rating : {7/10} </h2>
        <h2 className='text-sm text-gray-200'>Find below your interview Questions and their correct answers along with Feedback with improvement</h2>
        {feedbackList&&feedbackList.map((item,index)=>(
            <Collapsible key={index}>
            <CollapsibleTrigger className='p-2 flex justify-between rounded-lg my-2 gap-3 w-full'>
            {item.question} <ChevronsUpDown/>
                
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                        <h2 className='text-red-600 p-2 border rounded-lg'><strong>Rating : {item.rating}</strong></h2>
                        <h2 className='p-2 text-red-400 border rounded-lg bg-red-200 text-sm'><strong> Your Answer :</strong> {item.userAns}</h2>
                        <h2 className='p-2 text-green-500 border rounded-lg bg-green-200 text-sm'><strong> Correct Answer :</strong> {item.correctAns}</h2>
                        <h2 className='p-2 text-blue-600 border rounded-lg bg-blue-200 text-sm'><strong> FeedBack :</strong> {item.feedback}</h2>
                </div>
            </CollapsibleContent>
          </Collapsible>
        
        ))}
        </>}
        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default FeedbackPage
