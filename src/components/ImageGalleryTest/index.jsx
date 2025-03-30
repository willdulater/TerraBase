import React, { useState } from 'react';

const ImageGalleryTest = () => {
  // List of image files from your public/input_images folder with proper encoding
  const imageFiles = [
    '1.png', '2.png', '3.png', '4.png', '5.png',
    '6.png', '7.png', '8.png', '9.png', '10.png',
    '11.png', '12.png', '13.png', '14.png', '15.png',
    '16.png', '17.png', '18.png', '19.png', '20.png',
    '21.png', '22.png', '23.png', '24.png', '25.png',
    '26.png', '27.png', '28.png', '29.png', '30.png',
    '31.png', '32.png', '33.png', '34.png', '35.png',
    '36.png', '37.png', '38.png', '39.png', '40.png',
    '41.png', '42.png', '43.png', '44.png', '45.png',
    '46.png', '47.png', '48.png', '49.png', '50.png',
  ];

  // State to track which images loaded successfully and which had errors
  const [imageStatus, setImageStatus] = useState({});
  
  // Handle image load success
  const handleImageLoad = (imageName) => {
    setImageStatus(prev => ({
      ...prev,
      [imageName]: 'loaded'
    }));
  };

  // Handle image load error
  const handleImageError = (imageName) => {
    setImageStatus(prev => ({
      ...prev,
      [imageName]: 'error'
    }));
    console.error(`Failed to load image: ${imageName}`);
  };

  // Calculate loaded vs error counts
  const loadedCount = Object.values(imageStatus).filter(status => status === 'loaded').length;
  const errorCount = Object.values(imageStatus).filter(status => status === 'error').length;

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto h-screen">
      <h1 className="text-2xl font-bold mb-6">Saved Images:</h1>
      
     
      
      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageFiles.map((imageName, index) => (
          <div 
            key={index}
            className={`rounded-lg overflow-hidden border-2 ${
              imageStatus[imageName] === 'loaded' ? 'border-green-500' : 
              imageStatus[imageName] === 'error' ? 'border-red-500' : 
              'border-gray-200'
            }`}
          >
           
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
              <img
                src={`/input_images/${imageName}`}
                alt={`Satellite image ${index + 1}`}
                className="w-full h-48 object-cover"
                onLoad={() => handleImageLoad(imageName)}
                onError={() => handleImageError(imageName)}
              />
              
              
            </div>
            <div className="p-2">
              <p className="text-sm">
               Image {decodeURIComponent(imageName).replace('.png', '')}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Test image path directly */}
      
    </div>
  );


};

export default ImageGalleryTest;