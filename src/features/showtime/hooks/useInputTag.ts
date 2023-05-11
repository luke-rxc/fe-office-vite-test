import React, { useState } from 'react';

interface Props {
  tags: Array<string>;
  onUpdateTags: (updateTags: Array<string>) => void;
  onDeleteTags: (updateTags: Array<string>) => void;
}

/**
 * input tag hook
 */
export const useInputTag = ({ tags, onUpdateTags, onDeleteTags }: Props) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * input value를 tag 정보로 업데이트
   */
  const updateTags = () => {
    const addTags = inputValue.split(',').reduce<Array<string>>((target, value) => {
      if (value.trim() !== '' && !tags.includes(value) && !target.includes(value)) {
        target.push(value);
      }
      return target;
    }, []);
    onUpdateTags(tags.concat(addTags));
    setInputValue('');
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' || inputValue === '') {
      return;
    }

    event.preventDefault();

    updateTags();
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();

    updateTags();
  };

  const onDelete = (tagValue: string) => {
    return () => {
      if (!onDeleteTags) {
        return;
      }

      const filterdTags = tags.filter((tag) => {
        return tag !== tagValue;
      });

      onDeleteTags(filterdTags);
    };
  };

  return {
    inputValue,
    onChange,
    onKeyPress,
    onDelete,
    onBlur,
  };
};
