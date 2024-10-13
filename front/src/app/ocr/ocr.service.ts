import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  private Tesseract: any;
  private tesseractLoaded: boolean = false;  // Track if Tesseract.js is loaded

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Check if the code is running in the browser, and then load Tesseract
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import Tesseract.js only in the browser
      import('tesseract.js/dist/tesseract.min.js').then(module => {
        this.Tesseract = module.default;
        this.tesseractLoaded = true;  // Mark as loaded when Tesseract.js is ready
      }).catch(err => {
        console.error('Error loading Tesseract.js in the browser:', err);
      });
    }
  }

  
  recognizeTextFromBase64(base64Image: string): Promise<string> {
    if (!this.tesseractLoaded) {
      return Promise.reject('Tesseract.js is still loading. Please try again later.');
    }
  
    return new Promise((resolve, reject) => {
      this.Tesseract.recognize(
        base64Image,  // Pass the base64 image directly
        'eng',  // Language
        {
          logger: (info: { status: string; progress: number }) => console.log(info)  // Log progress
        }
      ).then(({ data }: { data: { text: string } }) => {
        resolve(data.text);  // Resolve the recognized text
      }).catch((err: any) => {
        reject(err);  // Handle errors during OCR
      });
    });
  }
  

  // Recognize text from the given ImageData
  recognizeTextFromImage(imageData: ImageData): Promise<string> {
    if (!this.tesseractLoaded) {
      return Promise.reject('Tesseract.js is not loaded yet. Please try again later.');
    }

    return new Promise((resolve, reject) => {
      this.Tesseract.recognize(
        imageData,
        'eng',  // Language setting for OCR (English)
        {
          logger: (info: { status: string; progress: number }) => console.log(info)  // Log OCR progress
        }
      ).then(({ data }: { data: { text: string } }) => {
        resolve(data.text);  // Resolve the text from the image
      }).catch((err: any) => {
        reject(err);  // Reject if an error occurs
      });
    });
  }
}
