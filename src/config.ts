/**
 * @deprecated
 */
export const amplifyConfig = {
  aws_project_region: import.meta.env.VITE_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: import.meta.env.VITE_AWS_COGNITO_REGION,
  aws_user_pools_id: import.meta.env.VITE_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
};

/**
 * @deprecated
 */
export const auth0Config = {
  client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
};

/**
 * @deprecated
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

export const gtmConfig = {
  containerId: import.meta.env.VITE_GTM_CONTAINER_ID,
};

export const datadogRumConfig = {
  datadogRumAppId: import.meta.env.VITE_DATADOG_RUM_APP_ID,
  datadogRumClientToken: import.meta.env.VITE_DATADOG_RUM_CLIENT_TOKEN,
  datadogRumVersion: import.meta.env.VITE_DATADOG_VERSION,
};

/**
 * 앱 환경 변수 설정 모음
 */
export interface AppEnvironment {
  /**
   * 운영 환경 여부
   */
  isProduction: boolean;
  /**
   * 스테이지 서버 여부
   */
  isStage: boolean;
  /**
   * 카나리 서버 여부
   */
  isCanary: boolean;
  /**
   * 개발 서버 여부 (로컬 동일)
   */
  isDevelopment: boolean;
  /**
   * 로컬 환경 여부
   */
  isLocally: boolean;
  /**
   * 개발 환경 이름 (=== appEnv)
   */
  environmentName: string | undefined;
}
const nodeEnv = import.meta.env.VITE_ENV;
const appEnv = import.meta.env.MODE;
const locally = import.meta.env.REACT_APP_BUILD_ENV;
const isNodeEnvProduction = nodeEnv === 'production';
export const apiConfig = {
  apiManagerBaseUrl: String(import.meta.env.VITE_MANAGER_API_URL),
  apiPartnerBaseUrl: String(import.meta.env.VITE_PARTNER_API_URL),
};

export const pathConfig = {
  cdnUrl: import.meta.env.VITE_CDN_URL,
  serviceUrl: import.meta.env.VITE_SERVICE_URL,
  partnerDataUrl: import.meta.env.REACT_APP_PARTNER_DATA_URL,
  operationOfficeUrl: import.meta.env.REACT_APP_OPERATION_OFFICE_URL,
};

export const env: AppEnvironment = {
  environmentName: appEnv,
  isCanary: appEnv === 'canary' && isNodeEnvProduction,
  isDevelopment: appEnv === 'development' || !isNodeEnvProduction,
  isProduction: appEnv === 'production' && isNodeEnvProduction,
  isStage: appEnv === 'dev' && isNodeEnvProduction,
  isLocally: locally === 'local',
};
