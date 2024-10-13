// import { Component } from '@angular/core';
// import { OcrService } from './ocr.service';  // Import the OCR service
import { FormsModule, NgForm } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { OcrService } from './ocr.service';

@Component({
  selector: 'app-ocr-camera',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss']
})
export class OcrCameraComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  isProcessing: boolean = false;
  recognizedText: string = '';
  videoStream!: MediaStream;

  availableCameras: MediaDeviceInfo[] = [];
  selectedCameraId: string | null = null;  // Store the selected camera's device ID

  constructor(private ocrService: OcrService) {}

  ngOnInit() {
    this.listAvailableCameras();
  }

  // List all available cameras
  async listAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableCameras = devices.filter(device => device.kind === 'videoinput');  // Get video input devices (cameras)

      if (this.availableCameras.length > 0) {
        this.selectedCameraId = this.availableCameras[0].deviceId;  // Default to the first camera
      }
    } catch (err) {
      console.error('Error listing available cameras', err);
    }
  }

  // Start accessing the camera
  async startCamera() {
    if (!this.selectedCameraId) {
      console.error('No camera selected');
      return;
    }

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: this.selectedCameraId } }  // Use the selected camera
      });
      this.videoElement.nativeElement.srcObject = this.videoStream;
      this.videoElement.nativeElement.play();
    } catch (err) {
      console.error('Error accessing the camera', err);
    }
  }

  captureFrame() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
  
    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    // Draw the current video frame onto the canvas
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Convert the canvas content to a base64 image
    const base64Image = canvas.toDataURL('image/png');
  
    // Call the OCR service with the base64 image
    this.ocrService.recognizeTextFromBase64(base64Image).then(text => {
      console.log('Recognized text:', text);
    }).catch((err: any) => {
      console.error('Error processing image:', err);
    });
  }
  

  // Stop the video stream when the component is destroyed
  ngOnDestroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
  }
}
