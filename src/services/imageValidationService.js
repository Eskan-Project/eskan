import axios from "axios";

export async function validateImage(file, onProgress = () => {}) {
  try {
    onProgress("Preparing image data...");
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        resolve(base64Image);
      };
    });
    const base64Image = await base64Promise;

    onProgress("Validating ID...");
    const res = await axios({
      method: "POST",
      url: "https://outline.roboflow.com/national-id-ltfb6/2",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        api_key: "62y8qpQFcqnvjHDDP1KW",
      },
      data: base64Image,
    });

    console.log(res.data);
    const isValid = res.data.predictions[0].confidence > 0.6;
    console.log(isValid);

    return isValid;
  } catch (error) {
    console.error("Error validating image with Roboflow:", error.message);
    throw new Error("Error validating image");
  }
}
