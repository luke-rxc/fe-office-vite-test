import { useState, useEffect } from 'react';
import type { VFC } from 'react';
import { Badge, Box, Button, Grid, OutlinedInput } from '@material-ui/core';
import {
  FORM_KEY,
  CTA_BUTTON_TYPE,
  CTA_LABEL_MAX_NUM,
  CTA_BUTTON_ACTION_TYPE,
  CTA_BUTTON_ACTION_TYPE_OPTIONS,
} from '../constants';
import { FormContentCtaButtonModel } from '../models';
import { getPlaceHolderLabel } from '../utils';
import { FormControlSelect, FormControlInput, FormControlCheckbox } from './form';
import { ControlColorPicker } from './ControlColorPicker';
import { ListItemWrapper } from './Styled';
import { TextController } from './TextController';
import { Tooltip } from './Tooltip';

/**
 * CTA 버튼 관리
 */
type CTAButtonProps = {
  id: number;
  index: number;
  button: FormContentCtaButtonModel;
  buttonStyle: CTA_BUTTON_TYPE;
  listLength: number;
  onRemoveButton: (index: number) => void;
};
export const CTAButton: VFC<CTAButtonProps> = ({
  id,
  index,
  button,
  buttonStyle,
  listLength,
  onRemoveButton: handleRemoveButton,
}) => {
  const [buttonType, setButtonType] = useState<CTA_BUTTON_ACTION_TYPE>(button.buttonActionType);
  const [placeholderText, setPlaceholderText] = useState<string>('');

  useEffect(() => {
    setPlaceholderText(getPlaceHolderLabel(buttonType));
  }, [buttonType]);

  return (
    <Box sx={{ border: '1px solid #c3c3c3', borderRadius: 1, pt: 0, pb: 3, pl: 1, pr: 1 }}>
      <Badge color="secondary" badgeContent={index + 1} sx={{ ml: 3, mt: 2 }}></Badge>
      {/* 버튼 배경 컬러 */}
      {(buttonStyle === CTA_BUTTON_TYPE.FILL_CENTER || buttonStyle === CTA_BUTTON_TYPE.FILL_LEFT) && (
        <ListItemWrapper listTitleName="버튼 배경 컬러">
          <Box sx={{ width: '100%' }}>
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                <ControlColorPicker
                  sx={{ display: 'inline' }}
                  name={`${id}.${FORM_KEY.CONTENTS}.buttons.${index}.bg`}
                  defaultValue={button?.bg}
                  label="배경 컬러"
                  colorSize="medium"
                />
              </Box>
            </Grid>
          </Box>
        </ListItemWrapper>
      )}
      {/* 버튼 텍스트 및 컬러 */}
      <ListItemWrapper listTitleName="버튼 텍스트 및 컬러">
        <Box sx={{ width: '100%' }}>
          <Grid container item>
            <Box sx={{ width: '100%' }} key={index}>
              <TextController
                textInputProps={{
                  name: `${id}.${FORM_KEY.CONTENTS}.buttons.${index}.label.text`,
                  defaultValue: button.label.text,
                  placeholder: `버튼 레이블을 입력하세요 (띄워쓰기 포함 최대 ${CTA_LABEL_MAX_NUM}자 이내)`,
                  inputProps: { max: CTA_LABEL_MAX_NUM },
                }}
                textColorProps={{
                  name: `${id}.${FORM_KEY.CONTENTS}.buttons.${index}.label.color`,
                  defaultValue: button.label.color,
                  label: '텍스트 컬러',
                }}
              />
            </Box>
          </Grid>
        </Box>
      </ListItemWrapper>
      {/* 랜딩 URL 설정 */}
      <ListItemWrapper
        listTitleName={
          <>
            랜딩 URL 설정
            <span style={{ position: 'absolute' }}>
              <Tooltip
                text={
                  <>
                    *사용자가 버튼 클릭시 랜딩될 위치의 URL 등록 하세요.
                    <br />
                    <br />
                    - 외부 링크: 외부 URL 등록
                    <br />- 내부 링크: 정의된 ID 등록
                  </>
                }
              ></Tooltip>
            </span>
          </>
        }
      >
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormControlSelect
                name={`${id}.${FORM_KEY.CONTENTS}.buttons.${index}.buttonActionType`}
                defaultValue={button.buttonActionType}
                label="버튼 타입"
                options={CTA_BUTTON_ACTION_TYPE_OPTIONS}
                displayEmpty
                sx={{ width: '100%' }}
                onChangeSelect={(e) => {
                  setButtonType(e.target.value);
                }}
              ></FormControlSelect>
            </Grid>
            <Grid container item xs={9}>
              <Grid container item xs={12} spacing={1}>
                {buttonType === CTA_BUTTON_ACTION_TYPE.DEEP_LINK && (
                  <Grid item xs={4}>
                    <OutlinedInput disabled value="prizm://prizm.co.kr"></OutlinedInput>
                  </Grid>
                )}
                <Grid item xs={buttonType === CTA_BUTTON_ACTION_TYPE.DEEP_LINK ? 8 : 12}>
                  <FormControlInput
                    name={`${id}.${FORM_KEY.CONTENTS}.buttons.${index}.value`}
                    defaultValue={button.value}
                    sx={{ width: '100%' }}
                    placeholder={placeholderText}
                  />
                </Grid>
              </Grid>
              {buttonType === CTA_BUTTON_ACTION_TYPE.EXTERNAL_WEB && (
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlCheckbox
                    name={`${id}.${FORM_KEY.CONTENTS}.buttons.${index}.isRequiredLogin`}
                    defaultChecked={button.isRequiredLogin}
                    label="랜딩시 로그인 여부 체크"
                  />
                  <Tooltip
                    text={
                      <>
                        *사용자가 버튼 클릭시 로그인 여부가 필요한 case의 경우 설정.
                        <br />
                        ex.회원만 참여 가능한 이벤트 신청 페이지 랜딩시
                      </>
                    }
                  ></Tooltip>
                </Grid>
              )}
              {buttonType === CTA_BUTTON_ACTION_TYPE.DEEP_LINK && (
                <>
                  <Box
                    component="a"
                    href="https://rxc.notion.site/URL-83c993e77db643c5b685f5d967ce2a8d"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 1, color: '#f50057', fontSize: 12 }}
                  >
                    URL 입력 가이드 &gt;
                  </Box>
                  <Box component="span" sx={{ mt: 1, ml: 1, color: '#5664d2', fontSize: 12 }}>
                    (i) 상품 상세 / 쇼룸 / 콘텐츠 URL 랜딩은 모바일 웹 내 이동도 제공합니다.
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </ListItemWrapper>
      {listLength !== 1 && (
        <div style={{ textAlign: 'right' }}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ textAlign: 'right', minWidth: 80 }}
            onClick={() => handleRemoveButton(index)}
          >
            삭제
          </Button>
        </div>
      )}
    </Box>
  );
};
