"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user, isLoaded } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoaded && user) {
            GetInterviewList();
        }
    }, [isLoaded, user]);

    const GetInterviewList = async () => {
        try {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id));
            console.log(result);
            setInterviewList(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2 className='font-medium text-xl'>Previous Interview Lists</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList.length > 0 ? (
                    interviewList.map((interview, index) => (
                        <InterviewItemCard interview={interview} key={index} />
                    ))
                ) : (
                    <div>No interviews found.</div>
                )}
            </div>
        </div>
    );
}

export default InterviewList;
