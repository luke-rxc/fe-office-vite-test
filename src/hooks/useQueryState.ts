import { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { useLocation, useNavigate } from 'react-router';
import { parse, stringifyUrl } from 'query-string';

export interface QueryState extends Record<string, string | Array<string>> {}

/**
 * query string을 관리하는 hook
 * url query string이 변경되면 업데이트 됨
 * url query string을 변경할때도 사용함
 */
export const useQueryState = <T extends QueryState>(defaultState = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [queryState, setQueryState] = useState(parse(location.search) as T);

  useEffect(() => {
    // defaultState와 url query string 다를경우 defaultState 기준으로 query string을 수정
    const currentState = parse(location.search) as T;
    if (!isEmpty(defaultState) && isEmpty(currentState) && !isEqual(defaultState, currentState)) {
      navigate(
        stringifyUrl({
          url: location.pathname,
          query: defaultState,
        }),
        { replace: true },
      );
    }
  }, [defaultState, location.pathname, location.search, navigate]);

  useEffect(() => {
    // url query string과 queryState 다를경우 url query string 기준으로 queryState을 수정
    const newState = parse(location.search) as T;
    if (!isEqual(newState, queryState)) {
      setQueryState(newState);
    }
  }, [location.search, queryState]);

  /**
   * url query string update
   */
  const updateQueryState = <T extends QueryState>(newState: T): void => {
    const oldQueryState = parse(location.search) as T;
    const nextQueryState: T = { ...oldQueryState, ...newState };
    if (!isEqual(oldQueryState, nextQueryState)) {
      navigate(
        stringifyUrl(
          {
            url: location.pathname,
            query: nextQueryState,
          },
          { skipEmptyString: true },
        ),
      );
    }
  };

  return { queryState, updateQueryState };
};
