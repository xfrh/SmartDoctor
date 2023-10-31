const { AndroidConfig, withPlugins, withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = (config, { googlePlayServicesVersion }) => {
  return withPlugins(config, [
    // ...其他插件
  ], (config) => {
    // 修改 Android Gradle 配置
    config = withGooglePlayServicesVersion(config, { googlePlayServicesVersion });

    return config;
  });
};

const withGooglePlayServicesVersion = (config, { googlePlayServicesVersion }) => {
    config = withProjectBuildGradle(config, (config) => {
      if (googlePlayServicesVersion) {
        // 在 android/build.gradle 中添加 ext 配置
        config.modResults.contents = config.modResults.contents.replace(
          /ext\s?{/,
          `ext {
              googlePlayServicesVersion = '${googlePlayServicesVersion}'
          `
        );
      }
      return config;
    });

  return config;
};

module.exports = withGooglePlayServicesVersion;

