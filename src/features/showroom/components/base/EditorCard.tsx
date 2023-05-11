import React from 'react';
import styled from '@emotion/styled';
import { ExpandMore } from '@material-ui/icons/';
import { CardHeaderProps, CardContentProps } from '@material-ui/core';
import { Button, Box, Card, CardHeader, CardContent, Collapse, Divider, IconButton } from '@material-ui/core';

export interface EditorCardProps extends Pick<CardHeaderProps, 'title'>, Pick<CardContentProps, 'sx' | 'children'> {
  /** API 요청 여부 */
  isLoading?: boolean;
  /** 수정 상태 여부 */
  isEdit?: boolean;
  /** 초기 확장 상태 */
  defaultExtend?: boolean;
  /** 클래스명 */
  className?: string;
  /** 저장 버튼 클릭시 콜백 */
  onSave?: () => any;
  /** 수정 버튼 클릭시 콜백 */
  onEdit?: () => any;
  /** 취소 버튼 클릭시 콜백 */
  onCancel?: () => any;
  /** 새로고침 버튼 클릭시 콜백 */
  onRefresh?: () => any;
}

/**
 * 편집 버튼이 있는 MUI 카드 컴포넌트
 */
export const EditorCard = styled(
  ({ title, children, sx, defaultExtend, isLoading, className, isEdit, ...handler }: EditorCardProps) => {
    const [isExtended, setExtendState] = React.useState<boolean>(defaultExtend || true);

    /**
     * 카드 확장/축소 제어
     */
    const handleExpandToggle = () => {
      setExtendState(!isExtended);
    };

    return (
      <Card sx={sx} className={`${className} ${isExtended ? 'is-extended' : ''}`}>
        <CardHeader
          className="edit-header"
          title={<div className="edit-title" tabIndex={-1} children={title} onClick={handleExpandToggle} />}
          avatar={
            <IconButton size="small" aria-label="더 보기" className="edit-extend" onClick={handleExpandToggle}>
              <ExpandMore />
            </IconButton>
          }
          action={
            <Box className="edit-actions">
              {/* 읽기모드 */}
              {!isEdit && handler.onRefresh && (
                <Button onClick={handler.onRefresh} disabled={isLoading} children="새로고침" />
              )}
              {!isEdit && handler.onEdit && (
                <Button onClick={handler.onEdit} disabled={isLoading} children="편집" sx={{ ml: 1, mr: 1 }} />
              )}

              {/* 수정모드 */}
              {isEdit && handler.onCancel && (
                <Button variant="outlined" disabled={isLoading} onClick={handler.onCancel} children="취소" />
              )}
              {isEdit && handler.onSave && (
                <Button
                  variant="contained"
                  disabled={isLoading}
                  onClick={handler.onSave}
                  children="저장"
                  sx={{ ml: 1, mr: 1 }}
                />
              )}
            </Box>
          }
        />

        {isExtended && <Divider />}

        <Collapse in={isExtended}>
          <CardContent>{children}</CardContent>
        </Collapse>
      </Card>
    );
  },
)`
  .edit-header {
    padding-top: 0;
    padding-bottom: 0;
  }

  .edit-title {
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing(2)} 0;
  }

  .edit-extend {
    margin-left: auto;
    transform: rotate(-90deg);
    transition: transform ${({ theme }) => theme.transitions.duration.shortest}ms;
  }

  .edit-actions {
    padding: ${({ theme }) => theme.spacing(2)} 0;
  }

  &.is-extended {
    .edit-extend {
      transform: rotate(0deg);
    }
  }
`;
