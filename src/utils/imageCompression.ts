/**
 * Client-Side Image Compression Utility for EcoCampus 3R UNM
 * Compresses large camera shots (e.g. 5MB - 12MB) to lightweight web images (<300KB)
 * using HTML5 Canvas before YOLO/Gemini scanning or posting to Bursa Reuse.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  width: number;
  height: number;
  savedPercentage: number;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function compressImage(
  source: File | Blob | string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    let originalSizeBytes = 0;
    const img = new Image();

    const handleLoadedImage = () => {
      let { width, height } = img;

      // Calculate constrained dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Gagal menginisialisasi canvas context untuk kompresi gambar'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // Estimate compressed size from base64 length
      const base64Str = compressedDataUrl.split(',')[1] || '';
      const compressedSizeBytes = Math.round((base64Str.length * 3) / 4);

      if (originalSizeBytes === 0) {
        originalSizeBytes = compressedSizeBytes;
      }

      const savedPercentage = Math.max(
        0,
        Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
      );

      resolve({
        dataUrl: compressedDataUrl,
        originalSizeBytes,
        compressedSizeBytes,
        width,
        height,
        savedPercentage,
      });
    };

    img.onerror = () => {
      reject(new Error('Gagal memproses file gambar'));
    };

    if (typeof source === 'string') {
      // It's already a DataURL or URL
      const base64Str = source.includes(',') ? source.split(',')[1] : source;
      originalSizeBytes = Math.round((base64Str.length * 3) / 4);
      img.src = source;
      if (img.complete) {
        handleLoadedImage();
      } else {
        img.onload = handleLoadedImage;
      }
    } else {
      // It's a File or Blob
      originalSizeBytes = source.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = handleLoadedImage;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file foto'));
      reader.readAsDataURL(source);
    }
  });
}
