import type { FC } from 'react';
import { Box } from '@material-ui/core';
import NavSection, { NavSectionProps } from '../components/NavSection';

interface NavSectionsProps {
  sections: Pick<NavSectionProps, 'items' | 'title'>[];
  pathname: string;
}

export const NavSections: FC<NavSectionsProps> = (props) => {
  const { sections, pathname } = props;

  return (
    <Box sx={{ p: 2 }}>
      {sections.map((section) => (
        <NavSection
          key={section.title}
          pathname={pathname}
          sx={{
            '& + &': {
              mt: 3,
            },
          }}
          {...section}
        />
      ))}
    </Box>
  );
};
