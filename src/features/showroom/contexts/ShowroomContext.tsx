import React, { createContext, useState } from 'react';
import { ShowroomType } from '../types';

/**
 * Context Value
 */
type ShowroomContextValue = {
  /** 쇼룸 Id */
  id?: number;
  /** 쇼룸 Code */
  code?: string;
  /** 쇼룸 Type */
  type?: ShowroomType;
  /** PGM/일반 쇼룸을 위한 Section Id */
  sectionId?: number;
  /** Context Value 업데이트 */
  dispatch: React.Dispatch<React.SetStateAction<Omit<ShowroomContextValue, 'dispatch'>>>;
};

/**
 * Provider Props
 */
interface ShowroomProviderProps {
  children?: React.ReactNode;
}

/**
 * Showroom Context
 */
export const ShowroomContext = createContext<ShowroomContextValue>(null);

/**
 * Showroom Provider
 */
export const ShowroomProvider: React.FC<ShowroomProviderProps> = ({ children }) => {
  const [value, setValue] = useState<ShowroomContextValue>(null);

  return <ShowroomContext.Provider value={{ ...value, dispatch: setValue }}>{children}</ShowroomContext.Provider>;
};
