'use client';

import { useState } from 'react';
import { Navbar } from "@/components/ui/navbar";
import { ClientOnlyChart } from "@/components/stats/ClientOnlyChart";
import { ClientOnlyRadarChart } from "@/components/stats/ClientOnlyRadarChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuChartBar, LuClock, LuCalendarDays, LuTrendingUp, LuBrain, LuCode } from 'react-icons/lu';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Mock data for charts and statistics
  const mockStudyTime = {
    total: 42, // hours
    week: 8.5,
    month: 32,
    year: 156,
  };
  
  const mockRetention = {
    current: 78, // percentage
    change: 12, // percentage points increase
  };
  
  const mockStatsFlashcards = {
    total: 120,
    learned: 92,
    mastered: 43,
    struggling: 18,
  };
  
  const mockStatsShadowCoding = {
    total: 15,
    completed: 8,
    mastered: 3,
    needsPractice: 4,
  };
  
  // Chart data
  const timeChartData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [1.2, 0.8, 1.5, 2.0, 1.3, 0.9, 0.8],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [5.2, 8.7, 10.3, 7.8],
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [12, 14, 10, 15, 18, 12, 8, 9, 11, 13, 16, 18],
    },
  };
  
  const retentionChartData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [65, 68, 70, 72, 75, 76, 78],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [60, 65, 72, 78],
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [40, 45, 50, 53, 58, 62, 65, 68, 70, 73, 75, 78],
    },
  };
  
  const categoryData = {
    labels: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
    data: [85, 68, 92, 88, 72],
  };
  
  const skillRadarData = {
    labels: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Node.js', 'Testing', 'API Design', 'Database'],
    data: [85, 68, 72, 92, 65, 58, 75, 63],
  };
  
  return (
    <>
      <Navbar />
      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              className="rounded-none"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              className="rounded-none"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'default' : 'ghost'}
              className="rounded-none"
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LuClock className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">
                    {timeRange === 'week' ? mockStudyTime.week : 
                     timeRange === 'month' ? mockStudyTime.month : 
                     mockStudyTime.year} hrs
                  </div>
                </div>
                <span className="text-sm text-green-500">+2.5 hrs</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Retention Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LuTrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{mockRetention.current}%</div>
                </div>
                <span className="text-sm text-green-500">+{mockRetention.change}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Flashcards Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LuBrain className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{mockStatsFlashcards.mastered}</div>
                </div>
                <span className="text-sm text-muted-foreground">of {mockStatsFlashcards.total}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shadow Coding Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LuCode className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{mockStatsShadowCoding.mastered}</div>
                </div>
                <span className="text-sm text-muted-foreground">of {mockStatsShadowCoding.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Time Spent</CardTitle>
              <CardDescription>Hours dedicated to learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ClientOnlyChart 
                  type="bar"
                  labels={timeChartData[timeRange].labels}
                  datasets={[
                    {
                      label: 'Hours',
                      data: timeChartData[timeRange].data,
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    }
                  ]}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Retention rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ClientOnlyChart 
                  type="line"
                  labels={retentionChartData[timeRange].labels}
                  datasets={[
                    {
                      label: 'Retention Rate (%)',
                      data: retentionChartData[timeRange].data,
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    }
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="flashcards" className="mb-8">
          <TabsList>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="shadow-coding">Shadow Coding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flashcards" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Flashcard Performance</CardTitle>
                <CardDescription>Category breakdown and mastery level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-60 w-full">
                    <ClientOnlyChart 
                      type="bar"
                      labels={categoryData.labels}
                      datasets={[
                        {
                          label: 'Mastery (%)',
                          data: categoryData.data,
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.5)',
                            'rgba(16, 185, 129, 0.5)',
                            'rgba(239, 68, 68, 0.5)',
                            'rgba(249, 115, 22, 0.5)',
                            'rgba(124, 58, 237, 0.5)',
                          ],
                        }
                      ]}
                      height={240}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Categories</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>JavaScript</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">85%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>React</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">68%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '68%' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>CSS</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">92%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Mastery Levels</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{mockStatsFlashcards.mastered}</div>
                          <div className="text-xs text-muted-foreground">Mastered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {mockStatsFlashcards.learned - mockStatsFlashcards.mastered}
                          </div>
                          <div className="text-xs text-muted-foreground">Learning</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{mockStatsFlashcards.struggling}</div>
                          <div className="text-xs text-muted-foreground">Struggling</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shadow-coding" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shadow Coding Performance</CardTitle>
                <CardDescription>Progress and difficulty analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-60 w-full">
                    <ClientOnlyChart 
                      type="bar"
                      labels={['JavaScript', 'TypeScript', 'Python']}
                      datasets={[
                        {
                          label: 'Completion Rate (%)',
                          data: [70, 45, 55],
                          backgroundColor: 'rgba(124, 58, 237, 0.5)',
                        }
                      ]}
                      height={240}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Languages</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>JavaScript</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">70%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>TypeScript</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">45%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Python</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">55%</span>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '55%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Completion Status</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{mockStatsShadowCoding.mastered}</div>
                          <div className="text-xs text-muted-foreground">Mastered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {mockStatsShadowCoding.completed - mockStatsShadowCoding.mastered}
                          </div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{mockStatsShadowCoding.needsPractice}</div>
                          <div className="text-xs text-muted-foreground">Needs Practice</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Your proficiency levels across different skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ClientOnlyRadarChart 
                labels={skillRadarData.labels}
                data={skillRadarData.data}
                label="Skill Mastery (%)"
                backgroundColor="rgba(79, 70, 229, 0.2)"
                borderColor="rgba(79, 70, 229, 1)"
                height={360}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Learning Schedule</CardTitle>
            <CardDescription>Upcoming review sessions based on spaced repetition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <LuCalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Today</div>
                    <div className="text-sm text-muted-foreground">18 flashcards, 2 coding exercises</div>
                  </div>
                </div>
                <Button size="sm">Start</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <LuCalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Tomorrow</div>
                    <div className="text-sm text-muted-foreground">12 flashcards, 1 coding exercise</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Upcoming
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <LuCalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">In 3 days</div>
                    <div className="text-sm text-muted-foreground">24 flashcards, 3 coding exercises</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Upcoming
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}