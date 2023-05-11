import { datadogRumConfig, env } from '@config';
import { datadogRum, RumInitConfiguration } from '@datadog/browser-rum';

const datadogConfig: RumInitConfiguration = {
  applicationId: datadogRumConfig.datadogRumAppId,
  clientToken: datadogRumConfig.datadogRumClientToken,
  site: 'datadoghq.com',
  service: 'office-web-prizm',
  env: env.environmentName,
  version: datadogRumConfig.datadogRumVersion,
  sessionSampleRate: 100,
  // 세션 리플레이 disable 설정 값
  sessionReplaySampleRate: 0,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  defaultPrivacyLevel: 'mask-user-input',
};

export const init = () => {
  // 로컬 구동인 경우 Datadog 비활성화
  if (env.isLocally) {
    return;
  }

  // RUM Initialize
  datadogRum.init(datadogConfig);

  // RUM Session Recording
  // 비용 대비 활용도가 낮아 세션리플레이 기능 중지
  // datadogRum.startSessionReplayRecording();
  // 레코딩 수집이 지속되어 Stop 추가 호출 처리
  datadogRum.stopSessionReplayRecording();
};
