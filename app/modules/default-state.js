import { LANGUAGES } from "../constants";

export default {
  loggedInUser: {
    authToken: null,
    id: null,
    name: null,
    phone: null,
    imageUrl: null,
    isPinSet: false,
    codepushDeploymentStaging: false,
    latestDoYouKnowReadId: 0
  },

  ui: {
    appOpenCount: 0,
    language: LANGUAGES[0],
    fcmToken: null,
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
