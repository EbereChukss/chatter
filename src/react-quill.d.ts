declare module 'react-quill' {
    import * as React from 'react';
  
    // Define the props that ReactQuill accepts
    interface ReactQuillProps {
      value: string;
      onChange: (content: string, delta: any, source: any, editor: any) => void;
      placeholder?: string;
      theme?: string;
      modules?: any;
      formats?: string[];
      bounds?: string | HTMLElement;
      readOnly?: boolean;
      scrollingContainer?: string | HTMLElement;
      onChangeSelection?: (range: any, source: any, editor: any) => void;
      onFocus?: (range: any, source: any, editor: any) => void;
      onBlur?: (previousRange: any, source: any, editor: any) => void;
      preserveWhitespace?: boolean;
    }
  
    // Define the ReactQuill component
    class ReactQuill extends React.Component<ReactQuillProps> {
      focus(): void;
      blur(): void;
      getEditor(): any;
    }
  
    // Export the component
    export = ReactQuill;
  }
  