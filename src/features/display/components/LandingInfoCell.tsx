import { Box } from '@material-ui/core';

interface Props {
  typeLabel: string;
  id: number | string;
}

export const LandingInfoCell = ({ typeLabel, id }: Props) => {
  return (
    <>
      <Box>{typeLabel}</Box>
      <Box>(ID: {id})</Box>
    </>
  );
};
