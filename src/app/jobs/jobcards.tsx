import React from 'react';

interface JobCardProps {
  title: string;
  company: string;
  skills: string[];
  location: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, skills, location }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white w-80 flex-shrink-0">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{company}</p>
      <p className="text-sm text-gray-500">{location}</p>
      <h4 className="mt-2 text-sm font-semibold">Required Skills:</h4>
      <ul className="list-disc ml-4 text-sm text-gray-700">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobCard;
