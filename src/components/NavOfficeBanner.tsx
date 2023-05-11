import type { VFC, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Typography } from '@material-ui/core';
import ExternalLinkIcon from '@assets/icons/ExternalLink';
import ChartPieIcon from '@assets/icons/ChartPie';
import { getProvider } from '@utils/auth';

interface NavOfficeBannerProps {
  title: string;
  subtitle?: string;
  ssoKey: string;
  secure?: boolean;
  url?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * 파트너 및 매니저 오피스 연동 배너
 *
 * @description 파트너 데이터 및 오퍼레이션 오피스 연동 전용 배너입니다.
 */
const NavOfficeBanner: VFC<NavOfficeBannerProps> = ({
  title,
  subtitle,
  ssoKey,
  secure = true,
  url,
  startIcon,
  endIcon,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!url) {
      return toast.error('지원하지 않는 환경입니다.');
    }

    const providerInfo = getProvider();

    if (!providerInfo) {
      return toast.error('입점사 정보가 없습니다.');
    }

    const value = encodeURIComponent(JSON.stringify(providerInfo));
    const secureOption = secure ? '; secure' : '';

    document.cookie = `${ssoKey}=${value}; domain=prizm.co.kr; max-age=60; path=/${secureOption}`;

    window.open(url.concat('/sso'), '_blank');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button
        color="primary"
        startIcon={startIcon ?? <ChartPieIcon />}
        endIcon={endIcon ?? <ExternalLinkIcon sx={{ opacity: '0.5' }} />}
        size="large"
        variant="contained"
        fullWidth
        onClick={handleClick}
        sx={{ my: '12px', '& .MuiButton-startIcon > svg:first-of-type': { fontSize: '38px' } }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography color="white" variant="button">
            {title}
          </Typography>
          <Typography color="white" variant="subtitle2">
            {subtitle}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};

export default NavOfficeBanner;
