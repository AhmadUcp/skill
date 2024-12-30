import React, { useState } from 'react';

interface SkillInputProps {
  onUpload: (file: File) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="text-sm font-semibold">Upload Your Skills (PDF):</label>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </button>
    </div>
  );
};

export default SkillInput;
