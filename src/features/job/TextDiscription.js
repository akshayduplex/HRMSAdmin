import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier, SelectionState } from 'draft-js';
// import createMentionPlugin from 'draft-js-mention-plugin';
// import createEmojiPlugin from 'draft-js-emoji-plugin';
// import createImagePlugin from 'draft-js-image-plugin';
// import createVideoPlugin from 'draft-js-video-plugin';
// import createStickerPlugin from 'draft-js-sticker-plugin';
// import createHashtagPlugin from 'draft-js-hashtag-plugin';
// import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
// import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
// import createStaticToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import createUndoPlugin from 'draft-js-undo-plugin';
// import createCounterPlugin from 'draft-js-counter-plugin';
// import createAnchorPlugin from 'draft-js-anchor-plugin';
// import createLinkifyPlugin from 'draft-js-linkify-plugin';
// import createFocusPlugin from 'draft-js-focus-plugin';
// import createAlignmentPlugin from 'draft-js-alignment-plugin';
// import createResizeablePlugin from 'draft-js-resizeable-plugin';
// import createDragNDropPlugin from 'draft-js-drag-n-drop-plugin';
// import createDividerPlugin from 'draft-js-divider-plugin';

// Initialize plugins
// const mentionPlugin = createMentionPlugin();
// const emojiPlugin = createEmojiPlugin();
// const imagePlugin = createImagePlugin();
// const videoPlugin = createVideoPlugin();
// const stickerPlugin = createStickerPlugin();
// const hashtagPlugin = createHashtagPlugin();
// const inlineToolbarPlugin = createInlineToolbarPlugin();
// const sideToolbarPlugin = createSideToolbarPlugin();
// const staticToolbarPlugin = createStaticToolbarPlugin();
// const undoPlugin = createUndoPlugin();
// const counterPlugin = createCounterPlugin();
// const anchorPlugin = createAnchorPlugin();
// const linkifyPlugin = createLinkifyPlugin();
// const focusPlugin = createFocusPlugin();
// const alignmentPlugin = createAlignmentPlugin();
// const resizeablePlugin = createResizeablePlugin();
// const dragNDropPlugin = createDragNDropPlugin();
// const dividerPlugin = createDividerPlugin();

// Extract plugin components
// const { MentionSuggestions } = mentionPlugin;
// const { EmojiSelect } = emojiPlugin;
// const { InlineToolbar } = inlineToolbarPlugin;
// const { SideToolbar } = sideToolbarPlugin;
// const { Toolbar: StaticToolbar } = staticToolbarPlugin;
// const { UndoButton, RedoButton } = undoPlugin;

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [mentionSuggestions, setMentionSuggestions] = useState([]);

  const onChange = (state) => setEditorState(state);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const onCutClick = () => {
    document.execCommand('cut');
  };

  const onCopyClick = () => {
    document.execCommand('copy');
  };

  return (
    <div>
      <div className="toolbar">
        {/* <UndoButton />
        <RedoButton />
        <EmojiSelect /> */}
        <button onClick={onBoldClick}>Bold</button>
        <button onClick={onItalicClick}>Italic</button>
        <button onClick={onUnderlineClick}>Underline</button>
        <button onClick={() => toggleBlockType('header-one')}>H1</button>
        <button onClick={() => toggleBlockType('header-two')}>H2</button>
        <button onClick={() => toggleBlockType('header-three')}>H3</button>
        <button onClick={() => toggleBlockType('header-four')}>H4</button>
        <button onClick={() => toggleBlockType('header-five')}>H5</button>
        <button onClick={() => toggleBlockType('header-six')}>H6</button>
        <button onClick={() => toggleBlockType('unstyled')}>Main</button>
        <button onClick={onCutClick}>Cut</button>
        <button onClick={onCopyClick}>Copy</button>
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          minHeight: '400px',
          padding: '10px',
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
        //   plugins={[
        //     mentionPlugin,
        //     emojiPlugin,
        //     imagePlugin,
        //     videoPlugin,
        //     stickerPlugin,
        //     hashtagPlugin,
        //     inlineToolbarPlugin,
        //     sideToolbarPlugin,
        //     staticToolbarPlugin,
        //     undoPlugin,
        //     counterPlugin,
        //     anchorPlugin,
        //     linkifyPlugin,
        //     focusPlugin,
        //     alignmentPlugin,
        //     resizeablePlugin,
        //     dragNDropPlugin,
        //     dividerPlugin,
        //   ]}
        // />
        // <MentionSuggestions />
        // <InlineToolbar />
        // <SideToolbar />
        // <StaticToolbar />
        />
      </div>
      {/* Additional plugin UIs can go here */}
    </div>
  );
};

export default MyEditor;
