import React from 'react';
import toast from 'react-hot-toast';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button, Box, Grid, Typography } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { pathConfig } from '@config';
import { FormControlTextField, FormControlSwitch } from '@components/form';
import { copy } from '../utils';
import { ShowroomFormFields as Fields, ShowroomFormFieldOptions } from '../types';
import { Tooltip } from './base';
import { FormControlAutoComplete, FormControlColorPicker, FormControlFileField } from './form';

export interface ShowroomFieldsProps {
  mode: 'create' | 'edit' | 'read';
  formMethods: UseFormReturn<Fields>;
  formOptions: ShowroomFormFieldOptions;
}

/**
 * 쇼룸 추가/수정 입력폼 컴포넌트
 */
export const ShowroomForm: React.FC<ShowroomFieldsProps> = ({ mode, formMethods, formOptions }) => {
  const containerRef = React.useRef(null);

  const [type, status] = formMethods.watch(['type', 'status']);

  /**
   * 콘셉트 쇼룸 여부
   */
  const isConceptShowroom = type?.id === 'CONCEPT';

  /**
   * 쇼룸 공개 상태
   */
  const isPublicStatus = status?.id === 'PUBLIC';

  /**
   * 쇼룸 정보 입력폼 모드
   */
  const { isCreate, isEdit, isReadOnly } = {
    isEdit: mode === 'edit',
    isCreate: mode === 'create',
    isReadOnly: mode === 'read',
  };

  /**
   * 쇼룸 URL
   */
  const showroomURL = `${pathConfig.serviceUrl}/showroom/${formMethods.getValues('code')}`;

  /**
   * 쇼룸 URL 복사
   */
  const handleCopyShowroomURL = () => {
    copy(showroomURL, {
      container: containerRef.current,
      onSuccess: () => toast.success('쇼룸 주소가 클립보드에 복사되었습니다'),
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Grid container spacing={2} ref={containerRef}>
        <Grid item md={isCreate ? 12 : 6} xs={12}>
          <FormControlAutoComplete<Fields>
            required={!isReadOnly}
            name="type"
            label="쇼룸 종류"
            placeholder="쇼룸 종류를 선택해주세요"
            disabled={isEdit || isReadOnly}
            InputLabelProps={{ shrink: true }}
            options={formOptions.type}
          />
        </Grid>

        {!isCreate && (
          <Grid item md={6} xs={12}>
            <FormControlAutoComplete<Fields>
              required={!isReadOnly}
              name="status"
              label="공개상태"
              placeholder="공개상태를 선택하세요"
              disabled={isReadOnly}
              InputLabelProps={{ shrink: true }}
              options={formOptions.status}
            />
          </Grid>
        )}

        <Grid item md={isCreate ? 12 : 6} xs={12}>
          <FormControlAutoComplete<Fields>
            required={!isReadOnly}
            name="provider"
            label="입점사"
            placeholder="입점사명을 선택하세요"
            disabled={isEdit || isReadOnly}
            InputLabelProps={{ shrink: true }}
            options={formOptions.provider}
          />
        </Grid>

        <Grid item md={isCreate ? 12 : 6} xs={12}>
          <FormControlAutoComplete<Fields>
            required={!isReadOnly}
            name="brand"
            label="브랜드"
            placeholder="브랜드를 선택하세요"
            noOptionsText="선택 가능한 브랜드가 없습니다"
            disabled={isReadOnly || (!isEdit && !formMethods.getValues('provider')?.id)}
            InputLabelProps={{ shrink: true }}
            options={formOptions.brand}
          />
        </Grid>

        <Grid item md={isCreate ? 12 : 6} xs={12}>
          <FormControlTextField<Fields>
            fullWidth
            required={!isReadOnly}
            name="name"
            label="쇼룸명"
            placeholder="생성할 쇼룸명을 입력하세요(최대 15자 이내)"
            disabled={isReadOnly}
            inputProps={{ maxLength: 15 }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item md={isCreate ? 12 : 6} xs={12}>
          <Tooltip title="등록한 쇼룸코드는 해당 브랜드 쇼룸의 웹링크 생성시\n경로 구분값으로 사용됩니다.\n예) https://prizm.co.kr/showroom/example">
            <Box>
              <FormControlTextField<Fields>
                fullWidth
                required={!isReadOnly}
                name="code"
                label="쇼룸코드"
                placeholder="생성할 쇼룸코드를 입력하세요(최대 15자 이내)"
                disabled={isReadOnly}
                inputProps={{ maxLength: 15 }}
                InputProps={{
                  endAdornment: isReadOnly && (
                    <Button variant="text" size="small" onClick={handleCopyShowroomURL} sx={{ flex: '0 0 auto' }}>
                      <FileCopy fontSize="small" sx={{ mr: 0.5 }} /> 쇼룸 주소 복사
                    </Button>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Tooltip>
        </Grid>

        {!isCreate && (
          <Grid item xs={12}>
            <FormControlAutoComplete<Fields>
              multiple
              filterSelectedOptions
              name="keywords"
              label="키워드 관리"
              placeholder="지정할 키워드를 선택하세요"
              disabled={isReadOnly}
              InputLabelProps={{ shrink: true }}
              options={formOptions.keywords}
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item xs={12}>
            <FormControlTextField<Fields>
              fullWidth
              multiline
              triggerPressEnterSubmit
              rows={3}
              name="description"
              label="쇼룸 설명"
              placeholder="쇼룸을 설명할 내용을 입력하세요(띄어쓰기 포함, 최대 200자 이내 텍스트/숫자/URL 입력가능)"
              disabled={isReadOnly}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item xs={12}>
            <FormControlFileField<Fields>
              name="primaryImage"
              title={`대표 프로필 이미지${isPublicStatus ? ' *' : ''}`}
              accept="image/png, image/jpeg"
              disabled={isReadOnly}
              descriptions={
                <Typography color="textPrimary" variant="body2" mt={1}>
                  등록한 대표 프로필 이미지는 쇼룸, 콘텐츠, 라이브 등의 서비스 주요 화면에서 프로필 썸네일로 공개됩니다
                  <br />
                  권장 이미지 사이즈: 512 x 512
                  <br />
                  이미지 파일 형식: jpg, png
                </Typography>
              }
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item xs={12}>
            <FormControlFileField<Fields>
              name="coverMedia"
              title={`커버 이미지/비디오${isPublicStatus ? ' *' : ''}`}
              accept="image/png, image/jpeg, video/*"
              disabled={isReadOnly}
              descriptions={
                <>
                  <Typography color="textPrimary" variant="body1" mt={1}>
                    등록한 커버 이미지 또는 비디오는 쇼룸 화면 상단 커버영역에 공개됩니다
                  </Typography>

                  <Typography color="textPrimary" variant="subtitle2" fontWeight="bold" mt={3}>
                    이미지 업로드 가이드
                  </Typography>
                  <Typography color="textPrimary" variant="body2">
                    권장 이미지 사이즈: (세로형) 1440 x 1920 / (가로형) 1440 x 1080
                    <br />
                    이미지 파일 형식: jpg, png
                  </Typography>

                  <Typography color="textPrimary" variant="subtitle2" fontWeight="bold" mt={1}>
                    비디오 업로드 가이드
                  </Typography>
                  <Typography color="textPrimary" variant="body2">
                    권장 비디오 해상도: (세로형) 1080 x 1440 / (가로형) 1080 x 810
                    <br />
                    비디오 파일 형식: MP4
                  </Typography>
                </>
              }
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item xs={12}>
            <FormControlFileField<Fields>
              name="lottieImage"
              title="라이브 편성표 타이틀 로고"
              accept=".json"
              disabled={isReadOnly}
              descriptions={
                <Typography color="textPrimary" variant="body2" mt={1}>
                  편성표 커버 화면에 노출하는 로고 파일입니다
                  <br />
                  권장 이미지 사이즈: 208 x 24
                  <br />
                  이미지 파일 형식: json(lottie)
                </Typography>
              }
            />
          </Grid>
        )}

        {!isCreate && isConceptShowroom && (
          <Grid item md={6} xs={12}>
            <FormControlColorPicker<Fields>
              fullWidth
              name="backgroundColor"
              label="쇼룸 백그라운드 컬러"
              placeholder="쇼룸 백그라운드 컬러를 선택하세요(.e.g #FFFFF)"
              disabled={isReadOnly}
            />
          </Grid>
        )}

        {!isCreate && isConceptShowroom && (
          <Grid item md={6} xs={12}>
            <FormControlColorPicker<Fields>
              fullWidth
              name="contentColor"
              label="쇼룸 콘텐츠 컬러"
              placeholder="쇼룸 콘텐츠 컬러를 선택하세요(.e.g #FFFFF)"
              disabled={isReadOnly}
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item md={6} xs={12}>
            <FormControlColorPicker<Fields>
              fullWidth
              name="tintColor"
              label="틴트 컬러"
              placeholder="틴트 컬러를 선택하세요(.e.g #FFFFF)"
              disabled={isReadOnly}
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item md={6} xs={12}>
            <FormControlColorPicker<Fields>
              fullWidth
              name="textColor"
              label="텍스트 컬러"
              placeholder="텍스트 컬러를 선택하세요(.e.g #FFFFF)"
              disabled={isReadOnly}
            />
          </Grid>
        )}

        {!isCreate && (
          <Grid item textAlign="right" xs={12}>
            <Tooltip title="*토글 OFF 시 디스커버 Brand Section 내 미노출됩니다">
              <div style={{ display: 'inline-block' }}>
                <FormControlSwitch<Fields>
                  name="discoverUse"
                  label="디스커버 자동 편성 관리"
                  labelDirection="row-reverse"
                  disabled={isReadOnly}
                />
              </div>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
};
