"use client";

import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthContext } from "../components/authContext";

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skillsRequired?: string[];
  recommendedCourses?: string[];
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
}

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.uid) return;

      setLoading(true);

      try {
        const userJobsCollectionRef = collection(db, "jobs", user.uid, "userJobs");
        const querySnapshot = await getDocs(userJobsCollectionRef);

        const jobsData: Job[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Job, "id">),
        }));

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.uid]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl max-w-4xl">
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">My Report</h1>

      {loading && <p className="text-center text-lg text-gray-500">Loading...</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-center text-lg text-gray-500">No jobs posted yet.</p>
      )}

      {!loading && jobs.length > 0 && (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="p-4 border rounded-md shadow-sm hover:shadow-lg transition-shadow duration-200"
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
              {job.recommendedCourses?.length ? (
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
              ) : null}
              <p className="text-gray-500 text-sm mt-4">
                Posted on:{" "}
                {job.createdAt?.seconds
                  ? new Date(job.createdAt.seconds * 1000).toLocaleDateString()
                  : "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyJobs;