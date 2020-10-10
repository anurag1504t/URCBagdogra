module.exports = {
    apps: [
      {
        name: "URCBagdogra",
        script: "node ./bin/www",
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 0000,
          MONGODB_URI: "<<<<<<<<<<Null>>>>>>>>>>",      
        }
      }
    ]
  };