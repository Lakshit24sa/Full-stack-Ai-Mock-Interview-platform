"use client";
import { Button } from '@/components/ui/button';
import { Mic, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel';
import { db } from '@/utils/db';
import { UserAnsTable } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnsSection({mockInterviewQuestion,selectedQuestionIndex, interviewData}) {
    const [webCamEnable, setWebcamEnable] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser(); 
    const [Loading,setLoading] = useState(false);
    const {
        startSpeechToText,
        stopSpeechToText,
        isRecording,
        results,
        setResults,
        error
    } = useSpeechToText({
        timeout: 10000,
        continuous: true
    });

    useEffect(() => {
        if (results.length > 0) {
            //const transcript = results.map(result => result.transcript).join(' ');
            setUserAnswer(results[0]); // Set userAnswer directly to the full transcript
            console.log(userAnswer);
        }
    }, [results]);

    useEffect(()=>{
        if (!isRecording&&userAnswer.length>10){
            updateUserAns();
        }
    },[userAnswer])


    const StartStopRecording = async()=> {
        if (isRecording) {
           
            stopSpeechToText();
            
        }
        else {
            startSpeechToText();
        }
    }
    const updateUserAns = async()=> {

        console.log(userAnswer);
        setLoading(true);
        const questions = mockInterviewQuestion.questions;
        const curquest = questions[selectedQuestionIndex].question
        
        const feedbackPrompt = "Question: "+curquest+ ",User Answer: "+userAnswer+" .Depends onquestion ans User answer for given interview question please give rating for answer and feedback for improvement in 3-5 lines in JSON format with rating field and feedback field";
        const res = await chatSession.sendMessage(feedbackPrompt);
        const jsonres = (res.response.text()).replace('```json','').replace('```','');
        console.log(jsonres);
        const jsonFeedback = JSON.parse(jsonres);
        const response = await db.insert(UserAnsTable)
        .values({
            mockIdRef: interviewData?.mockId,
            question: curquest,
            correctAns: questions[selectedQuestionIndex].answer,
            userAns: userAnswer,
            feedback: jsonFeedback?.feedback,
            rating: jsonFeedback?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt : moment().format('DD-MM-yyyy')
        })
        if (response) {
            toast('User Answer recorded successfully');
            setUserAnswer(''); 
            setResults([]);
        }
        setResults([]);
        setLoading(false);
        
        
        
    }
    return (
        <div>
            <div className='flex flex-col justify-center items-center'>
                {webCamEnable ? (
                    <>
                        <Webcam
                            onUserMedia={() => setWebcamEnable(true)}
                            onUserMediaError={() => setWebcamEnable(false)}
                            mirrored={true}
                            style={{ height: 300, width: 300 }}
                        />
                        <Button disabled={Loading} className='my-10' onClick={StartStopRecording}>
                            {isRecording ? <h2><Mic /> 'Recording...'</h2> : 'Record Your Answer'}
                        </Button>
                        <Button onClick={() => console.log('User Answer:', userAnswer)}>Show Answer</Button>
                    </>
                ) : (
                    <>
                        <WebcamIcon className='h-72 w-full my-7 p-20 bg-transparent rounded-lg border' />
                        <Button onClick={() => setWebcamEnable(true)}>Enable Webcam and Microphone</Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default RecordAnsSection;
