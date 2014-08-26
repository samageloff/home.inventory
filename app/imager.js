module.exports = {
  variants: {
    items: {
      // keepNames: true,
      resize: {
        large: '800',
      },
      resizeAndCrop: {
        gallery: {
          resize: '320x320^',
          crop: '320x320 center'
        },
        thumb: {
          resize: '80x80^',
          crop: '80x80 center'
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
      key: 'AKIAJSIGDTCPT22D3NEA',
      secret: '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',
      bucket: 'belongings-test',
      cdn: 'http://belongings-test.s3.amazonaws.com', // (optional)
      storageClass: 'REDUCED_REDUNDANCY' // (optional)
      // set `secure: false` if you want to use buckets with characters like '.' (dot)
    }
    // uploadDirectory: 'images/uploads/'
  },

  debug: true
}