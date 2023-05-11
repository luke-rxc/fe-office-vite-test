import { ChangeEvent, useEffect, useState } from 'react';

/**
 * message input hook
 */
export const useMessageInput = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      setMessage('');
    };
  }, []);

  /**
   * message update event
   */
  const handleUpdateMessage = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  /**
   * save click event
   */
  const handleSaveMessage = (onSave: (message: string) => void) => {
    return () => {
      onSave?.(message);
      setMessage('');
    };
  };

  return { message, handleUpdateMessage, handleSaveMessage };
};
