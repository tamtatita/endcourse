import React from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const ViewPDF = ({ file }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />;
      </Worker>
    </div>
  );
};

export default ViewPDF;
