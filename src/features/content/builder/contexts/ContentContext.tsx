import { useRef, useCallback, createContext } from 'react';
import type { FC } from 'react';
import { ContentModel, GoodsModel, LiveModel } from '../models';

type ContentContextProps = {
  contentData: Map<number, ContentModel>; //  컨텐츠(컴포넌트) 데이터 정보
  addContent: (content: ContentModel) => void; // 컨텐츠(컴포넌트) 추가
  removeContent: (id: number) => void; // 컨텐츠(컴포넌트) 삭제
  updateSortContent: (id: number, index: number) => void; // 컨텐츠 순서 변경
  updateLiveContent: (id: number, liveList: LiveModel[]) => void; // 라이브 디스플레이 정보 업데이트
  updateGoodsContent: (id: number, goodsList: GoodsModel[]) => void; // 상품 디스플레이 정보 업데이트
};

export const ContentContext = createContext<ContentContextProps>({} as ContentContextProps);
export const ContentProvider: FC = ({ children }) => {
  const contentData = useRef<Map<number, ContentModel>>(new Map());

  /**
   * 컴포넌트 추가
   */
  const addContent = useCallback((content: ContentModel) => {
    contentData.current.set(content.id, content);
  }, []);

  /**
   * 컴포넌트 삭제
   */
  const removeContent = useCallback((id: number) => {
    contentData.current.delete(id);
  }, []);

  /**
   * 정렬 업데이트
   */
  const updateSortContent = useCallback((id, targetIndex) => {
    const targetData = contentData.current.get(id);
    contentData.current.set(id, {
      ...targetData,
      sortNum: targetIndex,
    });
  }, []);

  /**
   * 라이브 디스플레이 정보 업데이트
   */
  const updateLiveContent = useCallback((id, liveList: LiveModel[]) => {
    const targetData = contentData.current.get(id);
    contentData.current.set(id, {
      ...targetData,
      liveList: [...liveList],
    });
  }, []);

  /**
   * 상품 디스플레이 정보 업데이트
   */
  const updateGoodsContent = useCallback((id, goodsList: GoodsModel[]) => {
    const targetData = contentData.current.get(id);
    contentData.current.set(id, {
      ...targetData,
      goodsList: [...goodsList],
    });
  }, []);

  return (
    <ContentContext.Provider
      value={{
        contentData: contentData.current,
        addContent,
        removeContent,
        updateSortContent,
        updateLiveContent,
        updateGoodsContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
