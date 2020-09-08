/// <reference path = "../types.d.ts" /> 
import * as AWS from "aws-sdk"
import imgDataUri from 'image-data-uri'
import * as uuid from 'uuid';



export class awsS3 {

  public static getExtensionFromImageType = (imageType: string) => {
    let extension = 'png';  // default
    if (imageType === 'image/jpeg') {
      extension = 'jpg';
    }
    else if (imageType === 'image/png') {
      extension = 'png';
    }
    else if (imageType === 'image/gif') {
      extension = 'gif';
    }
    else if (imageType === 'image/tiff') {
      extension = 'tif';
    }
    return extension;
  }

  public static WriteImage = async (id: string, dataURI: string) => {

    const image = imgDataUri.decode(dataURI);
    if(image == null){
      return null;
    }
    const extension = awsS3.getExtensionFromImageType(image.imageType);

    const imgName = `${id ? id : ''}_${uuid.v1()}.${extension}`;

    const s3 = new AWS.S3({ accessKeyId: "AKIASDWHYXX65BK4NYEW", secretAccessKey: process.env.AWS_SECRET});
    const params = {
      Bucket: 'property-portal-images', Key: imgName,
      Body: image.dataBuffer, ACL: 'public-read'
    };


    try { // You should always catch your errors when using async/await
      const s3Response = await s3.putObject(params).promise();
      if (!s3Response.$response.error) {
        console.log(`Successfully uploaded to - ${imgName}`);
        return imgName;
      }
      return null;
    }
    catch (e) {
      console.log(e)
      return null;
    }
  }
}