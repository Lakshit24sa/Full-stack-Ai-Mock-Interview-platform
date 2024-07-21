"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';

function AddnewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [JobPosition, setJobPosition] = useState();
    const [JobDesc, setJobDesc] = useState();
    const [JobExperience, setJobExperience] = useState();
    const [Loading,setLoading] = useState(false);
    const [jsonResponse,setJsonRseponse] = useState([]);
    const {user} = useUser();
    const router = useRouter();

    const onSubmit = async(e)=>{
        setLoading(true);
        e.preventDefault()
        console.log(JobDesc,JobPosition,JobExperience);
        
        const InputPrompt = "Job Position: "+JobPosition+", Job decription : "+JobDesc+",Years of experience: "+JobExperience+", Depends on Job position, job description and job experience give "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in JSON format. Give Questions and answers as field in JSON format" 
        const result = await chatSession.sendMessage(InputPrompt)
        const MockJsonResponse = (result.response.text()).replace('```json','').replace('```','')
        setJsonRseponse(MockJsonResponse);
        if (MockJsonResponse){
        const resp = await db.insert(MockInterview).values({
            mockId:uuidv4(),
            jsonMockResp: MockJsonResponse,
            jobPosition:JobPosition ,
            jsonDesc : JobDesc,
            jsonExperience: JobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt:  moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId})
        console.log("Inserted ID:",resp);
        if (resp) {
            setOpenDialog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else {
        console.log("ERROR");
    }
        console.log(JSON.parse(MockJsonResponse));
        setLoading(false);
    }

    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-slate-500 hover:scale-105 hover:shadow-md cursor-pointer'
                onClick={() => setOpenDialog(true)} // Use an arrow function here
            >
                <h2 className='font-bold text-lg'>+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}> {/* Add onOpenChange to handle dialog state */}
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about the job you want to get interviewed about?</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                            <div>
                                <h2>Add details about your job position/role, job description and years of experience</h2>
                                <div className='mt-7 my-3'>
                                    <label>Job Role/position</label>
                                    <Input placeholder="Ex. Full stackDeveloper" required 
                                    onChange={(event)=>setJobPosition(event.target.value)}
                                    />
                                </div>
                                <div className='mt-7 my-3'>
                                    <label>Job Description/ Tech Stack</label>
                                    <Textarea placeholder="React, Angular, Nodejs,Mysql etc..." required 
                                    onChange={(event)=>setJobDesc(event.target.value)}
                                    />
                                </div>
                                <div className='mt-7 my-3'>
                                    <label>Years of Experience</label>
                                    <Input placeholder="Ex.2" type="number" required 
                                    onChange={(event)=>setJobExperience(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-5 justify-end'>
                                <Button type= "button" variant='ghost' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                                <Button type = "submit" disabled={Loading}>
                                    {Loading?
                                    <>
                                    <LoaderCircle className='animate-spin'/>'Generating from Ai'
                                    </>: 'Start Interview'
                                    }
                                    </Button>
                            </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddnewInterview;
