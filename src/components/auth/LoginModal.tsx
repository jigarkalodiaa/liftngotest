'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPanel from '@/components/auth/LoginPanel';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
      <LoginPanel
        variant="modal"
        isActive={isOpen}
        onDismiss={onClose}
        onCompleted={(nextPath) => {
          onClose();
          router.push(nextPath);
        }}
      />
    </div>
  );
}
