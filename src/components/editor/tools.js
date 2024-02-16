import CheckList from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import NestedList from '@editorjs/nested-list';
import Quote from '@editorjs/quote';
import Raw from '@editorjs/raw';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Warning from '@editorjs/warning';
import Strikethrough from '@sotaproject/strikethrough';
import Paragraph from 'editorjs-paragraph-with-alignment';
import ColorPlugin from 'editorjs-text-color-plugin';

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  table: {
    class: Table,
    inlineToolbar: true
  },
  marker: Marker,
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  warning: {
    class: Warning,
    inlineToolbar: true
  },
  code: Code,
  raw: Raw,
  header: Header,
  quote: {
    class: Quote,
    inlineToolbar: true
  },
  checklist: {
    class: CheckList,
    inlineToolbar: true
  },
  delimiter: Delimiter,
  inlineCode: InlineCode,
  underline: Underline,
  embed: {
    class: Embed,
    inlineToolbar: true
  },
  Color: {
    class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
    config: {
      colorCollections: [
        '#EC7878',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#0070FF',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFF'
      ],
      defaultColor: '#FF1300',
      type: 'text',
      customPicker: true // add a button to allow selecting any colour
    }
  },
  strikethrough: Strikethrough
};
