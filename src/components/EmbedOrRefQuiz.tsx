'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const questions = [
  {
    id: "simplicity",
    question: "Would keeping the pieces of information together lead to a simpler data model and code?",
    embedLabel: "Yes",
    referenceLabel: "No",
    explanation: "A simpler data model reduces development time, makes maintenance easier, and minimizes bugs. For example, in a blog application, embedding comments within posts can simplify the code since you don't need separate queries to fetch related data."
  },
  {
    id: "goTogether",
    question: 'Do the pieces of information have a "has-a," "contains," or similar relationship?',
    embedLabel: "Yes",
    referenceLabel: "No",
    explanation: "The type of relationship between data affects how it should be stored. For instance, a user's address is a 'has-a' relationship and is often embedded, while a user's orders might be referenced since they're more independent entities."
  },
  {
    id: "queryAtomicity",
    question: "Does the application query the pieces of information together?",
    embedLabel: "Yes",
    referenceLabel: "No",
    explanation: "If data is frequently queried together, embedding can improve performance by reducing the number of database operations. For example, if you always need product details with its reviews, embedding reviews within the product document makes sense."
  },
  {
    id: "updateComplexity",
    question: "Are the pieces of information updated together?",
    embedLabel: "Yes",
    referenceLabel: "No",
    explanation: "Data that's updated together benefits from embedding as it ensures atomic updates. For instance, if a user's profile and settings are always updated simultaneously, embedding settings within the user document maintains data consistency."
  },
  {
    id: "archival",
    question: "Should the pieces of information be archived at the same time?",
    embedLabel: "Yes",
    referenceLabel: "No",
    explanation: "Data lifecycle management is crucial. If related data should be archived together (like a project and its tasks), embedding simplifies the archival process and maintains data integrity."
  },
  {
    id: "cardinality",
    question: "Is there a high cardinality (current or growing) in the child side of the relationship?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "High cardinality relationships (like a product with thousands of reviews) are better suited for referencing to avoid document size limits and performance issues when updating large arrays."
  },
  {
    id: "dataDuplication",
    question: "Would data duplication be too complicated to manage and undesired?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "Data duplication can lead to inconsistencies and increased storage costs. For example, if customer information is used across multiple orders, referencing prevents the need to update the same data in multiple places."
  },
  {
    id: "documentSize",
    question: "Would the combined size of the pieces of information take too much memory or transfer bandwidth for the application?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "MongoDB has a 16MB document size limit. Large embedded arrays or nested objects can hit this limit and affect performance. For instance, a social media post with thousands of comments might be better with referenced comments."
  },
  {
    id: "documentGrowth",
    question: "Would the embedded piece grow without bound?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "Unbounded growth can lead to performance issues and hit document size limits. For example, a chat application's message history should typically be referenced rather than embedded within a conversation document."
  },
  {
    id: "workload",
    question: "Are the pieces of information written at different times in a write-heavy workload?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "Frequent updates to embedded documents can cause document-level locking and concurrency issues. In a real-time analytics system, separate collections might perform better for high-frequency updates."
  },
  {
    id: "individuality",
    question: "For the children side of the relationship, can the pieces exist by themselves without a parent?",
    embedLabel: "No",
    referenceLabel: "Yes",
    explanation: "Independent entities often benefit from referencing. For example, users can exist without orders, so they're typically separate collections, while a user's address details make more sense embedded as they're meaningless without the user."
  },
]

const EmbedOrRefQuiz = () => {
  const totalQuestions = questions.length
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
  
  const [embedCount, setEmbedCount] = useState(0);
  const [referenceCount, setReferenceCount] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if(Object.keys(answers).length === totalQuestions){
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [embedCount, referenceCount, answers, totalQuestions]);

  const handleAnswer = (id: string, embedLabel: string, referenceLabel: string, answer: string) => {
    const previousAnswer = answers[id];

    if(!previousAnswer){
      if(answer === embedLabel){
        setEmbedCount(embedCount + 1);
      }else if(answer === referenceLabel){
        setReferenceCount(referenceCount + 1);
      }
    }else if (previousAnswer !== answer) {
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
                        const explanation = q.explanation;
                        const isExpanded = expandedExplanation === id;

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
                                        <p className="text-xl text-center text-slate-300 px-4 mb-4">
                                            {question}
                                        </p>
                                        <div className="flex flex-col items-center gap-4">
                                            <button
                                                onClick={() => setExpandedExplanation(isExpanded ? null : id)}
                                                className="text-sm text-[var(--mongodb-light-green)] hover:text-[var(--mongodb-green)] transition-colors duration-1000"
                                            >
                                                {isExpanded ? "Hide explanation" : "Why this matters?"}
                                            </button>
                                            <div 
                                                className={`overflow-hidden transition-all duration-600 ease-in-out ${
                                                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="text-slate-300 text-sm bg-slate-700/50 p-4 rounded-lg transform transition-transform duration-1000 ease-in-out">
                                                    {explanation}
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-4 pt-4">
                                                <button 
                                                    onClick={() => handleAnswer(id, embedLabel, referenceLabel, 'Yes')} 
                                                    className={`px-6 py-3 ${selectedAnswer === 'Yes' ? 'bg-[var(--mongodb-dark-green)]' : 'bg-slate-700'} text-white rounded-lg font-semibold hover:bg-[var(--mongodb-dark-green)] transition-colors duration-300`}
                                                >
                                                    Yes
                                                </button>
                                                <button 
                                                    onClick={() => handleAnswer(id, embedLabel, referenceLabel, 'No')} 
                                                    className={`px-6 py-3 ${selectedAnswer === 'No' ? 'bg-[var(--mongodb-dark-green)]' : 'bg-slate-700'} text-white rounded-lg font-semibold hover:bg-[var(--mongodb-dark-green)] transition-colors duration-300`}
                                                >
                                                    No
                                                </button>
                                            </div>
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