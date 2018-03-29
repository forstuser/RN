import { LANGUAGES } from "../constants";

export default {
  loggedInUser: {
    authToken: null,
    fcmToken: null,
    id: null,
    name: null,
    phone: null,
    imageName: null,
    isPinSet: false,
    codepushDeploymentStaging: false
  },

  ui: {
    latestDoYouKnowId: 0,
    language: LANGUAGES[0],
    screenToOpenAfterLogin: null,
    hasBlankDashboardTourShown: false,
    hasDashboardTourShown: false,
    hasEhomeTourShown: false,
    hasUploadDocTourShown: false,
    hasUploadBillTourShown: false,
    hasProductCardTourShown: false,
    hasUpdateAppScreenShown: false,
    rateUsDialogTimestamp: null
  }
};
