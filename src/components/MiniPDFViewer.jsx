import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { getFile } from '../firebase/storage';
import Spinner from './Spinner';

const MiniPDFViewer = ({ assignmentInfo, handleAssignmentClick }) => {
  const [numPages, setNumPages] = useState(null); // Number of total pages
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(true);
  const [docArrayBuffer, setDocArrayBuffer] = useState(null); // Complete pdf doc array buffer

  useEffect(() => {
    getFile(assignmentInfo.previewBucket)
      .then(downloadURL => fetch(downloadURL))
      .then(response => response.arrayBuffer())
      .then(pdfBlob => setDocArrayBuffer(pdfBlob))
      .catch(error => console.log("Could not get file"))
      .finally(()=> setIsLoading(false))
  }, []);

  const handlePrevious = () => {
    setCurrentPage(currentPage => currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage => currentPage + 1);
  };

  const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-8 h-8 border-4 border-gray-400 rounded-full animate-bounce"></div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Document
          
          className="relative h-full overflow-y-none flex"
          file={docArrayBuffer}
          onLoadSuccess={({ numPages }) => {setNumPages(numPages);}}
          loading={<Spinner/>}
          options={{
            cMapUrl: 'cmaps/',
            cMapPacked: true,
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={handlePrevious}
            className="h-full w-1/6 bg-[#5f5f5f13] hover:bg-gray-300 absolute z-[1]"
          >
            {'<'}
          </button>
          <Page
            onClick={()=>handleAssignmentClick(assignmentInfo)}
            pageNumber={currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<Spinner/>}
            scale={0.3}
            error={'Failed To Display Preview'}
            className="w-full aspect-auto flex justify-center cursor-pointer"
          />
          <button
            disabled={currentPage === numPages}
            onClick={handleNext}
            className="h-full w-1/6 bg-[#5f5f5f13] hover:bg-gray-300 -translate-x-[100%] left-[100%] absolute z-[1]"
          >
            {'>'}
          </button>
        </Document>
      )}
    </div>
  );
};

export default MiniPDFViewer;
