import React from 'react';
import UploadForm from '../components/Video/UploadForm';

const UploadPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Video</h1>
      <UploadForm />
    </div>
  );
};

export default UploadPage;