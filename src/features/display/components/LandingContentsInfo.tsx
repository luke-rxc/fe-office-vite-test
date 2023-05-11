import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface Props {
  id: number | string;
  name: string;
  link?: string;
}

export const LandingContentsInfo = ({ id, name, link = '#' }: Props) => {
  return (
    <Link to={link}>
      <Box>편성 ID: {id}</Box>
      {name}
    </Link>
  );
};
