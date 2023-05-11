import type { FC } from 'react';
import { Grid } from '@material-ui/core';
import { useGeneralSettingsService, useGeneralDetailService } from '../services';
import { GeneralInfoBase, GeneralInfoDetail, Authority } from '../components';

const GeneralSettingsContainer: FC = () => {
  const {
    generalInfo,
    generalDetail,
    authority,
    isComplete: isGeneralSettingComplete,
    isError,
  } = useGeneralSettingsService();

  const {
    isGeneralDetailEdit,
    generalDetailControl,
    generalDetailErrors,
    handleGeneralDetailEdit,
    handleGeneralDetailSave,
    handleGeneralDetailCancel,
  } = useGeneralDetailService({
    generalDetail,
  });

  if (!isGeneralSettingComplete || isError) {
    return null;
  }

  const { email, createdDate, companyName, name, partName, cellPhone } = generalInfo;

  return (
    <Grid container spacing={3}>
      {/* 기본 정보 & 소속 정보 */}
      <Grid item md={4} xs={12}>
        <Grid container item spacing={3}>
          <Grid item xs={12}>
            <GeneralInfoBase email={email} createdDate={createdDate} />
          </Grid>
          <Grid item xs={12}>
            <GeneralInfoDetail
              companyName={companyName}
              name={name}
              partName={partName}
              cellPhone={cellPhone}
              isEdit={isGeneralDetailEdit}
              control={generalDetailControl}
              errors={generalDetailErrors}
              onSave={handleGeneralDetailSave}
              onEdit={handleGeneralDetailEdit}
              onCancel={handleGeneralDetailCancel}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* 권한 정보 */}
      <Grid item md={8} xs={12}>
        <Grid container item spacing={3}>
          <Grid item xs={12}>
            <Authority authority={authority} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralSettingsContainer;
