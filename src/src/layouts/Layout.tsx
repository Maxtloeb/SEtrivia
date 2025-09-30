

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { QuizSession } from "@/entities/QuizSession"; // Import QuizSession
import {
  Home as HomeIcon,
  BookOpen,
  TrendingUp,
  Settings,
  GraduationCap,
  Upload,
  Inbox,
  Shield // Import Shield icon for Admin
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Home"),
    icon: HomeIcon,
  },
  {
    title: "Start Quiz",
    url: createPageUrl("Quiz"),
    icon: BookOpen,
  },
  {
    title: "Performance",
    url: createPageUrl("Performance"),
    icon: TrendingUp,
  },
  {
    title: "Submit Question",
    url: createPageUrl("SubmitQuestion"),
    icon: Upload,
  },
  {
    title: "Admin",
    url: createPageUrl("Admin"),
    icon: Shield,
  },
];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState({
    averageScore: "--",
    questionsMastered: 0,
    studyStreak: 0
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser) {
          if (currentUser.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false); // Ensure isAdmin is false if user is not admin
          }
         
          // Fetch user's quiz sessions for stats
          const sessions = await QuizSession.filter({ created_by: currentUser.email });
          if (sessions.length > 0) {
            const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
            const averageScore = Math.round(totalScore / sessions.length);
            const questionsMastered = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
           
            setUserStats({
              averageScore,
              questionsMastered,
              studyStreak: sessions.length
            });
          } else {
            setUserStats({ // Reset or set default if no sessions
              averageScore: "--",
              questionsMastered: 0,
              studyStreak: 0
            });
          }
        } else {
          setIsAdmin(false); // User not logged in
          setUserStats({ // Reset or set default if not logged in
            averageScore: "--",
            questionsMastered: 0,
            studyStreak: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsAdmin(false);
        setUserStats({ // Reset or set default on error
          averageScore: "--",
          questionsMastered: 0,
          studyStreak: 0
        });
      }
    };
    fetchUserData();
  }, []);


  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-blue: #1e40af;
          --secondary-blue: #3b82f6;
          --slate-gray: #475569;
          --light-gray: #f8fafc;
          --accent-blue: #dbeafe;
        }
       
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
      `}</style>
     
      <div classNam
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { QuizSession } from "@/entities/QuizSession"; // Import QuizSession
import {
  Home as HomeIcon,
  BookOpen,
  TrendingUp,
  Settings,
  GraduationCap,
  Upload,
  Inbox,
  Shield // Import Shield icon for Admin
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Home"),
    icon: HomeIcon,
  },
  {
    title: "Start Quiz",
    url: createPageUrl("Quiz"),
    icon: BookOpen,
  },
  {
    title: "Performance",
    url: createPageUrl("Performance"),
    icon: TrendingUp,
  },
  {
    title: "Submit Question",
    url: createPageUrl("SubmitQuestion"),
    icon: Upload,
  },
  {
    title: "Admin",
    url: createPageUrl("Admin"),
    icon: Shield,
  },
];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState({
    averageScore: "--",
    questionsMastered: 0,
    studyStreak: 0
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser) {
          if (currentUser.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false); // Ensure isAdmin is false if user is not admin
          }
         
          // Fetch user's quiz sessions for stats
          const sessions = await QuizSession.filter({ created_by: currentUser.email });
          if (sessions.length > 0) {
            const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
            const averageScore = Math.round(totalScore / sessions.length);
            const questionsMastered = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
           
            setUserStats({
              averageScore,
              questionsMastered,
              studyStreak: sessions.length
            });
          } else {
            setUserStats({ // Reset or set default if no sessions
              averageScore: "--",
              questionsMastered: 0,
              studyStreak: 0
            });
          }
        } else {
          setIsAdmin(false); // User not logged in
          setUserStats({ // Reset or set default if not logged in
            averageScore: "--",
            questionsMastered: 0,
            studyStreak: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsAdmin(false);
        setUserStats({ // Reset or set default on error
          averageScore: "--",
          questionsMastered: 0,
          studyStreak: 0
        });
      }
    };
    fetchUserData();
  }, []);


  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-blue: #1e40af;
          --secondary-blue: #3b82f6;
          --slate-gray: #475569;
          --light-gray: #f8fafc;
          --accent-blue: #dbeafe;
        }
       
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
      `}</style>
     
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-800 rounded-xl font-black text-yellow-400 text-2xl relative overflow-hidden">
                {/* Vertical Line */}
                <div className="absolute h-full w-px bg-yellow-400/30 top-0 left-1/2 -translate-x-1/2"></div>
               
                {/* S and E */}
                <div className="relative w-full h-full flex items-center justify-center gap-0.5">
                    <span>S</span>
                    <span>E</span>
                </div>
           
                {/* Truss */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-2">
                    <svg viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400/60">
                        <path d="M0 7L4 1L8 7L12 1L16 7L20 1L24 7" />
                        <path d="M0 7L24 7" />
                    </svg>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">StructurEd</h2>
                <p className="text-xs text-slate-500 font-medium">PE/SE Exam Prep</p>
              </div>
            </div>
          </SidebarHeader>
         
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Study Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    if (item.title === 'Admin' && !isAdmin) {
                      return null;
                    }
                   
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-slate-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>


            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Questions Mastered</span>
                    <span className="font-bold text-blue-600">{userStats.questionsMastered}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Study Streak</span>
                    <span className="font-bold text-green-600">{userStats.studyStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Average Score</span>
                    <span className="font-bold text-slate-700">{userStats.averageScore}{userStats.averageScore !== "--" ? "%" : ""}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>


          <SidebarFooter className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-blue-800 rounded-lg font-black text-yellow-400 text-xl relative overflow-hidden">
                {/* Vertical Line */}
                <div className="absolute h-full w-px bg-yellow-400/30 top-0 left-1/2 -translate-x-1/2"></div>
               
                {/* S and E */}
                <div className="relative w-full h-full flex items-center justify-center gap-0">
                    <span>S</span>
                    <span>E</span>
                </div>
           
                {/* Truss */}
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-2">
                    <svg viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400/60">
                        <path d="M0 7L4 1L8 7L12 1L16 7L20 1L24 7" />
                        <path d="M0 7L24 7" />
                    </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">Engineer</p>
                <p className="text-xs text-slate-500 truncate">Ready to ace the PE/SE?</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>


        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">StructurEd</h1>
            </div>
          </header>


          <div className="flex-1 overflow-auto bg-slate-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}


e="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-800 rounded-xl font-black text-yellow-400 text-2xl relative overflow-hidden">
                {/* Vertical Line */}
                <div className="absolute h-full w-px bg-yellow-400/30 top-0 left-1/2 -translate-x-1/2"></div>
               
                {/* S and E */}
                <div className="relative w-full h-full flex items-center justify-center gap-0.5">
                    <span>S</span>
                    <span>E</span>
                </div>
           
                {/* Truss */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-2">
                    <svg viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400/60">
                        <path d="M0 7L4 1L8 7L12 1L16 7L20 1L24 7" />
                        <path d="M0 7L24 7" />
                    </svg>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">StructurEd</h2>
                <p className="text-xs text-slate-500 font-medium">PE/SE Exam Prep</p>
              </div>
            </div>
          </SidebarHeader>
         
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Study Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    if (item.title === 'Admin' && !isAdmin) {
                      return null;
                    }
                   
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-slate-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>


            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Questions Mastered</span>
                    <span className="font-bold text-blue-600">{userStats.questionsMastered}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Study Streak</span>
                    <span className="font-bold text-green-600">{userStats.studyStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Average Score</span>
                    <span className="font-bold text-slate-700">{userStats.averageScore}{userStats.averageScore !== "--" ? "%" : ""}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>


          <SidebarFooter className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-blue-800 rounded-lg font-black text-yellow-400 text-xl relative overflow-hidden">
                {/* Vertical Line */}
                <div className="absolute h-full w-px bg-yellow-400/30 top-0 left-1/2 -translate-x-1/2"></div>
               
                {/* S and E */}
                <div className="relative w-full h-full flex items-center justify-center gap-0">
                    <span>S</span>
                    <span>E</span>
                </div>
           
                {/* Truss */}
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-2">
                    <svg viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400/60">
                        <path d="M0 7L4 1L8 7L12 1L16 7L20 1L24 7" />
                        <path d="M0 7L24 7" />
                    </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">Engineer</p>
                <p className="text-xs text-slate-500 truncate">Ready to ace the PE/SE?</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>


        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">StructurEd</h1>
            </div>
          </header>


          <div className="flex-1 overflow-auto bg-slate-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}



