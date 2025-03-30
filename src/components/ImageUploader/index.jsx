import React, { useState, useEffect } from "react";

const ImageUploader = ({ socket }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisDescriptions = {
    vegetation_coverage: {
      label: "Vegetation Coverage",
      unit: "/100",
      description: "Percentage of land covered by vegetation",
    },
    crop_health_score: {
      label: "Crop Health Score",
      unit: "/10",
      description: "Health rating of the crops",
    },
    normalized_difference_vegetation_index: {
      label: "NDVI",
      unit: "",
      description: "Normalized Difference Vegetation Index (-1 to 1) (Measures health and density of vegetation)",
    },
    moisture_estimate: {
      label: "Moisture Estimate",
      unit: "/100",
      description: "Soil moisture content percentage",
    },
    growth_percentage: {
      label: "Growth Percentage",
      unit: "/100",
      description: "Crop growth progress toward harvest",
    },
  };

  // Handle WebSocket message
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.websocket_type === "analyzeforestimage") {
        if (data.analysis_results) {
          setAnalysisResults(data.analysis_results);
          setIsAnalyzing(false);
        } else if (data.error) {
          console.error(`Analysis Error: ${data.message}`);
          setIsAnalyzing(false);
        }
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!imageBase64 || !socket || socket.readyState !== 1) {
      console.error("Image or WebSocket not ready");
      return;
    }

    setIsAnalyzing(true);
    socket.send(
      JSON.stringify({
        websocket_type: "analyzeforestimage",
        image_data: imageBase64,
      })
    );
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto flex gap-4 overflow-y-auto h-screen">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">Forest Image Analyzer</h2>

        <input type="file" accept="image/*" onChange={handleImageChange} className=" p-2 rounded" />

        {imagePreview && (
          <div className="p-4 border rounded-lg mt-4">
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
          </div>
        )}

        <button onClick={handleAnalyze} disabled={!imageBase64 || isAnalyzing} className="mt-4 px-4 py-2 bg-[#0B3D2E] text-white rounded disabled:opacity-50">
          {isAnalyzing ? "Analyzing..." : "Analyze Image"}
        </button>
      </div>

      {analysisResults && (
        <div className="flex-1 p-4  rounded-lg">
          <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
          <table className="w-full text-sm ">
            <tbody>
              {Object.entries(analysisResults).map(([key, value]) => {
                const info = analysisDescriptions[key] || {
                  label: key.replace(/_/g, ' '),
                  unit: "",
                  description: "",
                };
                return (
                  <tr key={key} className="border-t">
                    <td className="p-2 font-medium capitalize w-1/2">
                      {info.label}
                      {info.description && (
                        <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                      )}
                    </td>
                    <td className="p-2 text-right w-1/2">
                      {value}{info.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
