import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export async function validateImage(file, validLabels) {
  try {
    const model = await mobilenet.load();
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await new Promise((resolve) => (image.onload = resolve));

    const tensor = tf.browser.fromPixels(image);
    const predictions = await model.classify(tensor);

    const isValid = predictions.some((pred) =>
      validLabels.some(
        (label) =>
          pred.className.toLowerCase().includes(label) && pred.probability > 0.3
      )
    );
    tensor.dispose();

    return isValid;
  } catch (error) {
    console.error("Error validating image:", error);
    throw new Error("Error validating image");
  }
}
