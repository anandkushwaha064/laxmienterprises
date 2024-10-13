import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';  // Import isPlatformBrowser
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';  // Import ZXing barcode reader
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-item-register',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './item-register.component.html',
  styleUrls: ['./item-register.component.scss']
})
export class ItemRegisterComponent implements OnInit, OnDestroy {

  @ViewChild('scanner', { static: false }) scannerElementRef!: ElementRef<HTMLVideoElement>;  // Reference to the video element

  item = {
    barcode: '',
    itemName: '',
    description: '',
    category: '',
    price: 0,         // Default price as 0
    quantity: 0,      // Default quantity as 0
    quantityType: ''  // Default quantityType as an empty string
  };

  scanning: boolean = false;  // To control the barcode scanner visibility
  private codeReader = new BrowserMultiFormatReader();  // ZXing barcode reader
  private controls: IScannerControls | null = null;  // Controls to stop scanner
  private stream: MediaStream | null = null;  // Store the video stream
  availableCameras: MediaDeviceInfo[] = [];  // Store available video input devices
  selectedCameraId: string | null = null;  // Store the selected camera's device ID

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    // Check if we are in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.listAvailableCameras();  // Only list cameras in the browser environment
    }
  }

  // List all available cameras
  async listAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableCameras = devices.filter(device => device.kind === 'videoinput');
      
      if (this.availableCameras.length > 0) {
        // Automatically select the second camera (if available) or the first one
        this.selectedCameraId = this.availableCameras.length > 1 ? this.availableCameras[1].deviceId : this.availableCameras[0].deviceId;
        console.log("Available cameras: ", this.availableCameras);
        console.log("Selected camera: ", this.selectedCameraId);
      } else {
        console.error('No video input devices found.');
      }
    } catch (error) {
      console.error('Error listing available cameras', error);
    }
  }

  // Start barcode scanner with selected camera
  async startBarcodeScanner() {
    this.scanning = true;

    // Ensure the video element is ready before starting the scanner
    if (!this.scannerElementRef || !this.scannerElementRef.nativeElement) {
      console.error('Scanner video element is not ready.');
      return;
    }

    try {
      if (!this.selectedCameraId) {
        console.error('No camera selected.');
        return;
      }

      // Request access to the selected camera
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: this.selectedCameraId } } });
      
      // Attach the stream to the video element
      this.scannerElementRef.nativeElement.srcObject = this.stream;
      this.scannerElementRef.nativeElement.play();  // Ensure video playback starts

      console.log('Camera stream attached to video element');

      // Start ZXing barcode scanner with the video element
      this.codeReader.decodeFromVideoElement(
        this.scannerElementRef.nativeElement,  // Use the video element as input
        (result, error, controls) => {
          if (result) {
            this.item.barcode = result.getText();  // Populate barcode field with result
            console.log("Barcode detected: ", result.getText());
            console.log("Barcode detected: ", result.getText());
            this.controls = controls;
            this.stopBarcodeScanner();  // Stop scanner after detecting barcode
            this.fillItemDetailsBasedOnBarcode(this.item.barcode);
          }
          if (error) {
            console.error("Error scanning barcode: ", error);
          }
        }
      );
    } catch (error:any) {
      console.error('Error accessing the camera', error);
      alert('Error accessing the camera: ' + error.message);
    }
  }

  // Fill item details based on barcode (You can replace this with your own logic)
  fillItemDetailsBasedOnBarcode(barcode: string) {
    // Dummy logic for filling in the details
    if (barcode === '123456789') {
      this.item.itemName = 'Example Item';
      this.item.price = 100;
      this.item.quantity = 10;
      this.item.quantityType = 'pieces';
      this.item.category = 'electronics';
      this.item.description = 'This is an example item.';
    }
  }

  // Stop the barcode scanner and release the camera
  stopBarcodeScanner() {
    if (this.controls) {
      this.controls.stop();  // Stop the ZXing barcode scanner
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());  // Stop the camera stream
    }

    this.scanning = false;
  }

  // Clean up on component destroy to stop the scanner and release the camera
  ngOnDestroy() {
    this.stopBarcodeScanner();
  }

  // Handle form submission
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Item registered:', this.item);
      // Perform further actions, such as sending data to a server
      alert('Item successfully registered!');
      form.reset();  // Reset form after submission
    }
  }
}
