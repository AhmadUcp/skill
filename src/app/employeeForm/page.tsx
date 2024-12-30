"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";
import analyzeSkill from "./gemini"; // Adjust the import path based on your file structure.
import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Type definition for the response from analyzeSkill function
interface SkillAnalysisResponse {
  cvSkills: string[];
  descriptionSkills: string[];
}

// Utility function to extract text from PDF
const extractTextFromPDF = (pdfFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
        let textContent = "";
        const numPages = pdfDocument.numPages;
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          textContent += pageText + "\n";
        }
        resolve(textContent);
      } catch (error) {
        reject(error);
      }
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(pdfFile);
  });
};

// Utility function to calculate skill gap
const calculateSkillGap = (cvSkills: string[], jobSkills: string[]) => {
  const cvSet = new Set(cvSkills);
  const jobSet = new Set(jobSkills);

  const missingSkills = jobSkills.filter((skill) => !cvSet.has(skill));
  const overlappingSkills = cvSkills.filter((skill) => jobSet.has(skill));

  return { missingSkills, overlappingSkills };
};

const SkillGapAnalyzer: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>(""); 
  const [cvSkills, setCvSkills] = useState<string[]>([]);
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [skillGapData, setSkillGapData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAnalysisCard, setShowAnalysisCard] = useState<boolean>(false);
  const [showJobSearchCard, setShowJobSearchCard] = useState<boolean>(false);
  const [matchingJobs, setMatchingJobs] = useState<any[]>([]); // Array to store matching jobs
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);

  // Handle file change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setPdfFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  }, []);

  const extractSkillsFromPDF = async (pdfFile:File) => {
    try {
      // Extract text from the uploaded PDF
      const parsedText = await extractTextFromPDF(pdfFile);
  
      // Prepare input for Gemini
      const input = `Extract skills from the following CV (PDF content) and return cvSkills having cv skills:\n${parsedText}`;
  
      // Send input to gemini.js
      const response = await analyzeSkill(input);
  
      // Parse the response
      const result = JSON.parse(response);
      const extractedSkills = result.cvSkills || [];
  
      console.log("Extracted Skills:", extractedSkills);
  
      return extractedSkills;
    } catch (error) {
      console.error("Error extracting skills from PDF:", error);
      throw error;
    }
  };
  // Analyze CV and job description skills
  const analyzeSkills = useCallback(async () => {
    if (!pdfFile || !jobDescription) {
      alert("Please upload a PDF and enter a job description.");
      return;
    }

    try {
      setLoading(true);

      // Extract text from the uploaded PDF
      const parsedText = await extractTextFromPDF(pdfFile);

      const input = `
        Extract skills from the following CV (PDF content): 
        ${parsedText}

        And the following job description:
        ${jobDescription}

        you should give both separately one with cvSkills and other with descriptionSkills and all skills should be lower case
      `;

      // Send input to gemini.js 
      const response = await analyzeSkill(input);
      const result: SkillAnalysisResponse = JSON.parse(response);

      // Extract the skills from the response
      const extractedCvSkills = result.cvSkills || [];
      const extractedJobSkills = result?.descriptionSkills || [];

      setCvSkills(extractedCvSkills);
      setJobSkills(extractedJobSkills);

      const skillGap = calculateSkillGap(extractedCvSkills, extractedJobSkills);
      setSkillGapData(skillGap);
    } catch (error) {
      console.error("Error analyzing skills:", error);
      alert("Failed to analyze skills.");
    } finally {
      setLoading(false);
    }
  }, [pdfFile, jobDescription]);

  // Render the bar graph
  const renderGraph = () => {
    if (!skillGapData) return null;

    const labels = ["Missing Skills", "Overlapping Skills"];
    const data = {
      labels,
      datasets: [
        {
          label: "Skills",
          data: [
            skillGapData.missingSkills.length,
            skillGapData.overlappingSkills.length,
          ],
          backgroundColor: ["#ff6384", "#36a2eb"],
        },
      ],
    };

    return <Bar data={data}/>;
  };

  const searchJobs = async (cvSkills: string[], threshold: number = 3) => {
    setLoadingJobs(true);
    try {
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
  
      const allJobs: any[] = [];
  
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
  
      // Filter jobs based on matching skill count
      const matchingJobs = allJobs.filter((job) => {
        const normalizedCvSkills = cvSkills.map((skill) =>
          skill.toLowerCase().trim()
        );
        const normalizedJobSkills = job.skillsRequired.map((skill: string) =>
          skill.toLowerCase().trim()
        );
  
        // Find the matching skills
        const matchedSkills = normalizedJobSkills.filter((skill:string) =>
          normalizedCvSkills.includes(skill)
        );
        console.log("Cv: ",cvSkills);
        console.log(allJobs);


        // Always show jobs if the threshold is 0
        return threshold === 0 || matchedSkills.length >= threshold;
      });
  
      setMatchingJobs(matchingJobs);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setLoadingJobs(false);
    }
  };
    
  // Handle job search button click
  const handleJobSearch = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF file first.");
      return;
    }
  
    setLoadingJobs(true);
    try {
      // Extract CV skills from the uploaded PDF
      const cvSkillss = await extractSkillsFromPDF(pdfFile);
  
      // Perform job search
      await searchJobs(cvSkillss, 1); // Show jobs with at least 1 matching skill
      setShowJobSearchCard(true);
    } catch (error) {
      console.error("Error during job search:", error);
      alert("Failed to search for jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };
  
  
  // Reset form
  const resetForm = () => {
    setPdfFile(null);
    setJobDescription("");
    setSkillGapData(null);
    setCvSkills([]);
    setJobSkills([]);
    setShowAnalysisCard(false);
    setShowJobSearchCard(false);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl max-w-4xl">
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Skill Gap Analyzer</h1>

      {/* CV Upload */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2 text-gray-700">Upload CV (PDF):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Buttons for options */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          onClick={() => setShowAnalysisCard(true)}
        >
          Analyze Skills
        </button>

        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
          onClick={handleJobSearch}
        >
          Job Search Based on CV
        </button>
      </div>

      {/* Show skill analysis card */}
      {showAnalysisCard && (
        <div className="card bg-white p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Job Description</h2>
          <textarea
            className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter the job description here..."
          ></textarea>

          <div className="mt-4 flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
              onClick={analyzeSkills}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Skills"}
            </button>
          </div>

          {/* Skill Gap Analysis */}
          {skillGapData && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skill Gap Analysis</h3>
              <div className="flex justify-around">
                <div className="w-1/3">
                  {renderGraph()}
                </div>

                {/* Display skills in bubbles */}
                <div className="w-1/3">
                  <h4 className="text-lg font-semibold">CV Skills:</h4>
                  {cvSkills.map((skill, index) => (
                    <div key={index} className="bg-blue-200 p-2 m-1 rounded-full text-center inline-block">
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="w-1/3">
                  <h4 className="text-lg font-semibold">Job Description Skills:</h4>
                  {jobSkills.map((skill, index) => (
                    <div key={index} className="bg-green-200 p-2 m-1 rounded-full text-center inline-block">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Search Results */}
      {showJobSearchCard && (
        <div className="card bg-white p-6 rounded-lg shadow-lg mt-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Jobs</h3>
          {loadingJobs ? (
            <p>Loading jobs...</p>
          ) : matchingJobs.length > 0 ? (
            matchingJobs.map((job) => (
              <div key={job.id} className="mb-4">
                <h4 className="text-lg font-semibold">{job.jobTitle}</h4>
                <p>{job.jobDescription}</p>
                <p className="mt-2 text-gray-600">Skills: {job.skillsRequired.join(", ")}</p>
              </div>
            ))
          ) : (
            <p>No matching jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;
