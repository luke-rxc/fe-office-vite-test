import type { ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';
import styled from '@emotion/styled';
import { MEDIA_VIEW_RATIO_TYPE } from '../constants';
import { FormControlRadioGroup, FormControlRadioGroupProps } from './form';
import { Box } from '@material-ui/core';

/**
 * 미디어 노출 비율 선택
 */
type ControlMediaRatioRadioProps<T> = Omit<FormControlRadioGroupProps<T>, 'options'> & {
  videoType?: boolean;
};
export const ControlMediaRatioRadio = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  videoType = true,
  ...props
}: ControlMediaRatioRadioProps<T>) => {
  let options: Array<{
    label: string | ReactNode;
    value: string;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  }> = [
    {
      label: (
        <>
          <ImageStyled>
            <span className="img-wrapper">
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                <img
                  width="100%"
                  src="https://cdn-image.prizm.co.kr/story/20220209/afe653bf-1e8a-47f1-b793-7bc06bb4ff46.png"
                  alt=""
                />
              </Box>
            </span>
            <span className="txt-wrapper">1:1 비율</span>
          </ImageStyled>
        </>
      ),
      value: MEDIA_VIEW_RATIO_TYPE.SQUARE,
      labelPlacement: 'top',
    },
    {
      label: (
        <ImageStyled>
          <span className="img-wrapper">
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '75%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  width="100%"
                  src="https://cdn-image.prizm.co.kr/story/20220209/afe653bf-1e8a-47f1-b793-7bc06bb4ff46.png"
                  alt=""
                />
              </div>
            </Box>
          </span>
          <span className="txt-wrapper">4:3 비율</span>
        </ImageStyled>
      ),
      value: MEDIA_VIEW_RATIO_TYPE.RECTANGLE_VERTICAL,
      labelPlacement: 'top',
    },
    {
      label: (
        <ImageStyled>
          <span className="img-wrapper">
            <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <img
                height="100%"
                src="https://cdn-image.prizm.co.kr/story/20220209/afe653bf-1e8a-47f1-b793-7bc06bb4ff46.png"
                alt=""
              />
            </Box>
          </span>
          <span className="txt-wrapper">3:4 비율</span>
        </ImageStyled>
      ),
      value: MEDIA_VIEW_RATIO_TYPE.RECTANGLE_HORIZONTAL,
      labelPlacement: 'top',
    },
    {
      label: (
        <ImageStyled>
          <span className="img-wrapper">
            <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '56%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  width="100%"
                  src="https://cdn-image.prizm.co.kr/story/20220209/afe653bf-1e8a-47f1-b793-7bc06bb4ff46.png"
                  alt=""
                />
              </div>
            </Box>
          </span>
          <span className="txt-wrapper">16:9 비율</span>
        </ImageStyled>
      ),
      value: MEDIA_VIEW_RATIO_TYPE.RECTANGLE_16BY9,
      labelPlacement: 'top',
    },
  ];

  if (!videoType) {
    options = options.slice(0, 3);
  }
  return <FormControlRadioGroup row name={name} defaultValue={defaultValue} options={options} />;
};

const ImageStyled = styled.span`
  display: inline-block;
  width: 100px;
  text-align: center;
  & > .img-wrapper {
    display: block;
    width: 100%;
    height: 100px;
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
  }
  & > .txt-wrapper {
    display: block;
    width: 100%;
  }
`;
