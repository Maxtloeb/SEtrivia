

import React, { useState, useEffect } from "react";
import { Question } from "@/entities/Question";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Play, Settings } from "lucide-react";
import { uniq } from "lodash";


// MainCategory values from column K - updated to match actual spreadsheet case
const mainCategories = [
  "Concrete",
  "Steel",
  "Wood",
  "Masonry",
  "Seismic",
  "Wind",
  "Foundations",
  "Loads",
  "General",
  "Structural Analysis",
  "Design",
  "Codes",
  "Materials"
];


export default function QuizFilters({ filters, onFiltersChange, onStartQuiz }) {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);


  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Fetch actual categories from database
        const allQuestions = await Question.list(null, 5000);
        const dbCategories = uniq(allQuestions.map(q => q.category).filter(Boolean));
       
        // Use database categories if available, otherwise fall back to main categories
        const finalCategories = dbCategories.length > 0 ? dbCategories.sort() : mainCategories.sort();
        setCategories(finalCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        // Fallback to main categories only
        setCategories(mainCategories);
      }
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, []);


  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };


  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Start a Quiz</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Customize your practice session by selecting specific codes, categories, and difficulty levels
        </p>
      </div>


      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quiz Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First row: Code Source OR Category */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label>Code Source</Label>
              <Select
                value={filters.code_source}
                onValueChange={(value) => handleFilterChange("code_source", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Codes</SelectItem>
                  <SelectItem value="ACI">ACI (Concrete)</SelectItem>
                  <SelectItem value="AISC">AISC (Steel)</SelectItem>
                  <SelectItem value="IBC">IBC (Building)</SelectItem>
                  <SelectItem value="ASCE">ASCE (Loads)</SelectItem>
                  <SelectItem value="NDS">NDS (Wood)</SelectItem>
                  <SelectItem value="TMS">TMS (Masonry)</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="flex items-center justify-center text-slate-500 font-semibold text-3xl pb-2 px-4">
              or
            </div>


            <div className="flex-1 space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
                disabled={isLoadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Second row: Difficulty and Number of Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) => handleFilterChange("difficulty", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="impossible">Impossible</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Select
                value={filters.question_count.toString()}
                onValueChange={(value) => handleFilterChange("question_count", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                  <SelectItem value="30">30 Questions</SelectItem>
                  <SelectItem value="50">50 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          <div className="pt-6 border-t">
            <div className="flex justify-center">
              <Button
                onClick={onStartQuiz}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



