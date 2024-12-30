"use client";

import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  recommendedCourses: string[];
  createdAt: { seconds: number };
}

const FindJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        const allJobs: Job[] = [];

        // Loop through each user to get their userJobs subcollection
        for (const userDoc of usersSnapshot.docs) {
          const userJobsCollectionRef = collection(
            db,
            "jobs",
            userDoc.id,
            "userJobs"
          );
          const userJobsSnapshot = await getDocs(userJobsCollectionRef);

          // Add each user's jobs to the allJobs array
          userJobsSnapshot.docs.forEach((doc) => {
            const jobData = doc.data();
            allJobs.push({
              id: doc.id,
              jobTitle: jobData.jobTitle,
              jobDescription: jobData.jobDescription,
              skillsRequired: jobData.skillsRequired || [],
              recommendedCourses: jobData.recommendedCourses || [],
              createdAt: jobData.createdAt,
            });
          });
        }

        setJobs(allJobs);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl max-w-6xl">
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
        Find Jobs
      </h1>

      {loading && <p className="text-center text-lg text-gray-500">Loading...</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-center text-lg text-gray-500">
          No jobs found from any users.
        </p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg shadow-md p-4 bg-white transition-shadow duration-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800">{job.jobTitle}</h2>
              <p className="text-gray-600 mt-2">{job.jobDescription}</p>
              <div className="mt-2">
                <strong>Skills Required:</strong>
                <ul className="list-disc list-inside text-gray-700">
                  {job.skillsRequired?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              {job.recommendedCourses?.length > 0 && (
                <div className="mt-2">
                  <strong>Recommended Courses:</strong>
                  <ul className="list-disc list-inside text-blue-600">
                    {job.recommendedCourses.map((course, index) => (
                      <li key={index}>
                        <a href={course} target="_blank" rel="noopener noreferrer">
                          {course}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-4">
                Posted on: {new Date(job.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindJobs;
