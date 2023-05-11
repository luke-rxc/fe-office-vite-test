import styled from '@emotion/styled';
import createSvgIcon from '@material-ui/core/utils/createSvgIcon';

const Wrapper = styled.svg`
  path {
    fill: #bbb !important;
  }
`;

const SortDefault = createSvgIcon(
  <Wrapper xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <g>
      <path
        className="up"
        d="M442,186c0,6-2.6,11.9-6.8,16.2c-4.3,4.3-10.2,6.8-16.2,6.8H93c-6,0-11.9-2.6-16.2-6.8C72.5,198,70,192,70,186s2.6-11.9,6.8-16.2
 l163-163C244.1,2.6,250,0,256,0s11.9,2.6,16.2,6.8l163,163C439.5,174.1,442,180.1,442,186z"
      />
      <path
        d="M442,326c0,6-2.6,11.9-6.8,16.2l-163,163c-4.3,4.3-10.2,6.8-16.2,6.8s-11.9-2.6-16.2-6.8l-163-163
		c-4.3-4.3-6.8-10.2-6.8-16.2c0-6,2.6-11.9,6.8-16.2c4.3-4.3,10.2-6.8,16.2-6.8h326c6,0,11.9,2.6,16.2,6.8S442,319.1,442,326z
		 "
      />
    </g>
  </Wrapper>,
  'SortDefault',
);

export default SortDefault;
