import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { LuBrain, LuCode, LuChartBar, LuClock } from 'react-icons/lu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      icon: LuBrain,
      title: "Smart Flashcards",
      description: "Utilize spaced repetition algorithms to optimize your memory retention with intelligent flashcards.",
    },
    {
      icon: LuCode,
      title: "Shadow Coding",
      description: "Practice coding from memory to strengthen your programming skills through active recall.",
    },
    {
      icon: LuClock,
      title: "Time & ROI Tracking",
      description: "Monitor your learning efficiency with detailed time tracking and return on investment metrics.",
    },
    {
      icon: LuChartBar,
      title: "Performance Analytics",
      description: "Visualize your progress and identify areas for improvement with comprehensive analytics.",
    },
  ];

  return (
    <>
      <Navbar />
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Optimize Your Learning with AppNext
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Maximize knowledge retention and track your progress with our scientifically-backed learning platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform combines cutting-edge learning techniques to help you learn more efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex flex-col space-y-4 md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Based on Scientific Learning Principles
              </h2>
              <p className="text-muted-foreground">
                Our platform leverages the Ebbinghaus forgetting curve and spaced repetition techniques
                to ensure optimal retention of information. By precisely timing when you review material,
                we help you learn more with less effort.
              </p>
              <div>
                <Link href="/dashboard">
                  <Button>Start Learning Now</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-muted p-8 rounded-lg">
              <div className="h-64 w-full bg-primary/10 rounded-md flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  [Learning Retention Curve Visualization]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
