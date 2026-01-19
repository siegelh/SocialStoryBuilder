
/**
 * Merges an array of image URLs (or Base64 strings) side-by-side into a single horizontal strip.
 * This is used to create a composite reference image (The Party Lineup).
 */
export const mergeMultipleImages = (
  imageUrls: string[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!imageUrls || imageUrls.length === 0) {
      resolve("");
      return;
    }

    // If only one image, just return it (saving canvas processing)
    if (imageUrls.length === 1) {
      resolve(imageUrls[0]);
      return;
    }

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let hasError = false;

    const onAllLoaded = () => {
      if (hasError) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // We normalize all images to a fixed height to keep the lineup clean
        const TARGET_HEIGHT = 1024;
        
        // Calculate dimensions
        let totalWidth = 0;
        const scaledDims = images.map(img => {
          const scale = TARGET_HEIGHT / img.height;
          const w = img.width * scale;
          totalWidth += w;
          return { w, h: TARGET_HEIGHT, img };
        });

        // Add a small gap between characters
        const GAP = 20;
        totalWidth += (images.length - 1) * GAP;

        canvas.height = TARGET_HEIGHT;
        canvas.width = totalWidth;

        // Fill white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw images
        let currentX = 0;
        scaledDims.forEach((item, index) => {
          ctx.drawImage(item.img, currentX, 0, item.w, item.h);
          currentX += item.w + GAP;
        });

        // Return as Base64
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };

    // Load all images
    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          onAllLoaded();
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image at index ${index}`);
        hasError = true;
        reject(new Error(`Failed to load image at index ${index}`));
      };

      img.src = url;
      images.push(img);
    });
  });
};
