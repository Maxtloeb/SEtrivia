import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Image as ImageIcon, CheckCircle, XCircle, Flag } from "lucide-react";


export default function QuestionDisplay({ question, selectedAnswer, showAnswer, onAnswerSelect, onFlagQuestion, isFlagged }) {
  if (!question) return null;


  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {question.code_source}
            </Badge>
            {/* Changed from question.material_type to question.category */}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {question.category}
            </Badge>
            <Badge variant="outline" className={
              question.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
              question.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              question.difficulty === 'hard' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-purple-50 text-purple-700 border-purple-200'
            }>
              {question.difficulty}
            </Badge>
          </div>
         
          <div className="flex items-center gap-4">
            {question.code_reference && (
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <BookOpen className="w-4 h-4" />
                <span>{question.code_reference}</span>
              </div>
            )}
            {onFlagQuestion && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFlagQuestion}
                className={`flex items-center gap-1.5 text-sm ${isFlagged ? 'text-red-600 hover:text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} />
                {isFlagged ? 'Flagged' : 'Flag'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>


      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-slate-900 leading-relaxed">
            {question.question_text}
          </h3>
        </div>


        {/* Question Image */}
        {question.image_url && (
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
              <ImageIcon className="w-4 h-4" />
              <span>Reference Diagram</span>
            </div>
            <img
              src={question.image_url}
              alt="Question diagram"
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}


        {/* Answer Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-800">Select your answer:</h4>
          <div className="grid gap-3">
            {question.options?.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = option.is_correct;
              const showCorrect = showAnswer && isCorrect;
              const showIncorrect = showAnswer && isSelected && !isCorrect;
             
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start text-left h-auto p-4 transition-all duration-200 ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 hover:bg-green-50'
                      : showIncorrect
                        ? 'border-red-500 bg-red-50 hover:bg-red-50'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50 hover:bg-blue-50'
                          : 'hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => onAnswerSelect(index)}
                  disabled={showAnswer}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-3">
                      <span className="font-medium text-slate-600 mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-slate-800">{option.text}</span>
                    </div>
                   
                    {showAnswer && (
                      <div className="flex-shrink-0 ml-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>


        {/* Explanation */}
        {showAnswer && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
            <p className="text-blue-800 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



