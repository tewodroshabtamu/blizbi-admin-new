import React from 'react';
import blobSvg from '../assets/blizbi-blob.svg';

const BlizbiBlogLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[200px]">
      <img
        src={blobSvg}
        alt="Loading..."
        className="w-20 h-20 animate-blob-spin"
      />
    </div>
  );
};

export default BlizbiBlogLoader;
