module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // TinyMCE doesn't require special webpack configuration
            // The @tinymce/tinymce-react package handles bundling automatically
            return webpackConfig;
        }
    }
};
