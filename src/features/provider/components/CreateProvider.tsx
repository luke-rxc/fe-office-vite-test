import type { VFC } from 'react';
import { List, Box } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { Modal } from '@components/Modal';
import { BUSINESS_TYPE, BUSINESS_TYPE_OPTIONS } from '../constants';
import { CreateProviderFiledModel } from '../models';
import { FormControlRadioGroup, FormControlTextField } from './form';
import { ListItemWrapper } from './Styled';

/**
 * 입점사 등록
 */
type CreateProviderProps = {
  onConfirm: () => void;
  onCancel: () => void;
};
export const CreateProvider: VFC<CreateProviderProps> = ({ onConfirm, onCancel }) => {
  return (
    <>
      <Modal
        title="입점사등록"
        open={true}
        width={1000}
        maxWidth="initial"
        cancelText="닫기"
        confirmText={
          <>
            <SaveIcon />
            &nbsp;등록
          </>
        }
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={onCancel}
      >
        <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <ListItemWrapper listTitleName="사업자 유형">
            <Box sx={{ width: '100%' }}>
              <FormControlRadioGroup<CreateProviderFiledModel>
                row
                name="businessType"
                defaultValue={BUSINESS_TYPE.INDIVIDUAL}
                options={BUSINESS_TYPE_OPTIONS}
              />
            </Box>
          </ListItemWrapper>
          <ListItemWrapper listTitleName="입점사명">
            <Box sx={{ width: '100%' }}>
              <FormControlTextField<CreateProviderFiledModel>
                name="name"
                label="입점사명"
                placeholder="입점사명을 입력해 주세요."
                sx={{ width: '100%' }}
              />
            </Box>
          </ListItemWrapper>
          <ListItemWrapper listTitleName="사업자 번호">
            <Box sx={{ width: '100%' }}>
              <FormControlTextField<CreateProviderFiledModel>
                name="businessNumber"
                label="사업자번호"
                placeholder="사업자번호를 입력해 주세요."
                sx={{ width: '100%' }}
                inputProps={{ max: 12 }}
              />
            </Box>
          </ListItemWrapper>
        </List>
      </Modal>
    </>
  );
};
