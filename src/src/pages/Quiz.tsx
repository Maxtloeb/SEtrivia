

import React, { useState, useEffect } from "react";
import { Question } from "@/entities/Question";
import { QuizSession } from "@/entities/QuizSession";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, SkipForward } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";


import QuizFilters from "../components/quiz/QuizFilters";
import QuestionDisplay from "../components/quiz/QuestionDisplay";
import QuizResults from "../components/quiz/QuizResults";


export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    code_source: "all",
    category: "all",
    difficulty: "all",
    question_count: 10
  });


  useEffect(() => {
    // Parse URL parameters to set initial filters when the page loads
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get("difficulty");
    const code_source = urlParams.get("code_source");
    const category = urlParams.get("category");


    // Only update filters if any params are present in the URL
    if (difficulty || code_source || category) {
      setFilters(prevFilters => ({
        ...prevFilters,
        difficulty: difficulty || prevFilters.difficulty,
        code_source: code_source || prevFilters.code_source,
        category: category || prevFilters.category,
      }));
    }
    // This effect should only run once on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let timer;
    if (quizStarted && !quizCompleted) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);


  const loadQuestions = async () => {
    const dbFilters = {};
    if (filters.code_source !== "all") dbFilters.code_source = filters.code_source;
    if (filters.category !== "all") dbFilters.category = filters.category;
    if (filters.difficulty !== "all") dbFilters.difficulty = filters.difficulty;


    try {
      // This now ONLY fetches from the fast internal database.
      const fetchedQuestions = await Question.filter(dbFilters, null, 500);


      if (fetchedQuestions.length === 0) {
        toast({
          variant: "destructive",
          title: "No Questions Found",
          description: "No questions in the database match your filters. An admin may need to sync the question bank.",
        });
        return; // Stop if no questions
      }


      const shuffled = fetchedQuestions.sort(() => Math.random() - 0.5);
      const questionsToDisplay = shuffled.slice(0, Math.min(filters.question_count, shuffled.length));
     
      setQuestions(questionsToDisplay);
      setQuizStarted(true);
      setStartTime(Date.now());
     
      console.log(`Quiz started with ${questionsToDisplay.length} questions from internal database.`);


    } catch (error) {
      console.error("Error loading questions from database:", error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: `Could not load questions: ${error.message}`,
      });
    }
  };


  const currentQuestion = questions[currentIndex];


  const handleAnswerSelect = (optionIndex) => {
    if (showAnswer || !currentQuestion) return;
   
    const isCorrect = currentQuestion.options[optionIndex]?.is_correct || false;
   
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: { optionIndex, isCorrect, questionId: currentQuestion.id }
    }));
   
    setShowAnswer(true);
  };


  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      completeQuiz();
    }
  };


  const handleSkip = () => {
    if (!currentQuestion) return;
   
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: { optionIndex: -1, isCorrect: false, questionId: currentQuestion.id }
    }));
    setShowAnswer(true);
  };


  const handleFlagQuestion = async (question) => {
    if (!question || !question.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot flag this question. Please try again.",
      });
      return;
    }


    if (flaggedQuestions[question.id]) {
      toast({
        title: "Already Flagged",
        description: "This question has already been flagged for review.",
      });
      return;
    }


    setFlaggedQuestions(prev => ({ ...prev, [question.id]: true }));


    toast({
      title: "Question Flagged",
      description: "This question has been noted for local review.",
    });
  };


  const completeQuiz = async () => {
    setQuizCompleted(true);
   
    const correctCount = Object.values(selectedAnswers).filter(a => a.isCorrect).length;
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const sessionDuration = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
   
    // Save quiz session
    await QuizSession.create({
      questions_answered: Object.entries(selectedAnswers).map(([, answer]) => ({
        question_id: answer.questionId,
        selected_answer: answer.optionIndex.toString(),
        is_correct: answer.isCorrect,
        time_spent: 0 // Could track per question if needed
      })),
      filters_used: filters,
      score,
      total_questions: questions.length,
      correct_answers: correctCount,
      session_duration: sessionDuration
    });
  };


  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          <QuizFilters
            filters={filters}
            onFiltersChange={setFilters}
            onStartQuiz={loadQuestions}
          />
        </div>
      </div>
    );
  }


  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          <QuizResults
            questions={questions}
            selectedAnswers={selectedAnswers}
            timeSpent={timeSpent}
            filters={filters}
            onReturnToDashboard={() => navigate(createPageUrl("Home"))}
            onStartNewQuiz={() => {
              setQuizStarted(false);
              setQuizCompleted(false);
              setCurrentIndex(0);
              setSelectedAnswers({});
              setShowAnswer(false);
              setTimeSpent(0);
              setFlaggedQuestions({});
            }}
          />
        </div>
      </div>
    );
  }


  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answer = selectedAnswers[currentIndex];


  // Additional safety check: If quiz started but no questions were loaded or found
  if (quizStarted && (!questions || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No Questions Found</h2>
            <p className="text-slate-600 mb-4">No questions match your selected filters. Please adjust your filters and try again.</p>
            <Button onClick={() => {
              setQuizStarted(false); // Go back to filters
              setQuestions([]); // Clear any potentially partial questions
            }}>
              Back to Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }


  // Safety check for current question being undefined (e.g., during loading or unexpected state)
  if (quizStarted && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading Question...</h2>
            <p className="text-slate-600">Please wait while we load your question, or ensure your filters return valid questions.</p>
            <Button onClick={() => setQuizStarted(false)}>
              Back to Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800">
                Question {currentIndex + 1} of {questions.length}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
            >
              Exit Quiz
            </Button>
          </div>
         
          <Progress value={progress} className="h-2" />
        </div>


        {/* Question - only render if currentQuestion exists */}
        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={answer?.optionIndex}
            showAnswer={showAnswer}
            onAnswerSelect={handleAnswerSelect}
            onFlagQuestion={() => handleFlagQuestion(currentQuestion)}
            isFlagged={!!flaggedQuestions[currentQuestion.id]}
          />
        )}


        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 border-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {answer && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                  answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {answer.isCorrect ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {answer.isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
              )}
            </div>
           
            <div className="flex gap-3">
              {!showAnswer && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex items-center gap-2"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>
              )}
             
              {showAnswer && (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



