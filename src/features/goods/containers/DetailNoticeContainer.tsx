import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, Divider, List, ListItem, Box } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';
import { FormControlSelect } from '@components/form';
import { DetailNoticeTable } from '../components/detailNotice';
import { DetailToolTip } from '../components/detail';
import { useDetailNoticeService } from '../services/detailNotice';
import { StateModel } from '../models';
import { useLogger } from '../hooks';

export const DetailNoticeContainer: React.FC = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const { noticeInfos, fields, handleChangeTemplateType, handleContentsFill } = useDetailNoticeService();

  // logger
  useLogger('DetailNoticeContainer');

  return (
    <Card>
      <CardHeader title="상품정보제공고시" />
      <Divider />
      <CardContent>
        <List>
          <ListItem>
            <Box sx={{ width: 18, height: 18, flexShrink: 0 }}>
              <DetailToolTip message="판매하고자 하는 상품의 상품군을 선택하여, 상품정보제공고시를 입력해주세요." />
            </Box>
            <ListTitle name="상품군 선택" sx={{ ml: 1 }} />
            <FormControlSelect<StateModel>
              label="상품군 선택"
              name="noticeType"
              options={noticeInfos?.options ?? []}
              onChange={handleChangeTemplateType}
              showError
              sx={{ width: '500px' }}
            />
          </ListItem>
        </List>
        <DetailNoticeTable items={fields} errors={errors} onContentsFill={handleContentsFill} />
      </CardContent>
    </Card>
  );
};
