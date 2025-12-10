# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
  const PdfDocument = useMemo(() => {
    const documentTitle = previewData?.template_for || previewData?.doc_category || previewData;

    const cleanWebsite = webSettingData?.website_link?.replace("https://hrms.", "https://");
    return () => (
      <Document title={documentTitle}>
        <Page size="A4" style={pdfStyles.page}>

          {webSettingData?.water_mark_file && (
            <View style={pdfStyles.watermarkContainer} fixed>
              <Image
                style={pdfStyles.watermark}
                src={config.IMAGE_PATH + webSettingData.water_mark_file}
              />
            </View>
          )}


          <View style={pdfStyles.header} fixed>
            <View style={pdfStyles.headerLines} />
            <View style={pdfStyles.branding}>
              {webSettingData?.logo_image && (
                <Image
                  style={pdfStyles.logo}
                  src={config.IMAGE_PATH + webSettingData.logo_image}
                />
              )}
            </View>
          </View>

          <View style={pdfStyles.content}>
            {parsedPdfContent}
          </View>
          <View style={pdfStyles.footer} fixed render={({ pageNumber, totalPages }) => (
            (pageNumber === 1) ? (
              <View style={{ width: '100%' }}>
                <Text style={pdfStyles.companyName}>
                  {webSettingData?.meta_title}
                </Text>

                <Text style={pdfStyles.address}>
                  {webSettingData?.office_address}
                </Text>

                <Text style={pdfStyles.contact}>
                  Tel: {webSettingData?.organization_mobile_no}
                  <Text style={pdfStyles.separator}> | </Text>
                  Email: {webSettingData?.organization_email_id}
                  <Text style={pdfStyles.separator}> | </Text>
                  Website: {cleanWebsite}
                </Text>

                <View style={{ position: 'absolute', bottom: 1, right: 5 }}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {showSignature && (
                      <Image
                        style={{ width: 100, height: 60 }}
                        src={config.IMAGE_PATH + webSettingData?.hod_hr_signature}
                      />
                    )}
                  </View>
                </View>

                <View style={pdfStyles.footerLines} />
              </View>
            ) : null
          )} />

        </Page>
      </Document>
    );
  }, [parsedPdfContent, webSettingData, previewData]);
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
