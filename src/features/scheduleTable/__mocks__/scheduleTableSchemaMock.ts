import { ScheduleTableItemSchema } from '../schemas';

export const scheduleTableItemSchemaListMock: Array<ScheduleTableItemSchema> = [
  {
    id: 65,
    scheduleDate: 1652850420000,
    type: 'LIVE',
    bannerType: 'NONE',
    scheduled: false,
    showRoom: {
      id: 21228,
      name: '솔트레인',
      primaryImage: {
        id: 33491,
        path: 'showroom/20220302/9f9023ad-b88c-4386-85e8-70508c69576c.png',
        originalFileName: 'saltrain.png',
        extension: 'png',
        width: 512,
        height: 512,
      },
    },
    liveContents: { id: 21341, contentsType: 'STANDARD', title: 'test' },
  },
  {
    id: 67,
    scheduleDate: 1652928480000,
    type: 'LIVE',
    bannerType: 'NONE',
    scheduled: false,
    showRoom: {
      id: 21246,
      name: '심플리오',
      primaryImage: {
        id: 35870,
        path: 'showroom/20220308/6dc3d15d-00cd-42d3-b647-acce7c9954c7.png',
        originalFileName: 'simple0.png',
        extension: 'png',
        width: 512,
        height: 512,
      },
    },
    liveContents: { id: 21343, contentsType: 'STANDARD', title: '12313' },
  },
  {
    id: 66,
    scheduleDate: 1652952600000,
    type: 'LIVE',
    bannerType: 'NONE',
    scheduled: false,
    showRoom: {
      id: 21247,
      name: '벨레',
      primaryImage: {
        id: 47881,
        path: 'showroom/20220315/26d6d754-e49d-4971-85ba-e4521646bb38.jpg',
        originalFileName: 'wells.png',
        extension: 'jpg',
        width: 512,
        height: 512,
      },
    },
    liveContents: { id: 21342, contentsType: 'STANDARD', title: '벨레 Test' },
  },
  {
    id: 64,
    scheduleDate: 1653114840000,
    type: 'LIVE',
    bannerType: 'BUTTON',
    scheduled: true,
    showRoom: {
      id: 21249,
      name: '시에라디자인',
      primaryImage: {
        id: 38406,
        path: 'showroom/20220310/a6b47239-f4c6-4128-a255-055583f043d0.jpg',
        originalFileName: 'sierradesign.png',
        extension: 'jpg',
        width: 512,
        height: 512,
      },
    },
    liveContents: { id: 21340, contentsType: 'STANDARD', title: 'test' },
  },
];
