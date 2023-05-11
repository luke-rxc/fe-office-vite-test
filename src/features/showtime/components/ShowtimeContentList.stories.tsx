import { TableColumnProps } from '@components/table/Table';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ShowtimeContentsModel, toShowtimeContentsModelList } from '../models';
import { showtimeContentsSchemaMock } from '../__mocks__/showtimeContentsSchemaMock';
import { ShowtimeContentList } from './ShowtimeContentList';

export default {
  title: 'Features/Showtime/ShowtimeContentList',
  component: ShowtimeContentList,
} as ComponentMeta<typeof ShowtimeContentList>;

const Template: ComponentStory<typeof ShowtimeContentList> = (args) => {
  const items = toShowtimeContentsModelList(showtimeContentsSchemaMock.content);
  return <ShowtimeContentList {...args} items={items} />;
};

export const Default = Template.bind({});
Default.args = {
  columns: [
    {
      label: '라이브 ID',
      dataKey: 'id',
      align: 'center',
      width: '80px',
    },
    {
      label: '콘텐츠 타입',
      dataKey: 'contentsTypeText',
      align: 'center',
      width: '100px',
    },
    {
      label: '콘텐츠 제목',
      dataKey: 'title',
    },
    {
      label: '쇼룸',
      dataKey: 'showRoomName',
      align: 'center',
    },
    {
      label: '상품 정보',
      dataKey: 'goodsName',
      render: (value, item) => {
        return (
          <>
            <div>{value}</div>
            {item.goodsCountText ? <div>{item.goodsCountText}</div> : null}
          </>
        );
      },
    },
    {
      label: '대표이미지',
      dataKey: 'primaryImage.path',
    },
    {
      label: '라이브 시작일시',
      dataKey: 'liveStartDateText',
      align: 'center',
      width: '130px',
    },
    {
      label: 'Live 상태',
      dataKey: 'liveStatusText',
      align: 'center',
    },
    {
      label: '공개 상태',
      dataKey: 'openStatusText',
      align: 'center',
    },
  ] as Array<TableColumnProps<ShowtimeContentsModel>>,
};
