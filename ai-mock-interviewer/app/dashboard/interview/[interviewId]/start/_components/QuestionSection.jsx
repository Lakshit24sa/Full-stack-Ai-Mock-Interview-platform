import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestion, selectedQuestionIndex, setSelectedQuestionIndex }) {
    const textTospeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
        else {
            alert('Sorry your Browser does not support text to speech');
        }
    }

    if (!mockInterviewQuestion || !Array.isArray(mockInterviewQuestion.questions)) {
        return <div>Loading...</div>;
    }

    const questions = mockInterviewQuestion.questions;

    return (
        <div className='p-5 border rounded-lg'>
            <div className='flex space-x-4 mb-4'>
                {questions.map((_, index) => (
                    <button
                        key={index}
                        className={`p-2 rounded ${selectedQuestionIndex === index ? 'bg-green-500 text-white' : 'bg-red-400'}`}
                        //onClick={() => setSelectedQuestionIndex(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div>
                <h2>Question {selectedQuestionIndex + 1}</h2>
                <p>{questions[selectedQuestionIndex].question}</p>
                <Volume2 className='cursor-pointer' onClick={() => textTospeech(questions[selectedQuestionIndex].question)}/>
            </div>
            <div className='my-4 border rounded-lg p-5'>
                <h2 className='flex gap-2 items-center'>
                    <Lightbulb/>
                    <strong>Note: </strong>
                </h2>
                <h2 className='text-sm text-red-500 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    )
}

export default QuestionSection;
