"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null); // Initialize with null
    const [webCamEnable, setWebcamEnable] = useState(false);

    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, [params.interviewId]) // Add params.interviewId as dependency

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
    }

    return (
        <div className='my-10 flex justify-center flex-col items-center'>
            <h2 className='font-bold text-2xl'>
                Let's get started!
            </h2>
            <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-10'>
                
                <div className='flex flex-col my-5 p-5 rounded-lg border'>
                {interviewData ? ( // Check if interviewData is not null
                    <>
                        <h2 className='text-lg'><strong>Job Role/Job position: </strong>{interviewData.jsonPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData.jsonDesc}</h2>
                    </>
                ) : (
                    <p>Loading interview data...</p>
                )}
                </div>
                <div className='p-5 border rounded-lg border-yellow-500'>
                    <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
                    <h2>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                </div>
                
                <div>
                    {webCamEnable ? (
                        <Webcam
                            onUserMedia={() => setWebcamEnable(true)}
                            onUserMediaError={() => setWebcamEnable(false)}
                            mirrored={true}
                            style={{ height: 300, width: 300 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-transparent rounded-lg border' />
                            <Button onClick={() => setWebcamEnable(true)}>Enable Webcam and Microphone</Button>
                        </>
                    )}
                </div>

            </div>
            <div>
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                <Button>Start Interview</Button>
                </Link>
            </div>
            
        </div>
    )
}
