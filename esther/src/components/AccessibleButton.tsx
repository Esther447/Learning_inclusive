/**
 * Accessible Button Component
 * Ensures WCAG 2.1 AA compliance
 */

import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface AccessibleButtonProps extends ButtonProps {
  announceOnClick?: boolean;
  announcementText?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  announceOnClick = false,
  announcementText,
  onClick,
  ...props
}) => {
  const { speak } = useTextToSpeech();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (announceOnClick) {
      speak(
        announcementText || (typeof children === 'string' ? children : 'Button clicked')
      );
    }
    onClick?.(event);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      aria-label={
        props['aria-label'] || (typeof children === 'string' ? children : undefined)
      }
    >
      {children}
    </Button>
  );
};
