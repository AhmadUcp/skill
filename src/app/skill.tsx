import React from 'react';

interface SkillGraphProps {
  userSkills: { name: string; level: number }[]; // e.g., [{ name: "Python", level: 80 }]
  jobSkills: { name: string; level: number }[];
}

const SkillGraph: React.FC<SkillGraphProps> = ({ userSkills, jobSkills }) => {
  const maxLevel = 100;

  const getBarWidth = (level: number) => `${(level / maxLevel) * 100}%`;

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Skill Comparison</h3>
      <div className="space-y-4">
        {jobSkills.map((jobSkill, index) => {
          const userSkill = userSkills.find(skill => skill.name === jobSkill.name);
          return (
            <div key={index}>
              <p className="text-sm font-semibold">{jobSkill.name}</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-md h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-md"
                    style={{ width: getBarWidth(jobSkill.level) }}
                  ></div>
                </div>
                <span className="text-sm">{jobSkill.level}%</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-gray-200 rounded-md h-4">
                  <div
                    className="bg-green-500 h-4 rounded-md"
                    style={{ width: getBarWidth(userSkill?.level || 0) }}
                  ></div>
                </div>
                <span className="text-sm">{userSkill?.level || 0}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillGraph;
