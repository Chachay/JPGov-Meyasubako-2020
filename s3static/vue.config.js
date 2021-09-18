module.exports = {
  publicPath: './',

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: 'default',
      overrideEndpoint: false,
      region: '',
      bucket: '',
      createBucket: false,
      staticHosting: false,
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '',
      acl: 'private',
      pwa: false,
      gzip: true,
      enableCloudfront: true,
      cloudfrontId: '',
      cloudfrontMatchers: '/index.html,/data/*.json,/js/*.js',
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 5,
    },
  },
}
