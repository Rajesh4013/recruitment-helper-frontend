import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResumeExtractor.css';
// import { useAuth } from '../context/AuthContext';

const ResumeExtractor: React.FC = () => {
  // const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file); // field name expected by Flask server

    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        // If your Flask server doesn't require authorization, you can remove this header.
        // headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Extraction failed.');
      }
      const data = await response.json();
      setExtractedData(data);
      toast.success('Extraction successful.');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Extraction error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy!', err);
      toast.error('Failed to copy!');
    }
  };

  // Reset the state to allow extraction of another resume.
  const handleReset = () => {
    setExtractedData(null);
    setFile(null);
  };

  return (
    <div className="resume-extractor-container">
      <ToastContainer />
      <h1 className="page-title">Resume Extractor</h1>
      {!extractedData ? (
        <div className="resume-extractor-form">
          <input
            className="form-control"
            type="file"
            id="fileInput"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <button
            id="extractBtn"
            className="btn btn-primary"
            onClick={handleExtract}
            disabled={loading}
          >
            {loading ? 'Extracting...' : 'Extract Info'}
          </button>
        </div>
      ) : (
        <div className="extracted-data-form">
          <h2>Extracted Data</h2>
          <div className="form-group">
            <label>Name:</label>
            <input className="form-control" type="text" readOnly value={extractedData.name || ''} />
            <button
              className="copy-btn"
              onClick={() => handleCopy(extractedData.name || '')}
            >
              Copy
            </button>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              className="form-control"
              type="text"
              readOnly
              value={(extractedData.emails && extractedData.emails[0]) || ''}
            />
            <button
              className="copy-btn"
              onClick={() =>
                handleCopy(
                  (extractedData.emails && extractedData.emails[0]) || ''
                )
              }
            >
              Copy
            </button>
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              className="form-control"
              type="text"
              readOnly
              value={
                (extractedData.phone_numbers && extractedData.phone_numbers[0]) ||
                ''
              }
            />
            <button
              className="copy-btn"
              onClick={() =>
                handleCopy(
                  (extractedData.phone_numbers && extractedData.phone_numbers[0]) ||
                  ''
                )
              }
            >
              Copy
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleReset}>
            Extract Another Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeExtractor;
