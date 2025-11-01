const path = require('path');
const Video = require('../Models/Video.js');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { pipeline } = require('stream');
const { exec } = require('child_process');

const uploadToCloudinary = async (req, resp) => {
  try {
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    });
    const { name, description, projectId } = req.body;
    console.log('Started...');
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        req.file.path,
        { resource_type: 'video', chunk_size: 6000000 },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    console.log('uploadResult', uploadResult);
    const respo = await fetch(
      `http://localhost:5501/video/get?projectId=${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const pastVide = await respo.json();
    const pastVideo = pastVide.video;
    if (pastVideo) {
      const filter = { _id: pastVideo._id };
      const update = { url: uploadResult.secure_url };

      await Video.updateOne(filter, update);
    } else {
      const newVideo = new Video({
        name: name,
        description: description,
        projectId: projectId,
        url: uploadResult.secure_url,
      });
      await newVideo.save();
    }
    resp.json({ data: 'Uploaded Successfully!!' });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: error.message });
  }
};

const streamFromCloudinary = async (req, resp) => {
  const { url, name } = req.body;

  try {
    const videoPath = url;
    const outputPath = `./public/uploads/${name}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log('hlsPath', hlsPath);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`exec error: ${error}`);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      const videoUrl = `http://localhost:5501/uploads/${name}/index.m3u8`;

      resp.json({
        message: 'Video converted to HLS format',
        videoUrl: videoUrl,
      });
    });
  } catch (error) {
    console.log(error);
    resp.status(301).json({ error: error.message });
  }
};

module.exports = { uploadToCloudinary, streamFromCloudinary };

/*
{
  "data": {
    "asset_id": "219850d1d13a8134078c557ddc52bd84",
    "public_id": "rkjrofnerltytcj8jtz3",
    "version": 1706264684,
    "version_id": "1e5f22076fb4b46f24de654191c9a356",
    "signature": "18466bf74d49cbdda9112cbec44bf366a1d94b1f",
    "width": 1376,
    "height": 728,
    "format": "mp4",
    "resource_type": "video",
    "created_at": "2024-01-26T10:24:44Z",
    "tags": [],
    "pages": 0,
    "bytes": 35940037,
    "type": "upload",
    "etag": "41de962e98edc8e5904f10d6e4aee47a",
    "placeholder": false,
    "url": "http://res.cloudinary.com/dyw8hi1vu/video/upload/v1706264684/rkjrofnerltytcj8jtz3.mp4",
    "secure_url": "https://res.cloudinary.com/dyw8hi1vu/video/upload/v1706264684/rkjrofnerltytcj8jtz3.mp4",
    "playback_url": "https://res.cloudinary.com/dyw8hi1vu/video/upload/sp_auto/v1706264684/rkjrofnerltytcj8jtz3.m3u8",
    "folder": "",
    "audio": {
      "codec": "aac",
      "bit_rate": "128033",
      "frequency": 48000,
      "channels": 2,
      "channel_layout": "stereo"
    },
    "video": {
      "pix_format": "yuv420p",
      "codec": "h264",
      "level": 41,
      "profile": "Main",
      "bit_rate": "4235345",
      "dar": "172:91",
      "time_base": "1/30000"
    },
    "is_audio": false,
    "frame_rate": 60,
    "bit_rate": 4500006,
    "duration": 63.893313,
    "rotation": 0,
    "original_filename": "chk",
    "nb_frames": 1620,
    "api_key": "881169145529583",
    "done": true
  }
}
*/
