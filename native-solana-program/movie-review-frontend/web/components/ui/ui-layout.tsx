'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="navbar bg-gray-900 text-neutral-content flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
            <Image
              className="h-4 md:h-6"
              width={200}
              height={50}
              alt="Logo"
              src="/logo.png"
            />
          </Link>
          <ul className="menu menu-horizontal px-1 space-x-2">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`${
                    pathname.startsWith(path)
                      ? 'active text-blue-500'
                      : 'text-gray-50'
                  }`}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h3 className="text-[25px] font-bold">Movie Review dApp</h3>
        </div>

        <div className="flex items-center space-x-2">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>

      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>

      <div className="flex-grow mx-4 lg:mx-auto">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="hero py-[15px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl text-gray-100 font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

// default
export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}

// custom form component
type TransactionToastProps = {
  signature?: string;
  status?: 'success' | 'failure';
  errorMessage?: string;
};

export function useFormTransactionToast() {
  return ({ signature, status, errorMessage }: TransactionToastProps) => {
    if (status === 'success') {
      toast.success(
        <div className="text-center">
          <div className="text-lg">Transaction sent successfully</div>
          {signature && (
            <ExplorerLink
              path={`tx/${signature}`}
              label={'View Transaction'}
              className="btn btn-xs btn-primary"
            />
          )}
        </div>
      );
    } else if (status === 'failure') {
      toast.error(
        <div className="text-center">
          <div className="text-lg">Transaction failed</div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {signature && (
            <ExplorerLink
              path={`tx/${signature}`}
              label={'View Transaction'}
              className="btn btn-xs btn-primary"
            />
          )}
        </div>
      );
    }
  };
}
