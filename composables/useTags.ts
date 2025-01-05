import { h } from 'vue';
import { NTag } from 'naive-ui';
import { generateTagStyling } from '~/utils/tag-styles';

export function useTags() {
  const createTags = (data: number[] | number) => {
    if (typeof data === 'number') {
      const colorStyles = generateTagStyling(data);
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
            padding: '1rem 0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
          },
          color: colorStyles,
          bordered: true,
        },
        {
          default: () => data,
        }
      );
    }
    return data.map((tagKey) => {
      const colorStyles = generateTagStyling(tagKey);
      return h(
        NTag,
        {
          style: {
            marginRight: '1rem',
            padding: '1rem 0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
          },
          color: colorStyles,
          bordered: true,
        },
        {
          default: () => tagKey,
        }
      );
    });
  };

  return {
    createTags,
  };
}
