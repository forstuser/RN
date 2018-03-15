import { LANGUAGES } from "../constants";

export default {
  loggedInUser: {
    authToken: null,
    fcmToken: null,
    id: null,
    name: null,
    phone: null,
    codepushDeploymentStaging: false
  },

  ui: {
    language: LANGUAGES[0],
    screenToOpenAfterLogin: null,
    hasBlankDashboardTourShown: false,
    hasDashboardTourShown: false,
    hasEhomeTourShown: false,
    hasUploadDocTourShown: false,
    hasUpdateAppScreenShown: false,
    rateUsDialogTimestamp: null
  }
};
