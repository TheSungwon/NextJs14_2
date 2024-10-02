// pages/image-ocr.tsx
"use client";

import React, { useState, useRef } from "react";
import { Upload, Button, Row, Col } from "antd";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Tesseract from "tesseract.js";

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = (cropperRef.current as any).cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setCrops([...crops, url]);
      });
    }
  };

  const handleOCR = async (crop: string) => {
    const result = await Tesseract.recognize(crop, "eng+kor");
    return result.data.text;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Upload beforeUpload={handleUpload} showUploadList={false}>
        <Button>Upload Image</Button>
      </Upload>
      {image && (
        <div>
          <Cropper
            src={image}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
          />
          <Button onClick={handleCrop}>Crop</Button>
        </div>
      )}
      <Row gutter={[16, 16]}>
        {crops.map((crop, index) => (
          <Col key={index} span={8}>
            <img src={crop} alt={`crop-${index}`} style={{ width: "100%" }} />
            <Button
              onClick={async () => {
                const text = await handleOCR(crop);
                alert(text);
              }}
            >
              Run OCR
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default App;
