import React from 'react';
import { PRINCIPAL_TYPE } from '../constants';

interface ILoadingTaskProviderProps {
  principalType: typeof PRINCIPAL_TYPE[keyof typeof PRINCIPAL_TYPE];
  children?: React.ReactNode;
}

export interface IPrincipalContextValues {
  isManager: boolean;
  isPartner: boolean;
  principalType: ILoadingTaskProviderProps['principalType'];
}

/**
 * Context Create
 */
export const PrincipalTypeContext = React.createContext<IPrincipalContextValues>(null);

/**
 * 관리 계정의 타입을 가지고있는 Context
 * Context의 principalType에 의해 매니저 관리/파트너 관리로 페이지가 구분
 */
export const PrincipalProvider = ({ principalType, children }: ILoadingTaskProviderProps) => {
  const [isManager, setWhetherManager] = React.useState(principalType === PRINCIPAL_TYPE.MANAGER);
  const [isPartner, setWhetherPartner] = React.useState(principalType === PRINCIPAL_TYPE.PARTNER);

  React.useEffect(() => {
    setWhetherManager(principalType === PRINCIPAL_TYPE.MANAGER);
    setWhetherPartner(principalType === PRINCIPAL_TYPE.PARTNER);
  }, [principalType]);

  return (
    <PrincipalTypeContext.Provider value={{ isManager, isPartner, principalType }}>
      {children}
    </PrincipalTypeContext.Provider>
  );
};
