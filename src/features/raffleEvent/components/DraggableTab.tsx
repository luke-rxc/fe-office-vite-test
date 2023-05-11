import styled from '@emotion/styled';
import { Tab, Tabs } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReturnTypeUseRaffleEventDetailService } from '../services';
import classnames from 'classnames';

type Props = ReturnTypeUseRaffleEventDetailService['tabs'];

export const DraggableTab = ({
  activeIndex,
  items,
  errors,
  isDragDisabled,
  onChangeTab: handleChangeTab,
  onUpdateItems: handleUpdateItems,
}: Props) => {
  if ((items || []).length === 0) {
    return null;
  }

  const onClick = (index: number) => {
    return () => handleChangeTab(index);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleUpdateItems}>
        <Droppable droppableId="raffle" direction="horizontal">
          {(provided) => (
            <TabWrapperStyled
              value={activeIndex}
              ref={provided.innerRef}
              variant="scrollable"
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`times-${item.id}`}
                  index={index}
                  disableInteractiveElementBlocking={true}
                  isDragDisabled={isDragDisabled}
                >
                  {(provided) => (
                    <TabItemStyled
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={classnames({
                        active: activeIndex === index,
                        error: activeIndex !== index && !!errors[index],
                      })}
                      label={`${index + 1}회차 (id: ${item.itemId})`}
                      onClick={onClick(index)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TabWrapperStyled>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const TabWrapperStyled = styled(Tabs)`
  display: flex;
  width: 100%;

  & .MuiTabs-indicator {
    display: flex;
    justify-content: center;
    background-color: transparent;
  }
`;

const TabItemStyled = styled(Tab)`
  padding: 10px;
  text-transform: none;
  margin-right: 1px;
  background-color: #a9a9a9;
  color: #2e4f4f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &.active {
    background-color: #000;
    color: #fff;
  }
  &.error {
    background-color: red;
    color: #fff;
  }
  &.Mui-focusVisible {
    background-color: none;
  }
`;
