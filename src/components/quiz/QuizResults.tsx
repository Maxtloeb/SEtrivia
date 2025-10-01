import React, { useState, useEffect } from "react";
import { QuizSession } from "@/entities/QuizSession"; // Make sure QuizSession is imported
import { uniq } from 'lodash'; // Import uniq from lodash
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  RotateCcw,
  Home,
  CheckCircle,
  XCircle
} from "lucide-react";
import CommunityComparison from "./CommunityComparison"; // Import the new component

export default function QuizResults({
  questions,
  selectedAnswers,
  timeSpent,
  filters,
  onReturnToDashboard,
  onStartNewQuiz
}) {
  const [communityStats, setCommunityStats] = useState({ averageScore: 0, participantCount: 0 });
  const [isLoadingCommunityStats, setIsLoadingCommunityStats] = useState(true);

  const correctCount = Object.values(selectedAnswers).filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const timePerQuestion = totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;

  useEffect(() => {
    const fetchCommunityStats = async () => {
      if (!filters.category || filters.category === 'all') {
        setIsLoadingCommunityStats(false);
        return;
      }

      try {
        setIsLoadingCommunityStats(true);
        // Fetch sessions for the specific category
        const sessions = await QuizSession.filter({ 'filters_used.category': filters.category });
       
        if (sessions.length > 0) {
          const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
          const averageScore = totalScore / sessions.length;
          const participantCount = uniq(sessions.map(s => s.created_by)).length;

          setCommunityStats({ averageScore, participantCount });
        }
      } catch (error) {
        console.error("Error fetching community stats:", error);
        // Keep default stats on error
      } finally {
        setIsLoadingCommunityStats(false);
      }
    };

    fetchCommunityStats();
  }, [filters.category]);


  const getScoreMessage = () => {
    if (score >= 90) return { message: "Outstanding! You're mastering the material!", color: "text-blue-200", icon: Trophy };
    if (score >= 80) return { message: "Great work! You're on the right track!", color: "text-blue-200", icon: Target };
    if (score >= 70) return { message: "Good progress! Keep practicing!", color: "text-blue-200", icon: TrendingUp };
    return { message: "Keep studying! You'll get there!", color: "text-blue-200", icon: Target };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <scoreMessage.icon className="w-16 h-16 mx-auto text-blue-200" />
            <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            <p className={`text-xl ${scoreMessage.color}`}>
              {scoreMessage.message}
            </p>
            <div className="flex justify-center">
              <div className="bg-white/20 rounded-full px-6 py-3">
                <span className="text-4xl font-bold">{score}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Comparison */}
      <CommunityComparison
        userScore={score}
        communityStats={communityStats}
        category={filters.category}
        isLoading={isLoadingCommunityStats}
      />

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{correctCount}</div>
            <div className="text-sm text-slate-600">Correct</div>
          </CardContent>
        </Card>
       
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{totalQuestions - correctCount}</div>
            <div className="text-sm text-slate-600">Incorrect</div>
          </CardContent>
        </Card>
       
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-slate-600">Total Time</div>
          </CardContent>
        </Card>
       
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{timePerQuestion}s</div>
            <div className="text-sm text-slate-600">Avg per Question</div>
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const answer = selectedAnswers[index];
            const isCorrect = answer?.isCorrect || false;
           
            return (
              <div key={question.id || index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-700">
                        Q{index + 1}.
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {question.code_source}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {question.category}
                      </Badge>
                    </div>
                    <p className="text-slate-800 mb-2 line-clamp-2">
                      {question.question_text}
                    </p>
                  </div>
                 
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Incorrect</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onStartNewQuiz}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Take Another Quiz
        </Button>
       
        <Button
          variant="outline"
          onClick={onReturnToDashboard}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

