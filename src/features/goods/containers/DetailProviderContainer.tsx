import { Card, CardContent, CardHeader, Divider, Box, Grid, Typography, List, ListItem } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';
import { FormControlAutoComplete } from '@components/form';
import { useLogger, usePageType } from '../hooks';
import { useDetailProviderService } from '../services/detailProvider';
import { ComboModel, ProviderModel, StateModel } from '../models';
import { DetailSaleStatusOptions, DetailListTitleWidth, PageType } from '../constants';
import { ToggleButtonGroup } from '../components/form';

interface Props {
  providerInfo: ProviderModel;
  providerListOptions: ProviderModel[];
  mdListOptions: ComboModel[];
  managerListOptions: ComboModel[];
  initMdId?: number;
  initManagerId?: number;
  onSelectProvider: (provider: ProviderModel) => void;
}

const { provider: listTitleWidth } = DetailListTitleWidth;
export const DetailProviderContainer: React.FC<Props> = ({
  providerInfo,
  providerListOptions,
  mdListOptions,
  managerListOptions,
  initMdId,
  initManagerId,
  onSelectProvider: handleSelectProvider,
}) => {
  const { type: pageType, isPartnerSite } = usePageType();

  // 입점사
  const { handleChangeProvider, handleChangeMd, handleChangeManager } = useDetailProviderService({
    initMdId,
    initManagerId,
    mdListOptions,
    managerListOptions,
  });

  useLogger('DetailProviderContainer');

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader title="입점사/담당자 정보" />
          <Divider />
          <CardContent>
            {/* header */}

            <List>
              <Grid container>
                {pageType === PageType.MODIFY && (
                  <Grid item md={12} xs={12}>
                    <ListItemWrapper listTitleName="판매상태">
                      <ToggleButtonGroup name="status" options={DetailSaleStatusOptions} exclusive size="small" />
                    </ListItemWrapper>

                    <Divider sx={{ my: 3 }} />
                  </Grid>
                )}

                {!isPartnerSite && (
                  <>
                    <Grid item md={6} xs={12}>
                      <Typography color="textPrimary" variant="subtitle1" paragraph={true}>
                        입점사 정보
                      </Typography>
                      <Grid item>
                        <ListItemWrapper listTitleName="입점사 선택" isRequired>
                          <FormControlAutoComplete<StateModel>
                            name="providerInfo"
                            options={providerListOptions}
                            sx={{ width: '60%' }}
                            getOptionLabel={({ label }) => label ?? ''}
                            isOptionEqualToValue={(v: ProviderModel, o: ProviderModel) => v.value === o.value}
                            placeholder="입점사를 선택해주세요"
                            onChange={(values: ProviderModel) => {
                              handleSelectProvider(values);
                              handleChangeProvider(values);
                            }}
                            disabled={pageType === PageType.MODIFY}
                          />
                        </ListItemWrapper>
                      </Grid>
                      <Grid item>
                        {/* 입점사명 */}
                        <ListItemWrapper listTitleName="입점사명">
                          <Typography variant="body1">{providerInfo?.label ?? '입점사를 선택해주세요'}</Typography>
                        </ListItemWrapper>
                        {/* // 입점사명 */}

                        {/* 입점사 수수료 */}
                        <ListItemWrapper listTitleName="입점사 수수료">
                          <Typography variant="body1">
                            {providerInfo?.commissionRate ?? '입점사를 선택해주세요'}
                          </Typography>
                        </ListItemWrapper>
                        {/* // 입점사 수수료 */}
                      </Grid>
                    </Grid>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  </>
                )}

                <Grid item md={5} xs={12}>
                  <Typography color="textPrimary" variant="subtitle1" paragraph={true}>
                    담당자 정보
                  </Typography>
                  <Grid item>
                    {/* 담당자 정보 */}
                    <ListItemWrapper listTitleName="MD" isRequired>
                      <FormControlAutoComplete<StateModel>
                        name="adminMdInfo"
                        options={mdListOptions}
                        sx={{ width: '60%' }}
                        getOptionLabel={({ label }) => label ?? ''}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        placeholder="MD를 선택해주세요"
                        onChange={handleChangeMd}
                      />
                    </ListItemWrapper>
                    {/* // 담당자 정보 */}
                  </Grid>
                  <Grid item>
                    {/* 운영 담당자 정보 */}
                    <ListItemWrapper listTitleName="운영담당자">
                      <FormControlAutoComplete<StateModel>
                        name="adminGoodsManagerInfo"
                        options={managerListOptions}
                        sx={{ width: '60%' }}
                        getOptionLabel={({ label }) => label ?? ''}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        placeholder="담당자를 선택해주세요"
                        onChange={handleChangeManager}
                      />
                    </ListItemWrapper>
                    {/* // 운영 담당자 정보 */}
                  </Grid>
                </Grid>
              </Grid>
            </List>
            {/* // header */}

            {/* // info */}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

const ListItemWrapper = ({
  listTitleName,
  isRequired,
  children,
}: {
  listTitleName?: string;
  isRequired?: boolean;
  children: React.ReactNode;
}) => (
  <ListItem>
    {listTitleName && <ListTitle name={listTitleName} isRequired={isRequired} width={listTitleWidth} />}
    {children}
  </ListItem>
);
