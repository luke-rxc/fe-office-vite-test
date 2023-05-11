import { Link } from 'react-router-dom';
import type { VFC } from 'react';
import { List, Box, Grid } from '@material-ui/core';
import { ProviderBrandModel } from '../models';
import { ListItemWrapper } from './Styled';

/**
 * 입점사 브랜드
 */
type ProviderBrandProps = {
  brands: ProviderBrandModel[];
};

export const ProviderBrand: VFC<ProviderBrandProps> = ({ brands }) => {
  return (
    <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <ListItemWrapper listTitleName="브랜드 정보" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {brands.map((brand: ProviderBrandModel) => (
              <Grid item xs={12} key={brand.id}>
                <Link
                  to={`../../brands/${brand.id}`}
                  key={brand.id}
                  style={{
                    color: '#1976d2',
                    textDecoration: 'underline',
                  }}
                >
                  {brand.name} [{brand.id}]
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ListItemWrapper>
    </List>
  );
};
