const scanner = require("sonarqube-scanner");
const pkg = require("./package.json");

scanner(
    {
        serverUrl:
            process.env.SONARQUBE_SERVER_URL || "http://swstpbld002.pd.group.intl:9000/",
        options: {
            "sonar.projectKey": "TSDM_API",
            "sonar.projectName": "TSDM_API",
            "sonar.projectVersion": pkg.version,
            "sonar.sources": "."
            //"sonar.tests": "tests"
            //"sonar.typescript.lcov.reportPaths": ".test_coverage/lcov.info",
            //"sonar.testExecutionReportPaths": ".test_output/test-report.xml"
        }
    },
    () => {
        // callback is required
    }
);