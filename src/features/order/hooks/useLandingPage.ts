export type ReturnTypeUseLandingPage = ReturnType<typeof useLandingPage>;

/**
 * page landing hook
 */
export const useLandingPage = () => {
  const handleClickOpenService = (url: string) => {
    return () => {
      window.open(url, '_blank');
    };
  };

  return { handleClickOpenService };
};
