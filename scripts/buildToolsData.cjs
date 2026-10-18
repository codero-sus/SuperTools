const fs = require('fs');

const tools = [
  // ================= TEXT & CONTENT =================
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    category: 'Text & Content',
    description: 'Count words, characters, characters without spaces, sentences, paragraphs, and estimate reading and speaking time.',
    tags: ['text', 'words', 'characters', 'count', 'reading time', 'length', 'counter'],
    icon: 'FileText',
    componentId: 'text-tools',
    mode: 'word-counter',
    featured: true
  },
  {
    id: 'uppercase-converter',
    name: 'Uppercase Converter',
    category: 'Text & Content',
    description: 'Convert any text into ALL UPPERCASE letters instantly.',
    tags: ['text', 'case', 'upper', 'capital', 'uppercase'],
    icon: 'Type',
    componentId: 'text-tools',
    mode: 'case-upper'
  },
  {
    id: 'lowercase-converter',
    name: 'Lowercase Converter',
    category: 'Text & Content',
    description: 'Convert any text into all lowercase letters instantly.',
    tags: ['text', 'case', 'lower', 'small', 'lowercase'],
    icon: 'Type',
    componentId: 'text-tools',
    mode: 'case-lower'
  },
  {
    id: 'title-case-converter',
    name: 'Title Case Converter',
    category: 'Text & Content',
    description: 'Capitalize the first letter of each major word in titles and headings.',
    tags: ['text', 'case', 'title', 'capitalize', 'headline'],
    icon: 'Type',
    componentId: 'text-tools',
    mode: 'case-title'
  },
  {
    id: 'sentence-case-converter',
    name: 'Sentence Case Converter',
    category: 'Text & Content',
    description: 'Capitalize only the first letter of each sentence.',
    tags: ['text', 'case', 'sentence', 'grammar'],
    icon: 'Type',
    componentId: 'text-tools',
    mode: 'case-sentence'
  },
  {
    id: 'camel-case-converter',
    name: 'camelCase Converter',
    category: 'Text & Content',
    description: 'Convert phrases and strings to camelCase format for programming.',
    tags: ['text', 'case', 'camel', 'developer', 'variable'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-camel'
  },
  {
    id: 'snake-case-converter',
    name: 'snake_case Converter',
    category: 'Text & Content',
    description: 'Convert text to lowercase words separated by underscores.',
    tags: ['text', 'case', 'snake', 'python', 'variable'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-snake'
  },
  {
    id: 'kebab-case-converter',
    name: 'kebab-case Converter',
    category: 'Text & Content',
    description: 'Convert text to lowercase words separated by hyphens (lisp-case / css-case).',
    tags: ['text', 'case', 'kebab', 'slug', 'hyphen', 'css'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-kebab'
  },
  {
    id: 'pascal-case-converter',
    name: 'PascalCase Converter',
    category: 'Text & Content',
    description: 'Capitalize every word without spaces, ideal for class names in OOP.',
    tags: ['text', 'case', 'pascal', 'class', 'oop'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-pascal'
  },
  {
    id: 'constant-case-converter',
    name: 'CONSTANT_CASE Converter',
    category: 'Text & Content',
    description: 'Convert text to uppercase words joined with underscores for programming constants.',
    tags: ['text', 'case', 'constant', 'screaming snake', 'env'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-constant'
  },
  {
    id: 'dot-case-converter',
    name: 'dot.case Converter',
    category: 'Text & Content',
    description: 'Convert words joined by dots (e.g. config.settings.debug).',
    tags: ['text', 'case', 'dot', 'property'],
    icon: 'Code2',
    componentId: 'text-tools',
    mode: 'case-dot'
  },
  {
    id: 'path-case-converter',
    name: 'path/case Converter',
    category: 'Text & Content',
    description: 'Convert text to file path style separated by forward slashes.',
    tags: ['text', 'case', 'path', 'filesystem', 'route'],
    icon: 'Folder',
    componentId: 'text-tools',
    mode: 'case-path'
  },
  {
    id: 'swap-case-converter',
    name: 'Invert / Swap Case Converter',
    category: 'Text & Content',
    description: 'Invert the case of every character: uppercase becomes lowercase and vice versa.',
    tags: ['text', 'case', 'swap', 'invert', 'toggle'],
    icon: 'ArrowLeftRight',
    componentId: 'text-tools',
    mode: 'case-swap'
  },
  {
    id: 'text-slugifier',
    name: 'URL Slugifier',
    category: 'Text & Content',
    description: 'Transform blog post titles and strings into clean, SEO-friendly URL slugs.',
    tags: ['text', 'slug', 'seo', 'url', 'permalink'],
    icon: 'Link',
    componentId: 'text-tools',
    mode: 'slugify'
  },
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    category: 'Text & Content',
    description: 'Compare two texts side-by-side or inline to highlight additions, deletions, and modifications.',
    tags: ['diff', 'compare', 'text', 'difference', 'code'],
    icon: 'GitCompare',
    componentId: 'text-diff',
    featured: true
  },
  {
    id: 'text-reverser',
    name: 'Character Reverser',
    category: 'Text & Content',
    description: 'Reverse the order of every character in your text.',
    tags: ['text', 'reverse', 'backward', 'mirror'],
    icon: 'ArrowLeftRight',
    componentId: 'text-tools',
    mode: 'reverse-chars'
  },
  {
    id: 'word-reverser',
    name: 'Word Reverser',
    category: 'Text & Content',
    description: 'Reverse the order of words while preserving word spelling.',
    tags: ['text', 'reverse', 'words', 'order'],
    icon: 'ArrowLeftRight',
    componentId: 'text-tools',
    mode: 'reverse-words'
  },
  {
    id: 'line-reverser',
    name: 'Line Reverser',
    category: 'Text & Content',
    description: 'Reverse the order of lines from bottom to top.',
    tags: ['text', 'lines', 'reverse', 'order'],
    icon: 'ArrowDownUp',
    componentId: 'text-tools',
    mode: 'reverse-lines'
  },
  {
    id: 'palindrome-checker',
    name: 'Palindrome Checker',
    category: 'Text & Content',
    description: 'Check whether a word, sentence, or number reads identically backward and forward.',
    tags: ['palindrome', 'check', 'reverse', 'linguistics'],
    icon: 'CheckCircle2',
    componentId: 'text-tools',
    mode: 'palindrome'
  },
  {
    id: 'sort-lines-az',
    name: 'Sort Lines A-Z',
    category: 'Text & Content',
    description: 'Sort lines of text in alphabetical ascending order.',
    tags: ['sort', 'alphabetical', 'lines', 'order', 'list'],
    icon: 'ArrowDownAZ',
    componentId: 'text-tools',
    mode: 'sort-az'
  },
  {
    id: 'sort-lines-za',
    name: 'Sort Lines Z-A',
    category: 'Text & Content',
    description: 'Sort lines of text in alphabetical descending order.',
    tags: ['sort', 'alphabetical', 'descending', 'lines'],
    icon: 'ArrowUpAZ',
    componentId: 'text-tools',
    mode: 'sort-za'
  },
  {
    id: 'sort-lines-length',
    name: 'Sort Lines by Length',
    category: 'Text & Content',
    description: 'Sort lines from shortest to longest or longest to shortest.',
    tags: ['sort', 'length', 'lines', 'size'],
    icon: 'SlidersHorizontal',
    componentId: 'text-tools',
    mode: 'sort-length'
  },
  {
    id: 'deduplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'Text & Content',
    description: 'Remove duplicate lines from a list, leaving only distinct lines.',
    tags: ['deduplicate', 'unique', 'lines', 'clean', 'filter'],
    icon: 'Filter',
    componentId: 'text-tools',
    mode: 'dedup'
  },
  {
    id: 'remove-empty-lines',
    name: 'Remove Empty Lines',
    category: 'Text & Content',
    description: 'Clean up text by removing blank and whitespace-only lines.',
    tags: ['clean', 'blank', 'empty lines', 'strip'],
    icon: 'Scissors',
    componentId: 'text-tools',
    mode: 'remove-empty'
  },
  {
    id: 'trim-whitespace',
    name: 'Trim Whitespace',
    category: 'Text & Content',
    description: 'Strip leading and trailing spaces and tabs from every line.',
    tags: ['trim', 'whitespace', 'spaces', 'clean'],
    icon: 'Minimize2',
    componentId: 'text-tools',
    mode: 'trim'
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    category: 'Text & Content',
    description: 'Collapse consecutive multiple spaces into a single space.',
    tags: ['spaces', 'clean', 'single space', 'collapse'],
    icon: 'Minus',
    componentId: 'text-tools',
    mode: 'collapse-spaces'
  },
  {
    id: 'add-line-numbers',
    name: 'Add Line Numbers',
    category: 'Text & Content',
    description: 'Prefix each line with sequential line numbers and custom separator.',
    tags: ['numbers', 'prefix', 'lines', 'code'],
    icon: 'ListOrdered',
    componentId: 'text-tools',
    mode: 'line-numbers'
  },
  {
    id: 'prefix-suffix-lines',
    name: 'Prefix & Suffix Lines',
    category: 'Text & Content',
    description: 'Prepend text to the beginning and append text to the end of every line.',
    tags: ['prefix', 'suffix', 'append', 'prepend', 'lines'],
    icon: 'WrapText',
    componentId: 'text-tools',
    mode: 'prefix-suffix'
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Text & Content',
    description: 'Generate customizable dummy placeholder text by paragraphs, sentences, or words.',
    tags: ['lorem', 'ipsum', 'placeholder', 'dummy text', 'generator'],
    icon: 'FileText',
    componentId: 'lorem-generator',
    featured: true
  },
  {
    id: 'text-repeater',
    name: 'Text Repeater',
    category: 'Text & Content',
    description: 'Repeat a phrase or text block N times with custom delimiter or line breaks.',
    tags: ['repeat', 'multiplier', 'duplicate', 'pattern'],
    icon: 'Repeat',
    componentId: 'text-tools',
    mode: 'repeat'
  },
  {
    id: 'character-frequency',
    name: 'Character Frequency Analyzer',
    category: 'Text & Content',
    description: 'Count occurrences of every letter, digit, and symbol with percentage distributions.',
    tags: ['frequency', 'analysis', 'letters', 'symbols', 'stats'],
    icon: 'BarChart2',
    componentId: 'text-tools',
    mode: 'char-frequency'
  },
  {
    id: 'word-frequency',
    name: 'Word Frequency Analyzer',
    category: 'Text & Content',
    description: 'Analyze word count frequencies, density, and find most repeated keywords.',
    tags: ['frequency', 'density', 'keywords', 'seo', 'words'],
    icon: 'BarChart3',
    componentId: 'text-tools',
    mode: 'word-frequency'
  },
  {
    id: 'extract-emails',
    name: 'Extract Emails',
    category: 'Text & Content',
    description: 'Extract all valid email addresses found inside raw unstructured text.',
    tags: ['extract', 'email', 'scrape', 'regex', 'filter'],
    icon: 'Mail',
    componentId: 'text-tools',
    mode: 'extract-emails'
  },
  {
    id: 'extract-urls',
    name: 'Extract URLs',
    category: 'Text & Content',
    description: 'Extract all web links, URLs, and domains from messy text.',
    tags: ['extract', 'urls', 'links', 'http', 'domains'],
    icon: 'ExternalLink',
    componentId: 'text-tools',
    mode: 'extract-urls'
  },
  {
    id: 'extract-phone-numbers',
    name: 'Extract Phone Numbers',
    category: 'Text & Content',
    description: 'Extract international and domestic phone numbers from text.',
    tags: ['extract', 'phones', 'contact', 'numbers'],
    icon: 'Phone',
    componentId: 'text-tools',
    mode: 'extract-phones'
  },
  {
    id: 'extract-numbers',
    name: 'Extract Numbers',
    category: 'Text & Content',
    description: 'Extract all integer and floating point numbers from text.',
    tags: ['extract', 'numbers', 'digits', 'values'],
    icon: 'Hash',
    componentId: 'text-tools',
    mode: 'extract-numbers'
  },
  {
    id: 'extract-hashtags',
    name: 'Extract Hashtags',
    category: 'Text & Content',
    description: 'Extract all #hashtags from social media copy or blog drafts.',
    tags: ['extract', 'hashtags', 'social', 'tags'],
    icon: 'Hash',
    componentId: 'text-tools',
    mode: 'extract-hashtags'
  },
  {
    id: 'extract-mentions',
    name: 'Extract User Mentions',
    category: 'Text & Content',
    description: 'Extract all @mentions from Twitter, Instagram, or chat logs.',
    tags: ['extract', 'mentions', 'handles', 'username'],
    icon: 'AtSign',
    componentId: 'text-tools',
    mode: 'extract-mentions'
  },
  {
    id: 'extract-ipv4',
    name: 'Extract IPv4 Addresses',
    category: 'Text & Content',
    description: 'Extract all valid IPv4 network addresses from raw logs or configuration text.',
    tags: ['extract', 'ip', 'ipv4', 'network', 'logs'],
    icon: 'Network',
    componentId: 'text-tools',
    mode: 'extract-ipv4'
  },
  {
    id: 'remove-punctuation',
    name: 'Remove Punctuation',
    category: 'Text & Content',
    description: 'Strip all commas, periods, quotes, exclamation marks, and symbols from text.',
    tags: ['clean', 'punctuation', 'strip', 'nlp'],
    icon: 'Scissors',
    componentId: 'text-tools',
    mode: 'remove-punct'
  },
  {
    id: 'remove-numbers',
    name: 'Remove Numbers & Digits',
    category: 'Text & Content',
    description: 'Strip all numerical digits (0-9) from text leaving only alphabetic characters.',
    tags: ['clean', 'numbers', 'digits', 'strip'],
    icon: 'Scissors',
    componentId: 'text-tools',
    mode: 'remove-numbers'
  },
  {
    id: 'remove-accents',
    name: 'Remove Accents & Diacritics',
    category: 'Text & Content',
    description: 'Normalize accented characters to plain Latin equivalents (e.g. café -> cafe).',
    tags: ['normalize', 'accents', 'diacritics', 'clean'],
    icon: 'Check',
    componentId: 'text-tools',
    mode: 'remove-accents'
  },
  {
    id: 'add-quotes-to-lines',
    name: 'Add Quotes to Lines',
    category: 'Text & Content',
    description: 'Enclose each line in double quotes or single quotes for SQL or JSON arrays.',
    tags: ['quotes', 'lines', 'sql', 'json'],
    icon: 'FileCode',
    componentId: 'text-tools',
    mode: 'quote-lines'
  },
  {
    id: 'count-vowels-consonants',
    name: 'Vowel & Consonant Counter',
    category: 'Text & Content',
    description: 'Count vowels, consonants, spaces, and punctuation marks in your text.',
    tags: ['vowels', 'consonants', 'count', 'phonetics'],
    icon: 'BarChart2',
    componentId: 'text-tools',
    mode: 'vowels-consonants'
  },
  {
    id: 'add-commas-to-lines',
    name: 'Add Trailing Commas to Lines',
    category: 'Text & Content',
    description: 'Append a comma to the end of every line in your list.',
    tags: ['commas', 'lines', 'sql', 'format'],
    icon: 'List',
    componentId: 'text-tools',
    mode: 'add-commas'
  },
  {
    id: 'find-and-replace',
    name: 'Find & Replace',
    category: 'Text & Content',
    description: 'Find and replace occurrences of strings or regex patterns across text.',
    tags: ['find', 'replace', 'regex', 'substitute', 'edit'],
    icon: 'Search',
    componentId: 'text-tools',
    mode: 'find-replace'
  },
  {
    id: 'rot13-cipher',
    name: 'ROT13 Cipher',
    category: 'Text & Content',
    description: 'Rotate Latin letters by 13 positions to obscure spoilers or clues.',
    tags: ['rot13', 'cipher', 'cryptography', 'obfuscate'],
    icon: 'Key',
    componentId: 'text-tools',
    mode: 'rot13'
  },
  {
    id: 'rot47-cipher',
    name: 'ROT47 Cipher',
    category: 'Text & Content',
    description: 'Rotate standard ASCII characters (33 to 126) by 47 positions.',
    tags: ['rot47', 'cipher', 'ascii', 'obfuscate'],
    icon: 'Key',
    componentId: 'text-tools',
    mode: 'rot47'
  },
  {
    id: 'caesar-cipher',
    name: 'Caesar Cipher',
    category: 'Text & Content',
    description: 'Shift alphabet characters forward or backward by custom key shift amount.',
    tags: ['caesar', 'cipher', 'shift', 'cryptography', 'secret'],
    icon: 'Lock',
    componentId: 'text-tools',
    mode: 'caesar'
  },
  {
    id: 'atbash-cipher',
    name: 'Atbash Cipher',
    category: 'Text & Content',
    description: 'Substitution cipher reversing the alphabet (A becomes Z, B becomes Y).',
    tags: ['atbash', 'cipher', 'substitution', 'hebrew'],
    icon: 'Shuffle',
    componentId: 'text-tools',
    mode: 'atbash'
  },
  {
    id: 'morse-code-encoder',
    name: 'Morse Code Encoder',
    category: 'Text & Content',
    description: 'Translate Latin alphabet and numbers into International Morse Code dots and dashes.',
    tags: ['morse', 'dots', 'dashes', 'telegraph', 'code'],
    icon: 'Radio',
    componentId: 'text-tools',
    mode: 'morse-encode'
  },
  {
    id: 'morse-code-decoder',
    name: 'Morse Code Decoder',
    category: 'Text & Content',
    description: 'Translate Morse code dots and dashes back into human-readable text.',
    tags: ['morse', 'decode', 'dots', 'dashes', 'translate'],
    icon: 'Radio',
    componentId: 'text-tools',
    mode: 'morse-decode'
  },
  {
    id: 'binary-to-text',
    name: 'Binary to Text Converter',
    category: 'Text & Content',
    description: 'Convert binary bytes (01001000...) into ASCII / UTF-8 text.',
    tags: ['binary', 'text', 'ascii', '0101', 'decode'],
    icon: 'Binary',
    componentId: 'text-tools',
    mode: 'bin-to-text'
  },
  {
    id: 'text-to-binary',
    name: 'Text to Binary Converter',
    category: 'Text & Content',
    description: 'Convert plain text into 8-bit binary representation.',
    tags: ['text', 'binary', 'ascii', 'bytes', 'encode'],
    icon: 'Binary',
    componentId: 'text-tools',
    mode: 'text-to-bin'
  },
  {
    id: 'hex-to-text',
    name: 'Hex to Text Converter',
    category: 'Text & Content',
    description: 'Convert hexadecimal string pairs into readable plain text.',
    tags: ['hex', 'text', 'ascii', 'decode'],
    icon: 'FileCode',
    componentId: 'text-tools',
    mode: 'hex-to-text'
  },
  {
    id: 'text-to-hex',
    name: 'Text to Hex Converter',
    category: 'Text & Content',
    description: 'Convert plain text into space-separated or continuous hexadecimal bytes.',
    tags: ['text', 'hex', 'bytes', 'encode'],
    icon: 'FileCode',
    componentId: 'text-tools',
    mode: 'text-to-hex'
  },
  {
    id: 'nato-phonetic-alphabet',
    name: 'NATO Phonetic Alphabet',
    category: 'Text & Content',
    description: 'Spell out words using NATO phonetic radio alphabet (Alpha, Bravo, Charlie...).',
    tags: ['nato', 'phonetic', 'aviation', 'radio', 'spell'],
    icon: 'Mic',
    componentId: 'text-tools',
    mode: 'nato'
  },
  {
    id: 'zalgo-text-generator',
    name: 'Zalgo Glitch Text Generator',
    category: 'Text & Content',
    description: 'Add creepy glitch combining diacritics to text for scary aesthetic.',
    tags: ['zalgo', 'glitch', 'cursed', 'diacritics', 'chaos'],
    icon: 'Zap',
    componentId: 'text-tools',
    mode: 'zalgo'
  },
  {
    id: 'upside-down-text',
    name: 'Upside Down Text Generator',
    category: 'Text & Content',
    description: 'Flip your text upside down using special Unicode inverted glyphs.',
    tags: ['upside down', 'flip', 'unicode', 'fun'],
    icon: 'RotateCw',
    componentId: 'text-tools',
    mode: 'upside-down'
  },
  {
    id: 'leetspeak-generator',
    name: 'Leetspeak (1337) Generator',
    category: 'Text & Content',
    description: 'Translate standard English words into hacker leetspeak slang.',
    tags: ['leet', '1337', 'hacker', 'slang', 'generator'],
    icon: 'Terminal',
    componentId: 'text-tools',
    mode: 'leetspeak'
  },
  {
    id: 'braille-converter',
    name: 'Braille Text Converter',
    category: 'Text & Content',
    description: 'Translate Latin alphabet and numbers into Grade 1 Braille symbols.',
    tags: ['braille', 'blind', 'accessibility', 'symbols'],
    icon: 'Grid',
    componentId: 'text-tools',
    mode: 'braille'
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML Converter',
    category: 'Text & Content',
    description: 'Convert Markdown formatted text into raw HTML markup.',
    tags: ['markdown', 'html', 'convert', 'markup'],
    icon: 'FileCode2',
    componentId: 'text-tools',
    mode: 'md-to-html'
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown Converter',
    category: 'Text & Content',
    description: 'Convert HTML code back into clean, readable Markdown syntax.',
    tags: ['html', 'markdown', 'convert', 'clean'],
    icon: 'FileCode2',
    componentId: 'text-tools',
    mode: 'html-to-md'
  },
  {
    id: 'html-entities-encode',
    name: 'HTML Entities Encoder',
    category: 'Text & Content',
    description: 'Escape sensitive characters like &, <, >, " and single quotes into HTML entities.',
    tags: ['html', 'entities', 'escape', 'encode', 'xss'],
    icon: 'Code',
    componentId: 'text-tools',
    mode: 'html-encode'
  },
  {
    id: 'html-entities-decode',
    name: 'HTML Entities Decoder',
    category: 'Text & Content',
    description: 'Decode HTML entities back to their original characters.',
    tags: ['html', 'entities', 'unescape', 'decode'],
    icon: 'Code',
    componentId: 'text-tools',
    mode: 'html-decode'
  },
  {
    id: 'word-wrap-tool',
    name: 'Word Wrap Tool',
    category: 'Text & Content',
    description: 'Hard-wrap lines at specified column character width.',
    tags: ['wrap', 'columns', 'format', 'lines'],
    icon: 'AlignLeft',
    componentId: 'text-tools',
    mode: 'word-wrap'
  },
  {
    id: 'strip-html-tags',
    name: 'Strip HTML Tags',
    category: 'Text & Content',
    description: 'Remove all HTML tags, scripts, and styling to extract pure plain text.',
    tags: ['html', 'strip', 'clean', 'plain text'],
    icon: 'FileText',
    componentId: 'text-tools',
    mode: 'strip-html'
  },
  {
    id: 'lines-to-csv-list',
    name: 'Lines to Comma-Separated List',
    category: 'Text & Content',
    description: 'Convert lines of text into a single comma-separated line (or custom delimiter).',
    tags: ['lines', 'csv', 'join', 'comma'],
    icon: 'List',
    componentId: 'text-tools',
    mode: 'lines-to-csv'
  },
  {
    id: 'csv-to-lines-list',
    name: 'Comma-Separated to Lines List',
    category: 'Text & Content',
    description: 'Split a comma-separated or delimited string into separate lines.',
    tags: ['csv', 'split', 'lines', 'delimited'],
    icon: 'ListOrdered',
    componentId: 'text-tools',
    mode: 'csv-to-lines'
  },
  {
    id: 'shuffle-lines',
    name: 'Shuffle Lines (Randomizer)',
    category: 'Text & Content',
    description: 'Randomize and shuffle the order of lines in a list.',
    tags: ['shuffle', 'random', 'lines', 'order'],
    icon: 'Shuffle',
    componentId: 'text-tools',
    mode: 'shuffle-lines'
  },
  {
    id: 'truncate-text-tool',
    name: 'Text Truncator with Ellipsis',
    category: 'Text & Content',
    description: 'Truncate text at specified character or word limit with customizable ellipsis.',
    tags: ['truncate', 'shorten', 'ellipsis', 'limit'],
    icon: 'Scissors',
    componentId: 'text-tools',
    mode: 'truncate'
  },
  {
    id: 'text-to-speech-tool',
    name: 'Text to Speech Reader',
    category: 'Text & Content',
    description: 'Read aloud any written text using your browser Web Speech synthesis API with voice and pitch controls.',
    tags: ['tts', 'voice', 'speech', 'audio', 'read aloud'],
    icon: 'Volume2',
    componentId: 'text-speech-tool',
    featured: true
  }
];

function add(item) {
  tools.push(item);
}

// ================= UNIT CONVERTERS =================
const unitDimensions = [
  { id: 'length-converter', name: 'Length & Distance Converter', mode: 'length', desc: 'Convert meters, feet, inches, miles, km, cm, mm, yards, nautical miles.' },
  { id: 'weight-mass-converter', name: 'Weight & Mass Converter', mode: 'weight', desc: 'Convert kilograms, pounds, grams, ounces, metric tons, stones, grains.' },
  { id: 'temperature-converter', name: 'Temperature Converter', mode: 'temperature', desc: 'Convert Celsius, Fahrenheit, Kelvin, and Rankine.' },
  { id: 'area-converter', name: 'Area Converter', mode: 'area', desc: 'Convert sq meters, sq feet, acres, hectares, sq km, sq miles.' },
  { id: 'volume-converter', name: 'Volume & Capacity Converter', mode: 'volume', desc: 'Convert liters, milliliters, gallons, quarts, pints, cups, fluid ounces.' },
  { id: 'speed-converter', name: 'Speed & Velocity Converter', mode: 'speed', desc: 'Convert km/h, mph, m/s, knots, Mach.' },
  { id: 'time-converter', name: 'Time Duration Converter', mode: 'time', desc: 'Convert milliseconds, seconds, minutes, hours, days, weeks, months, years.' },
  { id: 'digital-storage-converter', name: 'Digital Storage Converter', mode: 'digital-storage', desc: 'Convert Bytes, KB, MB, GB, TB, PB, KiB, MiB, GiB, TiB.' },
  { id: 'data-transfer-rate-converter', name: 'Data Transfer Rate Converter', mode: 'data-transfer', desc: 'Convert bps, Kbps, Mbps, Gbps, MB/s, GB/s.' },
  { id: 'pressure-converter', name: 'Pressure Converter', mode: 'pressure', desc: 'Convert Pascals, bar, psi, atmospheres, torr, mmHg.' },
  { id: 'energy-converter', name: 'Energy & Work Converter', mode: 'energy', desc: 'Convert Joules, Calories (kcal), kWh, BTU, electron-volts.' },
  { id: 'power-converter', name: 'Power Converter', mode: 'power', desc: 'Convert Watts, kilowatts, horsepower, BTU/hr, ft-lb/s.' },
  { id: 'angle-converter', name: 'Angle Converter', mode: 'angle', desc: 'Convert Degrees, Radians, Gradians, Arcminutes, Arcseconds.' },
  { id: 'fuel-economy-converter', name: 'Fuel Economy Converter', mode: 'fuel-economy', desc: 'Convert MPG US, MPG UK, L/100km, km/L.' },
  { id: 'cooking-converter', name: 'Cooking Recipe Units Converter', mode: 'cooking', desc: 'Convert tablespoons, teaspoons, cups, grams, fluid ounces.' },
  { id: 'typography-converter', name: 'PX to REM & EM Typography Converter', mode: 'typography', desc: 'Convert pixel values to responsive rem and em based on root font size.' },
];

unitDimensions.forEach(d => {
  add({
    id: d.id,
    name: d.name,
    category: 'Unit Converters',
    description: d.desc,
    tags: ['converter', 'units', d.mode],
    icon: 'Ruler',
    componentId: 'unit-converter',
    mode: d.mode,
    featured: ['length-converter', 'weight-mass-converter', 'temperature-converter'].includes(d.id)
  });
});

// Quick specific conversion tools
const quickPairs = [
  ['celsius-to-fahrenheit', 'Celsius to Fahrenheit Converter', 'Convert temperatures from Celsius to Fahrenheit (°F = °C × 9/5 + 32).', 'temperature', 'celsius-to-fahrenheit'],
  ['fahrenheit-to-celsius', 'Fahrenheit to Celsius Converter', 'Convert temperatures from Fahrenheit to Celsius (°C = (°F - 32) × 5/9).', 'temperature', 'fahrenheit-to-celsius'],
  ['celsius-to-kelvin', 'Celsius to Kelvin Converter', 'Convert temperatures from Celsius to thermodynamic Kelvin (K = °C + 273.15).', 'temperature', 'celsius-to-kelvin'],
  ['kelvin-to-celsius', 'Kelvin to Celsius Converter', 'Convert temperatures from Kelvin to Celsius (°C = K - 273.15).', 'temperature', 'kelvin-to-celsius'],
  ['fahrenheit-to-kelvin', 'Fahrenheit to Kelvin Converter', 'Convert temperatures from Fahrenheit directly to Kelvin.', 'temperature', 'fahrenheit-to-kelvin'],
  ['meters-to-feet', 'Meters to Feet Converter', 'Convert distance from meters to decimal feet and feet & inches.', 'length', 'meters-to-feet'],
  ['feet-to-meters', 'Feet to Meters Converter', 'Convert measurements from feet & inches to metric meters.', 'length', 'feet-to-meters'],
  ['km-to-miles', 'Kilometers to Miles Converter', 'Convert distances from kilometers to statute miles (1 km ≈ 0.621371 mi).', 'length', 'km-to-miles'],
  ['miles-to-km', 'Miles to Kilometers Converter', 'Convert distances from miles to kilometers (1 mi ≈ 1.60934 km).', 'length', 'miles-to-km'],
  ['cm-to-inches', 'Centimeters to Inches Converter', 'Convert lengths from centimeters to inches (1 in = 2.54 cm).', 'length', 'cm-to-inches'],
  ['inches-to-cm', 'Inches to Centimeters Converter', 'Convert lengths from inches to centimeters.', 'length', 'inches-to-cm'],
  ['mm-to-inches', 'Millimeters to Inches Converter', 'Convert tiny measurements from millimeters to fractional/decimal inches.', 'length', 'mm-to-inches'],
  ['inches-to-mm', 'Inches to Millimeters Converter', 'Convert inches to precise metric millimeters.', 'length', 'inches-to-mm'],
  ['yards-to-meters', 'Yards to Meters Converter', 'Convert yards to international meters (1 yd = 0.9144 m).', 'length', 'yards-to-meters'],
  ['meters-to-yards', 'Meters to Yards Converter', 'Convert meters to yards (1 m ≈ 1.09361 yd).', 'length', 'meters-to-yards'],
  ['feet-to-inches', 'Feet to Inches Converter', 'Convert decimal feet to inches (1 ft = 12 in).', 'length', 'feet-to-inches'],
  ['inches-to-feet', 'Inches to Feet Converter', 'Convert total inches to feet.', 'length', 'inches-to-feet'],
  ['yards-to-feet', 'Yards to Feet Converter', 'Convert yards to feet (1 yd = 3 ft).', 'length', 'yards-to-feet'],
  ['feet-to-yards', 'Feet to Yards Converter', 'Convert feet to yards (3 ft = 1 yd).', 'length', 'feet-to-yards'],
  ['kg-to-lbs', 'Kilograms to Pounds Converter', 'Convert mass from kilograms to pounds (1 kg ≈ 2.20462 lbs).', 'weight', 'kg-to-lbs'],
  ['lbs-to-kg', 'Pounds to Kilograms Converter', 'Convert weight from pounds to metric kilograms (1 lb ≈ 0.453592 kg).', 'weight', 'lbs-to-kg'],
  ['grams-to-ounces', 'Grams to Ounces Converter', 'Convert weight from grams to ounces (1 oz ≈ 28.3495 g).', 'weight', 'grams-to-ounces'],
  ['ounces-to-grams', 'Ounces to Grams Converter', 'Convert ounces to metric grams.', 'weight', 'ounces-to-grams'],
  ['kg-to-stones', 'Kilograms to Stones Converter', 'Convert kilograms to British imperial stones and pounds.', 'weight', 'kg-to-stones'],
  ['stones-to-kg', 'Stones to Kilograms Converter', 'Convert British stones to metric kilograms.', 'weight', 'stones-to-kg'],
  ['liters-to-gallons', 'Liters to US Gallons Converter', 'Convert liquid volume from liters to US liquid gallons.', 'volume', 'liters-to-gallons'],
  ['gallons-to-liters', 'Gallons to Liters Converter', 'Convert volume from US gallons to metric liters (1 gal ≈ 3.78541 L).', 'volume', 'gallons-to-liters'],
  ['liters-to-pints', 'Liters to US Pints Converter', 'Convert liquid volume from liters to US liquid pints (1 L ≈ 2.11338 pt).', 'volume', 'liters-to-pints'],
  ['pints-to-liters', 'US Pints to Liters Converter', 'Convert US liquid pints to metric liters.', 'volume', 'pints-to-liters'],
  ['ml-to-fluid-oz', 'Milliliters to Fluid Ounces Converter', 'Convert liquid volume from ml to US fluid ounces.', 'volume', 'ml-to-fl-oz'],
  ['fluid-oz-to-ml', 'Fluid Ounces to Milliliters Converter', 'Convert fluid ounces (fl oz) to metric milliliters.', 'volume', 'fl-oz-to-ml'],
  ['cups-to-ml', 'Cooking Cups to Milliliters Converter', 'Convert culinary recipe cups to metric milliliters (1 US cup = 240 ml).', 'cooking', 'cups-to-ml'],
  ['ml-to-cups', 'Milliliters to Cooking Cups Converter', 'Convert milliliters to standard recipe cups.', 'cooking', 'ml-to-cups'],
  ['tbsp-to-tsp', 'Tablespoons to Teaspoons Converter', 'Convert tablespoons to teaspoons (1 tbsp = 3 tsp).', 'cooking', 'tbsp-to-tsp'],
  ['sq-meters-to-sq-feet', 'Square Meters to Square Feet', 'Convert floor and land area from square meters to square feet.', 'area', 'sqm-to-sqft'],
  ['sq-feet-to-sq-meters', 'Square Feet to Square Meters', 'Convert floor plan area from square feet to square meters.', 'area', 'sqft-to-sqm'],
  ['acres-to-hectares', 'Acres to Hectares Converter', 'Convert rural land area from acres to metric hectares.', 'area', 'acres-to-hectares'],
  ['hectares-to-acres', 'Hectares to Acres Converter', 'Convert hectares to acres (1 ha ≈ 2.47105 acres).', 'area', 'hectares-to-acres'],
  ['kmh-to-mph', 'Km/h to MPH Speed Converter', 'Convert driving speed from kilometers per hour to miles per hour.', 'speed', 'kmh-to-mph'],
  ['mph-to-kmh', 'MPH to Km/h Speed Converter', 'Convert speed from miles per hour to kilometers per hour.', 'speed', 'mph-to-kmh'],
  ['knots-to-mph', 'Knots to MPH Converter', 'Convert nautical knots to statute miles per hour.', 'speed', 'knots-to-mph'],
  ['mph-to-knots', 'MPH to Knots Converter', 'Convert miles per hour to maritime/aviation knots.', 'speed', 'mph-to-knots'],
  ['mb-to-gb', 'Megabytes to Gigabytes Converter', 'Convert file storage between Megabytes (MB) and Gigabytes (GB).', 'digital-storage', 'mb-to-gb'],
  ['gb-to-tb', 'Gigabytes to Terabytes Converter', 'Convert data storage between Gigabytes (GB) and Terabytes (TB).', 'digital-storage', 'gb-to-tb'],
  ['bytes-to-kb', 'Bytes to Kilobytes Converter', 'Convert raw byte count to readable Kilobytes (KB).', 'digital-storage', 'bytes-to-kb'],
  ['bits-to-bytes', 'Bits to Bytes Converter', 'Convert digital bits to bytes (8 bits = 1 byte).', 'digital-storage', 'bits-to-bytes'],
  ['mbps-to-mbs', 'Mbps to MB/s Bandwidth Converter', 'Convert network speed from Megabits/s to Megabytes/s download speed.', 'data-transfer', 'mbps-to-mbs'],
  ['bar-to-psi', 'Bar to PSI Pressure Converter', 'Convert pressure from metric Bar to Pounds per Square Inch (PSI).', 'pressure', 'bar-to-psi'],
  ['psi-to-bar', 'PSI to Bar Pressure Converter', 'Convert tire pressure from PSI to metric Bar.', 'pressure', 'psi-to-bar'],
  ['atm-to-psi', 'Atmospheres to PSI Converter', 'Convert standard atmospheres (atm) to Pounds per Square Inch (1 atm ≈ 14.6959 psi).', 'pressure', 'atm-to-psi'],
  ['psi-to-atm', 'PSI to Atmospheres Converter', 'Convert PSI pressure into standard physical atmospheres.', 'pressure', 'psi-to-atm'],
  ['joules-to-calories', 'Joules to Calories Converter', 'Convert energy from physical Joules to food Calories (kcal).', 'energy', 'joules-to-cal'],
  ['calories-to-joules', 'Calories to Joules Converter', 'Convert food nutritional calories to scientific Joules.', 'energy', 'cal-to-joules'],
  ['kw-to-hp', 'Kilowatts to Horsepower Converter', 'Convert electrical motor power from kW to mechanical Horsepower (HP).', 'power', 'kw-to-hp'],
  ['hp-to-kw', 'Horsepower to Kilowatts Converter', 'Convert mechanical horsepower to metric kilowatts.', 'power', 'hp-to-kw'],
  ['degrees-to-radians', 'Degrees to Radians Converter', 'Convert plane angles from degrees to radians (rad = deg × π / 180).', 'angle', 'deg-to-rad'],
  ['radians-to-degrees', 'Radians to Degrees Converter', 'Convert mathematical radians to degrees (deg = rad × 180 / π).', 'angle', 'rad-to-deg'],
  ['number-base-converter', 'Number Base Converter (2-36)', 'Convert numbers across Binary, Octal, Decimal, Hexadecimal and arbitrary radixes.', 'number-base', 'base', 'Binary', 'number-base-tool'],
  ['roman-numerals-converter', 'Roman Numerals Converter', 'Convert standard Arabic numbers to Roman numerals (e.g. 2026 -> MMXXVI) and vice versa.', 'roman', 'roman', 'Type', 'roman-converter']
];

quickPairs.forEach(q => {
  if (q[0] === 'number-base-converter' || q[0] === 'roman-numerals-converter') {
    add({
      id: q[0],
      name: q[1],
      category: 'Unit Converters',
      description: q[2],
      tags: ['converter', q[3], 'units'],
      icon: q[5] || 'Ruler',
      componentId: q[6] || 'unit-converter',
      mode: q[4],
      featured: true
    });
  } else {
    add({
      id: q[0],
      name: q[1],
      category: 'Unit Converters',
      description: q[2],
      tags: ['converter', q[3], 'quick-convert', 'units'],
      icon: 'ArrowRightLeft',
      componentId: 'quick-unit-tool',
      mode: q[4]
    });
  }
});

// ================= CODE & WEB DEV TOOLS =================
const codeDevTools = [
  { id: 'json-formatter', name: 'JSON Formatter & Validator', desc: 'Prettify, validate, format, and inspect JSON with syntax highlighting.', mode: 'json-format', feat: true, icon: 'Braces' },
  { id: 'json-minifier', name: 'JSON Minifier', desc: 'Compress JSON by removing whitespace, indentation, and newlines.', mode: 'json-minify', icon: 'Minimize2' },
  { id: 'json-validator', name: 'JSON Syntax Validator', desc: 'Validate JSON syntax and structure with precise error highlighting and line positions.', mode: 'json-validate', icon: 'CheckCircle' },
  { id: 'json-to-yaml', name: 'JSON to YAML Converter', desc: 'Convert JSON objects into clean, indented YAML data format.', mode: 'json-to-yaml', icon: 'FileCode' },
  { id: 'yaml-to-json', name: 'YAML to JSON Converter', desc: 'Parse YAML configuration into standard structured JSON.', mode: 'yaml-to-json', icon: 'FileCode' },
  { id: 'json-to-csv', name: 'JSON to CSV Converter', desc: 'Convert array of JSON objects into tabular CSV format for spreadsheets.', mode: 'json-to-csv', icon: 'Table' },
  { id: 'csv-to-json', name: 'CSV to JSON Converter', desc: 'Parse CSV spreadsheets and comma-separated text into structured JSON arrays.', mode: 'csv-to-json', icon: 'Table' },
  { id: 'json-to-typescript', name: 'JSON to TypeScript Interfaces', desc: 'Automatically generate TypeScript interface definitions from raw JSON samples.', mode: 'json-to-ts', icon: 'Code2', feat: true },
  { id: 'xml-formatter', name: 'XML Formatter & Prettifier', desc: 'Format, indent, and prettify messy XML and SVG documents.', mode: 'xml-format', icon: 'Code' },
  { id: 'xml-minifier', name: 'XML Minifier', desc: 'Compress XML documents by stripping extraneous spaces and newlines.', mode: 'xml-minify', icon: 'Minimize2' },
  { id: 'html-formatter', name: 'HTML Formatter & Beautifier', desc: 'Format and properly indent HTML markup with standard tab sizing.', mode: 'html-format', icon: 'FileCode2' },
  { id: 'html-minifier', name: 'HTML Minifier', desc: 'Minify HTML source code to reduce page payload and load faster.', mode: 'html-minify', icon: 'Minimize2' },
  { id: 'css-beautifier', name: 'CSS Beautifier', desc: 'Format unformatted or minified CSS styles with clean rule indentation.', mode: 'css-format', icon: 'Palette' },
  { id: 'css-minifier', name: 'CSS Minifier', desc: 'Minify CSS files by stripping comments, whitespace, and semicolons.', mode: 'css-minify', icon: 'Minimize2' },
  { id: 'js-formatter', name: 'JavaScript Formatter', desc: 'Format JavaScript and TypeScript code with clean indentations and brace styles.', mode: 'js-format', icon: 'FileCode' },
  { id: 'js-minifier', name: 'JS Quick Minifier', desc: 'Strip comments and redundant whitespace from JavaScript code.', mode: 'js-minify', icon: 'Minimize2' },
  { id: 'sql-formatter', name: 'SQL Query Formatter', desc: 'Format and beautify complex SQL queries with capitalized keywords.', mode: 'sql-format', icon: 'Database', feat: true },
  { id: 'curl-to-fetch', name: 'cURL to Fetch Converter', desc: 'Convert cURL command strings into modern browser JavaScript fetch() code snippets.', mode: 'curl-fetch', icon: 'Terminal' },
  { id: 'user-agent-parser', name: 'User-Agent Inspector', desc: 'Parse browser User-Agent string to detect browser name, engine, operating system, and device type.', mode: 'user-agent', icon: 'Monitor' },
  { id: 'url-parser', name: 'URL Parser & Query Inspector', desc: 'Deconstruct URLs into protocol, host, port, path, parameters table, and hash fragment.', mode: 'url-parse', icon: 'Link' },
  { id: 'url-query-builder', name: 'URL Query String Builder', desc: 'Assemble key-value pairs into properly URL-encoded query strings.', mode: 'query-builder', icon: 'Sliders' },
  { id: 'semver-calculator', name: 'Semantic Versioning (SemVer) Tool', desc: 'Compare two SemVer versions, bump major, minor, patch, or prerelease tags.', mode: 'semver', icon: 'GitBranch' },
  { id: 'robots-txt-generator', name: 'Robots.txt Generator', desc: 'Create crawler rules for Googlebot, Bingbot, and AI scrapers with custom disallow paths.', mode: 'robots-txt', icon: 'Bot' },
  { id: 'sitemap-generator', name: 'XML Sitemap Generator', desc: 'Create XML sitemap skeleton from list of URL paths with priority and changefreq.', mode: 'sitemap-xml', icon: 'Map' },
  { id: 'htaccess-generator', name: '.htaccess Redirects Generator', desc: 'Generate Apache .htaccess redirect rules (301, 302, HTTPS enforce, www removal).', mode: 'htaccess', icon: 'Server' },
  { id: 'nginx-config-generator', name: 'Nginx Config Snippet Generator', desc: 'Generate Nginx server block configs for reverse proxies, static SPAs, and SSL redirects.', mode: 'nginx', icon: 'Server' },
  { id: 'svg-to-data-uri', name: 'SVG to Data URI Converter', desc: 'Convert raw SVG XML into URL-encoded or base64 CSS background-image data URI.', mode: 'svg-data-uri', icon: 'Image' },
  { id: 'base64-data-uri-generator', name: 'Base64 Data URI Generator', desc: 'Generate complete data:mime;base64 string for file embedding.', mode: 'base64-data-uri', icon: 'FileText' },
  { id: 'csp-header-builder', name: 'Content Security Policy (CSP) Builder', desc: 'Visually configure default-src, script-src, style-src, and frame-ancestors CSP directives.', mode: 'csp-builder', icon: 'Shield' },
  { id: 'git-ignore-generator', name: '.gitignore File Generator', desc: 'Generate curated .gitignore rules for Node, Python, Java, Go, Rust, React, and OS.', mode: 'gitignore', icon: 'GitBranch' }
];

codeDevTools.forEach(t => {
  add({
    id: t.id,
    name: t.name,
    category: 'Code & Web Dev',
    description: t.desc,
    tags: ['code', 'developer', t.mode],
    icon: t.icon,
    componentId: 'code-tools',
    mode: t.mode,
    featured: t.feat || false
  });
});

add({
  id: 'jwt-decoder',
  name: 'JWT Decoder & Inspector',
  category: 'Code & Web Dev',
  description: 'Decode JSON Web Tokens, inspect header, payload claims, expiration timestamps, and validation status.',
  tags: ['jwt', 'token', 'auth', 'decode', 'bearer', 'security'],
  icon: 'Key',
  componentId: 'jwt-decoder',
  featured: true
});

add({
  id: 'cron-expression-parser',
  name: 'Cron Expression Parser & Explainer',
  category: 'Code & Web Dev',
  description: 'Parse standard cron schedules into plain human-readable sentences and calculate next execution runs.',
  tags: ['cron', 'schedule', 'crontab', 'time', 'devops'],
  icon: 'Clock',
  componentId: 'cron-tool',
  featured: true
});

add({
  id: 'chmod-calculator',
  name: 'Chmod Permissions Calculator',
  category: 'Code & Web Dev',
  description: 'Calculate UNIX file permission modes interactively in octal (e.g. 755), symbolic (rwxr-xr-x), and command syntax.',
  tags: ['chmod', 'permissions', 'linux', 'unix', 'rwx', 'octal'],
  icon: 'ShieldCheck',
  componentId: 'chmod-tool',
  featured: true
});

add({
  id: 'regex-tester',
  name: 'RegEx Interactive Tester',
  category: 'Code & Web Dev',
  description: 'Test regular expressions against sample text with live match highlighting, group captures, and flag toggles.',
  tags: ['regex', 'regular expression', 'tester', 'pattern', 'match'],
  icon: 'Search',
  componentId: 'regex-tester',
  featured: true
});

add({
  id: 'uuid-v4-generator',
  name: 'UUID v4 Generator',
  category: 'Code & Web Dev',
  description: 'Generate cryptographically random UUID v4 identifiers in batch with custom formatting.',
  tags: ['uuid', 'guid', 'v4', 'random', 'generator', 'id'],
  icon: 'Fingerprint',
  componentId: 'uuid-tool',
  mode: 'v4',
  featured: true
});

add({
  id: 'uuid-v1-generator',
  name: 'UUID v1 Generator',
  category: 'Code & Web Dev',
  description: 'Generate timestamp-based UUID v1 identifiers client-side.',
  tags: ['uuid', 'v1', 'timestamp', 'generator'],
  icon: 'Fingerprint',
  componentId: 'uuid-tool',
  mode: 'v1'
});

add({
  id: 'uuid-v7-generator',
  name: 'UUID v7 Generator',
  category: 'Code & Web Dev',
  description: 'Generate sortable modern Unix-epoch timestamped UUID v7 identifiers.',
  tags: ['uuid', 'v7', 'sortable', 'timestamp', 'generator'],
  icon: 'Fingerprint',
  componentId: 'uuid-tool',
  mode: 'v7'
});

add({
  id: 'uuid-validator',
  name: 'UUID Validator & Parser',
  category: 'Code & Web Dev',
  description: 'Validate UUID strings, extract version number, and check RFC 4122 compliance.',
  tags: ['uuid', 'validator', 'guid', 'check'],
  icon: 'CheckCircle',
  componentId: 'uuid-tool',
  mode: 'validate'
});

add({
  id: 'nanoid-generator',
  name: 'NanoID Generator',
  category: 'Code & Web Dev',
  description: 'Generate URL-friendly compact unique IDs with customizable alphabet and length.',
  tags: ['nanoid', 'id', 'unique', 'compact', 'url-friendly'],
  icon: 'Hash',
  componentId: 'uuid-tool',
  mode: 'nanoid'
});

add({
  id: 'qr-code-generator',
  name: 'QR Code Generator',
  category: 'Code & Web Dev',
  description: 'Generate high-resolution QR codes for URLs, text, Wi-Fi credentials, with SVG/PNG download and custom colors.',
  tags: ['qr', 'qrcode', 'barcode', 'generator', 'svg', 'png'],
  icon: 'QrCode',
  componentId: 'qr-generator',
  featured: true
});

add({
  id: 'qr-code-scanner',
  name: 'QR Code Reader & Scanner',
  category: 'Code & Web Dev',
  description: 'Decode and read QR codes from uploaded images or your web camera client-side.',
  tags: ['qr', 'scanner', 'reader', 'decode', 'camera'],
  icon: 'Scan',
  componentId: 'qr-scanner'
});

add({
  id: 'barcode-generator',
  name: 'Barcode Generator',
  category: 'Code & Web Dev',
  description: 'Generate standard Code 128 barcodes from numbers and text with SVG download.',
  tags: ['barcode', 'code128', 'ean', 'scanner'],
  icon: 'Barcode',
  componentId: 'barcode-generator'
});

add({
  id: 'keycode-inspector',
  name: 'Keycode Event Inspector',
  category: 'Code & Web Dev',
  description: 'Press any key on your keyboard to view event.key, event.code, which, and modifier states.',
  tags: ['keycode', 'keyboard', 'event', 'javascript', 'tester'],
  icon: 'Keyboard',
  componentId: 'keycode-inspector',
  featured: true
});

add({
  id: 'meta-tags-generator',
  name: 'Meta Tags & OpenGraph Generator',
  category: 'Code & Web Dev',
  description: 'Generate complete HTML SEO meta tags, OpenGraph cards for Facebook & LinkedIn, and Twitter Card tags.',
  tags: ['meta', 'seo', 'opengraph', 'twitter', 'social'],
  icon: 'Globe',
  componentId: 'meta-generator'
});

// ================= CRYPTO & SECURITY =================
const cryptoToolsList = [
  { id: 'sha256-hash', name: 'SHA-256 Hash Generator', mode: 'sha256', desc: 'Compute cryptographic SHA-256 hash using Web Crypto API.', feat: true },
  { id: 'sha512-hash', name: 'SHA-512 Hash Generator', mode: 'sha512', desc: 'Compute 512-bit cryptographic hash using Web Crypto API.' },
  { id: 'sha384-hash', name: 'SHA-384 Hash Generator', mode: 'sha384', desc: 'Compute 384-bit cryptographic hash using Web Crypto API.' },
  { id: 'sha1-hash', name: 'SHA-1 Hash Generator', mode: 'sha1', desc: 'Compute legacy SHA-1 hash checksum of any input text.' },
  { id: 'md5-hash', name: 'MD5 Hash Generator', mode: 'md5', desc: 'Generate 128-bit MD5 message digest hash client-side.' },
  { id: 'hmac-sha256', name: 'HMAC-SHA256 Generator', mode: 'hmac-sha256', desc: 'Calculate Hash-based Message Authentication Code using SHA-256 and secret key.' },
  { id: 'hmac-sha512', name: 'HMAC-SHA512 Generator', mode: 'hmac-sha512', desc: 'Calculate high-security HMAC using SHA-512 algorithm and secret key.' },
  { id: 'hmac-md5', name: 'HMAC-MD5 Generator', mode: 'hmac-md5', desc: 'Calculate HMAC message digest using MD5 algorithm and secret key.' },
  { id: 'aes-encrypt', name: 'AES Encryption Tool', mode: 'aes-encrypt', desc: 'Encrypt secret text messages using AES-256 cipher with custom password passphrase.' },
  { id: 'aes-decrypt', name: 'AES Decryption Tool', mode: 'aes-decrypt', desc: 'Decrypt AES-256 encrypted ciphertext using your secret passphrase.' },
  { id: 'base64-encoder', name: 'Base64 Text Encoder', mode: 'b64-encode', desc: 'Encode UTF-8 text into standard Base64 representation.' },
  { id: 'base64-decoder', name: 'Base64 Text Decoder', mode: 'b64-decode', desc: 'Decode Base64 strings back into original UTF-8 text.' },
  { id: 'base64url-encoder', name: 'Base64URL Encoder', mode: 'b64url-encode', desc: 'Encode text into URL-safe Base64 without + / and padding = signs.' },
  { id: 'base64url-decoder', name: 'Base64URL Decoder', mode: 'b64url-decode', desc: 'Decode URL-safe Base64 strings into UTF-8 text.' },
  { id: 'url-encoder', name: 'URL Percent Encoder', mode: 'url-encode', desc: 'Encode special characters into percent-encoded URI strings (RFC 3986).' },
  { id: 'url-decoder', name: 'URL Percent Decoder', mode: 'url-decode', desc: 'Decode percent-encoded %20, %2F, %3F URL query strings.' },
  { id: 'random-hex-generator', name: 'Random Hex Generator', mode: 'random-hex', desc: 'Generate cryptographically random hexadecimal strings of arbitrary byte length.' }
];

cryptoToolsList.forEach(c => {
  add({
    id: c.id,
    name: c.name,
    category: 'Crypto & Security',
    description: c.desc,
    tags: ['crypto', 'hash', 'security', c.mode],
    icon: 'Hash',
    componentId: 'crypto-tools',
    mode: c.mode,
    featured: c.feat || false
  });
});

add({
  id: 'password-generator',
  name: 'Strong Password Generator',
  category: 'Crypto & Security',
  description: 'Generate ultra-secure passwords using cryptographic randomness with length, uppercase, numbers, and symbols rules.',
  tags: ['password', 'random', 'security', 'generator', 'credentials'],
  icon: 'Lock',
  componentId: 'password-tool',
  featured: true
});

add({
  id: 'password-strength-checker',
  name: 'Password Strength & Entropy Analyzer',
  category: 'Crypto & Security',
  description: 'Evaluate password resilience, bits of entropy, dictionary risks, and estimated crack time.',
  tags: ['password', 'strength', 'entropy', 'security', 'audit'],
  icon: 'ShieldCheck',
  componentId: 'password-strength',
  featured: true
});

add({
  id: 'rsa-key-generator',
  name: 'RSA Key Pair Generator',
  category: 'Crypto & Security',
  description: 'Generate asymmetric RSA-2048 or RSA-4096 public and private key pairs in PEM format using Web Crypto.',
  tags: ['rsa', 'keys', 'public key', 'private key', 'asymmetric'],
  icon: 'Key',
  componentId: 'rsa-tool'
});

add({
  id: 'totp-generator',
  name: 'TOTP 2FA Authenticator Simulator',
  category: 'Crypto & Security',
  description: 'Generate live 6-digit Time-based One-Time Passwords from 2FA Base32 secret keys (RFC 6238).',
  tags: ['totp', '2fa', 'authenticator', 'otp', 'security'],
  icon: 'ShieldAlert',
  componentId: 'totp-tool'
});

add({
  id: 'file-checksum-verifier',
  name: 'File Checksum Verifier',
  category: 'Crypto & Security',
  description: 'Compute SHA-256 or MD5 hash of any local file right in your browser without uploading to any server.',
  tags: ['checksum', 'file', 'sha256', 'md5', 'verify'],
  icon: 'FileCheck',
  componentId: 'file-checksum',
  featured: true
});

// ================= MATH & SCIENCE =================
const mathModes = [
  ['percentage-calculator', 'Percentage Calculator', 'percentage', 'Calculate what is X% of Y, percentage increase/decrease, and X is what percent of Y.', true, 'Percent'],
  ['fraction-simplifier', 'Fraction Simplifier & Calculator', 'fractions', 'Simplify fractions to lowest terms, convert to decimal/mixed numbers, and add/subtract fractions.', false, 'Divide'],
  ['gcd-lcm-calculator', 'GCD & LCM Calculator', 'gcd-lcm', 'Calculate Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of two or more numbers.', false, 'Binary'],
  ['prime-number-checker', 'Prime Number Checker', 'prime-check', 'Test if a number is prime and view nearby prime numbers.', false, 'CheckCircle'],
  ['prime-factorization', 'Prime Factorization Calculator', 'prime-factors', 'Decompose any positive integer into its product of prime factors.', false, 'Sparkles'],
  ['statistics-calculator', 'Statistics & Summary Calculator', 'statistics', 'Calculate Mean, Median, Mode, Variance, Standard Deviation, Min, Max, Range, and Sum.', true, 'BarChart2'],
  ['quadratic-equation-solver', 'Quadratic Equation Solver', 'quadratic', 'Find real and complex roots of quadratic equation ax² + bx + c = 0 with step-by-step discriminant.', false, 'FunctionSquare'],
  ['random-number-generator', 'Random Number Generator', 'random-num', 'Generate customizable lists of random numbers within min/max bounds.', false, 'Shuffle'],
  ['coin-flipper', 'Coin Flipper & Probabilities', 'coin-flip', 'Flip virtual coins with flip animations, heads/tails counts, and streak tracking.', false, 'Coins'],
  ['permutations-combinations', 'Permutations & Combinations (nPr / nCr)', 'perm-comb', 'Calculate nPr permutations and nCr combinations with factorial formulas.', false, 'Layers'],
  ['fibonacci-generator', 'Fibonacci Sequence Generator', 'fibonacci', 'Generate Fibonacci sequence up to N terms with ratio convergence analysis.', false, 'TrendingUp'],
  ['golden-ratio-calculator', 'Golden Ratio (φ) Calculator', 'golden-ratio', 'Calculate divine proportions and golden sections (1.618033...) for art and design.', false, 'CircleDot'],
  ['rule-of-three-calculator', 'Rule of Three Calculator', 'rule-of-three', 'Solve direct and inverse proportions (if A yields B, then what does C yield?).', false, 'HelpCircle'],
  ['number-to-words', 'Number to Words Speller', 'num-to-words', 'Spell out numbers into written English words (e.g. 14,250 -> Fourteen Thousand Two Hundred Fifty).', false, 'FileText'],
  ['bitwise-calculator', 'Bitwise Logic Calculator', 'bitwise', 'Compute bitwise AND, OR, XOR, NOT, and bit shifts with 32-bit binary views.', false, 'Cpu'],
  ['ohm-law-calculator', "Ohm's Law Calculator", 'ohms-law', 'Calculate Voltage (V), Current (I), Resistance (R), and Power (P) in electrical circuits.', false, 'Zap'],
  ['kinetic-energy-calculator', 'Kinetic Energy Calculator', 'kinetic-energy', 'Calculate kinetic energy (E_k = ½mv²) from mass and velocity.', false, 'Zap'],
  ['gravitational-potential-energy', 'Potential Energy Calculator', 'potential-energy', 'Calculate gravitational potential energy (E_p = m · g · h) from mass and height.', false, 'Zap'],
  ['circle-calculator', 'Circle Area & Circumference Calculator', 'circle', 'Calculate radius, diameter, circumference, and surface area of circles.', false, 'Circle'],
  ['triangle-area-calculator', 'Triangle Area & Trigonometry Solver', 'triangle', 'Calculate area using base/height or Heron formula with side lengths.', false, 'Triangle'],
  ['hypotenuse-calculator', 'Hypotenuse (Pythagorean) Calculator', 'hypotenuse', 'Calculate hypotenuse length c = √(a² + b²) of a right-angled triangle.', false, 'Triangle'],
  ['sphere-calculator', 'Sphere Volume & Area Calculator', 'sphere', 'Calculate volume V = 4/3 πr³ and surface area A = 4πr² of a sphere.', false, 'Circle'],
  ['cylinder-calculator', 'Cylinder Volume & Area Calculator', 'cylinder', 'Calculate volume V = πr²h and total surface area of a cylinder.', false, 'Box'],
  ['cone-calculator', 'Cone Volume & Slant Height Calculator', 'cone', 'Calculate volume V = 1/3 πr²h and slant height of a circular cone.', false, 'Triangle'],
  ['cube-calculator', 'Cube Volume & Surface Area Calculator', 'cube', 'Calculate volume V = s³ and total surface area A = 6s² of a regular cube.', false, 'Box'],
  ['rectangle-calculator', 'Rectangle Area & Perimeter Calculator', 'rectangle', 'Calculate perimeter P = 2(l + w) and surface area A = l · w of rectangles.', false, 'Square'],
  ['logarithm-calculator', 'Logarithm Calculator (log10, ln, log2)', 'logarithm', 'Compute common logarithm (base 10), natural log (ln), and binary log (base 2).', false, 'Calculator'],
  ['z-score-calculator', 'Z-Score Normal Distribution Calculator', 'z-score', 'Calculate standard Z-score (x - μ) / σ and percentile ranking.', false, 'BarChart2'],
  ['midpoint-calculator', '2D Midpoint Coordinate Calculator', 'midpoint', 'Find the midpoint coordinate ((x1+x2)/2, (y1+y2)/2) between two Cartesian points.', false, 'Compass'],
  ['distance-2d-calculator', '2D Euclidean Distance Calculator', 'distance-2d', 'Calculate straight-line distance d = √((x2-x1)² + (y2-y1)²) between two points.', false, 'Ruler'],
  ['slope-calculator', 'Slope & Line Equation Calculator', 'slope', 'Calculate slope m = (y2 - y1) / (x2 - x1) and equation y = mx + b.', false, 'TrendingUp'],
  ['speed-distance-time', 'Speed, Distance & Time Calculator', 'speed-dist-time', 'Solve for speed (v = d/t), distance (d = vt), or time (t = d/v).', false, 'Gauge'],
  ['density-mass-volume', 'Density, Mass & Volume Calculator', 'density', 'Calculate physical material density ρ = m / V, mass, or volume.', false, 'Box'],
  ['work-power-energy-calculator', 'Work & Mechanical Power Calculator', 'work-power', 'Calculate physical work W = F · d and power output P = W / t in Watts.', false, 'Zap']
];

mathModes.forEach(m => {
  add({
    id: m[0],
    name: m[1],
    category: 'Math & Science',
    description: m[3],
    tags: ['math', 'science', m[2]],
    icon: m[5],
    componentId: 'math-tools',
    mode: m[2],
    featured: m[4]
  });
});

add({
  id: 'scientific-calculator',
  name: 'Scientific Calculator',
  category: 'Math & Science',
  description: 'Full scientific calculator with trigonometric (sin, cos, tan), logarithmic, exponential, and memory functions.',
  tags: ['calculator', 'scientific', 'math', 'trig', 'log'],
  icon: 'Calculator',
  componentId: 'scientific-calc',
  featured: true
});

add({
  id: 'dice-roller',
  name: 'Virtual Dice Roller',
  category: 'Math & Science',
  description: 'Roll tabletop gaming dice (d4, d6, d8, d10, d12, d20, d100) with modifier sum and roll history log.',
  tags: ['dice', 'dnd', 'roller', 'd20', 'd6', 'games'],
  icon: 'Dice5',
  componentId: 'dice-tool',
  featured: true
});

// ================= FINANCE & MONEY =================
const financeModes = [
  ['simple-interest-calculator', 'Simple Interest Calculator', 'simple-interest', 'Calculate principal, rate, time, and accrued simple interest (I = P · r · t).', 'DollarSign'],
  ['discount-sale-calculator', 'Discount & Sale Price Calculator', 'discount', 'Calculate discounted sale price, dollar savings, and final price after coupons.', 'Tag'],
  ['sales-tax-vat-calculator', 'Sales Tax / VAT / GST Calculator', 'sales-tax', 'Add or reverse tax from gross or net prices with custom tax rates.', 'Percent'],
  ['profit-margin-markup', 'Profit Margin & Markup Calculator', 'margin-markup', 'Compute cost, selling price, gross profit margin %, and markup percentage.', 'Briefcase'],
  ['break-even-calculator', 'Break-Even Point Calculator', 'break-even', 'Determine units and revenue required to cover fixed and variable business costs.', 'Target'],
  ['investment-roi-calculator', 'ROI (Return on Investment) Calculator', 'roi', 'Calculate total gain, percentage return on investment, and annualized ROI.', 'TrendingUp'],
  ['inflation-calculator', 'Inflation Impact Calculator', 'inflation', 'Calculate how purchasing power erodes over years at given inflation rates.', 'TrendingDown'],
  ['retirement-savings-planner', 'Retirement Savings Planner', 'retirement', 'Estimate required nest egg, future portfolio value, and monthly retirement withdrawal budget.', 'Award'],
  ['salary-to-hourly-converter', 'Salary to Hourly Wage Converter', 'salary-hourly', 'Convert annual salary into equivalent hourly, daily, weekly, and monthly pay rates.', 'CreditCard'],
  ['unit-price-comparator', 'Unit Price Best-Value Comparator', 'unit-price', 'Compare two items with different sizes and prices to identify the cheapest unit price.', 'ShoppingBag'],
  ['fuel-cost-trip-calculator', 'Trip Fuel Cost Calculator', 'fuel-trip', 'Estimate road trip fuel expenses based on distance, vehicle MPG, and fuel price per gallon/liter.', 'Car'],
  ['rule-of-72-calculator', 'Rule of 72 Doubling Time Calculator', 'rule-of-72', 'Estimate how many years it will take to double your investment at a fixed annual return rate.', 'Clock'],
  ['emergency-fund-calculator', 'Emergency Fund Target Calculator', 'emergency-fund', 'Calculate 3 to 6 months of living expenses reserve fund recommendation.', 'ShieldCheck'],
  ['freelance-hourly-rate-calculator', 'Freelance Billing Rate Calculator', 'freelance-rate', 'Calculate minimum hourly billable rate from desired income and billable hours.', 'Briefcase'],
  ['50-30-20-budget-calculator', '50/30/20 Monthly Budget Calculator', 'budget-50-30-20', 'Allocate monthly take-home income into 50% Needs, 30% Wants, and 20% Savings.', 'PieChart'],
  ['credit-card-payoff-calculator', 'Credit Card Debt Payoff Calculator', 'credit-card-payoff', 'Calculate total months and interest payments to pay off credit card balances.', 'CreditCard'],
  ['net-worth-calculator', 'Personal Net Worth Calculator', 'net-worth', 'Sum total assets vs total liabilities to track personal financial net worth.', 'DollarSign'],
  ['recurring-subscription-auditor', 'Recurring Subscription Auditor', 'subscriptions', 'Audit monthly and annual expenditures on digital streaming and SaaS subscriptions.', 'Receipt']
];

financeModes.forEach(f => {
  add({
    id: f[0],
    name: f[1],
    category: 'Finance & Money',
    description: f[3],
    tags: ['finance', 'money', f[2], 'calculator'],
    icon: f[4],
    componentId: 'finance-tools',
    mode: f[2]
  });
});

add({
  id: 'loan-mortgage-calculator',
  name: 'Loan & Mortgage EMI Calculator',
  category: 'Finance & Money',
  description: 'Calculate monthly loan EMI payments, total interest paid, total payment, and detailed amortization breakdown.',
  tags: ['loan', 'mortgage', 'emi', 'finance', 'interest', 'amortization'],
  icon: 'Home',
  componentId: 'loan-calculator',
  featured: true
});

add({
  id: 'compound-interest-calculator',
  name: 'Compound Interest Calculator',
  category: 'Finance & Money',
  description: 'Forecast investment growth over time with compounding frequencies and regular monthly deposits.',
  tags: ['compound interest', 'investment', 'savings', 'growth', 'money'],
  icon: 'TrendingUp',
  componentId: 'compound-interest-tool',
  featured: true
});

add({
  id: 'tip-and-split-calculator',
  name: 'Tip & Bill Splitter Calculator',
  category: 'Finance & Money',
  description: 'Calculate tip percentage, tax, and split total bill evenly among party guests.',
  tags: ['tip', 'bill', 'split', 'restaurant', 'dining'],
  icon: 'Receipt',
  componentId: 'tip-calculator',
  featured: true
});

// ================= DATE & TIME =================
const dateModes = [
  ['unix-timestamp-converter', 'Unix Timestamp Converter', 'timestamp', 'Convert epoch seconds/milliseconds to human-readable ISO/UTC dates and dates to Unix timestamps.', true, 'Clock'],
  ['date-difference-calculator', 'Date Difference Calculator', 'date-diff', 'Calculate exact years, months, weeks, days, hours, and minutes between two calendar dates.', false, 'Calendar'],
  ['date-add-subtract', 'Add or Subtract Date Calculator', 'date-add', 'Add or subtract days, weeks, months, or years from any date to find the target date.', false, 'CalendarPlus'],
  ['age-calculator', 'Chronological Age Calculator', 'age', 'Calculate your exact age in years, months, days, total hours, minutes, and seconds lived.', true, 'UserCheck'],
  ['business-days-calculator', 'Work / Business Days Calculator', 'business-days', 'Count business days between dates excluding Saturdays and Sundays.', false, 'Briefcase'],
  ['leap-year-checker', 'Leap Year Checker', 'leap-year', 'Check whether any Gregorian calendar year is a leap year with rule explanation.', false, 'HelpCircle'],
  ['day-of-week-finder', 'Day of Week Finder', 'day-of-week', 'Find what day of the week any historical or future date falls on.', false, 'Calendar'],
  ['time-card-hours-calculator', 'Time Card & Work Hours Calculator', 'time-card', 'Compute daily total work hours, unpaid lunch breaks, and gross weekly pay.', false, 'Clock'],
  ['seconds-to-hms', 'Seconds to Hours, Minutes, Seconds', 'sec-to-hms', 'Convert large numbers of seconds into hh:mm:ss format.', false, 'Clock'],
  ['hms-to-seconds', 'HH:MM:SS to Seconds Converter', 'hms-to-sec', 'Convert hours, minutes, and seconds input into total integer seconds.', false, 'Clock'],
  ['minutes-to-hours-minutes', 'Minutes to Hours and Minutes', 'min-to-hm', 'Convert raw minutes (e.g. 175 mins) to hours and minutes (2h 55m).', false, 'Clock'],
  ['decimal-hours-to-time', 'Decimal Hours to HH:MM Converter', 'dec-to-time', 'Convert decimal hours (e.g. 7.75 hrs) into clock time (7 hours 45 minutes).', false, 'Clock'],
  ['time-to-decimal-hours', 'HH:MM to Decimal Hours Converter', 'time-to-dec', 'Convert standard hours and minutes into decimal hours for payroll.', false, 'Clock'],
  ['days-in-month-calculator', 'Days in Month Calculator', 'days-in-month', 'Check number of days in any month of any year.', false, 'Calendar'],
  ['iso-week-number-tool', 'ISO 8601 Week Number Finder', 'iso-week', 'Find the exact ISO week number (1-53) and day of the year for any date.', false, 'Calendar'],
  ['military-time-converter', '12-Hour to 24-Hour Military Time', 'military-time', 'Convert between 12-hour AM/PM and standard 24-hour military clock time.', false, 'Clock'],
  ['century-finder-tool', 'Century & Millennium Finder', 'century', 'Determine exactly which century (e.g. 21st century) and millennium any year belongs to.', false, 'Calendar'],
  ['next-birthday-countdown', 'Next Birthday Countdown Clock', 'birthday-cd', 'Calculate how many days, hours, and minutes remain until your next birthday.', false, 'CalendarHeart'],
  ['new-year-countdown', 'New Year Midnight Countdown', 'new-year-cd', 'Real-time countdown timer to the arrival of the upcoming New Year midnight.', false, 'Sparkles']
];

dateModes.forEach(d => {
  add({
    id: d[0],
    name: d[1],
    category: 'Date & Time',
    description: d[3],
    tags: ['date', 'time', d[2]],
    icon: d[5],
    componentId: 'datetime-tools',
    mode: d[2],
    featured: d[4]
  });
});

add({
  id: 'world-clock-meeting-planner',
  name: 'World Clock & Timezone Planner',
  category: 'Date & Time',
  description: 'View current live times across global timezones and schedule international meetings without friction.',
  tags: ['world clock', 'timezones', 'meeting', 'utc', 'gmt'],
  icon: 'Globe',
  componentId: 'world-clock-tool',
  featured: true
});

add({
  id: 'stopwatch-lap-timer',
  name: 'Stopwatch & Lap Timer',
  category: 'Date & Time',
  description: 'High precision millisecond stopwatch with split lap records and export.',
  tags: ['stopwatch', 'timer', 'laps', 'chronometer'],
  icon: 'Timer',
  componentId: 'stopwatch-tool'
});

add({
  id: 'countdown-timer',
  name: 'Countdown Timer with Sound',
  category: 'Date & Time',
  description: 'Customizable countdown timer with progress ring and sound alert upon completion.',
  tags: ['timer', 'countdown', 'alarm', 'chime'],
  icon: 'Hourglass',
  componentId: 'timer-tool'
});

add({
  id: 'pomodoro-timer',
  name: 'Pomodoro Productivity Timer',
  category: 'Date & Time',
  description: 'Structured 25-minute focus intervals and 5-minute restorative breaks with audio notifications.',
  tags: ['pomodoro', 'focus', 'productivity', 'study', 'work'],
  icon: 'CheckCircle2',
  componentId: 'pomodoro-tool',
  featured: true
});

// ================= COLOR & DESIGN =================
const designModes = [
  ['color-palette-generator', 'Color Palette Harmonizer', 'palette', 'Generate complementary, analogous, triadic, and monochromatic harmonic color palettes.', 'Sliders'],
  ['css-box-shadow-generator', 'CSS Box Shadow Generator', 'shadow', 'Design smooth multi-layered CSS box shadows with blur, spread, offset, and color controls.', 'Square'],
  ['css-glassmorphism-generator', 'CSS Glassmorphism Generator', 'glassmorphism', 'Design frosted glass UI cards with backdrop-blur, opacity, border, and specular reflections.', 'Layers'],
  ['css-border-radius-generator', 'Fancy 8-Point Border Radius Generator', 'border-radius', 'Create modern organic blob shapes with 8-value CSS border-radius sliders.', 'Circle'],
  ['color-shades-tints-generator', 'Color Shades & Tints Generator', 'shades-tints', 'Generate 10 lighter tints and 10 darker shades of any base hex color.', 'Grid'],
  ['hex-to-rgba-converter', 'HEX to RGBA Converter', 'hex-rgba', 'Convert HEX color with alpha opacity slider into valid CSS rgba() code.', 'Type'],
  ['aspect-ratio-calculator', 'Aspect Ratio Calculator', 'aspect-ratio', 'Calculate corresponding width or height for standard and custom aspect ratios.', 'AspectRatio'],
  ['css-clamp-calculator', 'CSS Clamp() Fluid Typography Generator', 'css-clamp', 'Calculate responsive clamp(min, val, max) values for seamless viewport font scaling.', 'Maximize2']
];

designModes.forEach(d => {
  add({
    id: d[0],
    name: d[1],
    category: 'Color & Design',
    description: d[3],
    tags: ['color', 'design', 'css', d[2]],
    icon: d[4],
    componentId: 'design-tools',
    mode: d[2]
  });
});

add({
  id: 'color-picker-converter',
  name: 'Color Picker & Converter',
  category: 'Color & Design',
  description: 'Pick colors visually and convert across HEX, RGB, HSL, HSV, and CMYK color spaces.',
  tags: ['color', 'picker', 'hex', 'rgb', 'hsl', 'cmyk', 'design'],
  icon: 'Palette',
  componentId: 'color-picker-tool',
  featured: true
});

add({
  id: 'contrast-checker',
  name: 'WCAG Color Contrast Checker',
  category: 'Color & Design',
  description: 'Test foreground and background text contrast ratios against WCAG 2.1 AA and AAA accessibility standards.',
  tags: ['contrast', 'wcag', 'accessibility', 'a11y', 'color'],
  icon: 'Eye',
  componentId: 'contrast-tool',
  featured: true
});

add({
  id: 'css-gradient-generator',
  name: 'CSS Gradient Generator',
  category: 'Color & Design',
  description: 'Interactive visual linear, radial, and conic gradient designer with copyable CSS code.',
  tags: ['gradient', 'css', 'background', 'linear', 'radial'],
  icon: 'Maximize',
  componentId: 'gradient-tool',
  featured: true
});

// ================= IMAGE & MEDIA =================
const imageModes = [
  ['image-format-converter', 'Client-Side Image Format Converter', 'convert', 'Convert image files between PNG, JPEG, and WebP completely in-browser with zero uploads.', true, 'Image'],
  ['image-resizer', 'Image Resizer & Scaler', 'resize', 'Scale image dimensions by pixel width/height or percentage with aspect ratio lock.', false, 'Scaling'],
  ['image-compressor', 'Image Compressor & Optimizer', 'compress', 'Compress photo file size with adjustable JPEG/WebP quality slider and instant preview.', false, 'FileArchive'],
  ['image-filters-effects', 'Photo Filters & Color Effects', 'filter', 'Apply grayscale, sepia, invert, vintage, brightness, and contrast effects to images.', false, 'Sliders'],
  ['image-watermark-tool', 'Image Watermark Tool', 'watermark', 'Add custom text copyright watermark with font size, opacity, and positioning controls.', false, 'Stamp'],
  ['privacy-blur-redactor', 'Privacy Blur & Redaction Tool', 'redact', 'Blur or black out sensitive personal details, faces, and phone numbers in photos.', false, 'EyeOff']
];

imageModes.forEach(i => {
  add({
    id: i[0],
    name: i[1],
    category: 'Image & Media',
    description: i[3],
    tags: ['image', 'photo', i[2]],
    icon: i[5],
    componentId: 'image-studio',
    mode: i[2],
    featured: i[4]
  });
});

add({
  id: 'meme-generator',
  name: 'Classic Meme Generator',
  category: 'Image & Media',
  description: 'Add classic Impact top and bottom text with black stroke outline to any photo or template.',
  tags: ['meme', 'generator', 'humor', 'fun', 'impact font'],
  icon: 'Smile',
  componentId: 'meme-tool',
  featured: true
});

add({
  id: 'canvas-whiteboard-doodle',
  name: 'Canvas Whiteboard & Sketchpad',
  category: 'Image & Media',
  description: 'Draw, sketch, annotate, and brainstorm on an interactive whiteboard with colors, brushes, and PNG export.',
  tags: ['draw', 'sketch', 'whiteboard', 'canvas', 'paint'],
  icon: 'PenTool',
  componentId: 'canvas-doodle',
  featured: true
});

add({
  id: 'audio-tone-generator',
  name: 'Web Audio Tone Generator',
  category: 'Image & Media',
  description: 'Generate continuous pure sine, square, sawtooth, and triangle audio soundwaves with custom Hz frequency.',
  tags: ['audio', 'tone', 'sound', 'frequency', 'sine wave', 'hertz'],
  icon: 'Volume2',
  componentId: 'audio-tools',
  mode: 'tone'
});

add({
  id: 'metronome-bpm',
  name: 'Audio Metronome BPM',
  category: 'Image & Media',
  description: 'Audible precision beat metronome with adjustable BPM tempo (40 - 240) and beats per measure.',
  tags: ['metronome', 'bpm', 'tempo', 'music', 'rhythm'],
  icon: 'Activity',
  componentId: 'audio-tools',
  mode: 'metronome'
});

add({
  id: 'white-pink-noise-generator',
  name: 'White & Pink Noise Sleep Machine',
  category: 'Image & Media',
  description: 'Play soothing white noise, pink noise, and deep brown noise for sleep, concentration, and tinnitus relief.',
  tags: ['white noise', 'pink noise', 'sleep', 'relax', 'focus', 'audio'],
  icon: 'CloudRain',
  componentId: 'audio-tools',
  mode: 'noise'
});

// ================= PRODUCTIVITY & HEALTH =================
add({
  id: 'local-scratchpad',
  name: 'Distraction-Free Scratchpad',
  category: 'Productivity',
  description: 'Quick notes and markdown scratchpad with live word count, auto-saved persistently in your browser.',
  tags: ['notes', 'scratchpad', 'memo', 'writing', 'autosave'],
  icon: 'FileEdit',
  componentId: 'scratchpad-tool',
  featured: true
});

add({
  id: 'todo-checklist',
  name: 'Interactive To-Do Checklist',
  category: 'Productivity',
  description: 'Add tasks, mark done, set priorities, and keep track of daily action items with local persistence.',
  tags: ['todo', 'checklist', 'tasks', 'planner', 'organizer'],
  icon: 'CheckSquare',
  componentId: 'todo-tool',
  featured: true
});

add({
  id: 'kanban-task-board',
  name: 'Mini Kanban Board',
  category: 'Productivity',
  description: 'Organize work into To Do, In Progress, and Completed columns with drag/move controls.',
  tags: ['kanban', 'tasks', 'board', 'agile', 'trello'],
  icon: 'Kanban',
  componentId: 'kanban-tool'
});

add({
  id: 'daily-habit-tracker',
  name: 'Daily Habit Streak Tracker',
  category: 'Productivity',
  description: 'Track daily habits, check off completions, and maintain your streak counts day over day.',
  tags: ['habits', 'streaks', 'goals', 'routine', 'self-improvement'],
  icon: 'Flame',
  componentId: 'habit-tool'
});

add({
  id: 'decision-wheel-picker',
  name: 'Decision Wheel & Random Picker',
  category: 'Productivity',
  description: 'Enter choices (what to eat, who goes first, where to travel) and spin the wheel for a fair random pick.',
  tags: ['wheel', 'random', 'picker', 'decision', 'roulette'],
  icon: 'PieChart',
  componentId: 'wheel-tool',
  featured: true
});

add({
  id: 'flashcard-study-deck',
  name: 'Flashcards Study Tool',
  category: 'Productivity',
  description: 'Create question/answer study cards, flip through the deck, and test your knowledge for exams.',
  tags: ['flashcards', 'study', 'quiz', 'learn', 'cards'],
  icon: 'BookOpen',
  componentId: 'flashcards-tool'
});

add({
  id: 'digital-signature-pad',
  name: 'Digital Signature Pad',
  category: 'Productivity',
  description: 'Draw your signature smoothly with mouse or finger and download clean transparent PNG.',
  tags: ['signature', 'sign', 'draw', 'document', 'png'],
  icon: 'PenTool',
  componentId: 'signature-pad-tool',
  featured: true
});

add({
  id: 'typing-speed-test',
  name: 'Typing Speed (WPM) Benchmark',
  category: 'Productivity',
  description: 'Test your typing speed in Words Per Minute (WPM) with live accuracy percentage and error tracking.',
  tags: ['typing', 'wpm', 'speed', 'test', 'keyboard'],
  icon: 'Keyboard',
  componentId: 'typing-test-tool',
  featured: true
});

add({
  id: 'reaction-time-tester',
  name: 'Reaction Time Reflex Tester',
  category: 'Productivity',
  description: 'Click as fast as possible when the red screen turns green to measure your reflex latency in milliseconds.',
  tags: ['reaction', 'reflex', 'speed', 'benchmark', 'test'],
  icon: 'Zap',
  componentId: 'reaction-tool'
});

const healthModes = [
  ['bmi-calculator', 'BMI (Body Mass Index) Calculator', 'bmi', 'Calculate BMI from metric or imperial height and weight with WHO health classification.', true, 'Activity'],
  ['bmr-tdee-calculator', 'BMR & Daily Calorie Needs (TDEE)', 'bmr', 'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure (TDEE) based on activity level.', false, 'Heart'],
  ['daily-water-intake-calculator', 'Daily Water Intake Target', 'water', 'Calculate recommended daily water consumption based on body weight and workout duration.', false, 'Droplet'],
  ['sleep-cycle-calculator', 'Sleep Cycle Calculator', 'sleep', 'Calculate optimal wake-up or bedtime schedules based on natural 90-minute REM sleep cycles.', false, 'Moon'],
  ['target-heart-rate-calculator', 'Target Heart Rate Training Zones', 'heart-rate', 'Calculate warm-up, fat burn, aerobic, and peak heart rate training BPM zones from your age.', false, 'HeartPulse'],
  ['calorie-deficit-calculator', 'Calorie Deficit Weight Loss Planner', 'calorie-deficit', 'Calculate target daily calorie intake deficit for healthy weight milestones.', false, 'Flame']
];

healthModes.forEach(h => {
  add({
    id: h[0],
    name: h[1],
    category: 'Productivity',
    description: h[3],
    tags: ['health', 'fitness', h[2]],
    icon: h[5],
    componentId: 'health-tools',
    mode: h[2],
    featured: h[4]
  });
});

const netModes = [
  ['ip-cidr-subnet-calculator', 'IPv4 Subnet & CIDR Calculator', 'cidr', 'Calculate network IP, broadcast address, subnet mask, usable host range, and total hosts for any CIDR.', true, 'Network'],
  ['browser-system-diagnostics', 'Browser & Device Diagnostics', 'system', 'Inspect live device memory, logical CPU cores, screen resolution, GPU renderer, and browser capabilities.', false, 'Cpu'],
  ['ping-latency-tester', 'Browser Ping & Latency Tester', 'latency', 'Benchmark real HTTP round-trip latency to edge global CDNs directly from your browser.', false, 'Wifi']
];

netModes.forEach(n => {
  add({
    id: n[0],
    name: n[1],
    category: 'Productivity',
    description: n[3],
    tags: ['network', 'system', n[2]],
    icon: n[5],
    componentId: 'network-tools',
    mode: n[2],
    featured: n[4]
  });
});

// ================= CHEATSHEETS & REFERENCES =================
const cheatsheets = [
  ['cheatsheet-git', 'Git Commands Cheatsheet', 'git', 'Quick reference for git checkout, branch, rebase, stash, cherry-pick, reset, and tags with copyable syntax.', true, 'GitBranch'],
  ['cheatsheet-http-status', 'HTTP Status Codes Reference', 'http-status', 'Complete guide to all standard 1xx, 2xx, 3xx, 4xx, and 5xx HTTP response codes with explanations.', true, 'Globe'],
  ['cheatsheet-regex', 'RegEx Cheatsheet & Tokens', 'regex', 'Essential reference for regular expression syntax: character classes, lookarounds, quantifiers, and groups.', true, 'Search'],
  ['cheatsheet-markdown', 'Markdown Syntax Cheatsheet', 'markdown', 'Full reference of Markdown syntax: headings, tables, links, blockquotes, task lists, and code blocks.', false, 'FileText'],
  ['cheatsheet-linux-bash', 'Linux / Bash Terminal Cheatsheet', 'linux', 'Crucial Linux shell commands for navigation, file management, permissions, grep, and process inspection.', true, 'Terminal'],
  ['cheatsheet-sql', 'SQL Syntax & Queries Cheatsheet', 'sql', 'Syntax and examples for SELECT, JOIN, GROUP BY, HAVING, subqueries, and window functions.', false, 'Database'],
  ['cheatsheet-html5-tags', 'HTML5 Semantic Tags Reference', 'html5', 'Complete dictionary of semantic HTML5 tags: article, section, nav, dialog, figure, and form elements.', false, 'FileCode2'],
  ['cheatsheet-css-selectors', 'CSS Selectors & Combinators Guide', 'css-selectors', 'Quick reference for pseudo-classes (:nth-child, :is, :has, :not), attributes, and combinators.', false, 'Palette'],
  ['cheatsheet-docker', 'Docker CLI Cheatsheet', 'docker', 'Commands reference for docker run, exec, build, compose, volumes, networks, and cleanup.', false, 'Box'],
  ['cheatsheet-common-ports', 'Common Network Ports Guide', 'ports', 'Lookup common TCP/UDP ports: HTTP 80, HTTPS 443, SSH 22, DNS 53, MySQL 3306, Postgres 5432, Redis 6379.', false, 'Server'],
  ['cheatsheet-ascii-table', 'ASCII Table & Control Codes', 'ascii', 'Complete 7-bit ASCII table from 0 to 127 with binary, hex, decimal, and character symbols.', false, 'Binary'],
  ['cheatsheet-periodic-table', 'Periodic Table of Elements', 'periodic-table', 'Explore chemical elements with atomic number, atomic mass, symbol, electron configuration, and group category.', true, 'Sparkles'],
  ['cheatsheet-mime-types', 'MIME Types Dictionary', 'mime', 'Directory of common Content-Type MIME strings for web formats, audio, video, images, and fonts.', false, 'File'],
  ['cheatsheet-iso-country-codes', 'ISO Country Codes Reference', 'country-codes', 'Lookup ISO 3166-1 alpha-2, alpha-3 country codes, dialing codes, and capital cities.', false, 'Flag'],
  ['cheatsheet-iso-currency-codes', 'ISO Currency Codes (4217)', 'currency-codes', 'Reference for world currency 3-letter codes, symbols ($, €, £, ¥, ₹), and official country names.', false, 'DollarSign'],
  ['cheatsheet-vim', 'Vim Keybindings Cheatsheet', 'vim', 'Vim modal editor shortcuts for navigation, insertion, visual mode, search, buffers, and window splits.', false, 'Terminal'],
  ['cheatsheet-tmux', 'Tmux Multiplexer Cheatsheet', 'tmux', 'Tmux session, window, and pane management keybindings.', false, 'Layers'],
  ['cheatsheet-dns-records', 'DNS Record Types Guide', 'dns', 'Reference guide to A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, SOA, and CAA records.', false, 'Globe'],
  ['cheatsheet-javascript', 'JavaScript Methods Cheatsheet', 'javascript', 'Interactive guide to Array (map, filter, reduce), Object, and Promise methods.', false, 'Code2'],
  ['cheatsheet-python', 'Python Idioms & Cheat Sheet', 'python', 'Essential Python syntax: list comprehensions, dict slicing, lambdas, and decorators.', false, 'FileCode'],
  ['cheatsheet-http-headers', 'HTTP Headers Reference', 'http-headers', 'Common standard HTTP request and response headers with directives.', false, 'Server'],
  ['cheatsheet-physics-constants', 'Fundamental Physics Constants', 'physics-constants', 'Reference for speed of light, Planck constant, gravitational constant, elementary charge, and Boltzmann constant.', false, 'Sparkles'],
  ['cheatsheet-math-formulas', 'Mathematical Formulas Reference', 'math-formulas', 'Key formulas for algebra, quadratic roots, trigonometry identities, and geometry.', false, 'Calculator']
];

cheatsheets.forEach(c => {
  add({
    id: c[0],
    name: c[1],
    category: 'Cheatsheets',
    description: c[3],
    tags: ['cheatsheet', 'reference', c[2]],
    icon: c[5],
    componentId: 'cheatsheet-view',
    mode: c[2],
    featured: c[4]
  });
});

add({"id":"text-center-align","name":"Center Align Text","category":"Text & Content","description":"Center-align each line of text within a fixed character column width.","tags":["text","align","center","format"],"icon":"AlignCenter","componentId":"text-tools","mode":"center-align"});
add({"id":"text-right-align","name":"Right Align Text","category":"Text & Content","description":"Right-align each line of text to a fixed column width.","tags":["text","align","right","format"],"icon":"AlignRight","componentId":"text-tools","mode":"right-align"});
add({"id":"remove-leading-spaces","name":"Remove Leading Spaces","category":"Text & Content","description":"Strip only leading indentations and whitespace from beginning of lines.","tags":["text","clean","indent"],"icon":"Minimize2","componentId":"text-tools","mode":"leading-spaces"});
add({"id":"remove-trailing-spaces","name":"Remove Trailing Spaces","category":"Text & Content","description":"Strip only trailing whitespace from end of lines.","tags":["text","clean","trailing"],"icon":"Minimize2","componentId":"text-tools","mode":"trailing-spaces"});
add({"id":"meters-to-miles","name":"Meters to Statute Miles","category":"Unit Converters","description":"Convert metric meters to statute miles (1 m ≈ 0.000621371 mi).","tags":["converter","length","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"meters-to-miles"});
add({"id":"miles-to-meters","name":"Statute Miles to Meters","category":"Unit Converters","description":"Convert statute miles into metric meters (1 mi = 1609.344 m).","tags":["converter","length","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"miles-to-meters"});
add({"id":"stone-to-lbs","name":"Stones to Pounds Converter","category":"Unit Converters","description":"Convert imperial stones to pounds (1 stone = 14 lbs).","tags":["converter","weight","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"stone-to-lbs"});
add({"id":"lbs-to-stone","name":"Pounds to Stones Converter","category":"Unit Converters","description":"Convert pounds to British stones and pounds.","tags":["converter","weight","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"lbs-to-stone"});
add({"id":"atm-to-bar","name":"Atmospheres to Bar Converter","category":"Unit Converters","description":"Convert standard atmospheres to Bar (1 atm = 1.01325 bar).","tags":["converter","pressure","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"atm-to-bar"});
add({"id":"bar-to-atm","name":"Bar to Atmospheres Converter","category":"Unit Converters","description":"Convert Bar to standard physical atmospheres.","tags":["converter","pressure","quick-convert","units"],"icon":"ArrowRightLeft","componentId":"quick-unit-tool","mode":"bar-to-atm"});
add({"id":"cost-of-delay-calculator","name":"Cost of Delay Investment Calculator","category":"Finance & Money","description":"Estimate how much compound wealth is lost by delaying retirement investments by 1, 3, or 5 years.","tags":["finance","investment","retirement","delay"],"icon":"Clock","componentId":"finance-tools","mode":"cost-of-delay"});
add({"id":"present-value-annuity","name":"Present Value of Annuity Calculator","category":"Finance & Money","description":"Calculate present discounted cash lump sum value of future periodic payments.","tags":["finance","annuity","present value","investing"],"icon":"DollarSign","componentId":"finance-tools","mode":"pv-annuity"});
add({"id":"future-value-annuity","name":"Future Value of Annuity Calculator","category":"Finance & Money","description":"Calculate future accumulated value of regular periodic savings payments.","tags":["finance","annuity","future value","investing"],"icon":"TrendingUp","componentId":"finance-tools","mode":"fv-annuity"});
add({"id":"markup-to-margin-converter","name":"Markup to Margin Converter","category":"Finance & Money","description":"Convert markup % to gross profit margin % and vice versa with live formula.","tags":["finance","margin","markup","business"],"icon":"Percent","componentId":"finance-tools","mode":"markup-margin"});
add({"id":"time-until-weekend","name":"Weekend Countdown Clock","category":"Date & Time","description":"Live countdown timer until Friday 5:00 PM for celebrating the weekend.","tags":["weekend","countdown","time","friday"],"icon":"PartyPopper","componentId":"datetime-tools","mode":"weekend-cd"});
add({"id":"cheatsheet-keyboard-keys","name":"Keyboard Event Keys Reference","category":"Cheatsheets","description":"Interactive reference of DOM KeyboardEvent key strings, codes, and legacy which values.","tags":["keyboard","event","keys","keycode","dom"],"icon":"Keyboard","componentId":"cheatsheet-view","mode":"keyboard-keys"});
console.log('Total tools built:', tools.length);

// Ensure all IDs are unique
const seen = new Set();
for (const t of tools) {
  if (seen.has(t.id)) {
    console.error('Duplicate ID detected:', t.id);
  }
  seen.add(t.id);
}

const fileContent = `import { ToolItem } from '../types';

export const TOOLS_DATA: ToolItem[] = ${JSON.stringify(tools, null, 2)};

export const CATEGORIES = [
  'All',
  'Text & Content',
  'Code & Web Dev',
  'Crypto & Security',
  'Unit Converters',
  'Math & Science',
  'Finance & Money',
  'Date & Time',
  'Color & Design',
  'Image & Media',
  'Productivity',
  'Cheatsheets'
] as const;
`;

fs.writeFileSync('src/data/toolsData.ts', fileContent, 'utf8');
console.log('Successfully wrote src/data/toolsData.ts');
