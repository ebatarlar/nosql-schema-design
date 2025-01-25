'use client'

import React, {  useState ,useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const questions = [
  {
    id: "simplicity",
    question: "Would keeping the pieces of information together lead to a simpler data model and code?",
    embedLabel: "Yes",
    referenceLabel: "No",
  },
  {
    id: "goTogether",
    question: 'Do the pieces of information have a "has-a," "contains," or similar relationship?',
    embedLabel: "Yes",
    referenceLabel: "No",
  },
  {
    id: "queryAtomicity",
    question: "Does the application query the pieces of information together?",
    embedLabel: "Yes",
    referenceLabel: "No",
  },
  {
    id: "updateComplexity",
    question: "Are the pieces of information updated together?",
    embedLabel: "Yes",
    referenceLabel: "No",
  },
  {
    id: "archival",
    question: "Should the pieces of information be archived at the same time?",
    embedLabel: "Yes",
    referenceLabel: "No",
  },
  {
    id: "cardinality",
    question: "Is there a high cardinality (current or growing) in the child side of the relationship?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
  {
    id: "dataDuplication",
    question: "Would data duplication be too complicated to manage and undesired?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
  {
    id: "documentSize",
    question:
      "Would the combined size of the pieces of information take too much memory or transfer bandwidth for the application?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
  {
    id: "documentGrowth",
    question: "Would the embedded piece grow without bound?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
  {
    id: "workload",
    question: "Are the pieces of information written at different times in a write-heavy workload?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
  {
    id: "individuality",
    question: "For the children side of the relationship, can the pieces exist by themselves without a parent?",
    embedLabel: "No",
    referenceLabel: "Yes",
  },
]


const EmbedOrRefQuiz = () => {

  const totalQuestions                = questions.length
  const [showResults, setShowResults] = useState(false);
  const resultsRef                    = useRef<HTMLDivElement>(null);
  
  const [embedCount, setEmbedCount]         = useState(0);
  const [referenceCount, setReferenceCount] = useState(0);
  const [answers, setAnswers]               = useState<{[key: string]: string}>({});

  useEffect(() => {
    //console.log("Embed count:", embedCount, "Reference count:", referenceCount);
    //console.log("Answers:", Object.keys(answers).length);
    if(Object.keys(answers).length === totalQuestions){
      setShowResults(true);
      // Scroll to results after a short delay to ensure the results section is rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [embedCount, referenceCount, answers, totalQuestions]);

  const handleAnswer = (id: string, embedLabel: string, referenceLabel: string, answer: string) => {
    const previousAnswer = answers[id];

    //console.log("Previous answer:", previousAnswer);
    
    if(!previousAnswer){
      /*first answer*/
      if(answer === embedLabel){
        setEmbedCount(embedCount + 1);
      }else if(answer === referenceLabel){
        setReferenceCount(referenceCount + 1);
      }
    }else if (previousAnswer !== answer) {
      // Changed answer for this question
      if (previousAnswer === embedLabel) {
        setEmbedCount(embedCount - 1);
      } else if (previousAnswer === referenceLabel) {
        setReferenceCount(referenceCount - 1);
      }
      if (answer === embedLabel) {
        setEmbedCount(embedCount + 1);
      } else if (answer === referenceLabel) {
        setReferenceCount(referenceCount + 1);
      }
    }

    setAnswers({...answers, [id]: answer});

    
  }
    
  return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-white mb-8 tracking-tight">
                        <span className="text-[var(--mongodb-green)]">MongoDB</span> Schema Design
                    </h1>
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-slate-700">
                        <h2 className="text-3xl font-semibold text-[var(--mongodb-light-green)] mb-6">
                            Embed or Reference?
                        </h2>
                        <div className="text-slate-300 space-y-4 max-w-3xl mx-auto">
                            <p className="text-xl">
                                In MongoDB, there are two main ways to model relationships between data: 
                                <span className="text-[var(--mongodb-green)] font-semibold"> embedding</span> and 
                                <span className="text-[var(--mongodb-green)] font-semibold"> referencing</span>.
                            </p>
                            <p className="text-lg">
                                <strong className="text-[var(--mongodb-light-green)]">Embedding</strong> means including related data within the same document, while 
                                <strong className="text-[var(--mongodb-light-green)]"> referencing</strong> means storing related data in separate documents and collections with references between them.
                            </p>
                            <p className="text-lg">
                                This quiz will help you make better decisions about when to use each approach based on your specific use case, data relationships, and access patterns.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-8">
                    {questions.map((q, index) => {
                        const id = q.id;
                        const question = q.question;
                        const embedLabel = q.embedLabel;
                        const referenceLabel = q.referenceLabel;

                        const selectedAnswer = answers[id];

                        return(
                            <div key={index} className="transform transition-all duration-300 hover:scale-[1.02]">
                                <Card className="bg-slate-800/70 border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-3xl font-bold text-center text-[var(--mongodb-light-green)]">
                                            Question {index + 1}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl text-center text-slate-300 px-4">
                                            {question}
                                        </p>
                                        <div className="flex justify-center gap-4 pt-4">
                                            <button onClick={() => handleAnswer(id, embedLabel, referenceLabel, 'Yes')} className={`px-6 py-3 ${selectedAnswer === 'Yes' ? 'bg-[var(--mongodb-dark-green)]' : 'bg-slate-700'} text-white rounded-lg font-semibold hover:bg-[var(--mongodb-dark-green)] transition-colors duration-300`}>Yes</button>
                                            <button onClick={() => handleAnswer(id, embedLabel, referenceLabel, 'No')} className={`px-6 py-3 ${selectedAnswer === 'No' ? 'bg-[var(--mongodb-dark-green)]' : 'bg-slate-700'} text-white rounded-lg font-semibold hover:bg-[var(--mongodb-dark-green)] transition-colors duration-300`}>No</button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}
                </div>
                {/* Results Section */}
                {showResults && (
                    <div ref={resultsRef} className="mt-12 bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-slate-700">
                        <h2 className="text-3xl font-semibold text-[var(--mongodb-light-green)] mb-6 text-center">
                            Quiz Results
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-center gap-12">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-[var(--mongodb-green)]">{embedCount}</p>
                                    <p className="text-slate-300 mt-2">Embed Answers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-[var(--mongodb-green)]">{referenceCount}</p>
                                    <p className="text-slate-300 mt-2">Reference Answers</p>
                                </div>
                            </div>
                            
                            <div className="text-center text-slate-300 mt-8">
                                <p className="text-xl mb-4">Recommendation:</p>
                                <p className="text-lg">
                                    {embedCount > referenceCount ? (
                                        "Based on your answers, embedding would be a better choice for your use case."
                                    ) : embedCount < referenceCount ? (
                                        "Based on your answers, using references would be a better choice for your use case."
                                    ) : (
                                        "Your answers suggest that either embedding or referencing could work. Consider other factors specific to your use case."
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
        
        

}

export default EmbedOrRefQuiz