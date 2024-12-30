"use client";

import Head from "next/head";
import { ArrowRight, Award, Brain, Building, ChartArea, ChartBar, CheckCircle, Lightbulb, Mail, Navigation, Phone, Shield, Target, User, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ChatSession } from "@google/generative-ai";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface FeatureItemProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isReversed?: boolean;
}

// Feature Card Component
const FeatureItem: React.FC<FeatureItemProps> = ({  
  title, 
  description, 
  icon,
}) => {
  return (
      <div className="flex-1">
        <div className="mb-4 p-3 bg-blue-100 rounded-full w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
  );
};

interface ProcessItemProps {
  title: string;
  description: string;
  imageSrc: string;
  isReversed?: boolean;
}

// Define and export the ProcessItem component
export const ProcessItem: React.FC<ProcessItemProps> = ({
  title,
  description,
  imageSrc,
  isReversed = false,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
        isReversed ? 'md:flex-row-reverse' : ''
      } mb-20`}
    >
      {/* Text Section */}
      <div className={`${isReversed ? 'md:order-2' : ''}`}>
        <h3 className="text-2xl font-bold text-blue-700 mb-4">{title}</h3>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Image Section */}
      <div className={`${isReversed ? 'md:order-1' : ''}`}>
        <img
          src={imageSrc}
          alt={title}
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>
  );
};

export default function Home() {
  const benefits = [
    {
      icon: <Target className="h-8 w-8 text-blue-700" />,
      title: "Close Skill Gaps Faster",
      description:
        "AI-powered analysis identifies skill gaps 30% faster than traditional methods.",
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-700" />,
      title: "Enhanced Learning",
      description: "Tailored learning programs boost employee satisfaction by 40%.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      title: "Team Growth",
      description: "35% increase in team productivity with guided pathways.",
    },
    {
      icon: <Award className="h-8 w-8 text-blue-700" />,
      title: "Career Development",
      description: "60% more likely to pursue internal promotions.",
    },
  ];

  const values = [
    { title: "For Corporations", content: "Enhance workforce readiness." },
    { title: "For Employees", content: "Boost career satisfaction." },
  ];

  const steps = [
    { title: "Step 1", content: "Analyze skill gaps." },
    { title: "Step 2", content: "Design tailored pathways." },
    { title: "Step 3", content: "Implement programs." },
    { title: "Step 4", content: "Track and improve." },
  ];

  const contactFields = [
    { type: "text", placeholder: "Name" },
    { type: "email", placeholder: "Email" },
    { type: "text", placeholder: "Company Name" },
  ];

  return (
    <>
      <Head>
      <Link href="/" className="flex items-center space-x-2">
        <Navigation className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">SkillMap Navigator</span>
      </Link>

        <meta name="description" content="Empowering Workforce Development" />
      </Head>
      <main className="bg-gray-50 text-gray-800">
        {/* Header Section */}
        <header className="bg-blue-700 text-white py-6 px-8">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold">
              SkillMap Navigator: Transforming Workforce Development
            </h1>
            <h2 className="text-lg mt-2">
              Align employee skills with corporate goals and empower career growth.
            </h2>
            <button className="bg-white text-blue-700 mt-4 px-6 py-2 rounded">
              Learn More – Contact Us
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="relative h-[600px] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">
                Transforming Workforce Development
              </h1>
              <p className="text-xl mb-8">
                Align employee skills with corporate goals and empower career growth through AI-powered pathways.
              </p>
              <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Benefits of SkillMap Navigator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </section>

          {/* Corporate and Employee Sections Side by Side */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
                Why Choose Us?
              </h2>
              <div className="flex flex-wrap gap-16 justify-center">
                {/* Corporate Card */}
                <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white shadow-lg rounded-lg">
                  <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Corporate</h2>
                  <div className="space-y-10">
                    <FeatureItem
                        icon={<Building className="h-6 w-6 text-blue-700" />}
                        title="Align Corporate Learning"
                        description="Customize and align corporate learning programs with strategic organizational goals, ensuring measurable outcomes." number={""}                    
                    />
                    <FeatureItem
                        icon={<ChartBar className="h-6 w-6 text-blue-700" />}
                        title="Gain Actionable Insights"
                        description="Leverage analytics to identify skill gaps, workforce readiness, and areas of opportunity for development." number={""}
                    />
                    <FeatureItem
                          icon={<Users className="h-6 w-6 text-blue-700" />}
                          title="Enhance Employee Engagement"
                          description="Foster a culture of continuous learning by supporting employees’ career aspirations and aligning their growth with business success." number={""}                  
                    />
                  </div>
                </div>

                {/* Employee Card */}
                <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white shadow-lg rounded-lg">
                  <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Employee</h2>
                  <div className="space-y-10">
                    <FeatureItem
                    icon={<User className="h-6 w-6 text-blue-700" />}
                    title="Personalized Career Pathways"
                    description="Explore personalized learning pathways designed to unlock career opportunities and provide clear direction." number={""}                    />
                    <FeatureItem
                    icon={<Lightbulb className="h-6 w-6 text-blue-700" />}
                    title="Skill Development Opportunities"
                    description="Access tailored resources and tools to acquire in-demand skills aligned with your goals and interests." number={""}                    />
                    <FeatureItem
                    icon={<ChartArea className="h-6 w-6 text-blue-700" />}
                    title="Track Progress and Milestones"
                    description="Stay motivated with real-time tracking of your learning journey, achievements, and progress milestones." number={""}                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

            {/* How it Works Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
                  How it Works
                </h2>

                {/* Corporation Section */}
                <div className="mb-20">
                  <h3 className="text-3xl font-semibold text-blue-700 mb-12 text-center">
                    For Corporations
                  </h3>
                  <ProcessItem
                    title="Provide Necessary Documents"
                    description="Upload documents such as job descriptions, job postings, and training catalogs through a secure link. SkillMap Navigator combines this data with proprietary resources for AI-driven analysis"
                    imageSrc="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
                  />
                  <ProcessItem
                    title="Skills Mapping Report"
                    description="AI generates a report mapping critical skills for current and future roles, identifying gaps and areas for improvement with actionable insights."
                    imageSrc="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80"
                    isReversed
                  />
                  <ProcessItem
                    title="Workforce Insights"
                    description="Generate detailed reports and recommendations for updates to corporate training catalogs, ensuring workforce readiness and alignment with business goals."
                    imageSrc="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80"
                  />
                  <ProcessItem
                    title="Customizable Learning Pathways"
                    description="Tailor learning pathways for specific roles using insights from the Skills Mapping Report. Align training content with critical skills and future requirements."
                    imageSrc="https://images.unsplash.com/photo-1573495612937-01aa3301374e?auto=format&fit=crop&q=80"
                    isReversed
                  />
                </div>

                {/* Employee Section */}
                <div>
                  <h3 className="text-3xl font-semibold text-blue-700 mb-12 text-center">
                    For Employees
                  </h3>
                  <ProcessItem
                    title="Upload and Verify Skills"
                    description="Upload a CV or manually input current skills. Approve or modify the AI-generated skill profile to ensure accuracy."
                    imageSrc="https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&q=80"
                  />
                  <ProcessItem
                    title="Specify Career Goals"
                    description="Select a desired career path or role and receive a clear skill gap analysis for your chosen path."
                    imageSrc="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80"
                    isReversed
                  />
                  <ProcessItem
                    title="Skill Gap Mapping"
                    description="Identify missing skills and access personalized recommendations to close gaps using your organization’s training catalog."
                    imageSrc="https://images.unsplash.com/photo-1531538625531-c59e0052a2a5?auto=format&fit=crop&q=80"
                  />
                  <ProcessItem
                    title="Learning Pathways and Progress Tracking"
                    description="Follow tailored learning pathways with step-by-step guidance and track your progress confidently."
                    imageSrc="https://images.unsplash.com/photo-1564866657315-535206189b82?auto=format&fit=crop&q=80"
                    isReversed
                  />
                </div>
              </div>
            </section>


          <footer className="bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-400">Contact & Support</Link></li>
                  <li><Link href="/careers" className="hover:text-blue-400">Careers</Link></li>
                  <li><Link href="/press" className="hover:text-blue-400">Press</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/help" className="hover:text-blue-400">Help Center</Link></li>
                  <li><Link href="/blog" className="hover:text-blue-400">Blog</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-400">Terms & Conditions</Link></li>
                  <li><Link href="/accessibility" className="hover:text-blue-400">Accessibility</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/custom" className="hover:text-blue-400">Custom Services</Link></li>
                  <li><Link href="/why-us" className="hover:text-blue-400">Why SkillMap Navigator</Link></li>
                  <li><Link href="/security" className="hover:text-blue-400">Data Security</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Subscribe to us</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name"
                     className="w-full px-4 py-2 bg-white-500 border border-white-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-white-600  border border-white-500 text-white rounded-md hover:bg-blue-500 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} SkillMap Navigator. All rights reserved.</p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>contact@skillmap.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
