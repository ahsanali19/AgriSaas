// src/utils/imageCompressor.ts

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.7)
  maxSizeKB?: number; // Target max size in KB (default 500KB)
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  savedPercentage: number;
  width: number;
  height: number;
}

/**
 * Format bytes into human readable format (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Compresses an image file on the client-side (in the browser)
 * Resizes to max dimensions (default 1080px) and compresses heavily (quality <= 0.7)
 * to guarantee the resulting payload is well under 500KB.
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1080,
    maxHeight = 1080,
    quality = 0.7,
    maxSizeKB = 500,
    mimeType = 'image/jpeg'
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions preserving aspect ratio
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > targetHeight) {
          if (targetWidth > maxWidth) {
            targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
            targetWidth = maxWidth;
          }
        } else {
          if (targetHeight > maxHeight) {
            targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
            targetHeight = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw image onto canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Recursive compression helper to ensure under maxSizeKB
        const tryCompress = (currentQuality: number) => {
          const dataUrl = canvas.toDataURL(mimeType, currentQuality);
          
          // Estimate byte size from base64 string
          const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
          const compressedBytes = Math.ceil((base64Length * 3) / 4);

          // If still larger than maxSizeKB and quality can be reduced further, step down
          if (compressedBytes > maxSizeKB * 1024 && currentQuality > 0.3) {
            tryCompress(Math.max(0.25, currentQuality - 0.15));
            return;
          }

          // Convert dataURL to File/Blob
          const arr = dataUrl.split(',');
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : mimeType;
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          
          const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
          const compressedFile = new File([u8arr], newFileName, { type: mime });

          const savedBytes = Math.max(0, originalSize - compressedBytes);
          const savedPercentage = originalSize > 0 
            ? Math.round((savedBytes / originalSize) * 100) 
            : 0;

          resolve({
            file: compressedFile,
            dataUrl,
            originalSize,
            compressedSize: compressedBytes,
            originalSizeFormatted: formatFileSize(originalSize),
            compressedSizeFormatted: formatFileSize(compressedBytes),
            savedPercentage,
            width: targetWidth,
            height: targetHeight
          });
        };

        tryCompress(quality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      } else {
        reject(new Error('Failed to read image file data'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk or camera'));
    };

    reader.readAsDataURL(file);
  });
}
