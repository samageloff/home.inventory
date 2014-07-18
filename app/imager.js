module.exports = {
  variants: {
    items: {
      // keepNames: true,
      resize: {
        large: '800',
      },
      resizeAndCrop: {
        gallery: {
          resize: '320',
          crop: '320x320'
        },
        thumb: {
          resize: '80',
          crop: '80x80'
        }
      }
    }
  },

  storage: {
    Local: {
      path: '/tmp',
      mode: 0777
    },
    S3: {
      key: 'AKIAJWP4TU5YQX76VLJQ',
      secret: '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',
      bucket: 'belongings-global',
      cdn: 'http://belongings-global.s3.amazonaws.com', // (optional)
      storageClass: 'REDUCED_REDUNDANCY' // (optional)
      // set `secure: false` if you want to use buckets with characters like '.' (dot)
    }
    // uploadDirectory: 'images/uploads/'
  },

  debug: true
}
