module.exports = {
  transpileDependencies: ["vuetify", "vuex-module-decorators"],
  pwa: {
    name: "StarSport",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "dev/sw.js"
    }
  }
};
