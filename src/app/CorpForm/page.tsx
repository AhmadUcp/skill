"use client";

import React, { useEffect, useState } from "react";
import analyzeSkill from "../employeeForm/gemini";
import { db } from "../components/firebase";
import { collection, doc, setDoc, addDoc} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../components/authContext";
import './sheet.css';

const JobSkillsCoursesForm: React.FC = () => {
  const router = useRouter(); // Get the router instance
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState(""); // Comma-separated skills input
  const [recommendedCourses, setRecommendedCourses] = useState(""); // Comma-separated links
  const [loading, setLoading] = useState(false);
  const [loadingauto, setLoadingauto] = useState(false);

  const { user } = useAuthContext(); // Assuming user and logout come from your AuthContext
  const [isAutoBtnEnabled, setIsAutoBtnEnabled] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle || !jobDescription || !skillsRequired) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const skillsList = skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const coursesList = recommendedCourses
        .split(",")
        .map((link) => link.trim())
        .filter((link) => link);

      const jobData = {
        jobTitle,
        jobDescription,
        skillsRequired: skillsList,
        recommendedCourses: coursesList,
        createdAt: new Date(),
      };

      // Add to Firestore
      const userId = user?.uid; // Ensure userId is defined
      if (!userId) {
        throw new Error("User ID is required to save job data.");
      }
      
      // Create a reference to the user's jobs collection
      const userJobsCollectionRef = collection(db, "jobs", userId, "userJobs");
      
      // Add the job document to the collection
      const docRef = await addDoc(userJobsCollectionRef, jobData);
      

      // Reset form
      setJobTitle("");
      setJobDescription("");
      setSkillsRequired("");
      setRecommendedCourses("");

      // Redirect or stay on the same page
      router.push("/jobs");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to upload job data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dummy JSON data for skills
  const generateSkillsFromJobDescription = async (jobTitle: string, jobDescription: string) => {
    try {
      // Prepare the input for Gemini with job title and description
      const input = `Based on job title and description, generate a list of skills required for the job:\n\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\n\nskills:`;
  
      // Send input to Gemini for analysis
      const response = await analyzeSkill(input);
  
      // Parse the response
      const result = JSON.parse(response);
      const generatedSkills = result.skills || [];
  
      console.log("Generated Skills:", generatedSkills);
  
      return generatedSkills;
    } catch (error) {
      console.error("Error generating skills from job description:", error);
      throw error;
    }
  };

  const handleAutoFillSkills = async () => {
    setLoadingauto(true); // Set loading state to true when the auto-fill is triggered
    try {
      const generatedSkills = await generateSkillsFromJobDescription(jobTitle, jobDescription);
      const skills = generatedSkills.join(", "); // Join skills in a comma-separated format
      setSkillsRequired(skills); // Set the skills in the input field
    } catch (error) {
      console.error("Error auto-filling skills:", error);
    } finally {
      setLoadingauto(false); // Set loading to false once the process is complete
    }
  };

  useEffect(() => {
    setIsAutoBtnEnabled(jobTitle.trim() !== "" && jobDescription.trim() !== "");
  }, [jobTitle, jobDescription]);

    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl max-w-4xl">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Job Skills and Courses Form</h1>
        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-700">Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job title"
              required
            />
          </div>
  
          {/* Job Description */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-700">Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter job description"
              required
            ></textarea>
          </div>
  
{/* Skills Required */}
<div className="mb-4 flex items-center">
  <div className="flex-1">
    <label className="block text-lg font-semibold mb-2 text-gray-700">Skills Required (comma-separated):</label>
    <div className="flex items-center">
      <input
        type="text"
        value={skillsRequired}
        onChange={(e) => setSkillsRequired(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., JavaScript, React, Node.js"
        required
      />
      <button
        type="button"
        onClick={handleAutoFillSkills}
        className={`ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200 ${!isAutoBtnEnabled ? "opacity-50 cursor-not-allowed" : ""} w-32`}  // Fixed width added here
        title="Ask AI to fill"
        disabled={!isAutoBtnEnabled} // Disable button when jobTitle or jobDescription is empty
      >
        {/* Show loading dots if loading state is true */}
        {loadingauto ? (
          <span className="flex justify-center "> {/* Added flex and spacing */}
            <span className="dot text-2xl">.</span> {/* Ensure fixed size for dots */}
            <span className="dot text-2xl">.</span>
            <span className="dot text-2xl">.</span> 
          </span>
        ) : (
          <span className="text-sm">Auto</span>
        )}
      </button>
    </div>
  </div>
</div>

  
          {/* Recommended Courses */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 text-gray-700">Recommended Courses (comma-separated URLs):</label>
            <input
              type="text"
              value={recommendedCourses}
              onChange={(e) => setRecommendedCourses(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., https://course1.com, https://course2.com"
            />
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default JobSkillsCoursesForm;
