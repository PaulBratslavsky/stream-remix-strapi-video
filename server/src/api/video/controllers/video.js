'use strict';
const fs = require('fs');
const path = require('path');

/**
 * video controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::video.video', ({ strapi }) => ({
  async play(ctx) {
    // find the video entity with the specified ID and populate its "video" relation
    const { video } = await strapi.entityService.findOne("api::video.video", ctx.request.params.id, {
      populate: {
        video: true
      },
    });

    // create a path to the video file
    const MY_PATH = strapi.dirs.static.public;
    const VIDEO_PATH = path.join(MY_PATH, video.url);

    // get the file size and "Range" header from the request
    const videoStats = fs.statSync(VIDEO_PATH);
    const videoSize = videoStats.size;
    const videoRange = ctx.request.headers.range;

    // check if the file exists; if not, throw a 404 error
    try {
      fs.promises.access(VIDEO_PATH, fs.constants.F_OK);
      console.log('File exists');
    } catch (err) {
      console.error(err);
      ctx.throw(404, 'File not found');
    }

    // set response headers
    ctx.set('Content-Type', 'video/mp4');
    ctx.set('Content-Ranges', 'bytes');

    if (videoRange) {
      // parse the "Range" header and set response headers for a partial content response
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunksize = (end - start) + 1;

      ctx.set('Content-Length', chunksize);
      ctx.set('Content-Ranges', `bytes ${start}-${end}/${videoSize}`);
      ctx.body = fs.createReadStream(VIDEO_PATH, { start, end });
    } else {
      // set response headers for a full content response
      ctx.status = 200;
      ctx.set('Content-Length', videoSize);
      ctx.body = fs.createReadStream(VIDEO_PATH);
    }
  },
}));
