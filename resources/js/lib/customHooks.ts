/**
 * THESE METHODS CAN ONLY BE CALLED INSIDE OF THE BODY OF A REACT FUNCTIONAL COMPONENT
 */

import { DependencyList, EffectCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import HttpStatus from 'http-status-codes';
import { AnyObject } from '@/types/common';
import { ApiError } from '@/types/errors';
import eventDispatcher from '@/lib/eventDispatcher/eventDispatcher';
import Path from '@/router/Path';

export const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};

export const useEventListener = (
  eventName: string,
  callback: (messageId: string, data?: { [key: string]: any }) => void,
  deps?: DependencyList
) => {
  let listenerId: string;

  useEffect(() => {
    if (listenerId) {
      eventDispatcher.detach(eventName, listenerId);
    }

    listenerId = eventDispatcher.attach(eventName, callback);

    return () => {
      eventDispatcher.detach(eventName, listenerId);
    };
  }, [deps]);
};

type Destructor = () => void;

export const useDidUpdateEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const didMountRef = useRef(false);

  useEffect((): void | Destructor => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return effect();
    }
  }, deps);
};

type AsyncUseEffectActions<Data> = {
  predicate?: () => boolean;
  run: () => Promise<Data>;
  onSuccess?: (data: Data) => void;
  onError?: (error: any) => void;
  onFinally?: VoidFunction;
  onUnmount?: VoidFunction;
};

export const asyncUseEffect = <Data>(actions: AsyncUseEffectActions<Data>, deps?: DependencyList): void => {
  const { predicate, run, onSuccess, onError, onFinally, onUnmount } = actions;
  let mounted = true;

  useEffect((): VoidFunction => {
    let continueRun = true;
    if (predicate && mounted) {
      continueRun = predicate();
    }

    const runAsyncEffect = async () => {
      try {
        const data = await run();
        if (onSuccess && mounted) {
          onSuccess(data);
        }
      } catch (error) {
        if (onError && mounted) {
          onError(error);
        }
      } finally {
        if (onFinally && mounted) {
          onFinally();
        }
      }
    };

    if (continueRun) {
      runAsyncEffect();
    }

    return (): void => {
      mounted = false;
      if (onUnmount) {
        onUnmount();
      }
    };
  }, deps);
};

type ApiErrorHandlerOptions = {
  onUnauthorized?: VoidFunction;
  onForbidden?: VoidFunction;
  onBadRequest?: VoidFunction;
  onDefault?: VoidFunction;
};

type ApiErrorHandler = (error: ApiError, message: string, options?: ApiErrorHandlerOptions) => void;

export const useErrorHandler = (): { handleApiError: ApiErrorHandler } => {
  const history = useHistory();
  const { addToast } = useToasts();

  return {
    handleApiError: (error: ApiError, message: string, options?: ApiErrorHandlerOptions): void => {
      switch (error.status) {
        case HttpStatus.UNAUTHORIZED: {
          if (options?.onUnauthorized) {
            return options.onUnauthorized();
          }
          return history.push(Path.LOGIN);
        }
        case HttpStatus.FORBIDDEN: {
          if (options?.onForbidden) {
            return options.onForbidden();
          }
          return history.push(Path.FORBIDDEN);
        }
        case HttpStatus.BAD_REQUEST: {
          if (options?.onBadRequest) {
            return options.onBadRequest();
          }
          return addToast(message, { appearance: 'error', autoDismiss: true });
        }
        default: {
          if (options?.onDefault) {
            return options.onDefault();
          }
          addToast(message, { appearance: 'error', autoDismiss: true });
        }
      }
    }
  };
};

type MatchObject = {
  path: string;
  url: string;
  isExact: boolean;
  params: AnyObject;
};

export const useMatch = (): MatchObject => useRouteMatch();

export type UseScrollState = {
  x: number;
  y: number;
  direction: string;
};

export const useScroll = (): UseScrollState => {
  const [scroll, setScroll] = useState<UseScrollState>({
    x: document.body.getBoundingClientRect().left,
    y: document.body.getBoundingClientRect().top,
    direction: ''
  });
  const handleScroll = (): void => {
    setScroll((prevState: UseScrollState) => ({
      x: document.body.getBoundingClientRect().left,
      y: -document.body.getBoundingClientRect().top,
      direction: prevState.y > -document.body.getBoundingClientRect().top ? 'up' : 'down'
    }));
  };
  useEffect((): VoidFunction => {
    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scroll;
};
export type UseWindowSizeState = {
  width: number;
  height: number;
};

export const useWindowSize = (): UseWindowSizeState => {
  const [windowSize, setWindowSize] = useState<UseWindowSizeState>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const handleResize = (): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  useEffect((): VoidFunction => {
    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};
