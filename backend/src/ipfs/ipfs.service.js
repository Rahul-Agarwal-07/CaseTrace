const axios = require("axios");
const FormData = require("form-data");

/**
 * Upload buffer to IPFS (Pinata)
 * @returns CID
 */
exports.uploadToIPFS = async (fileBuffer, originalName = "Evidence") => {

  if (!fileBuffer) {
    throw new Error("Empty file buffer");
  }

  const formData = new FormData();
  formData.append("file", fileBuffer, {
    filename: originalName
  });

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: "Infinity",
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
      }
    }
  );

  return response.data.IpfsHash; // CID
};
