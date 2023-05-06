module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/videos/play/:id',
      handler: 'video.play',
    }
  ]
}