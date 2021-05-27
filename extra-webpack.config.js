module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: './tslint.json',
              emitErrors: true,
              failOnHint: true,
              tsConfigFile: './tsconfig.app.json'
            }
          }
        ]
      },
      {
        test: /\.spec\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: './tslint.json',
              emitErrors: true,
              failOnHint: true,
              tsConfigFile: './tsconfig.spec.json'
            }
          }
        ]
      }
    ]
  }
};
