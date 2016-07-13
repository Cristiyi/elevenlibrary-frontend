/**
   * Unified Profile namespace
   * @namespace
   */
  window.up = window.up || {
    __: {},
    services: {},
    views: {}
  };
/**
 * Environment flag
 * @readonly
 * @memberofup
 */
up.ENV = "dpev935";
/**
 * Ajax proxy based on environment
 * @readonly
 * @memberof up
 */
up.AJAX_PROXY_URL = "";
/**
 * Object which specifies feature profiling
 * @readonly
 * @memberof up
 */
up.CONFIG = {
  "featureFlags": {
    "sametime": "active",
    "sametime:profile": "active",
    "sametime:businesscard": "active",
    "sametime:expandedcard": "active",
    "sametime:tooltip": "active",
    "editable": "active",
    "editable:scroll": "active",
    "editable:banner": "active",
    "editable:unauthenticatedSave": "inactive",
    "editable:useStorage": "active",
    "help": "active",
    "addToSametime": "inactive",
    "sametimeStatusImprovement": "inactive",
    "initLeadershipFixed": "active",
    "pronounce": "active",
    "pronounce:tooltip": "active",
    "feedback": "inactive",
    "feedback:postToCommunities": "inactive",
    "feedback:emailField": "active",
    "searchResults:keyboardNavigation": "active",
    "searchResults:keyboardTabNavigation": "active",
    "updatePlaceholderImage": "active",
    "updatePlaceholderImage:initials": "active",
    "updatePlaceholderImage:initials:businesscard": "active",
    "preloadImages:rememberPhoto": "active",
    "preloadImages:serveBase64": "active",
    "businesscardOnModal": "active",
    "expertise": "inactive",
    "expertise:resume": "inactive",
    "expertise:skills": "inactive",
    "expertise:patents": "inactive",
    "expertise:publications": "inactive",
    "expertise:bluethx": "inactive",
    "canonicalNumber": "active",
    "resizeJobDescription": "active",
    "mastheadInputSearchQuery": "active",
    "mastheadInputPasteEvent": "active",
    "welcome:carousel": "active",
    "welcome:video": "active",
    "errorHandling": "active",
    "errorHandling:displayMessage": "active",
    "errorHandling:services": "active",
    "nativetitle": "active",
    "pageTitleUpdates:showSearchQuery": "inactive",
    "personLargeTeams:modalRefactor": "active",
    "socialNetwork": "inactive",
    "socialNetwork:connections": "inactive",
    "socialNetwork:connections:sso": "inactive",
    "teamCardHelp": "active",
    "mastheadSearch:positionLeft": "active",
    "profileTeamHeader:localTime": "inactive",
    "modalStickyHeaderShift": "active",
    "profilePageLoading:cardWithGrayBox": "active",
    "profileAssistantTo": "active",
    "profileActionsMenu": "active",
    "profileFooter": "active",
    "profileSortOrder": "active",
    "editableRewrite": "inactive",
    "editableRewrite:searchCard": "inactive",
    "expandedSearchCard:ModalButton": "active",
    "expandedSearchCard:WorkLocationLink": "active",
    "personModel:filterPersonOutOfLeadership": "active",
    "personModel:determinePersonsHasBio": "active",
    "searchPage:layout:mini": "active",
    "searchPage:layout:list": "inactive",
    "modal:fixedHeight": "active",
    "hidePICountryData": "inactive",
    "teamModalBlurDefect": "active",
    "profilePhotoEdit": "inactive",
    "profilePhotoEdit:dropfile": "active",
    "profilePhotoEdit:zoom": "active",
    "profilePhotoEdit:rotate": "active",
    "profilePhotoEdit:resizeLargeImg": "active",
    "person:bosses": "active",
    "teamCardInvalidID": "active",
    "teamModalDistributionLinks": "active",
    "disclaimerView": "active",
    "disclaimerHRcode": "active",
    "tip": "active",
    "newServices": "inactive",
    "newServices:mixinUnified": "inactive",
    "validateNumbers": "active",
    "tooltipRewrite": "active",
    "styleguide": "inactive",
    "modalFade": "active",
    "profileHeaderNewActionIcon": "active"
  }
};
