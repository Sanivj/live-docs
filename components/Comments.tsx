'use client';

import React from 'react';
import { Composer, Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { cn } from '@/lib/utils';

type ThreadWrapperProps = {
  thread: ReturnType<typeof useThreads>['threads'][number]; // ✅ infers correct type
};

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'liveblocks-thread w-full max-w-[800px] lg:w-[350px] transition-all',
    isActive && '!border-blue-500 shadow-md',
    thread.resolved && 'opacity-40'
      )}
    />
  );
};

const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className=" gap-2 mb-10 space-y-4 lg:w-fit flex w-full flex-col items-center justify-center">
      <Composer
        className="liveblocks-composer w-full max-w-[800px] lg:w-[350px]"
      />
      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;
