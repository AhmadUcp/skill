"use client";

import { useEffect, useState } from "react";
import coursesData from './scrapedCourses.json';
type Course = {
  title: string;
  university: string;
  skills: string[];
  learn_more_link: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = () => {
      if (courses.length > 0) {
        setLoading(false);
        return;
      }

      try {
        setCourses(coursesData.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [courses]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-xl text-gray-700 font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="flex h-screen">
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-xl text-gray-700 font-semibold">No courses available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-full h-full overflow-y-auto bg-gray-100">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Available Courses by SkillMap</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-lg p-4 bg-white"
              >
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{course.university}</p>
                <h3 className="font-semibold text-sm mt-2">Skills:</h3>
                <ul className="list-disc ml-5 text-sm text-gray-700">
                  {course.skills.slice(0, 4).map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
                <a
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  href={course.learn_more_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enroll Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
