import { useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Divider, Grid, List, Paper, Typography } from '@material-ui/core';
import {
  ContentFormModel,
  ContentModel,
  FormContentDealAUploaderModel,
  FormContentDealAModel,
  GoodsModel,
} from '../../models';
import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  DEAL_A_COLUMN_TYPE,
  DEAL_A_DESC_MAX_NUM,
  DEAL_A_SUBTITLE_MAX_NUM,
  DEAL_A_TITLE_MAX_NUM,
  FORM_KEY,
} from '../../constants';
import { useContentContext } from '../../hooks';
import { useMediaService } from '../../services';
import { getGoodsTextColor, getInitFileInfo } from '../../utils';
import { DisplayDeal } from '../DisplayDeal';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { TextController } from '../TextController';
import { MediaFileUploader } from '../MediaFileUploader';
import { ControlColorPicker } from '../ControlColorPicker';
import { GuideText, ListItemWrapper } from '../Styled';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 상품 A 컴포넌트
 */
type ContentDealAProps = {
  content: ContentModel;
};
export const ContentDealA: VFC<ContentDealAProps> = ({ content }) => {
  const { id, goodsList: goodsDisplayList = [] } = content;
  const { updateGoodsContent } = useContentContext();
  const { getValues, setValue } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    useText,
    align,
    textEffect,
    title,
    subTitle,
    description,
    goodsColumnType,
    fillColumn,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    isOverlay,
    goodsColor,
    isGoodsDefaultColor,
  } = formValue[FORM_KEY.CONTENTS] as FormContentDealAModel;
  // 미디어 업로드 정보
  const { backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentDealAUploaderModel;

  const [isUseText, setIsUseText] = useState<boolean>(useText);
  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);

  // background Image form Value 처리
  const {
    fileInfo: backgroundMediaFileInfo,
    handleChange: handleChangeBackgroundMedia,
    handleRemove: handleRemoveBackgroundMedia,
    fileErrors: backgroundMediaFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(backgroundMedia),
    singleType: true,
    id,
    formKey: 'backgroundMedia',
  });

  const handleChangeList = (list: GoodsModel[]) => {
    const goodsIdList = list.map((goods) => goods.goodsId);
    // display 상품 리스트 업데이트
    updateGoodsContent(id, list);
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    setValue(`${id}.${FORM_KEY.GOODS_LIST}`, [...goodsIdList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleChangeDefaultColor = useCallback(
    (value: BOOLEAN_VALUE_TYPE) => {
      const goodsTextColor = getGoodsTextColor(value === BOOLEAN_VALUE_TYPE.T);
      setValue(`${id}.${FORM_KEY.CONTENTS}.goodsColor`, goodsTextColor);
    },
    [id, setValue],
  );

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      useText,
      align,
      textEffect,
      title,
      subTitle,
      description,
      goodsColumnType,
      fillColumn,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      isOverlay,
      goodsColor,
      isGoodsDefaultColor,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="상품 리스트 타입"
        previewImage={['story/20220209/69fa5083-518f-460a-a8e7-04da50b2d048.png']}
      />

      {/* 리스트타입 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          리스트 타입 상세 설정
        </Typography>
        <List>
          {/* 리스트타입 */}
          <ListItemWrapper listTitleName="상품리스트 노출">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.goodsColumnType`}
                    defaultValue={goodsColumnType}
                    options={[
                      { label: '2열', value: DEAL_A_COLUMN_TYPE.TWO_COLUMN },
                      { label: '1열', value: DEAL_A_COLUMN_TYPE.ONE_COLUMN },
                    ]}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 상품이미지 여백 */}
          <ListItemWrapper listTitleName="상품이미지 여백">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.fillColumn`}
                    defaultValue={fillColumn}
                    options={[
                      { label: '여백있음', value: BOOLEAN_VALUE_TYPE.F },
                      { label: '여백없음', value: BOOLEAN_VALUE_TYPE.T },
                    ]}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 텍스트 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트
        </Typography>
        <List>
          {/* 텍스트 */}
          <ListItemWrapper listTitleName="텍스트 등록">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useText`}
                    defaultValue={useText}
                    onChangeSwitch={(value) => setIsUseText(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseText && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 텍스트 배치 */}
              <ListItemWrapper listTitleName="텍스트 배치">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlRadioGroup
                        row
                        name={`${id}.${FORM_KEY.CONTENTS}.align`}
                        defaultValue={align}
                        options={[
                          { label: '좌측(가로) 정렬', value: ALIGN_TYPE.LEFT },
                          { label: '중앙(가로) 정렬', value: ALIGN_TYPE.CENTER },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 텍스트 효과 */}
              <ListItemWrapper listTitleName="텍스트 효과">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlRadioGroup
                        row
                        name={`${id}.${FORM_KEY.CONTENTS}.textEffect`}
                        defaultValue={textEffect}
                        options={[
                          { label: '모션적용', value: BOOLEAN_VALUE_TYPE.T },
                          { label: '고정', value: BOOLEAN_VALUE_TYPE.F },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 타이틀 */}
              <ListItemWrapper listTitleName="타이틀 (선택)">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <TextController
                        textInputProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.title.text`,
                          defaultValue: title?.text,
                          placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${DEAL_A_TITLE_MAX_NUM}자 이내)`,
                          inputProps: { max: DEAL_A_TITLE_MAX_NUM },
                          multiline: true,
                        }}
                        textBoldProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.title.bold`,
                          defaultValue: title?.bold,
                        }}
                        textColorProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.title.color`,
                          defaultValue: title?.color,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 서브 타이틀(선택) */}
              <ListItemWrapper listTitleName="서브타이틀 (선택)">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <TextController
                        textInputProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.subTitle.text`,
                          defaultValue: subTitle?.text,
                          placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${DEAL_A_SUBTITLE_MAX_NUM}자 이내)`,
                          inputProps: { max: DEAL_A_SUBTITLE_MAX_NUM },
                          multiline: true,
                        }}
                        textBoldProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.subTitle.bold`,
                          defaultValue: subTitle?.bold,
                        }}
                        textColorProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.subTitle.color`,
                          defaultValue: subTitle?.color,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 디스크립션(선택) */}
              <ListItemWrapper listTitleName="디스크립션 (선택)">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <TextController
                        textInputProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.description.text`,
                          defaultValue: description?.text,
                          placeholder: `디스크립션을 입력하세요 (띄워쓰기 포함 최대 ${DEAL_A_DESC_MAX_NUM}자 이내)`,
                          inputProps: { max: DEAL_A_DESC_MAX_NUM },
                          multiline: true,
                        }}
                        textBoldProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.description.bold`,
                          defaultValue: description?.bold,
                        }}
                        textColorProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.description.color`,
                          defaultValue: description?.color,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>

      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드 설정
        </Typography>
        <List>
          {/* 백그라운드 등록 */}
          <ListItemWrapper listTitleName="백그라운드 등록">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <Grid container item>
                  <Box sx={{ width: '100%' }}>
                    <FormControlRadioGroup
                      row
                      name={`${id}.${FORM_KEY.CONTENTS}.backgroundType`}
                      defaultValue={bgType}
                      options={[
                        { label: '이미지 업로드', value: CONTENT_BACKGROUND_TYPE.MEDIA },
                        { label: '컬러 지정', value: CONTENT_BACKGROUND_TYPE.COLOR },
                      ]}
                      onChangeRadio={(e) => {
                        switch (e.target.value) {
                          case CONTENT_BACKGROUND_TYPE.MEDIA:
                            setBgType(CONTENT_BACKGROUND_TYPE.MEDIA);
                            break;
                          case CONTENT_BACKGROUND_TYPE.COLOR:
                            setBgType(CONTENT_BACKGROUND_TYPE.COLOR);
                            break;
                          default:
                            break;
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Grid container>
                  {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box>
                          <MediaFileUploader
                            fileInfos={backgroundMediaFileInfo.length ? [backgroundMediaFileInfo[0]] : []}
                            width={300}
                            height={400}
                            accept="image/*"
                            multiple={false}
                            maxFiles={backgroundMediaFileInfo.length ? undefined : 1}
                            emptyStatus={!backgroundMediaFileInfo.length}
                            emptyStatusText="IMAGE"
                            fileError={backgroundMediaFileErrors.length ? backgroundMediaFileErrors[0] : null}
                            onChange={(files) => {
                              if (files.length > 0) {
                                handleChangeBackgroundMedia(files);
                              }
                            }}
                            onRemove={(index) => {
                              handleRemoveBackgroundMedia(index);
                            }}
                          />
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <GuideText
                            title="이미지 가이드"
                            desc={[
                              '권장 이미지 사이즈: (최소)1080 x 1440 ~ (최대) 1080 x 1920px',
                              '이미지 파일 형식: jpg, png',
                            ]}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {bgType === CONTENT_BACKGROUND_TYPE.COLOR && (
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%' }}>
                        <ControlColorPicker
                          sx={{ display: 'inline' }}
                          name={`${id}.${FORM_KEY.CONTENTS}.backgroundColor`}
                          defaultValue={backgroundColor}
                          colorSize="medium"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </ListItemWrapper>
          {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 이미지 딤드 */}
              <ListItemWrapper listTitleName="이미지 딤드 처리">
                <FormControlSwitch name={`${id}.${FORM_KEY.CONTENTS}.isOverlay`} defaultValue={isOverlay} />
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>

      {/* 상품 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          전시 상품 관리
        </Typography>
        {/* 상품 정보 텍스트 컬러 */}
        <ListItemWrapper listTitleName="상품 정보 텍스트 컬러">
          <Box sx={{ width: '100%' }}>
            <FormControlRadioGroup
              row
              name={`${id}.${FORM_KEY.CONTENTS}.isGoodsDefaultColor`}
              defaultValue={isGoodsDefaultColor}
              options={[
                { label: 'Black', value: BOOLEAN_VALUE_TYPE.T },
                { label: 'White', value: BOOLEAN_VALUE_TYPE.F },
              ]}
              onChangeRadio={(e) => handleChangeDefaultColor(e.target.value)}
            />
            <Typography sx={{ mt: 1 }} color="secondary" variant="body2">
              * 지정한 텍스트 컬러는 등록된 모든 전시 상품 정보에 반영됩니다.
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <Box sx={{ mt: 2 }}>
          <DisplayDeal componentId={id} goodsList={goodsDisplayList} onChangeList={handleChangeList} />
        </Box>
      </Paper>
    </>
  );
};
