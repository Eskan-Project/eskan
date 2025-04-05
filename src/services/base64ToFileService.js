const base64ToFile = (base64String) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const byteString = atob(arr[1]);
  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mime });

  return new File([blob], `image_${Date.now()}.${mime.split("/")[1]}`, {
    type: mime,
  });
};

export default base64ToFile;
