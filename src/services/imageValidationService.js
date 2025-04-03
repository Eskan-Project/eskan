import axios from "axios";

export async function validateImage(
  file,
  validationMessage,
  onProgress = () => {}
) {
  try {
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        resolve(base64Image);
      };
    });
    const base64Image = await base64Promise;

    onProgress(validationMessage);
    const res = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/id-xbtly/1",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        api_key: "62y8qpQFcqnvjHDDP1KW",
      },
      data: base64Image,
    });

    console.log(res.data);

    // Check if predictions exist and has at least one element
    if (!res.data.predictions || res.data.predictions.length === 0) {
      console.warn("No predictions returned from Roboflow API.");
      return false; // Or handle this case as needed
    }

    const isValid = res.data.predictions[0].confidence > 0.8;
    console.log("Is valid:", isValid);

    return isValid;
  } catch (error) {
    console.error("Error validating image with Roboflow:", error.message);
    throw new Error("Error validating image");
  }
}
