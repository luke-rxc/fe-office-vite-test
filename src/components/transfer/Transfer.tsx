/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import isEqual from 'lodash/isEqual';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, List, IconButton } from '@material-ui/core';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import KeyboardTabOutlinedIcon from '@material-ui/icons/KeyboardTabOutlined';
import { TransferHeader } from './TransferHeader';
import { TransferItem } from './TransferItem';

type TListInfo = {
  size: number;
  checkedSize: number;
  readOnlySize: number;
};

export type TListItem = {
  value: string | number;
  label: string;
  readOnly?: boolean;
  checked?: boolean;
};

/**
 * interface for Transfer
 */
export interface ITransferProps {
  leftList: TListItem[];
  rightList: TListItem[];
  height?: string;
  /** 좌측 리스트에 표시할 헤더 정보 */
  leftHeader?: React.ReactNode;
  /** 우측 리스트에 표시할 헤더 정보 */
  rightHeader?: React.ReactNode;
  disabled?: boolean;
  onChange?: (leftValues: (string | number)[], rightValues: (string | number)[]) => void;
}

/**
 * Transfer 컴포넌트
 */
export const Transfer: React.FC<ITransferProps> = ({
  leftList: originLeftList,
  rightList: originRightList,
  leftHeader,
  rightHeader,
  disabled,
  height,
  onChange,
}) => {
  const styles = useStyles({ height });
  const prevRightList = React.useRef(null);
  const prevLeftList = React.useRef(null);

  // 마운트 여부 체크를 위한 상태값
  const [isMounted, setMountState] = React.useState(false);
  // 좌/우 리스트의 아이템 위치 변화 체크를 위한 상태값
  const [changed, setChanged] = React.useState(false);
  // 오른쪽 리스트
  const [rightList, setRightList] = React.useState(createListMap(originRightList));
  // 왼쪽 리스트
  const [leftList, setLeftList] = React.useState(createListMap(originLeftList));
  // 좌/우 리스트의 정보 데이터
  const [leftListInfo, rightListInfo] = React.useMemo(() => {
    return [toListInfoModel(leftList), toListInfoModel(rightList)];
  }, [leftList, rightList]);

  /**
   * value값에 해당하는 좌측 아이템 checked 토글
   */
  const handleToggleSelectLeftItem = (key: string) => () => {
    toggleSelectItem(key, leftList, setLeftList);
  };

  /**
   * value값에 해당하는 우측 아이템 checked 토글
   */
  const handleToggleSelectRightItem = (key: string) => () => {
    toggleSelectItem(key, rightList, setRightList);
  };

  /**
   * 좌측 모든 아이템 일괄 checked 선택/선택해제
   */
  const handleToggleSelectAllLeftList = () => {
    toggleSelectAllItems(leftList, leftListInfo, setLeftList);
  };

  /**
   * 우측 모든 아이템 일괄 checked 선택/선택해제
   */
  const handleToggleSelectAllRightList = () => {
    toggleSelectAllItems(rightList, rightListInfo, setRightList);
  };

  /**
   * 선택된 우측 아이템을 좌측으로 이동
   */
  const handleMoveToLeft = () => {
    if (isPossibleMove(rightListInfo)) {
      setChanged(true);
      moveTo(rightList, leftList, setRightList, setLeftList);
    }
  };

  /**
   * 선택된 좌측 아이템을 우측으로 이동
   */
  const handleMoveToRight = () => {
    if (isPossibleMove(leftListInfo)) {
      setChanged(true);
      moveTo(leftList, rightList, setLeftList, setRightList);
    }
  };

  /**
   * 모든 우측 아이템을 좌측으로 이동
   */
  const handleMoveToAllLeft = () => {
    if (isPossibleMoveAll(rightListInfo)) {
      setChanged(true);
      moveToAll(rightList, leftList, setRightList, setLeftList);
    }
  };

  /**
   * 모든 좌측 아이템을 우측으로 이동
   */
  const handleMoveToAllRight = () => {
    if (isPossibleMoveAll(leftListInfo)) {
      setChanged(true);
      moveToAll(leftList, rightList, setLeftList, setRightList);
    }
  };

  // originRightList, originLeftList의 값이 변경되면 리스트 갱신
  React.useEffect(() => {
    if (!isEqual(prevRightList.current, originRightList) || !isEqual(prevLeftList.current, originLeftList)) {
      prevRightList.current = originRightList;
      prevLeftList.current = originLeftList;

      setRightList(createListMap(originRightList));
      setLeftList(createListMap(originLeftList));
    }
  }, [originRightList, originLeftList]);

  // 리스트의 값이 변경됨에 따라 props로 받은 onChange 함수 실행
  React.useEffect(() => {
    if (isMounted && changed) {
      onChange && onChange(getValues(leftList), getValues(rightList));
      setChanged(false);
    } else {
      setMountState(true);
    }
  }, [changed]);

  return (
    <Grid container>
      {/* 좌측 리스트 */}
      <Grid item md={5} xs={5}>
        <Paper className={styles.paper}>
          <List
            className={styles.list}
            subheader={
              leftHeader && (
                <TransferHeader
                  title={leftHeader}
                  disabled={disabled}
                  itemSize={leftListInfo.size}
                  selectedSize={leftListInfo.checkedSize}
                  readOnlySize={rightListInfo.readOnlySize}
                  onToggleAll={handleToggleSelectAllLeftList}
                />
              )
            }
          >
            {createTransferItems({ list: leftList, disabled, onClick: handleToggleSelectLeftItem })}
          </List>
        </Paper>
      </Grid>

      {/* prettier-ignore */}
      <Grid container item md={2} xs={2} direction="column" justifyContent="center" alignItems="center">
        {/* -> */}
        <IconButton disabled={disabled || !leftListInfo.size} onClick={handleMoveToAllRight}>
          <KeyboardTabOutlinedIcon />
        </IconButton>

        {/* > */}
        <IconButton disabled={disabled || !leftListInfo.size || !leftListInfo.checkedSize} onClick={handleMoveToRight}>
          <KeyboardBackspaceOutlinedIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        
        {/* < */}
        <IconButton disabled={disabled || !rightListInfo.size|| !rightListInfo.checkedSize} onClick={handleMoveToLeft}>
          <KeyboardBackspaceOutlinedIcon />
        </IconButton>
        
        {/* <- */}
        <IconButton disabled={disabled || !rightListInfo.size} onClick={handleMoveToAllLeft}>
          <KeyboardTabOutlinedIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      </Grid>

      {/* 우측 리스트 */}
      <Grid item md={5} xs={5}>
        <Paper className={styles.paper}>
          <List
            className={styles.list}
            subheader={
              rightHeader && (
                <TransferHeader
                  title={rightHeader}
                  disabled={disabled}
                  itemSize={rightListInfo.size}
                  selectedSize={rightListInfo.checkedSize}
                  readOnlySize={rightListInfo.readOnlySize}
                  onToggleAll={handleToggleSelectAllRightList}
                />
              )
            }
          >
            {createTransferItems({ list: rightList, disabled, onClick: handleToggleSelectRightItem })}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

/**
 * Map 객체를 생성
 */
const createListMap = (origin: TListItem[]) => {
  const list = new Map<string | number, TListItem>();
  origin.forEach((item) => list.set(item.value, { ...item }));
  return list;
};

/**
 * 리스트 정보 가공
 */
const toListInfoModel = (list: Map<string | number, TListItem>) => {
  const listInfo: TListInfo = {
    size: 0,
    checkedSize: 0,
    readOnlySize: 0,
  };

  list.forEach(({ readOnly, checked }) => {
    // 체크되어 있어도 readOnly이면 카운트에서 제외
    checked && !readOnly && ++listInfo.checkedSize;
    readOnly && ++listInfo.readOnlySize;
  });

  // 채크 개수는 전체 수에서도 제외
  listInfo.size = list.size - listInfo.readOnlySize;

  return listInfo;
};

/**
 * 특정 리스트의 특정 아이템의 선택상태를 토글
 */
const toggleSelectItem = (
  key: string,
  list: Map<string | number, TListItem>,
  listSetter: React.Dispatch<React.SetStateAction<Map<string | number, TListItem>>>,
) => {
  const newList = new Map(list);
  const item = newList.get(key);

  newList.set(key, { ...item, checked: !item.checked });
  listSetter(newList);
};

/**
 * 특정 리스트의 모든 아이템을 일괄 선택/선택해제
 */
const toggleSelectAllItems = (
  list: Map<string | number, TListItem>,
  listInfo: TListInfo,
  listSetter: React.Dispatch<React.SetStateAction<Map<string | number, TListItem>>>,
) => {
  const newList = new Map<string | number, TListItem>();
  const newChecked = listInfo.size !== listInfo.checkedSize;

  list.forEach(({ value, label, readOnly, checked = false }, key) => {
    newList.set(key, {
      value,
      label,
      readOnly,
      // readOnly이면 checked는 항상 초기값을 유지
      checked: readOnly ? checked : newChecked,
    });
  });

  listSetter(newList);
};

/**
 * 특정 리스트로 특정 아이템을 이동
 */
const moveTo = (
  fromList: Map<string | number, TListItem>,
  toList: Map<string | number, TListItem>,
  fromListSetter: React.Dispatch<React.SetStateAction<Map<string|number, TListItem>>>, // prettier-ignore
  toListSetter: React.Dispatch<React.SetStateAction<Map<string | number, TListItem>>>,
) => {
  const newFromList = new Map<string | number, TListItem>();
  const newToList = new Map(toList);

  fromList.forEach(({ value, label, readOnly, checked }, key) => {
    checked && !readOnly
      ? newToList.set(key, { value, label, readOnly, checked: false })
      : newFromList.set(key, { value, label, readOnly, checked });
  });

  fromListSetter(newFromList);
  toListSetter(newToList);
};

/**
 * 아이템 이동이 가능한가
 */
const isPossibleMove = (listInfo: TListInfo) => {
  return listInfo.checkedSize !== 0;
};

/**
 * 모든 아이템 이동이 가능한가
 */
const isPossibleMoveAll = (listInfo: TListInfo) => {
  return listInfo.size > 0;
};

/**
 * 리스트 Map을 순회하면서 아이템 value들을 반환
 */
const getValues = (list: Map<string | number, TListItem>) => {
  const values: (string | number)[] = [];

  for (let [, { value }] of list) {
    values.push(value);
  }

  return values;
};

/**
 * 특정 리스트로 모든 아이템을 이동
 */
const moveToAll = (
  fromList: Map<string | number, TListItem>,
  toList: Map<string | number, TListItem>,
  fromListSetter: React.Dispatch<React.SetStateAction<Map<string|number, TListItem>>>, // prettier-ignore
  toListSetter: React.Dispatch<React.SetStateAction<Map<string | number, TListItem>>>,
) => {
  const newFromList = new Map<string | number, TListItem>();
  const newToList = new Map(toList);

  fromList.forEach((item, key) => {
    item.readOnly ? newFromList.set(key, { ...item }) : newToList.set(key, { ...item });
  });

  fromListSetter(newFromList);
  toListSetter(newToList);
};

/**
 * Map 객체에서 Transfer 아이템을 생성
 */
const createTransferItems = ({
  list,
  onClick,
  disabled,
}: {
  list: Map<string | number, TListItem>;
  disabled: boolean;
  onClick: (key: string | number) => () => void;
}) => {
  const elements: React.ReactNode[] = [];

  for (let [, { value, label, readOnly, checked }] of list) {
    elements.push(
      <TransferItem
        key={value}
        value={value}
        label={label}
        disabled={disabled || readOnly}
        checked={checked}
        onClick={onClick(value)}
      />,
    );
  }

  return elements;
};

/**
 * Transfer Styles
 */
const useStyles = makeStyles((theme: Theme) => ({
  /* stylelint-disable */
  paper: {
    overflow: 'hidden',
  },
  list: {
    overflow: 'auto',
    height: (props: Pick<ITransferProps, 'height'>) => props.height || '240px',
  },
}));
