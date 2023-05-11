import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Box, Paper, Typography, Divider } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import { ContentFormModel, ContentModel, FormContentBlankModel } from '../../models';
import {
  BLANK_COLOR_TYPE,
  BLANK_SPACING_SIZE,
  BLANK_SPACING_TYPE,
  BLANK_SPACING_TYPE_OPTIONS,
  FORM_KEY,
  BLANK_COLOR_TYPE_OPTIONS,
} from '../../constants';
import { FormControlInput, FormControlRadioGroup, FormControlSwitch } from '../form';
import { ControlColorPicker } from '../ControlColorPicker';
import { ListItemWrapper } from '../Styled';

/**
 * 여백 컴포넌트
 */
type ContentBlankProps = {
  content: ContentModel;
};
export const ContentBlank: VFC<ContentBlankProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    height,
    spacingType,
    customHeight,
    colorType: colorTypeContents,
    colors,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentBlankModel;
  const [showHeightField, setShowHeightField] = useState<boolean>(spacingType === BLANK_SPACING_TYPE.CUSTOM);
  const [colorType, setColorType] = useState<string>(
    colors.length > 1 ? BLANK_COLOR_TYPE.GRADIENT : BLANK_COLOR_TYPE.SINGLE,
  );
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

  /**
   * 노출시간정보는 (예외적으로) watch로 값 변경시 마다 유효성 체크
   * - 다른 폼 요소는 submit시에만 유효성 체크
   */
  const [displayStartDateTimeValue, displayEndDateTimeValue] = watch([
    `${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`,
    `${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`,
  ]);

  useEffect(() => {
    trigger(`${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`);
    trigger(`${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`);
  }, [displayStartDateTimeValue, displayEndDateTimeValue, trigger, id]);

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      height,
      spacingType,
      customHeight,
      colorType: colorTypeContents,
      colors,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 여백 */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography color="textPrimary" variant="h6">
          여백
        </Typography>
        <List>
          {/* 여백 높이값 설정 */}
          <ListItemWrapper listTitleName="여백 높이값 설정">
            <Grid container item>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.spacingType`}
                  defaultValue={spacingType}
                  options={BLANK_SPACING_TYPE_OPTIONS}
                  onChangeRadio={(e) => {
                    switch (e.target.value) {
                      case BLANK_SPACING_TYPE.LARGE:
                        setValue(`${id}.${FORM_KEY.CONTENTS}.height`, BLANK_SPACING_SIZE.LARGE);
                        setShowHeightField(false);
                        break;
                      case BLANK_SPACING_TYPE.MEDIUM:
                        setValue(`${id}.${FORM_KEY.CONTENTS}.height`, BLANK_SPACING_SIZE.MEDIUM);
                        setShowHeightField(false);
                        break;
                      case BLANK_SPACING_TYPE.SMALL:
                        setValue(`${id}.${FORM_KEY.CONTENTS}.height`, BLANK_SPACING_SIZE.SMALL);
                        setShowHeightField(false);

                        break;
                      default:
                        const customHeight = getValues(`${id}.${FORM_KEY.CONTENTS}.customHeight`);
                        setValue(`${id}.${FORM_KEY.CONTENTS}.height`, customHeight);
                        setShowHeightField(true);
                        break;
                    }
                  }}
                />
              </Box>
              {showHeightField && (
                <Box sx={{ width: 300, mt: 3 }}>
                  <FormControlInput
                    name={`${id}.${FORM_KEY.CONTENTS}.customHeight`}
                    defaultValue={customHeight}
                    placeholder="여백의 높이값을 설정하세요"
                    inputProps={{ type: 'number', min: 0 }}
                  />
                </Box>
              )}
            </Grid>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* 백그라운드 컬러지정 */}
          <ListItemWrapper listTitleName="백그라운드 컬러지정">
            <Grid container item>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.colorType`}
                  defaultValue={colorType}
                  options={BLANK_COLOR_TYPE_OPTIONS}
                  onChangeRadio={(e) => {
                    switch (e.target.value) {
                      case BLANK_COLOR_TYPE.SINGLE:
                        setColorType(BLANK_COLOR_TYPE.SINGLE);
                        break;
                      case BLANK_COLOR_TYPE.GRADIENT:
                        setColorType(BLANK_COLOR_TYPE.GRADIENT);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </Box>
              <Grid container sx={{ alignItems: 'center', mt: 3 }}>
                <Grid item xs={2}>
                  <span>{colorType === BLANK_COLOR_TYPE.GRADIENT ? `시작점 (위)` : `색상`}</span>
                </Grid>
                <Grid item xs={10}>
                  <ControlColorPicker
                    sx={{ display: 'inline' }}
                    name={`${id}.${FORM_KEY.CONTENTS}.colors.${0}`}
                    defaultValue={colors[0] ?? ''}
                    colorSize="medium"
                  />
                </Grid>
              </Grid>
              {colorType === BLANK_COLOR_TYPE.GRADIENT && (
                <Grid container sx={{ alignItems: 'center', mt: 3 }}>
                  <Grid item xs={2}>
                    <span>끝점 (아래)</span>
                  </Grid>
                  <Grid item xs={10}>
                    <ControlColorPicker
                      sx={{ display: 'inline' }}
                      name={`${id}.${FORM_KEY.CONTENTS}.colors.${1}`}
                      defaultValue={colors[1] ?? ''}
                      colorSize="medium"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </ListItemWrapper>
        </List>
      </Paper>
      {/* 노출 기간 설정  */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          노출 기간 설정
        </Typography>
        <List>
          {/* 예약 설정 */}
          <ListItemWrapper listTitleName="예약 설정">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useDisplayDateTime`}
                    defaultValue={useDisplayDateTime}
                    onChangeSwitch={(value) => setIsUseDisplayDateTime(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseDisplayDateTime && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 노출 시작 */}
              <ListItemWrapper listTitleName="노출 시작">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlDatePickerLocal
                        name={`${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`}
                        defaultValue={displayStartDateTime}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              {/* 노출 종료 */}
              <ListItemWrapper listTitleName="노출 종료">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlDatePickerLocal
                        name={`${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`}
                        defaultValue={displayEndDateTime}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>
    </>
  );
};
