import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import { PassThrough } from "node:stream";
import s3 from "../config/awss3.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { convertS3ToCloudFrontUrl } from "../utils/convertS3ToCloudFrontUrl.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadFilesToS3 = async (files) => {
  const uploadedFiles = [];

  for (const file of files) {
    const pass = new PassThrough();

    const ext = file.originalname.split(".").pop(); // e.g., jpg
    const baseName = slugify(file.originalname.replace(/\.[^/.]+$/, ""), {
      lower: true,
    });
    const uniqueName = `${baseName}-${uuidv4()}.${ext}`;

    const key = `jupi-files/${uniqueName}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: pass,
        ContentType: file.mimetype,
        ContentDisposition: "inline",
      },
    });

    pass.end(file.buffer);
    await upload.done();
    // Convert S3 URL to CloudFront URL
    const s3Url = `${process.env.AWS_S3_BUCKET_URL}/jupi-files/${uniqueName}`;

    const cloudFrontUrl = convertS3ToCloudFrontUrl(s3Url);

    uploadedFiles.push({
      fieldname: file.fieldname,
      filename: uniqueName,
      originalname: file.originalname,
      url: cloudFrontUrl,
    });
  }

  return uploadedFiles;
};
