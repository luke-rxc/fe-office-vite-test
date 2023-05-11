import { ContentSchema } from '../schemas';

export const apiSchemaMock: ContentSchema = {
  componentList: [
    {
      componentGroup: 'LIVE',
      componentType: 'LIVE',
      contents: '{}',
      goodsList: [],
      hide: false,
      sortNumber: 3,
      liveList: [
        {
          contentsType: 'STANDARD',
          goodsCount: 3,
          goodsName: '아모레퍼시픽 상품',
          id: 7,
          liveStartDate: 1627028361000,
          liveStatus: 'LIVE',
          openStatus: 'PUBLIC',
          primaryImage: {
            // 대표이미지
            blurHash: 'U8MQFHr9M_tl0I.AI9tl00%%%iDi004m~pR4',
            height: 2776,
            id: 177,
            path: 'goods/20211123/945a6e6f-a005-4719-87a8-c658f037cd1b.png',
            width: 1560,
          },
          showRoomName: '나이키',
          sortNumber: 0,
          title: '일반형 쇼타임 콘텐츠',
        },
      ],
    },
    {
      componentGroup: 'MEDIA_VIEWER',
      componentType: 'MEDIA_VIEWER_A',
      contents:
        '{"mediaLists":[{"id":11047,"type":"IMAGE","path":"story/20211117/1c4e72ca-28af-4c52-ad8d-3ee890f8cd08.png","width":0,"height":0,"fileSize":135220,"extension":"png","posterImage":""},{"id":11048,"type":"IMAGE","path":"story/20211117/4dbfc2f3-da0f-4800-a65b-205da5195375.png","width":0,"height":0,"fileSize":3214,"extension":"png","posterImage":""},{"id":11050,"type":"IMAGE","path":"story/20211117/083fee78-65a2-426c-aaad-dea42fe48377.png","width":0,"height":0,"fileSize":605089,"extension":"png","posterImage":""},{"id":11068,"path":"story/20211117/ce29017a-7561-4c79-8a70-8eb6eb5bf5ea/720p.mp4","width":1280,"height":720,"fileSize":578189,"extension":"mp4","posterImage":"story/20211117/ce29017a-7561-4c79-8a70-8eb6eb5bf5ea/720p.0000000.jpg","type":"VIDEO"}]}',
      goodsList: [],
      hide: false,
      liveList: [],
      sortNumber: 0,
    },
    {
      componentGroup: 'TEXT',
      componentType: 'TEXT',
      contents:
        '{"title":{"text":"Made with high standards of animal welfare","bold":false,"color":"#ff0000","sizeType":"LARGE"}}',
      goodsList: [],
      hide: false,
      liveList: [],
      sortNumber: 0,
    },
    /* {
      componentGroup: 'HEADER',
      componentType: 'HEADER',
      contents: '{}',
      //  '{"backround":[{"color":"#ff0000","extension":"jpg","fileSize":2222,"height":100,"id":null,"path":"showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064","type":"IMAGE","width":100}],"logoImage":[{"color":"#ff0000","extension":"jpg","fileSize":2222,"height":100,"id":null,"path":"showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064","type":"IMAGE","width":100}]}',
      goodsList: [],
      hide: true,
      liveList: [],
      sortNumber: 0,
    },*/
    /*    {
      componentGroup: 'BLANK',
      componentType: 'BLANK',
      contents: '{"height":100}',
      goodsList: [],
      hide: true,
      liveList: [],
      sortNumber: 0,
    },
    {
      componentGroup: 'FOOTER',
      componentType: 'FOOTER',
      contents:
        '{"color":"#ff0000","background":{"type":"IMAGE","color":"","url":"https://img.29cm.co.kr/next-edition/2021/10/06/c05dcc1c73c44ed3a93f0ebc7d331511_20211006094957.jpg?width=500","width":600,"height":1080},"isOverlay":true}',
      goodsList: [],
      hide: true,
      liveList: [],
      sortNumber: 0,
    },*/
  ],
  contentName: '컨텐츠 오피스 테스트입니다.',
  type: 'STORY',
  publicEndDate: 1635994133682,
  publicStartDate: 1635994133682,
  revisionId: 0,
  showroom: {
    backgroundColor: 'string',
    brandId: 0,
    brandName: 'nike',
    code: 'string',
    coverImage: {
      extension: 'string',
      height: 0,
      id: 0,
      path: 'showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064',
      width: 0,
    },
    coverVideo: {
      extension: 'string',
      fileSize: 0,
      height: 0,
      id: 0,
      path: 'string',
      width: 0,
    },
    description: 'string',
    id: 0,
    keywords: [
      {
        id: 0,
        name: 'string',
      },
    ],
    name: '나이키+아디다스',
    primaryImage: {
      extension: 'string',
      height: 0,
      id: 0,
      path: 'string',
      width: 0,
    },
    providerId: 0,
    providerName: 'string',
    status: 'ADMIN_PUBLIC',
    textColor: 'string',
  },
  status: 'ADMIN_PUBLIC',
};
