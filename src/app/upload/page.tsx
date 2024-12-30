"use client";

import { useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";

// Set workerSrc
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const UploadPage = () => {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const extractTextFromPDF = async (pdfFile: File) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
      const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
      const numPages = pdfDocument.numPages;
      let textContent = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        textContent += pageText + '\n';
      }

      setPdfText(textContent);
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  const handleUpload = () => {
    if (file) {
      extractTextFromPDF(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload PDF and Extract Text</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Extract Text
      </button>

      {pdfText && (
        <div className="mt-4">
          <h2 className="font-semibold">Extracted Text:</h2>
          <pre className="bg-gray-100 p-4 mt-2 rounded">{pdfText}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
