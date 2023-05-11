import { pathConfig } from '@config';

const { cdnUrl } = pathConfig;

/**
 * 이미지 URL
 *
 * @example
 *   1. CDN URL 추가
 *   getImageLink('/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png')
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png
 *   2. 전체 URL인 경우 ORIGIN 변경하지 않음
 *   getImageLink('https://example.com/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png')
 *   -> https://example.com/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png
 *   3. width 인자가 있는 경우
 *   getImageLink('https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png', 192)
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=192
 *   4. width 인자가 있고, QueryString이 이미 있는 경우
 *   getImageLink('https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=32', 192)
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=32
 */
export const getImageLink = (url: string, width?: number) => {
  const imageUrl = addOrigin(url);

  const { href, search } = new URL(imageUrl);

  if (width) {
    return search ? href : `${href}?im=Resize,width=${width}`;
  }

  return imageUrl;
};

export const getCdnLink = (url: string) => {
  return addOrigin(url);
};

function addOrigin(url: string) {
  const fullUrl = [url];

  try {
    const { href } = new URL(url);

    return href;
  } catch (err) {
    fullUrl.unshift(cdnUrl);
  }

  return fullUrl.join('/');
}
