import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuBrain, LuCode, LuBarChart, LuClock, LuTrendingUp } from 'react-icons/lu';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // Mock data for dashboard
  const stats = {
    totalStudyTime: 42, // hours
    flashcards: {
      total: 120,
      mastered: 43,
      needsReview: 18,
    },
    shadowCoding: {
      total: 15,
      completed: 8,
      needsReview: 3,
    }
  };

  const recentActivity = [
    { id: 1, type: 'flashcard', name: 'JavaScript Syntax', date: '2 hours ago', success: true },
    { id: 2, type: 'shadowCoding', name: 'React Hook Implementation', date: '1 day ago', success: false },
    { id: 3, type: 'flashcard', name: 'CSS Flexbox', date: '3 days ago', success: true },
  ];

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Dashboard</h1>

        <div className="grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="p-3 sm:p-6 sm:pb-2 pb-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <LuClock className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground mr-1 sm:mr-2" />
                <div className="text-lg sm:text-2xl font-bold">{stats.totalStudyTime} hrs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 sm:p-6 sm:pb-2 pb-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <LuBrain className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground mr-1 sm:mr-2" />
                <div className="text-lg sm:text-2xl font-bold">{stats.flashcards.mastered} / {stats.flashcards.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 sm:p-6 sm:pb-2 pb-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Coding
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <LuCode className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground mr-1 sm:mr-2" />
                <div className="text-lg sm:text-2xl font-bold">{stats.shadowCoding.completed} / {stats.shadowCoding.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 sm:p-6 sm:pb-2 pb-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Retention Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex items-center">
                <LuTrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground mr-1 sm:mr-2" />
                <div className="text-lg sm:text-2xl font-bold">78%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-xl">Learning Progress</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your retention rate over time</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="h-60 sm:h-80 w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Progress Chart Visualization</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-xl">Review Today</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Items scheduled for review</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LuBrain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" />
                    <span className="text-sm sm:text-base">Flashcards</span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stats.flashcards.needsReview} items</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LuCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" />
                    <span className="text-sm sm:text-base">Shadow Coding</span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stats.shadowCoding.needsReview} items</span>
                </div>
                <div className="pt-2 sm:pt-4">
                  <Link href="/flashcards">
                    <Button className="w-full text-xs sm:text-sm py-1 sm:py-2 h-8 sm:h-10">Start Review Session</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3 sm:pb-4">
                  <div className="flex items-center">
                    {activity.type === 'flashcard' ? (
                      <LuBrain className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-primary" />
                    ) : (
                      <LuCode className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-primary" />
                    )}
                    <div>
                      <div className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{activity.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                  <div className={`text-xs sm:text-sm ${activity.success ? 'text-green-500' : 'text-red-500'}`}>
                    {activity.success ? 'Success' : 'Needs Practice'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}