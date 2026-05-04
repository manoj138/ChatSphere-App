export const optimizeImageFile = (
  file,
  {
    maxSizeMB = 5,
    maxDimension = 1280,
    quality = 0.75,
    outputType = "image/jpeg",
  } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file"));
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      reject(new Error(`Please select an image smaller than ${maxSizeMB}MB`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image processing is not supported"));
          return;
        }

        context.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(outputType, quality));
      };

      img.onerror = () => reject(new Error("Failed to read image"));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Failed to load file"));
    reader.readAsDataURL(file);
  });
