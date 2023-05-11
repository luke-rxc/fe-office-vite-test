import styled from '@emotion/styled';
import { FormLayout } from './FormLayout';

interface Props {
  followerCount?: string;
}

export const ScheduleAppPushInfo = ({ followerCount }: Props) => {
  return (
    <>
      <FormLayout label="개별방송 알림 신청 현황">{followerCount ?? ''}</FormLayout>
      <DescriptionUlStyled>
        <li>팔로잉 앱푸시와 동일한 메시지로 동일한 타이밍에 발송됩니다. (On-Air 시) </li>
        <li>앱푸시 본문 메시지에 대한 커스터마이징은 ‘라이브 콘텐츠 상세 페이지’ 에서 설정할 수 있습니다. </li>
      </DescriptionUlStyled>
    </>
  );
};

const DescriptionUlStyled = styled.ul`
  margin: 0;
  font-size: 0.875rem;
`;
