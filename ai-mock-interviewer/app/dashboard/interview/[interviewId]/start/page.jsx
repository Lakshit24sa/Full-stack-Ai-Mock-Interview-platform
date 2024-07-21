"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {
    
    const [interviewData, setInterviewData] = useState(null); // Initialize with null
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null); // Initialize with null
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0); // Add this state

    useEffect(() => {
        GetInterviewDetails();
    }, [params.interviewId]); // Add params.interviewId as dependency

    useEffect(() => {
        // Log mockInterviewQuestion whenever it changes
        console.log(mockInterviewQuestion);
    }, [mockInterviewQuestion]);
    
    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
            setInterviewData(result[0]);
            console.log('Raw JSON response:', result[0].jsonMockResp); // Log the raw JSON response
            
            // Extract the JSON part
            const jsonStartIndex = result[0].jsonMockResp.indexOf('{');
            const jsonEndIndex = result[0].jsonMockResp.lastIndexOf('}') + 1;
            const validJsonString = result[0].jsonMockResp.substring(jsonStartIndex, jsonEndIndex);

            const jsonMockResp = JSON.parse(validJsonString);
            setMockInterviewQuestion(jsonMockResp);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'> 
                <QuestionSection mockInterviewQuestion={mockInterviewQuestion} 
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
                />
                <RecordAnsSection mockInterviewQuestion={mockInterviewQuestion}
                selectedQuestionIndex={selectedQuestionIndex}
                interviewData = {interviewData}/>
            </div>
            <div className='p-5 flex justify-center gap-2'>
                {selectedQuestionIndex>0 && <Button onClick={()=>setSelectedQuestionIndex(selectedQuestionIndex-1)}>Previous Question</Button>}
                {selectedQuestionIndex<4 && <Button onClick={()=>setSelectedQuestionIndex(selectedQuestionIndex+1)}>Next Question</Button>}
                <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
                {selectedQuestionIndex==4&&<Button>End Interview</Button>}
                </Link>
                
            </div>
            
        </div>
    )
}

export default StartInterview;
