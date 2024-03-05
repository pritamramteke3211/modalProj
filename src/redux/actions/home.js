import {
  apiPost,
  apiGet,
  setUserData,
  apiPut,
  apiDelete,
} from '../../utils/apiReq';
import * as urls from '../../config/urls';

export async function homeApi(skip, limit = 50) {
  console.log('SKIPPING', skip);

  return apiGet(urls.HOME_FEED + `?limit=${limit}&skip=${skip}`);
}
export function homeApiWithTag(skip, tag) {
  return apiGet(urls.HOME_FEED + `?tags=${tag}`);
}

export async function getCausesList() {
  return apiGet(urls.CAUSES);
}

export function profileDetailFeed() {
  return apiGet(urls.PROFILE_DETAIL);
}

export function emergencyStories() {
  return apiGet(urls.EMERGENCY_STORIES);
}

export function feedLike(data) {
  return apiPost(urls.FEED_LIKE, data);
}

export function feedDislike(data) {
  return apiPost(urls.FEED_DISLIKE, data);
}

export function chatRequestApi() {
  return apiGet(urls.CHAT_REQUEST);
}
export function chatReceiverPostNotCreatedApi() {
  return apiGet(urls.CHAT_RECEIVER_POST_NOT_CREATED);
}

export function chatWithRoomId(postId, roomId) {
  return apiGet(
    urls.CHAT_WITH_ROOM_ID + '?postId=' + postId + '&room=' + roomId,
  );
}

export function chatWithWithoutRoomId(postId) {
  return apiGet(urls.CHAT_WITHOUT_ROOM_ID + postId);
}

export function notificationApi() {
  return apiGet(urls.NOTIFICATION_LISTING);
}

export function createEmergencyFeed(data) {
  return apiPost(urls.CREATE_EMERGENCY_FEED, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function createFeed(data) {
  return apiPost(urls.CREATE_FEED, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function deleteOwnFeed(data) {
  return apiDelete(urls.FEED_MEDIA_DELETE, data);
}

export function otherUserDetail(userId) {
  return apiGet(urls.OTHER_USER_DETAIL + userId);
}

export function getWhoMessageMe(postId) {
  return apiGet(urls.REQUEST_USERS + postId);
}

export function chatAcceptRequest(requestStatus, data) {
  return apiPost(urls.CHAT_ACCEPT_REQUEST + requestStatus, data);
}

export function reportFeed(data) {
  return apiPost(urls.REPORT_FEED, data);
}

export async function sendMessage(data) {
  return apiPost(urls.SEND_MESSAGE, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function uploadFile(data) {
  return apiPost(urls.UPLOAD_FILE, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function getUserStories(userId) {
  return apiGet(urls.USER_STORIES + userId);
}

export function isUserExist(socialMediaId, loginType) {
  return apiGet(
    urls.IS_USER_EXIST +
      `?socialMediaId=${socialMediaId}&loginType=${loginType}`,
  );
}

export function deleteEmergencyPost(data) {
  return apiDelete(urls.DELETE_FEED_EMERGENCY, data, {
    'Content-Type': 'multipart/form-data',
  });
}

/**
 *
 * CREATE_FEED And Mark Complete End Point Is Same
 */
export function markAsCompletePostApi(data) {
  console.log('data', JSON.stringify(data));
  return apiPut(urls.CREATE_FEED, data);
}

export function getFeedById(id) {
  return apiGet(urls.FEED_INFO_WITH_ID + `?id=${id}`);
}

export function globalSearch(searchText) {
  return apiGet(urls.GLOBAL_SEARCH + `${searchText}`);
}

export function logoutApi() {
  return apiPost(urls.LOGOUT, {});
}

export function deleteAccount() {
  return apiDelete(urls.DELETE_USER, {});
}

export function updateVersion(type) {
  return apiGet(urls.UPDATE_VERSION + type, {});
}

export function updateFeed(data) {
  return apiPut(urls.UPDATE_FEED, data);
}

export function reportEmpergencyPost(data) {
  return apiPost(urls.REPORT_EMERGENCY, data);
}
