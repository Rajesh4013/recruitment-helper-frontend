import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResumeExtractor.css'; // Import the CSS file

const ResumeExtractor: React.FC = () => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/resume-extractor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract resume data');
      }

      const data = await response.json();
      setExtractedData(data);
      toast.success('Resume data extracted successfully!');
    } catch (error) {
      console.error('Error extracting resume data:', error);
      toast.error('Error extracting resume data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-extractor-container">
      <ToastContainer />
      <h1 className="page-title">Resume Extractor</h1>
      <form onSubmit={handleSubmit} className="resume-extractor-form">
        <div className="form-group">
          <label htmlFor="resumeFile">Upload Resume</label>
          <input
            type="file"
            id="resumeFile"
            name="resumeFile"
            className="form-control"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Extracting...' : 'Extract Resume'}
          </button>
        </div>
      </form>
      {extractedData && (
        <div className="extracted-data">
          <h2>Extracted Data</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeExtractor;
