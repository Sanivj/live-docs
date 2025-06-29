'use client';

// Update the import path below if Theme.ts or Theme.js exists elsewhere in your project
import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React, { useState } from 'react';
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin } from '@liveblocks/react-lexical';
import Loader from '../Loader';
import EditorReadyPlugin from './plugins/EditorReadyPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '../Comments';
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({roomId,currentUserType}:{roomId:string, currentUserType:UserType}) {
   const [isLoaded, setIsLoaded] = useState(false);

   const {threads}=useThreads();
  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable:currentUserType==='editor',
    
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className='z-50 custom-scrollbar w-screen overflow-auto border-y border-dark-300 bg-dark-100 pl-3 pr-4 shadow-sm flex min-w-full justify-between'>
          <ToolbarPlugin />
          {/*currentUserType==='editor'&&<DeleteModal roomId={roomId}/>*/}
        </div>
        <div className='custom-scrollbar h-[calc(100vh-140px)] gap-5 overflow-auto px-5 pt-5 lg:flex-row lg:items-start lg:justify-center  xl:gap-10 xl:pt-10 flex flex-col itmes-center justify-start'>
          {!isLoaded?<Loader/>:(
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input h-full" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {currentUserType==='editor'&&<FloatingToolbarPlugin/>}
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
          )}
        
         <EditorReadyPlugin onReady={() => setIsLoaded(true)} />
          <LiveblocksPlugin>
            <FloatingComposer className='w-[350px]'/>
            <FloatingThreads threads={threads}/>
            
              <Comments/>
           
            
          </LiveblocksPlugin>
      </div>
      </div>
    </LexicalComposer>
  );
}
