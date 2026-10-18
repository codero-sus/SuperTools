import { ToolItem } from '../types';

export const TOOLS_DATA: ToolItem[] = [
  {
    "id": "word-counter",
    "name": "Word & Character Counter",
    "category": "Text & Content",
    "description": "Count words, characters, characters without spaces, sentences, paragraphs, and estimate reading and speaking time.",
    "tags": [
      "text",
      "words",
      "characters",
      "count",
      "reading time",
      "length",
      "counter"
    ],
    "icon": "FileText",
    "componentId": "text-tools",
    "mode": "word-counter",
    "featured": true
  },
  {
    "id": "uppercase-converter",
    "name": "Uppercase Converter",
    "category": "Text & Content",
    "description": "Convert any text into ALL UPPERCASE letters instantly.",
    "tags": [
      "text",
      "case",
      "upper",
      "capital",
      "uppercase"
    ],
    "icon": "Type",
    "componentId": "text-tools",
    "mode": "case-upper"
  },
  {
    "id": "lowercase-converter",
    "name": "Lowercase Converter",
    "category": "Text & Content",
    "description": "Convert any text into all lowercase letters instantly.",
    "tags": [
      "text",
      "case",
      "lower",
      "small",
      "lowercase"
    ],
    "icon": "Type",
    "componentId": "text-tools",
    "mode": "case-lower"
  },
  {
    "id": "title-case-converter",
    "name": "Title Case Converter",
    "category": "Text & Content",
    "description": "Capitalize the first letter of each major word in titles and headings.",
    "tags": [
      "text",
      "case",
      "title",
      "capitalize",
      "headline"
    ],
    "icon": "Type",
    "componentId": "text-tools",
    "mode": "case-title"
  },
  {
    "id": "sentence-case-converter",
    "name": "Sentence Case Converter",
    "category": "Text & Content",
    "description": "Capitalize only the first letter of each sentence.",
    "tags": [
      "text",
      "case",
      "sentence",
      "grammar"
    ],
    "icon": "Type",
    "componentId": "text-tools",
    "mode": "case-sentence"
  },
  {
    "id": "camel-case-converter",
    "name": "camelCase Converter",
    "category": "Text & Content",
    "description": "Convert phrases and strings to camelCase format for programming.",
    "tags": [
      "text",
      "case",
      "camel",
      "developer",
      "variable"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-camel"
  },
  {
    "id": "snake-case-converter",
    "name": "snake_case Converter",
    "category": "Text & Content",
    "description": "Convert text to lowercase words separated by underscores.",
    "tags": [
      "text",
      "case",
      "snake",
      "python",
      "variable"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-snake"
  },
  {
    "id": "kebab-case-converter",
    "name": "kebab-case Converter",
    "category": "Text & Content",
    "description": "Convert text to lowercase words separated by hyphens (lisp-case / css-case).",
    "tags": [
      "text",
      "case",
      "kebab",
      "slug",
      "hyphen",
      "css"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-kebab"
  },
  {
    "id": "pascal-case-converter",
    "name": "PascalCase Converter",
    "category": "Text & Content",
    "description": "Capitalize every word without spaces, ideal for class names in OOP.",
    "tags": [
      "text",
      "case",
      "pascal",
      "class",
      "oop"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-pascal"
  },
  {
    "id": "constant-case-converter",
    "name": "CONSTANT_CASE Converter",
    "category": "Text & Content",
    "description": "Convert text to uppercase words joined with underscores for programming constants.",
    "tags": [
      "text",
      "case",
      "constant",
      "screaming snake",
      "env"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-constant"
  },
  {
    "id": "dot-case-converter",
    "name": "dot.case Converter",
    "category": "Text & Content",
    "description": "Convert words joined by dots (e.g. config.settings.debug).",
    "tags": [
      "text",
      "case",
      "dot",
      "property"
    ],
    "icon": "Code2",
    "componentId": "text-tools",
    "mode": "case-dot"
  },
  {
    "id": "path-case-converter",
    "name": "path/case Converter",
    "category": "Text & Content",
    "description": "Convert text to file path style separated by forward slashes.",
    "tags": [
      "text",
      "case",
      "path",
      "filesystem",
      "route"
    ],
    "icon": "Folder",
    "componentId": "text-tools",
    "mode": "case-path"
  },
  {
    "id": "swap-case-converter",
    "name": "Invert / Swap Case Converter",
    "category": "Text & Content",
    "description": "Invert the case of every character: uppercase becomes lowercase and vice versa.",
    "tags": [
      "text",
      "case",
      "swap",
      "invert",
      "toggle"
    ],
    "icon": "ArrowLeftRight",
    "componentId": "text-tools",
    "mode": "case-swap"
  },
  {
    "id": "text-slugifier",
    "name": "URL Slugifier",
    "category": "Text & Content",
    "description": "Transform blog post titles and strings into clean, SEO-friendly URL slugs.",
    "tags": [
      "text",
      "slug",
      "seo",
      "url",
      "permalink"
    ],
    "icon": "Link",
    "componentId": "text-tools",
    "mode": "slugify"
  },
  {
    "id": "text-diff",
    "name": "Text Diff Checker",
    "category": "Text & Content",
    "description": "Compare two texts side-by-side or inline to highlight additions, deletions, and modifications.",
    "tags": [
      "diff",
      "compare",
      "text",
      "difference",
      "code"
    ],
    "icon": "GitCompare",
    "componentId": "text-diff",
    "featured": true
  },
  {
    "id": "text-reverser",
    "name": "Character Reverser",
    "category": "Text & Content",
    "description": "Reverse the order of every character in your text.",
    "tags": [
      "text",
      "reverse",
      "backward",
      "mirror"
    ],
    "icon": "ArrowLeftRight",
    "componentId": "text-tools",
    "mode": "reverse-chars"
  },
  {
    "id": "word-reverser",
    "name": "Word Reverser",
    "category": "Text & Content",
    "description": "Reverse the order of words while preserving word spelling.",
    "tags": [
      "text",
      "reverse",
      "words",
      "order"
    ],
    "icon": "ArrowLeftRight",
    "componentId": "text-tools",
    "mode": "reverse-words"
  },
  {
    "id": "line-reverser",
    "name": "Line Reverser",
    "category": "Text & Content",
    "description": "Reverse the order of lines from bottom to top.",
    "tags": [
      "text",
      "lines",
      "reverse",
      "order"
    ],
    "icon": "ArrowDownUp",
    "componentId": "text-tools",
    "mode": "reverse-lines"
  },
  {
    "id": "palindrome-checker",
    "name": "Palindrome Checker",
    "category": "Text & Content",
    "description": "Check whether a word, sentence, or number reads identically backward and forward.",
    "tags": [
      "palindrome",
      "check",
      "reverse",
      "linguistics"
    ],
    "icon": "CheckCircle2",
    "componentId": "text-tools",
    "mode": "palindrome"
  },
  {
    "id": "sort-lines-az",
    "name": "Sort Lines A-Z",
    "category": "Text & Content",
    "description": "Sort lines of text in alphabetical ascending order.",
    "tags": [
      "sort",
      "alphabetical",
      "lines",
      "order",
      "list"
    ],
    "icon": "ArrowDownAZ",
    "componentId": "text-tools",
    "mode": "sort-az"
  },
  {
    "id": "sort-lines-za",
    "name": "Sort Lines Z-A",
    "category": "Text & Content",
    "description": "Sort lines of text in alphabetical descending order.",
    "tags": [
      "sort",
      "alphabetical",
      "descending",
      "lines"
    ],
    "icon": "ArrowUpAZ",
    "componentId": "text-tools",
    "mode": "sort-za"
  },
  {
    "id": "sort-lines-length",
    "name": "Sort Lines by Length",
    "category": "Text & Content",
    "description": "Sort lines from shortest to longest or longest to shortest.",
    "tags": [
      "sort",
      "length",
      "lines",
      "size"
    ],
    "icon": "SlidersHorizontal",
    "componentId": "text-tools",
    "mode": "sort-length"
  },
  {
    "id": "deduplicate-lines",
    "name": "Remove Duplicate Lines",
    "category": "Text & Content",
    "description": "Remove duplicate lines from a list, leaving only distinct lines.",
    "tags": [
      "deduplicate",
      "unique",
      "lines",
      "clean",
      "filter"
    ],
    "icon": "Filter",
    "componentId": "text-tools",
    "mode": "dedup"
  },
  {
    "id": "remove-empty-lines",
    "name": "Remove Empty Lines",
    "category": "Text & Content",
    "description": "Clean up text by removing blank and whitespace-only lines.",
    "tags": [
      "clean",
      "blank",
      "empty lines",
      "strip"
    ],
    "icon": "Scissors",
    "componentId": "text-tools",
    "mode": "remove-empty"
  },
  {
    "id": "trim-whitespace",
    "name": "Trim Whitespace",
    "category": "Text & Content",
    "description": "Strip leading and trailing spaces and tabs from every line.",
    "tags": [
      "trim",
      "whitespace",
      "spaces",
      "clean"
    ],
    "icon": "Minimize2",
    "componentId": "text-tools",
    "mode": "trim"
  },
  {
    "id": "remove-extra-spaces",
    "name": "Remove Extra Spaces",
    "category": "Text & Content",
    "description": "Collapse consecutive multiple spaces into a single space.",
    "tags": [
      "spaces",
      "clean",
      "single space",
      "collapse"
    ],
    "icon": "Minus",
    "componentId": "text-tools",
    "mode": "collapse-spaces"
  },
  {
    "id": "add-line-numbers",
    "name": "Add Line Numbers",
    "category": "Text & Content",
    "description": "Prefix each line with sequential line numbers and custom separator.",
    "tags": [
      "numbers",
      "prefix",
      "lines",
      "code"
    ],
    "icon": "ListOrdered",
    "componentId": "text-tools",
    "mode": "line-numbers"
  },
  {
    "id": "prefix-suffix-lines",
    "name": "Prefix & Suffix Lines",
    "category": "Text & Content",
    "description": "Prepend text to the beginning and append text to the end of every line.",
    "tags": [
      "prefix",
      "suffix",
      "append",
      "prepend",
      "lines"
    ],
    "icon": "WrapText",
    "componentId": "text-tools",
    "mode": "prefix-suffix"
  },
  {
    "id": "lorem-ipsum-generator",
    "name": "Lorem Ipsum Generator",
    "category": "Text & Content",
    "description": "Generate customizable dummy placeholder text by paragraphs, sentences, or words.",
    "tags": [
      "lorem",
      "ipsum",
      "placeholder",
      "dummy text",
      "generator"
    ],
    "icon": "FileText",
    "componentId": "lorem-generator",
    "featured": true
  },
  {
    "id": "text-repeater",
    "name": "Text Repeater",
    "category": "Text & Content",
    "description": "Repeat a phrase or text block N times with custom delimiter or line breaks.",
    "tags": [
      "repeat",
      "multiplier",
      "duplicate",
      "pattern"
    ],
    "icon": "Repeat",
    "componentId": "text-tools",
    "mode": "repeat"
  },
  {
    "id": "character-frequency",
    "name": "Character Frequency Analyzer",
    "category": "Text & Content",
    "description": "Count occurrences of every letter, digit, and symbol with percentage distributions.",
    "tags": [
      "frequency",
      "analysis",
      "letters",
      "symbols",
      "stats"
    ],
    "icon": "BarChart2",
    "componentId": "text-tools",
    "mode": "char-frequency"
  },
  {
    "id": "word-frequency",
    "name": "Word Frequency Analyzer",
    "category": "Text & Content",
    "description": "Analyze word count frequencies, density, and find most repeated keywords.",
    "tags": [
      "frequency",
      "density",
      "keywords",
      "seo",
      "words"
    ],
    "icon": "BarChart3",
    "componentId": "text-tools",
    "mode": "word-frequency"
  },
  {
    "id": "extract-emails",
    "name": "Extract Emails",
    "category": "Text & Content",
    "description": "Extract all valid email addresses found inside raw unstructured text.",
    "tags": [
      "extract",
      "email",
      "scrape",
      "regex",
      "filter"
    ],
    "icon": "Mail",
    "componentId": "text-tools",
    "mode": "extract-emails"
  },
  {
    "id": "extract-urls",
    "name": "Extract URLs",
    "category": "Text & Content",
    "description": "Extract all web links, URLs, and domains from messy text.",
    "tags": [
      "extract",
      "urls",
      "links",
      "http",
      "domains"
    ],
    "icon": "ExternalLink",
    "componentId": "text-tools",
    "mode": "extract-urls"
  },
  {
    "id": "extract-phone-numbers",
    "name": "Extract Phone Numbers",
    "category": "Text & Content",
    "description": "Extract international and domestic phone numbers from text.",
    "tags": [
      "extract",
      "phones",
      "contact",
      "numbers"
    ],
    "icon": "Phone",
    "componentId": "text-tools",
    "mode": "extract-phones"
  },
  {
    "id": "extract-numbers",
    "name": "Extract Numbers",
    "category": "Text & Content",
    "description": "Extract all integer and floating point numbers from text.",
    "tags": [
      "extract",
      "numbers",
      "digits",
      "values"
    ],
    "icon": "Hash",
    "componentId": "text-tools",
    "mode": "extract-numbers"
  },
  {
    "id": "extract-hashtags",
    "name": "Extract Hashtags",
    "category": "Text & Content",
    "description": "Extract all #hashtags from social media copy or blog drafts.",
    "tags": [
      "extract",
      "hashtags",
      "social",
      "tags"
    ],
    "icon": "Hash",
    "componentId": "text-tools",
    "mode": "extract-hashtags"
  },
  {
    "id": "extract-mentions",
    "name": "Extract User Mentions",
    "category": "Text & Content",
    "description": "Extract all @mentions from Twitter, Instagram, or chat logs.",
    "tags": [
      "extract",
      "mentions",
      "handles",
      "username"
    ],
    "icon": "AtSign",
    "componentId": "text-tools",
    "mode": "extract-mentions"
  },
  {
    "id": "extract-ipv4",
    "name": "Extract IPv4 Addresses",
    "category": "Text & Content",
    "description": "Extract all valid IPv4 network addresses from raw logs or configuration text.",
    "tags": [
      "extract",
      "ip",
      "ipv4",
      "network",
      "logs"
    ],
    "icon": "Network",
    "componentId": "text-tools",
    "mode": "extract-ipv4"
  },
  {
    "id": "remove-punctuation",
    "name": "Remove Punctuation",
    "category": "Text & Content",
    "description": "Strip all commas, periods, quotes, exclamation marks, and symbols from text.",
    "tags": [
      "clean",
      "punctuation",
      "strip",
      "nlp"
    ],
    "icon": "Scissors",
    "componentId": "text-tools",
    "mode": "remove-punct"
  },
  {
    "id": "remove-numbers",
    "name": "Remove Numbers & Digits",
    "category": "Text & Content",
    "description": "Strip all numerical digits (0-9) from text leaving only alphabetic characters.",
    "tags": [
      "clean",
      "numbers",
      "digits",
      "strip"
    ],
    "icon": "Scissors",
    "componentId": "text-tools",
    "mode": "remove-numbers"
  },
  {
    "id": "remove-accents",
    "name": "Remove Accents & Diacritics",
    "category": "Text & Content",
    "description": "Normalize accented characters to plain Latin equivalents (e.g. café -> cafe).",
    "tags": [
      "normalize",
      "accents",
      "diacritics",
      "clean"
    ],
    "icon": "Check",
    "componentId": "text-tools",
    "mode": "remove-accents"
  },
  {
    "id": "add-quotes-to-lines",
    "name": "Add Quotes to Lines",
    "category": "Text & Content",
    "description": "Enclose each line in double quotes or single quotes for SQL or JSON arrays.",
    "tags": [
      "quotes",
      "lines",
      "sql",
      "json"
    ],
    "icon": "FileCode",
    "componentId": "text-tools",
    "mode": "quote-lines"
  },
  {
    "id": "count-vowels-consonants",
    "name": "Vowel & Consonant Counter",
    "category": "Text & Content",
    "description": "Count vowels, consonants, spaces, and punctuation marks in your text.",
    "tags": [
      "vowels",
      "consonants",
      "count",
      "phonetics"
    ],
    "icon": "BarChart2",
    "componentId": "text-tools",
    "mode": "vowels-consonants"
  },
  {
    "id": "add-commas-to-lines",
    "name": "Add Trailing Commas to Lines",
    "category": "Text & Content",
    "description": "Append a comma to the end of every line in your list.",
    "tags": [
      "commas",
      "lines",
      "sql",
      "format"
    ],
    "icon": "List",
    "componentId": "text-tools",
    "mode": "add-commas"
  },
  {
    "id": "find-and-replace",
    "name": "Find & Replace",
    "category": "Text & Content",
    "description": "Find and replace occurrences of strings or regex patterns across text.",
    "tags": [
      "find",
      "replace",
      "regex",
      "substitute",
      "edit"
    ],
    "icon": "Search",
    "componentId": "text-tools",
    "mode": "find-replace"
  },
  {
    "id": "rot13-cipher",
    "name": "ROT13 Cipher",
    "category": "Text & Content",
    "description": "Rotate Latin letters by 13 positions to obscure spoilers or clues.",
    "tags": [
      "rot13",
      "cipher",
      "cryptography",
      "obfuscate"
    ],
    "icon": "Key",
    "componentId": "text-tools",
    "mode": "rot13"
  },
  {
    "id": "rot47-cipher",
    "name": "ROT47 Cipher",
    "category": "Text & Content",
    "description": "Rotate standard ASCII characters (33 to 126) by 47 positions.",
    "tags": [
      "rot47",
      "cipher",
      "ascii",
      "obfuscate"
    ],
    "icon": "Key",
    "componentId": "text-tools",
    "mode": "rot47"
  },
  {
    "id": "caesar-cipher",
    "name": "Caesar Cipher",
    "category": "Text & Content",
    "description": "Shift alphabet characters forward or backward by custom key shift amount.",
    "tags": [
      "caesar",
      "cipher",
      "shift",
      "cryptography",
      "secret"
    ],
    "icon": "Lock",
    "componentId": "text-tools",
    "mode": "caesar"
  },
  {
    "id": "atbash-cipher",
    "name": "Atbash Cipher",
    "category": "Text & Content",
    "description": "Substitution cipher reversing the alphabet (A becomes Z, B becomes Y).",
    "tags": [
      "atbash",
      "cipher",
      "substitution",
      "hebrew"
    ],
    "icon": "Shuffle",
    "componentId": "text-tools",
    "mode": "atbash"
  },
  {
    "id": "morse-code-encoder",
    "name": "Morse Code Encoder",
    "category": "Text & Content",
    "description": "Translate Latin alphabet and numbers into International Morse Code dots and dashes.",
    "tags": [
      "morse",
      "dots",
      "dashes",
      "telegraph",
      "code"
    ],
    "icon": "Radio",
    "componentId": "text-tools",
    "mode": "morse-encode"
  },
  {
    "id": "morse-code-decoder",
    "name": "Morse Code Decoder",
    "category": "Text & Content",
    "description": "Translate Morse code dots and dashes back into human-readable text.",
    "tags": [
      "morse",
      "decode",
      "dots",
      "dashes",
      "translate"
    ],
    "icon": "Radio",
    "componentId": "text-tools",
    "mode": "morse-decode"
  },
  {
    "id": "binary-to-text",
    "name": "Binary to Text Converter",
    "category": "Text & Content",
    "description": "Convert binary bytes (01001000...) into ASCII / UTF-8 text.",
    "tags": [
      "binary",
      "text",
      "ascii",
      "0101",
      "decode"
    ],
    "icon": "Binary",
    "componentId": "text-tools",
    "mode": "bin-to-text"
  },
  {
    "id": "text-to-binary",
    "name": "Text to Binary Converter",
    "category": "Text & Content",
    "description": "Convert plain text into 8-bit binary representation.",
    "tags": [
      "text",
      "binary",
      "ascii",
      "bytes",
      "encode"
    ],
    "icon": "Binary",
    "componentId": "text-tools",
    "mode": "text-to-bin"
  },
  {
    "id": "hex-to-text",
    "name": "Hex to Text Converter",
    "category": "Text & Content",
    "description": "Convert hexadecimal string pairs into readable plain text.",
    "tags": [
      "hex",
      "text",
      "ascii",
      "decode"
    ],
    "icon": "FileCode",
    "componentId": "text-tools",
    "mode": "hex-to-text"
  },
  {
    "id": "text-to-hex",
    "name": "Text to Hex Converter",
    "category": "Text & Content",
    "description": "Convert plain text into space-separated or continuous hexadecimal bytes.",
    "tags": [
      "text",
      "hex",
      "bytes",
      "encode"
    ],
    "icon": "FileCode",
    "componentId": "text-tools",
    "mode": "text-to-hex"
  },
  {
    "id": "nato-phonetic-alphabet",
    "name": "NATO Phonetic Alphabet",
    "category": "Text & Content",
    "description": "Spell out words using NATO phonetic radio alphabet (Alpha, Bravo, Charlie...).",
    "tags": [
      "nato",
      "phonetic",
      "aviation",
      "radio",
      "spell"
    ],
    "icon": "Mic",
    "componentId": "text-tools",
    "mode": "nato"
  },
  {
    "id": "zalgo-text-generator",
    "name": "Zalgo Glitch Text Generator",
    "category": "Text & Content",
    "description": "Add creepy glitch combining diacritics to text for scary aesthetic.",
    "tags": [
      "zalgo",
      "glitch",
      "cursed",
      "diacritics",
      "chaos"
    ],
    "icon": "Zap",
    "componentId": "text-tools",
    "mode": "zalgo"
  },
  {
    "id": "upside-down-text",
    "name": "Upside Down Text Generator",
    "category": "Text & Content",
    "description": "Flip your text upside down using special Unicode inverted glyphs.",
    "tags": [
      "upside down",
      "flip",
      "unicode",
      "fun"
    ],
    "icon": "RotateCw",
    "componentId": "text-tools",
    "mode": "upside-down"
  },
  {
    "id": "leetspeak-generator",
    "name": "Leetspeak (1337) Generator",
    "category": "Text & Content",
    "description": "Translate standard English words into hacker leetspeak slang.",
    "tags": [
      "leet",
      "1337",
      "hacker",
      "slang",
      "generator"
    ],
    "icon": "Terminal",
    "componentId": "text-tools",
    "mode": "leetspeak"
  },
  {
    "id": "braille-converter",
    "name": "Braille Text Converter",
    "category": "Text & Content",
    "description": "Translate Latin alphabet and numbers into Grade 1 Braille symbols.",
    "tags": [
      "braille",
      "blind",
      "accessibility",
      "symbols"
    ],
    "icon": "Grid",
    "componentId": "text-tools",
    "mode": "braille"
  },
  {
    "id": "markdown-to-html",
    "name": "Markdown to HTML Converter",
    "category": "Text & Content",
    "description": "Convert Markdown formatted text into raw HTML markup.",
    "tags": [
      "markdown",
      "html",
      "convert",
      "markup"
    ],
    "icon": "FileCode2",
    "componentId": "text-tools",
    "mode": "md-to-html"
  },
  {
    "id": "html-to-markdown",
    "name": "HTML to Markdown Converter",
    "category": "Text & Content",
    "description": "Convert HTML code back into clean, readable Markdown syntax.",
    "tags": [
      "html",
      "markdown",
      "convert",
      "clean"
    ],
    "icon": "FileCode2",
    "componentId": "text-tools",
    "mode": "html-to-md"
  },
  {
    "id": "html-entities-encode",
    "name": "HTML Entities Encoder",
    "category": "Text & Content",
    "description": "Escape sensitive characters like &, <, >, \" and single quotes into HTML entities.",
    "tags": [
      "html",
      "entities",
      "escape",
      "encode",
      "xss"
    ],
    "icon": "Code",
    "componentId": "text-tools",
    "mode": "html-encode"
  },
  {
    "id": "html-entities-decode",
    "name": "HTML Entities Decoder",
    "category": "Text & Content",
    "description": "Decode HTML entities back to their original characters.",
    "tags": [
      "html",
      "entities",
      "unescape",
      "decode"
    ],
    "icon": "Code",
    "componentId": "text-tools",
    "mode": "html-decode"
  },
  {
    "id": "word-wrap-tool",
    "name": "Word Wrap Tool",
    "category": "Text & Content",
    "description": "Hard-wrap lines at specified column character width.",
    "tags": [
      "wrap",
      "columns",
      "format",
      "lines"
    ],
    "icon": "AlignLeft",
    "componentId": "text-tools",
    "mode": "word-wrap"
  },
  {
    "id": "strip-html-tags",
    "name": "Strip HTML Tags",
    "category": "Text & Content",
    "description": "Remove all HTML tags, scripts, and styling to extract pure plain text.",
    "tags": [
      "html",
      "strip",
      "clean",
      "plain text"
    ],
    "icon": "FileText",
    "componentId": "text-tools",
    "mode": "strip-html"
  },
  {
    "id": "lines-to-csv-list",
    "name": "Lines to Comma-Separated List",
    "category": "Text & Content",
    "description": "Convert lines of text into a single comma-separated line (or custom delimiter).",
    "tags": [
      "lines",
      "csv",
      "join",
      "comma"
    ],
    "icon": "List",
    "componentId": "text-tools",
    "mode": "lines-to-csv"
  },
  {
    "id": "csv-to-lines-list",
    "name": "Comma-Separated to Lines List",
    "category": "Text & Content",
    "description": "Split a comma-separated or delimited string into separate lines.",
    "tags": [
      "csv",
      "split",
      "lines",
      "delimited"
    ],
    "icon": "ListOrdered",
    "componentId": "text-tools",
    "mode": "csv-to-lines"
  },
  {
    "id": "shuffle-lines",
    "name": "Shuffle Lines (Randomizer)",
    "category": "Text & Content",
    "description": "Randomize and shuffle the order of lines in a list.",
    "tags": [
      "shuffle",
      "random",
      "lines",
      "order"
    ],
    "icon": "Shuffle",
    "componentId": "text-tools",
    "mode": "shuffle-lines"
  },
  {
    "id": "truncate-text-tool",
    "name": "Text Truncator with Ellipsis",
    "category": "Text & Content",
    "description": "Truncate text at specified character or word limit with customizable ellipsis.",
    "tags": [
      "truncate",
      "shorten",
      "ellipsis",
      "limit"
    ],
    "icon": "Scissors",
    "componentId": "text-tools",
    "mode": "truncate"
  },
  {
    "id": "text-to-speech-tool",
    "name": "Text to Speech Reader",
    "category": "Text & Content",
    "description": "Read aloud any written text using your browser Web Speech synthesis API with voice and pitch controls.",
    "tags": [
      "tts",
      "voice",
      "speech",
      "audio",
      "read aloud"
    ],
    "icon": "Volume2",
    "componentId": "text-speech-tool",
    "featured": true
  },
  {
    "id": "length-converter",
    "name": "Length & Distance Converter",
    "category": "Unit Converters",
    "description": "Convert meters, feet, inches, miles, km, cm, mm, yards, nautical miles.",
    "tags": [
      "converter",
      "units",
      "length"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "length",
    "featured": true
  },
  {
    "id": "weight-mass-converter",
    "name": "Weight & Mass Converter",
    "category": "Unit Converters",
    "description": "Convert kilograms, pounds, grams, ounces, metric tons, stones, grains.",
    "tags": [
      "converter",
      "units",
      "weight"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "weight",
    "featured": true
  },
  {
    "id": "temperature-converter",
    "name": "Temperature Converter",
    "category": "Unit Converters",
    "description": "Convert Celsius, Fahrenheit, Kelvin, and Rankine.",
    "tags": [
      "converter",
      "units",
      "temperature"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "temperature",
    "featured": true
  },
  {
    "id": "area-converter",
    "name": "Area Converter",
    "category": "Unit Converters",
    "description": "Convert sq meters, sq feet, acres, hectares, sq km, sq miles.",
    "tags": [
      "converter",
      "units",
      "area"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "area",
    "featured": false
  },
  {
    "id": "volume-converter",
    "name": "Volume & Capacity Converter",
    "category": "Unit Converters",
    "description": "Convert liters, milliliters, gallons, quarts, pints, cups, fluid ounces.",
    "tags": [
      "converter",
      "units",
      "volume"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "volume",
    "featured": false
  },
  {
    "id": "speed-converter",
    "name": "Speed & Velocity Converter",
    "category": "Unit Converters",
    "description": "Convert km/h, mph, m/s, knots, Mach.",
    "tags": [
      "converter",
      "units",
      "speed"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "speed",
    "featured": false
  },
  {
    "id": "time-converter",
    "name": "Time Duration Converter",
    "category": "Unit Converters",
    "description": "Convert milliseconds, seconds, minutes, hours, days, weeks, months, years.",
    "tags": [
      "converter",
      "units",
      "time"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "time",
    "featured": false
  },
  {
    "id": "digital-storage-converter",
    "name": "Digital Storage Converter",
    "category": "Unit Converters",
    "description": "Convert Bytes, KB, MB, GB, TB, PB, KiB, MiB, GiB, TiB.",
    "tags": [
      "converter",
      "units",
      "digital-storage"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "digital-storage",
    "featured": false
  },
  {
    "id": "data-transfer-rate-converter",
    "name": "Data Transfer Rate Converter",
    "category": "Unit Converters",
    "description": "Convert bps, Kbps, Mbps, Gbps, MB/s, GB/s.",
    "tags": [
      "converter",
      "units",
      "data-transfer"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "data-transfer",
    "featured": false
  },
  {
    "id": "pressure-converter",
    "name": "Pressure Converter",
    "category": "Unit Converters",
    "description": "Convert Pascals, bar, psi, atmospheres, torr, mmHg.",
    "tags": [
      "converter",
      "units",
      "pressure"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "pressure",
    "featured": false
  },
  {
    "id": "energy-converter",
    "name": "Energy & Work Converter",
    "category": "Unit Converters",
    "description": "Convert Joules, Calories (kcal), kWh, BTU, electron-volts.",
    "tags": [
      "converter",
      "units",
      "energy"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "energy",
    "featured": false
  },
  {
    "id": "power-converter",
    "name": "Power Converter",
    "category": "Unit Converters",
    "description": "Convert Watts, kilowatts, horsepower, BTU/hr, ft-lb/s.",
    "tags": [
      "converter",
      "units",
      "power"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "power",
    "featured": false
  },
  {
    "id": "angle-converter",
    "name": "Angle Converter",
    "category": "Unit Converters",
    "description": "Convert Degrees, Radians, Gradians, Arcminutes, Arcseconds.",
    "tags": [
      "converter",
      "units",
      "angle"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "angle",
    "featured": false
  },
  {
    "id": "fuel-economy-converter",
    "name": "Fuel Economy Converter",
    "category": "Unit Converters",
    "description": "Convert MPG US, MPG UK, L/100km, km/L.",
    "tags": [
      "converter",
      "units",
      "fuel-economy"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "fuel-economy",
    "featured": false
  },
  {
    "id": "cooking-converter",
    "name": "Cooking Recipe Units Converter",
    "category": "Unit Converters",
    "description": "Convert tablespoons, teaspoons, cups, grams, fluid ounces.",
    "tags": [
      "converter",
      "units",
      "cooking"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "cooking",
    "featured": false
  },
  {
    "id": "typography-converter",
    "name": "PX to REM & EM Typography Converter",
    "category": "Unit Converters",
    "description": "Convert pixel values to responsive rem and em based on root font size.",
    "tags": [
      "converter",
      "units",
      "typography"
    ],
    "icon": "Ruler",
    "componentId": "unit-converter",
    "mode": "typography",
    "featured": false
  },
  {
    "id": "celsius-to-fahrenheit",
    "name": "Celsius to Fahrenheit Converter",
    "category": "Unit Converters",
    "description": "Convert temperatures from Celsius to Fahrenheit (°F = °C × 9/5 + 32).",
    "tags": [
      "converter",
      "temperature",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "celsius-to-fahrenheit"
  },
  {
    "id": "fahrenheit-to-celsius",
    "name": "Fahrenheit to Celsius Converter",
    "category": "Unit Converters",
    "description": "Convert temperatures from Fahrenheit to Celsius (°C = (°F - 32) × 5/9).",
    "tags": [
      "converter",
      "temperature",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "fahrenheit-to-celsius"
  },
  {
    "id": "celsius-to-kelvin",
    "name": "Celsius to Kelvin Converter",
    "category": "Unit Converters",
    "description": "Convert temperatures from Celsius to thermodynamic Kelvin (K = °C + 273.15).",
    "tags": [
      "converter",
      "temperature",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "celsius-to-kelvin"
  },
  {
    "id": "kelvin-to-celsius",
    "name": "Kelvin to Celsius Converter",
    "category": "Unit Converters",
    "description": "Convert temperatures from Kelvin to Celsius (°C = K - 273.15).",
    "tags": [
      "converter",
      "temperature",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "kelvin-to-celsius"
  },
  {
    "id": "fahrenheit-to-kelvin",
    "name": "Fahrenheit to Kelvin Converter",
    "category": "Unit Converters",
    "description": "Convert temperatures from Fahrenheit directly to Kelvin.",
    "tags": [
      "converter",
      "temperature",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "fahrenheit-to-kelvin"
  },
  {
    "id": "meters-to-feet",
    "name": "Meters to Feet Converter",
    "category": "Unit Converters",
    "description": "Convert distance from meters to decimal feet and feet & inches.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "meters-to-feet"
  },
  {
    "id": "feet-to-meters",
    "name": "Feet to Meters Converter",
    "category": "Unit Converters",
    "description": "Convert measurements from feet & inches to metric meters.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "feet-to-meters"
  },
  {
    "id": "km-to-miles",
    "name": "Kilometers to Miles Converter",
    "category": "Unit Converters",
    "description": "Convert distances from kilometers to statute miles (1 km ≈ 0.621371 mi).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "km-to-miles"
  },
  {
    "id": "miles-to-km",
    "name": "Miles to Kilometers Converter",
    "category": "Unit Converters",
    "description": "Convert distances from miles to kilometers (1 mi ≈ 1.60934 km).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "miles-to-km"
  },
  {
    "id": "cm-to-inches",
    "name": "Centimeters to Inches Converter",
    "category": "Unit Converters",
    "description": "Convert lengths from centimeters to inches (1 in = 2.54 cm).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "cm-to-inches"
  },
  {
    "id": "inches-to-cm",
    "name": "Inches to Centimeters Converter",
    "category": "Unit Converters",
    "description": "Convert lengths from inches to centimeters.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "inches-to-cm"
  },
  {
    "id": "mm-to-inches",
    "name": "Millimeters to Inches Converter",
    "category": "Unit Converters",
    "description": "Convert tiny measurements from millimeters to fractional/decimal inches.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "mm-to-inches"
  },
  {
    "id": "inches-to-mm",
    "name": "Inches to Millimeters Converter",
    "category": "Unit Converters",
    "description": "Convert inches to precise metric millimeters.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "inches-to-mm"
  },
  {
    "id": "yards-to-meters",
    "name": "Yards to Meters Converter",
    "category": "Unit Converters",
    "description": "Convert yards to international meters (1 yd = 0.9144 m).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "yards-to-meters"
  },
  {
    "id": "meters-to-yards",
    "name": "Meters to Yards Converter",
    "category": "Unit Converters",
    "description": "Convert meters to yards (1 m ≈ 1.09361 yd).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "meters-to-yards"
  },
  {
    "id": "feet-to-inches",
    "name": "Feet to Inches Converter",
    "category": "Unit Converters",
    "description": "Convert decimal feet to inches (1 ft = 12 in).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "feet-to-inches"
  },
  {
    "id": "inches-to-feet",
    "name": "Inches to Feet Converter",
    "category": "Unit Converters",
    "description": "Convert total inches to feet.",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "inches-to-feet"
  },
  {
    "id": "yards-to-feet",
    "name": "Yards to Feet Converter",
    "category": "Unit Converters",
    "description": "Convert yards to feet (1 yd = 3 ft).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "yards-to-feet"
  },
  {
    "id": "feet-to-yards",
    "name": "Feet to Yards Converter",
    "category": "Unit Converters",
    "description": "Convert feet to yards (3 ft = 1 yd).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "feet-to-yards"
  },
  {
    "id": "kg-to-lbs",
    "name": "Kilograms to Pounds Converter",
    "category": "Unit Converters",
    "description": "Convert mass from kilograms to pounds (1 kg ≈ 2.20462 lbs).",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "kg-to-lbs"
  },
  {
    "id": "lbs-to-kg",
    "name": "Pounds to Kilograms Converter",
    "category": "Unit Converters",
    "description": "Convert weight from pounds to metric kilograms (1 lb ≈ 0.453592 kg).",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "lbs-to-kg"
  },
  {
    "id": "grams-to-ounces",
    "name": "Grams to Ounces Converter",
    "category": "Unit Converters",
    "description": "Convert weight from grams to ounces (1 oz ≈ 28.3495 g).",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "grams-to-ounces"
  },
  {
    "id": "ounces-to-grams",
    "name": "Ounces to Grams Converter",
    "category": "Unit Converters",
    "description": "Convert ounces to metric grams.",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "ounces-to-grams"
  },
  {
    "id": "kg-to-stones",
    "name": "Kilograms to Stones Converter",
    "category": "Unit Converters",
    "description": "Convert kilograms to British imperial stones and pounds.",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "kg-to-stones"
  },
  {
    "id": "stones-to-kg",
    "name": "Stones to Kilograms Converter",
    "category": "Unit Converters",
    "description": "Convert British stones to metric kilograms.",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "stones-to-kg"
  },
  {
    "id": "liters-to-gallons",
    "name": "Liters to US Gallons Converter",
    "category": "Unit Converters",
    "description": "Convert liquid volume from liters to US liquid gallons.",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "liters-to-gallons"
  },
  {
    "id": "gallons-to-liters",
    "name": "Gallons to Liters Converter",
    "category": "Unit Converters",
    "description": "Convert volume from US gallons to metric liters (1 gal ≈ 3.78541 L).",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "gallons-to-liters"
  },
  {
    "id": "liters-to-pints",
    "name": "Liters to US Pints Converter",
    "category": "Unit Converters",
    "description": "Convert liquid volume from liters to US liquid pints (1 L ≈ 2.11338 pt).",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "liters-to-pints"
  },
  {
    "id": "pints-to-liters",
    "name": "US Pints to Liters Converter",
    "category": "Unit Converters",
    "description": "Convert US liquid pints to metric liters.",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "pints-to-liters"
  },
  {
    "id": "ml-to-fluid-oz",
    "name": "Milliliters to Fluid Ounces Converter",
    "category": "Unit Converters",
    "description": "Convert liquid volume from ml to US fluid ounces.",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "ml-to-fl-oz"
  },
  {
    "id": "fluid-oz-to-ml",
    "name": "Fluid Ounces to Milliliters Converter",
    "category": "Unit Converters",
    "description": "Convert fluid ounces (fl oz) to metric milliliters.",
    "tags": [
      "converter",
      "volume",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "fl-oz-to-ml"
  },
  {
    "id": "cups-to-ml",
    "name": "Cooking Cups to Milliliters Converter",
    "category": "Unit Converters",
    "description": "Convert culinary recipe cups to metric milliliters (1 US cup = 240 ml).",
    "tags": [
      "converter",
      "cooking",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "cups-to-ml"
  },
  {
    "id": "ml-to-cups",
    "name": "Milliliters to Cooking Cups Converter",
    "category": "Unit Converters",
    "description": "Convert milliliters to standard recipe cups.",
    "tags": [
      "converter",
      "cooking",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "ml-to-cups"
  },
  {
    "id": "tbsp-to-tsp",
    "name": "Tablespoons to Teaspoons Converter",
    "category": "Unit Converters",
    "description": "Convert tablespoons to teaspoons (1 tbsp = 3 tsp).",
    "tags": [
      "converter",
      "cooking",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "tbsp-to-tsp"
  },
  {
    "id": "sq-meters-to-sq-feet",
    "name": "Square Meters to Square Feet",
    "category": "Unit Converters",
    "description": "Convert floor and land area from square meters to square feet.",
    "tags": [
      "converter",
      "area",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "sqm-to-sqft"
  },
  {
    "id": "sq-feet-to-sq-meters",
    "name": "Square Feet to Square Meters",
    "category": "Unit Converters",
    "description": "Convert floor plan area from square feet to square meters.",
    "tags": [
      "converter",
      "area",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "sqft-to-sqm"
  },
  {
    "id": "acres-to-hectares",
    "name": "Acres to Hectares Converter",
    "category": "Unit Converters",
    "description": "Convert rural land area from acres to metric hectares.",
    "tags": [
      "converter",
      "area",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "acres-to-hectares"
  },
  {
    "id": "hectares-to-acres",
    "name": "Hectares to Acres Converter",
    "category": "Unit Converters",
    "description": "Convert hectares to acres (1 ha ≈ 2.47105 acres).",
    "tags": [
      "converter",
      "area",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "hectares-to-acres"
  },
  {
    "id": "kmh-to-mph",
    "name": "Km/h to MPH Speed Converter",
    "category": "Unit Converters",
    "description": "Convert driving speed from kilometers per hour to miles per hour.",
    "tags": [
      "converter",
      "speed",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "kmh-to-mph"
  },
  {
    "id": "mph-to-kmh",
    "name": "MPH to Km/h Speed Converter",
    "category": "Unit Converters",
    "description": "Convert speed from miles per hour to kilometers per hour.",
    "tags": [
      "converter",
      "speed",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "mph-to-kmh"
  },
  {
    "id": "knots-to-mph",
    "name": "Knots to MPH Converter",
    "category": "Unit Converters",
    "description": "Convert nautical knots to statute miles per hour.",
    "tags": [
      "converter",
      "speed",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "knots-to-mph"
  },
  {
    "id": "mph-to-knots",
    "name": "MPH to Knots Converter",
    "category": "Unit Converters",
    "description": "Convert miles per hour to maritime/aviation knots.",
    "tags": [
      "converter",
      "speed",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "mph-to-knots"
  },
  {
    "id": "mb-to-gb",
    "name": "Megabytes to Gigabytes Converter",
    "category": "Unit Converters",
    "description": "Convert file storage between Megabytes (MB) and Gigabytes (GB).",
    "tags": [
      "converter",
      "digital-storage",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "mb-to-gb"
  },
  {
    "id": "gb-to-tb",
    "name": "Gigabytes to Terabytes Converter",
    "category": "Unit Converters",
    "description": "Convert data storage between Gigabytes (GB) and Terabytes (TB).",
    "tags": [
      "converter",
      "digital-storage",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "gb-to-tb"
  },
  {
    "id": "bytes-to-kb",
    "name": "Bytes to Kilobytes Converter",
    "category": "Unit Converters",
    "description": "Convert raw byte count to readable Kilobytes (KB).",
    "tags": [
      "converter",
      "digital-storage",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "bytes-to-kb"
  },
  {
    "id": "bits-to-bytes",
    "name": "Bits to Bytes Converter",
    "category": "Unit Converters",
    "description": "Convert digital bits to bytes (8 bits = 1 byte).",
    "tags": [
      "converter",
      "digital-storage",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "bits-to-bytes"
  },
  {
    "id": "mbps-to-mbs",
    "name": "Mbps to MB/s Bandwidth Converter",
    "category": "Unit Converters",
    "description": "Convert network speed from Megabits/s to Megabytes/s download speed.",
    "tags": [
      "converter",
      "data-transfer",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "mbps-to-mbs"
  },
  {
    "id": "bar-to-psi",
    "name": "Bar to PSI Pressure Converter",
    "category": "Unit Converters",
    "description": "Convert pressure from metric Bar to Pounds per Square Inch (PSI).",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "bar-to-psi"
  },
  {
    "id": "psi-to-bar",
    "name": "PSI to Bar Pressure Converter",
    "category": "Unit Converters",
    "description": "Convert tire pressure from PSI to metric Bar.",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "psi-to-bar"
  },
  {
    "id": "atm-to-psi",
    "name": "Atmospheres to PSI Converter",
    "category": "Unit Converters",
    "description": "Convert standard atmospheres (atm) to Pounds per Square Inch (1 atm ≈ 14.6959 psi).",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "atm-to-psi"
  },
  {
    "id": "psi-to-atm",
    "name": "PSI to Atmospheres Converter",
    "category": "Unit Converters",
    "description": "Convert PSI pressure into standard physical atmospheres.",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "psi-to-atm"
  },
  {
    "id": "joules-to-calories",
    "name": "Joules to Calories Converter",
    "category": "Unit Converters",
    "description": "Convert energy from physical Joules to food Calories (kcal).",
    "tags": [
      "converter",
      "energy",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "joules-to-cal"
  },
  {
    "id": "calories-to-joules",
    "name": "Calories to Joules Converter",
    "category": "Unit Converters",
    "description": "Convert food nutritional calories to scientific Joules.",
    "tags": [
      "converter",
      "energy",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "cal-to-joules"
  },
  {
    "id": "kw-to-hp",
    "name": "Kilowatts to Horsepower Converter",
    "category": "Unit Converters",
    "description": "Convert electrical motor power from kW to mechanical Horsepower (HP).",
    "tags": [
      "converter",
      "power",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "kw-to-hp"
  },
  {
    "id": "hp-to-kw",
    "name": "Horsepower to Kilowatts Converter",
    "category": "Unit Converters",
    "description": "Convert mechanical horsepower to metric kilowatts.",
    "tags": [
      "converter",
      "power",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "hp-to-kw"
  },
  {
    "id": "degrees-to-radians",
    "name": "Degrees to Radians Converter",
    "category": "Unit Converters",
    "description": "Convert plane angles from degrees to radians (rad = deg × π / 180).",
    "tags": [
      "converter",
      "angle",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "deg-to-rad"
  },
  {
    "id": "radians-to-degrees",
    "name": "Radians to Degrees Converter",
    "category": "Unit Converters",
    "description": "Convert mathematical radians to degrees (deg = rad × 180 / π).",
    "tags": [
      "converter",
      "angle",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "rad-to-deg"
  },
  {
    "id": "number-base-converter",
    "name": "Number Base Converter (2-36)",
    "category": "Unit Converters",
    "description": "Convert numbers across Binary, Octal, Decimal, Hexadecimal and arbitrary radixes.",
    "tags": [
      "converter",
      "number-base",
      "units"
    ],
    "icon": "Binary",
    "componentId": "number-base-tool",
    "mode": "base",
    "featured": true
  },
  {
    "id": "roman-numerals-converter",
    "name": "Roman Numerals Converter",
    "category": "Unit Converters",
    "description": "Convert standard Arabic numbers to Roman numerals (e.g. 2026 -> MMXXVI) and vice versa.",
    "tags": [
      "converter",
      "roman",
      "units"
    ],
    "icon": "Type",
    "componentId": "roman-converter",
    "mode": "roman",
    "featured": true
  },
  {
    "id": "json-formatter",
    "name": "JSON Formatter & Validator",
    "category": "Code & Web Dev",
    "description": "Prettify, validate, format, and inspect JSON with syntax highlighting.",
    "tags": [
      "code",
      "developer",
      "json-format"
    ],
    "icon": "Braces",
    "componentId": "code-tools",
    "mode": "json-format",
    "featured": true
  },
  {
    "id": "json-minifier",
    "name": "JSON Minifier",
    "category": "Code & Web Dev",
    "description": "Compress JSON by removing whitespace, indentation, and newlines.",
    "tags": [
      "code",
      "developer",
      "json-minify"
    ],
    "icon": "Minimize2",
    "componentId": "code-tools",
    "mode": "json-minify",
    "featured": false
  },
  {
    "id": "json-validator",
    "name": "JSON Syntax Validator",
    "category": "Code & Web Dev",
    "description": "Validate JSON syntax and structure with precise error highlighting and line positions.",
    "tags": [
      "code",
      "developer",
      "json-validate"
    ],
    "icon": "CheckCircle",
    "componentId": "code-tools",
    "mode": "json-validate",
    "featured": false
  },
  {
    "id": "json-to-yaml",
    "name": "JSON to YAML Converter",
    "category": "Code & Web Dev",
    "description": "Convert JSON objects into clean, indented YAML data format.",
    "tags": [
      "code",
      "developer",
      "json-to-yaml"
    ],
    "icon": "FileCode",
    "componentId": "code-tools",
    "mode": "json-to-yaml",
    "featured": false
  },
  {
    "id": "yaml-to-json",
    "name": "YAML to JSON Converter",
    "category": "Code & Web Dev",
    "description": "Parse YAML configuration into standard structured JSON.",
    "tags": [
      "code",
      "developer",
      "yaml-to-json"
    ],
    "icon": "FileCode",
    "componentId": "code-tools",
    "mode": "yaml-to-json",
    "featured": false
  },
  {
    "id": "json-to-csv",
    "name": "JSON to CSV Converter",
    "category": "Code & Web Dev",
    "description": "Convert array of JSON objects into tabular CSV format for spreadsheets.",
    "tags": [
      "code",
      "developer",
      "json-to-csv"
    ],
    "icon": "Table",
    "componentId": "code-tools",
    "mode": "json-to-csv",
    "featured": false
  },
  {
    "id": "csv-to-json",
    "name": "CSV to JSON Converter",
    "category": "Code & Web Dev",
    "description": "Parse CSV spreadsheets and comma-separated text into structured JSON arrays.",
    "tags": [
      "code",
      "developer",
      "csv-to-json"
    ],
    "icon": "Table",
    "componentId": "code-tools",
    "mode": "csv-to-json",
    "featured": false
  },
  {
    "id": "json-to-typescript",
    "name": "JSON to TypeScript Interfaces",
    "category": "Code & Web Dev",
    "description": "Automatically generate TypeScript interface definitions from raw JSON samples.",
    "tags": [
      "code",
      "developer",
      "json-to-ts"
    ],
    "icon": "Code2",
    "componentId": "code-tools",
    "mode": "json-to-ts",
    "featured": true
  },
  {
    "id": "xml-formatter",
    "name": "XML Formatter & Prettifier",
    "category": "Code & Web Dev",
    "description": "Format, indent, and prettify messy XML and SVG documents.",
    "tags": [
      "code",
      "developer",
      "xml-format"
    ],
    "icon": "Code",
    "componentId": "code-tools",
    "mode": "xml-format",
    "featured": false
  },
  {
    "id": "xml-minifier",
    "name": "XML Minifier",
    "category": "Code & Web Dev",
    "description": "Compress XML documents by stripping extraneous spaces and newlines.",
    "tags": [
      "code",
      "developer",
      "xml-minify"
    ],
    "icon": "Minimize2",
    "componentId": "code-tools",
    "mode": "xml-minify",
    "featured": false
  },
  {
    "id": "html-formatter",
    "name": "HTML Formatter & Beautifier",
    "category": "Code & Web Dev",
    "description": "Format and properly indent HTML markup with standard tab sizing.",
    "tags": [
      "code",
      "developer",
      "html-format"
    ],
    "icon": "FileCode2",
    "componentId": "code-tools",
    "mode": "html-format",
    "featured": false
  },
  {
    "id": "html-minifier",
    "name": "HTML Minifier",
    "category": "Code & Web Dev",
    "description": "Minify HTML source code to reduce page payload and load faster.",
    "tags": [
      "code",
      "developer",
      "html-minify"
    ],
    "icon": "Minimize2",
    "componentId": "code-tools",
    "mode": "html-minify",
    "featured": false
  },
  {
    "id": "css-beautifier",
    "name": "CSS Beautifier",
    "category": "Code & Web Dev",
    "description": "Format unformatted or minified CSS styles with clean rule indentation.",
    "tags": [
      "code",
      "developer",
      "css-format"
    ],
    "icon": "Palette",
    "componentId": "code-tools",
    "mode": "css-format",
    "featured": false
  },
  {
    "id": "css-minifier",
    "name": "CSS Minifier",
    "category": "Code & Web Dev",
    "description": "Minify CSS files by stripping comments, whitespace, and semicolons.",
    "tags": [
      "code",
      "developer",
      "css-minify"
    ],
    "icon": "Minimize2",
    "componentId": "code-tools",
    "mode": "css-minify",
    "featured": false
  },
  {
    "id": "js-formatter",
    "name": "JavaScript Formatter",
    "category": "Code & Web Dev",
    "description": "Format JavaScript and TypeScript code with clean indentations and brace styles.",
    "tags": [
      "code",
      "developer",
      "js-format"
    ],
    "icon": "FileCode",
    "componentId": "code-tools",
    "mode": "js-format",
    "featured": false
  },
  {
    "id": "js-minifier",
    "name": "JS Quick Minifier",
    "category": "Code & Web Dev",
    "description": "Strip comments and redundant whitespace from JavaScript code.",
    "tags": [
      "code",
      "developer",
      "js-minify"
    ],
    "icon": "Minimize2",
    "componentId": "code-tools",
    "mode": "js-minify",
    "featured": false
  },
  {
    "id": "sql-formatter",
    "name": "SQL Query Formatter",
    "category": "Code & Web Dev",
    "description": "Format and beautify complex SQL queries with capitalized keywords.",
    "tags": [
      "code",
      "developer",
      "sql-format"
    ],
    "icon": "Database",
    "componentId": "code-tools",
    "mode": "sql-format",
    "featured": true
  },
  {
    "id": "curl-to-fetch",
    "name": "cURL to Fetch Converter",
    "category": "Code & Web Dev",
    "description": "Convert cURL command strings into modern browser JavaScript fetch() code snippets.",
    "tags": [
      "code",
      "developer",
      "curl-fetch"
    ],
    "icon": "Terminal",
    "componentId": "code-tools",
    "mode": "curl-fetch",
    "featured": false
  },
  {
    "id": "user-agent-parser",
    "name": "User-Agent Inspector",
    "category": "Code & Web Dev",
    "description": "Parse browser User-Agent string to detect browser name, engine, operating system, and device type.",
    "tags": [
      "code",
      "developer",
      "user-agent"
    ],
    "icon": "Monitor",
    "componentId": "code-tools",
    "mode": "user-agent",
    "featured": false
  },
  {
    "id": "url-parser",
    "name": "URL Parser & Query Inspector",
    "category": "Code & Web Dev",
    "description": "Deconstruct URLs into protocol, host, port, path, parameters table, and hash fragment.",
    "tags": [
      "code",
      "developer",
      "url-parse"
    ],
    "icon": "Link",
    "componentId": "code-tools",
    "mode": "url-parse",
    "featured": false
  },
  {
    "id": "url-query-builder",
    "name": "URL Query String Builder",
    "category": "Code & Web Dev",
    "description": "Assemble key-value pairs into properly URL-encoded query strings.",
    "tags": [
      "code",
      "developer",
      "query-builder"
    ],
    "icon": "Sliders",
    "componentId": "code-tools",
    "mode": "query-builder",
    "featured": false
  },
  {
    "id": "semver-calculator",
    "name": "Semantic Versioning (SemVer) Tool",
    "category": "Code & Web Dev",
    "description": "Compare two SemVer versions, bump major, minor, patch, or prerelease tags.",
    "tags": [
      "code",
      "developer",
      "semver"
    ],
    "icon": "GitBranch",
    "componentId": "code-tools",
    "mode": "semver",
    "featured": false
  },
  {
    "id": "robots-txt-generator",
    "name": "Robots.txt Generator",
    "category": "Code & Web Dev",
    "description": "Create crawler rules for Googlebot, Bingbot, and AI scrapers with custom disallow paths.",
    "tags": [
      "code",
      "developer",
      "robots-txt"
    ],
    "icon": "Bot",
    "componentId": "code-tools",
    "mode": "robots-txt",
    "featured": false
  },
  {
    "id": "sitemap-generator",
    "name": "XML Sitemap Generator",
    "category": "Code & Web Dev",
    "description": "Create XML sitemap skeleton from list of URL paths with priority and changefreq.",
    "tags": [
      "code",
      "developer",
      "sitemap-xml"
    ],
    "icon": "Map",
    "componentId": "code-tools",
    "mode": "sitemap-xml",
    "featured": false
  },
  {
    "id": "htaccess-generator",
    "name": ".htaccess Redirects Generator",
    "category": "Code & Web Dev",
    "description": "Generate Apache .htaccess redirect rules (301, 302, HTTPS enforce, www removal).",
    "tags": [
      "code",
      "developer",
      "htaccess"
    ],
    "icon": "Server",
    "componentId": "code-tools",
    "mode": "htaccess",
    "featured": false
  },
  {
    "id": "nginx-config-generator",
    "name": "Nginx Config Snippet Generator",
    "category": "Code & Web Dev",
    "description": "Generate Nginx server block configs for reverse proxies, static SPAs, and SSL redirects.",
    "tags": [
      "code",
      "developer",
      "nginx"
    ],
    "icon": "Server",
    "componentId": "code-tools",
    "mode": "nginx",
    "featured": false
  },
  {
    "id": "svg-to-data-uri",
    "name": "SVG to Data URI Converter",
    "category": "Code & Web Dev",
    "description": "Convert raw SVG XML into URL-encoded or base64 CSS background-image data URI.",
    "tags": [
      "code",
      "developer",
      "svg-data-uri"
    ],
    "icon": "Image",
    "componentId": "code-tools",
    "mode": "svg-data-uri",
    "featured": false
  },
  {
    "id": "base64-data-uri-generator",
    "name": "Base64 Data URI Generator",
    "category": "Code & Web Dev",
    "description": "Generate complete data:mime;base64 string for file embedding.",
    "tags": [
      "code",
      "developer",
      "base64-data-uri"
    ],
    "icon": "FileText",
    "componentId": "code-tools",
    "mode": "base64-data-uri",
    "featured": false
  },
  {
    "id": "csp-header-builder",
    "name": "Content Security Policy (CSP) Builder",
    "category": "Code & Web Dev",
    "description": "Visually configure default-src, script-src, style-src, and frame-ancestors CSP directives.",
    "tags": [
      "code",
      "developer",
      "csp-builder"
    ],
    "icon": "Shield",
    "componentId": "code-tools",
    "mode": "csp-builder",
    "featured": false
  },
  {
    "id": "git-ignore-generator",
    "name": ".gitignore File Generator",
    "category": "Code & Web Dev",
    "description": "Generate curated .gitignore rules for Node, Python, Java, Go, Rust, React, and OS.",
    "tags": [
      "code",
      "developer",
      "gitignore"
    ],
    "icon": "GitBranch",
    "componentId": "code-tools",
    "mode": "gitignore",
    "featured": false
  },
  {
    "id": "jwt-decoder",
    "name": "JWT Decoder & Inspector",
    "category": "Code & Web Dev",
    "description": "Decode JSON Web Tokens, inspect header, payload claims, expiration timestamps, and validation status.",
    "tags": [
      "jwt",
      "token",
      "auth",
      "decode",
      "bearer",
      "security"
    ],
    "icon": "Key",
    "componentId": "jwt-decoder",
    "featured": true
  },
  {
    "id": "cron-expression-parser",
    "name": "Cron Expression Parser & Explainer",
    "category": "Code & Web Dev",
    "description": "Parse standard cron schedules into plain human-readable sentences and calculate next execution runs.",
    "tags": [
      "cron",
      "schedule",
      "crontab",
      "time",
      "devops"
    ],
    "icon": "Clock",
    "componentId": "cron-tool",
    "featured": true
  },
  {
    "id": "chmod-calculator",
    "name": "Chmod Permissions Calculator",
    "category": "Code & Web Dev",
    "description": "Calculate UNIX file permission modes interactively in octal (e.g. 755), symbolic (rwxr-xr-x), and command syntax.",
    "tags": [
      "chmod",
      "permissions",
      "linux",
      "unix",
      "rwx",
      "octal"
    ],
    "icon": "ShieldCheck",
    "componentId": "chmod-tool",
    "featured": true
  },
  {
    "id": "regex-tester",
    "name": "RegEx Interactive Tester",
    "category": "Code & Web Dev",
    "description": "Test regular expressions against sample text with live match highlighting, group captures, and flag toggles.",
    "tags": [
      "regex",
      "regular expression",
      "tester",
      "pattern",
      "match"
    ],
    "icon": "Search",
    "componentId": "regex-tester",
    "featured": true
  },
  {
    "id": "uuid-v4-generator",
    "name": "UUID v4 Generator",
    "category": "Code & Web Dev",
    "description": "Generate cryptographically random UUID v4 identifiers in batch with custom formatting.",
    "tags": [
      "uuid",
      "guid",
      "v4",
      "random",
      "generator",
      "id"
    ],
    "icon": "Fingerprint",
    "componentId": "uuid-tool",
    "mode": "v4",
    "featured": true
  },
  {
    "id": "uuid-v1-generator",
    "name": "UUID v1 Generator",
    "category": "Code & Web Dev",
    "description": "Generate timestamp-based UUID v1 identifiers client-side.",
    "tags": [
      "uuid",
      "v1",
      "timestamp",
      "generator"
    ],
    "icon": "Fingerprint",
    "componentId": "uuid-tool",
    "mode": "v1"
  },
  {
    "id": "uuid-v7-generator",
    "name": "UUID v7 Generator",
    "category": "Code & Web Dev",
    "description": "Generate sortable modern Unix-epoch timestamped UUID v7 identifiers.",
    "tags": [
      "uuid",
      "v7",
      "sortable",
      "timestamp",
      "generator"
    ],
    "icon": "Fingerprint",
    "componentId": "uuid-tool",
    "mode": "v7"
  },
  {
    "id": "uuid-validator",
    "name": "UUID Validator & Parser",
    "category": "Code & Web Dev",
    "description": "Validate UUID strings, extract version number, and check RFC 4122 compliance.",
    "tags": [
      "uuid",
      "validator",
      "guid",
      "check"
    ],
    "icon": "CheckCircle",
    "componentId": "uuid-tool",
    "mode": "validate"
  },
  {
    "id": "nanoid-generator",
    "name": "NanoID Generator",
    "category": "Code & Web Dev",
    "description": "Generate URL-friendly compact unique IDs with customizable alphabet and length.",
    "tags": [
      "nanoid",
      "id",
      "unique",
      "compact",
      "url-friendly"
    ],
    "icon": "Hash",
    "componentId": "uuid-tool",
    "mode": "nanoid"
  },
  {
    "id": "qr-code-generator",
    "name": "QR Code Generator",
    "category": "Code & Web Dev",
    "description": "Generate high-resolution QR codes for URLs, text, Wi-Fi credentials, with SVG/PNG download and custom colors.",
    "tags": [
      "qr",
      "qrcode",
      "barcode",
      "generator",
      "svg",
      "png"
    ],
    "icon": "QrCode",
    "componentId": "qr-generator",
    "featured": true
  },
  {
    "id": "qr-code-scanner",
    "name": "QR Code Reader & Scanner",
    "category": "Code & Web Dev",
    "description": "Decode and read QR codes from uploaded images or your web camera client-side.",
    "tags": [
      "qr",
      "scanner",
      "reader",
      "decode",
      "camera"
    ],
    "icon": "Scan",
    "componentId": "qr-scanner"
  },
  {
    "id": "barcode-generator",
    "name": "Barcode Generator",
    "category": "Code & Web Dev",
    "description": "Generate standard Code 128 barcodes from numbers and text with SVG download.",
    "tags": [
      "barcode",
      "code128",
      "ean",
      "scanner"
    ],
    "icon": "Barcode",
    "componentId": "barcode-generator"
  },
  {
    "id": "keycode-inspector",
    "name": "Keycode Event Inspector",
    "category": "Code & Web Dev",
    "description": "Press any key on your keyboard to view event.key, event.code, which, and modifier states.",
    "tags": [
      "keycode",
      "keyboard",
      "event",
      "javascript",
      "tester"
    ],
    "icon": "Keyboard",
    "componentId": "keycode-inspector",
    "featured": true
  },
  {
    "id": "meta-tags-generator",
    "name": "Meta Tags & OpenGraph Generator",
    "category": "Code & Web Dev",
    "description": "Generate complete HTML SEO meta tags, OpenGraph cards for Facebook & LinkedIn, and Twitter Card tags.",
    "tags": [
      "meta",
      "seo",
      "opengraph",
      "twitter",
      "social"
    ],
    "icon": "Globe",
    "componentId": "meta-generator"
  },
  {
    "id": "sha256-hash",
    "name": "SHA-256 Hash Generator",
    "category": "Crypto & Security",
    "description": "Compute cryptographic SHA-256 hash using Web Crypto API.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "sha256"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "sha256",
    "featured": true
  },
  {
    "id": "sha512-hash",
    "name": "SHA-512 Hash Generator",
    "category": "Crypto & Security",
    "description": "Compute 512-bit cryptographic hash using Web Crypto API.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "sha512"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "sha512",
    "featured": false
  },
  {
    "id": "sha384-hash",
    "name": "SHA-384 Hash Generator",
    "category": "Crypto & Security",
    "description": "Compute 384-bit cryptographic hash using Web Crypto API.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "sha384"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "sha384",
    "featured": false
  },
  {
    "id": "sha1-hash",
    "name": "SHA-1 Hash Generator",
    "category": "Crypto & Security",
    "description": "Compute legacy SHA-1 hash checksum of any input text.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "sha1"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "sha1",
    "featured": false
  },
  {
    "id": "md5-hash",
    "name": "MD5 Hash Generator",
    "category": "Crypto & Security",
    "description": "Generate 128-bit MD5 message digest hash client-side.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "md5"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "md5",
    "featured": false
  },
  {
    "id": "hmac-sha256",
    "name": "HMAC-SHA256 Generator",
    "category": "Crypto & Security",
    "description": "Calculate Hash-based Message Authentication Code using SHA-256 and secret key.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "hmac-sha256"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "hmac-sha256",
    "featured": false
  },
  {
    "id": "hmac-sha512",
    "name": "HMAC-SHA512 Generator",
    "category": "Crypto & Security",
    "description": "Calculate high-security HMAC using SHA-512 algorithm and secret key.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "hmac-sha512"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "hmac-sha512",
    "featured": false
  },
  {
    "id": "hmac-md5",
    "name": "HMAC-MD5 Generator",
    "category": "Crypto & Security",
    "description": "Calculate HMAC message digest using MD5 algorithm and secret key.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "hmac-md5"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "hmac-md5",
    "featured": false
  },
  {
    "id": "aes-encrypt",
    "name": "AES Encryption Tool",
    "category": "Crypto & Security",
    "description": "Encrypt secret text messages using AES-256 cipher with custom password passphrase.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "aes-encrypt"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "aes-encrypt",
    "featured": false
  },
  {
    "id": "aes-decrypt",
    "name": "AES Decryption Tool",
    "category": "Crypto & Security",
    "description": "Decrypt AES-256 encrypted ciphertext using your secret passphrase.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "aes-decrypt"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "aes-decrypt",
    "featured": false
  },
  {
    "id": "base64-encoder",
    "name": "Base64 Text Encoder",
    "category": "Crypto & Security",
    "description": "Encode UTF-8 text into standard Base64 representation.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "b64-encode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "b64-encode",
    "featured": false
  },
  {
    "id": "base64-decoder",
    "name": "Base64 Text Decoder",
    "category": "Crypto & Security",
    "description": "Decode Base64 strings back into original UTF-8 text.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "b64-decode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "b64-decode",
    "featured": false
  },
  {
    "id": "base64url-encoder",
    "name": "Base64URL Encoder",
    "category": "Crypto & Security",
    "description": "Encode text into URL-safe Base64 without + / and padding = signs.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "b64url-encode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "b64url-encode",
    "featured": false
  },
  {
    "id": "base64url-decoder",
    "name": "Base64URL Decoder",
    "category": "Crypto & Security",
    "description": "Decode URL-safe Base64 strings into UTF-8 text.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "b64url-decode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "b64url-decode",
    "featured": false
  },
  {
    "id": "url-encoder",
    "name": "URL Percent Encoder",
    "category": "Crypto & Security",
    "description": "Encode special characters into percent-encoded URI strings (RFC 3986).",
    "tags": [
      "crypto",
      "hash",
      "security",
      "url-encode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "url-encode",
    "featured": false
  },
  {
    "id": "url-decoder",
    "name": "URL Percent Decoder",
    "category": "Crypto & Security",
    "description": "Decode percent-encoded %20, %2F, %3F URL query strings.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "url-decode"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "url-decode",
    "featured": false
  },
  {
    "id": "random-hex-generator",
    "name": "Random Hex Generator",
    "category": "Crypto & Security",
    "description": "Generate cryptographically random hexadecimal strings of arbitrary byte length.",
    "tags": [
      "crypto",
      "hash",
      "security",
      "random-hex"
    ],
    "icon": "Hash",
    "componentId": "crypto-tools",
    "mode": "random-hex",
    "featured": false
  },
  {
    "id": "password-generator",
    "name": "Strong Password Generator",
    "category": "Crypto & Security",
    "description": "Generate ultra-secure passwords using cryptographic randomness with length, uppercase, numbers, and symbols rules.",
    "tags": [
      "password",
      "random",
      "security",
      "generator",
      "credentials"
    ],
    "icon": "Lock",
    "componentId": "password-tool",
    "featured": true
  },
  {
    "id": "password-strength-checker",
    "name": "Password Strength & Entropy Analyzer",
    "category": "Crypto & Security",
    "description": "Evaluate password resilience, bits of entropy, dictionary risks, and estimated crack time.",
    "tags": [
      "password",
      "strength",
      "entropy",
      "security",
      "audit"
    ],
    "icon": "ShieldCheck",
    "componentId": "password-strength",
    "featured": true
  },
  {
    "id": "rsa-key-generator",
    "name": "RSA Key Pair Generator",
    "category": "Crypto & Security",
    "description": "Generate asymmetric RSA-2048 or RSA-4096 public and private key pairs in PEM format using Web Crypto.",
    "tags": [
      "rsa",
      "keys",
      "public key",
      "private key",
      "asymmetric"
    ],
    "icon": "Key",
    "componentId": "rsa-tool"
  },
  {
    "id": "totp-generator",
    "name": "TOTP 2FA Authenticator Simulator",
    "category": "Crypto & Security",
    "description": "Generate live 6-digit Time-based One-Time Passwords from 2FA Base32 secret keys (RFC 6238).",
    "tags": [
      "totp",
      "2fa",
      "authenticator",
      "otp",
      "security"
    ],
    "icon": "ShieldAlert",
    "componentId": "totp-tool"
  },
  {
    "id": "file-checksum-verifier",
    "name": "File Checksum Verifier",
    "category": "Crypto & Security",
    "description": "Compute SHA-256 or MD5 hash of any local file right in your browser without uploading to any server.",
    "tags": [
      "checksum",
      "file",
      "sha256",
      "md5",
      "verify"
    ],
    "icon": "FileCheck",
    "componentId": "file-checksum",
    "featured": true
  },
  {
    "id": "percentage-calculator",
    "name": "Percentage Calculator",
    "category": "Math & Science",
    "description": "Calculate what is X% of Y, percentage increase/decrease, and X is what percent of Y.",
    "tags": [
      "math",
      "science",
      "percentage"
    ],
    "icon": "Percent",
    "componentId": "math-tools",
    "mode": "percentage",
    "featured": true
  },
  {
    "id": "fraction-simplifier",
    "name": "Fraction Simplifier & Calculator",
    "category": "Math & Science",
    "description": "Simplify fractions to lowest terms, convert to decimal/mixed numbers, and add/subtract fractions.",
    "tags": [
      "math",
      "science",
      "fractions"
    ],
    "icon": "Divide",
    "componentId": "math-tools",
    "mode": "fractions",
    "featured": false
  },
  {
    "id": "gcd-lcm-calculator",
    "name": "GCD & LCM Calculator",
    "category": "Math & Science",
    "description": "Calculate Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of two or more numbers.",
    "tags": [
      "math",
      "science",
      "gcd-lcm"
    ],
    "icon": "Binary",
    "componentId": "math-tools",
    "mode": "gcd-lcm",
    "featured": false
  },
  {
    "id": "prime-number-checker",
    "name": "Prime Number Checker",
    "category": "Math & Science",
    "description": "Test if a number is prime and view nearby prime numbers.",
    "tags": [
      "math",
      "science",
      "prime-check"
    ],
    "icon": "CheckCircle",
    "componentId": "math-tools",
    "mode": "prime-check",
    "featured": false
  },
  {
    "id": "prime-factorization",
    "name": "Prime Factorization Calculator",
    "category": "Math & Science",
    "description": "Decompose any positive integer into its product of prime factors.",
    "tags": [
      "math",
      "science",
      "prime-factors"
    ],
    "icon": "Sparkles",
    "componentId": "math-tools",
    "mode": "prime-factors",
    "featured": false
  },
  {
    "id": "statistics-calculator",
    "name": "Statistics & Summary Calculator",
    "category": "Math & Science",
    "description": "Calculate Mean, Median, Mode, Variance, Standard Deviation, Min, Max, Range, and Sum.",
    "tags": [
      "math",
      "science",
      "statistics"
    ],
    "icon": "BarChart2",
    "componentId": "math-tools",
    "mode": "statistics",
    "featured": true
  },
  {
    "id": "quadratic-equation-solver",
    "name": "Quadratic Equation Solver",
    "category": "Math & Science",
    "description": "Find real and complex roots of quadratic equation ax² + bx + c = 0 with step-by-step discriminant.",
    "tags": [
      "math",
      "science",
      "quadratic"
    ],
    "icon": "FunctionSquare",
    "componentId": "math-tools",
    "mode": "quadratic",
    "featured": false
  },
  {
    "id": "random-number-generator",
    "name": "Random Number Generator",
    "category": "Math & Science",
    "description": "Generate customizable lists of random numbers within min/max bounds.",
    "tags": [
      "math",
      "science",
      "random-num"
    ],
    "icon": "Shuffle",
    "componentId": "math-tools",
    "mode": "random-num",
    "featured": false
  },
  {
    "id": "coin-flipper",
    "name": "Coin Flipper & Probabilities",
    "category": "Math & Science",
    "description": "Flip virtual coins with flip animations, heads/tails counts, and streak tracking.",
    "tags": [
      "math",
      "science",
      "coin-flip"
    ],
    "icon": "Coins",
    "componentId": "math-tools",
    "mode": "coin-flip",
    "featured": false
  },
  {
    "id": "permutations-combinations",
    "name": "Permutations & Combinations (nPr / nCr)",
    "category": "Math & Science",
    "description": "Calculate nPr permutations and nCr combinations with factorial formulas.",
    "tags": [
      "math",
      "science",
      "perm-comb"
    ],
    "icon": "Layers",
    "componentId": "math-tools",
    "mode": "perm-comb",
    "featured": false
  },
  {
    "id": "fibonacci-generator",
    "name": "Fibonacci Sequence Generator",
    "category": "Math & Science",
    "description": "Generate Fibonacci sequence up to N terms with ratio convergence analysis.",
    "tags": [
      "math",
      "science",
      "fibonacci"
    ],
    "icon": "TrendingUp",
    "componentId": "math-tools",
    "mode": "fibonacci",
    "featured": false
  },
  {
    "id": "golden-ratio-calculator",
    "name": "Golden Ratio (φ) Calculator",
    "category": "Math & Science",
    "description": "Calculate divine proportions and golden sections (1.618033...) for art and design.",
    "tags": [
      "math",
      "science",
      "golden-ratio"
    ],
    "icon": "CircleDot",
    "componentId": "math-tools",
    "mode": "golden-ratio",
    "featured": false
  },
  {
    "id": "rule-of-three-calculator",
    "name": "Rule of Three Calculator",
    "category": "Math & Science",
    "description": "Solve direct and inverse proportions (if A yields B, then what does C yield?).",
    "tags": [
      "math",
      "science",
      "rule-of-three"
    ],
    "icon": "HelpCircle",
    "componentId": "math-tools",
    "mode": "rule-of-three",
    "featured": false
  },
  {
    "id": "number-to-words",
    "name": "Number to Words Speller",
    "category": "Math & Science",
    "description": "Spell out numbers into written English words (e.g. 14,250 -> Fourteen Thousand Two Hundred Fifty).",
    "tags": [
      "math",
      "science",
      "num-to-words"
    ],
    "icon": "FileText",
    "componentId": "math-tools",
    "mode": "num-to-words",
    "featured": false
  },
  {
    "id": "bitwise-calculator",
    "name": "Bitwise Logic Calculator",
    "category": "Math & Science",
    "description": "Compute bitwise AND, OR, XOR, NOT, and bit shifts with 32-bit binary views.",
    "tags": [
      "math",
      "science",
      "bitwise"
    ],
    "icon": "Cpu",
    "componentId": "math-tools",
    "mode": "bitwise",
    "featured": false
  },
  {
    "id": "ohm-law-calculator",
    "name": "Ohm's Law Calculator",
    "category": "Math & Science",
    "description": "Calculate Voltage (V), Current (I), Resistance (R), and Power (P) in electrical circuits.",
    "tags": [
      "math",
      "science",
      "ohms-law"
    ],
    "icon": "Zap",
    "componentId": "math-tools",
    "mode": "ohms-law",
    "featured": false
  },
  {
    "id": "kinetic-energy-calculator",
    "name": "Kinetic Energy Calculator",
    "category": "Math & Science",
    "description": "Calculate kinetic energy (E_k = ½mv²) from mass and velocity.",
    "tags": [
      "math",
      "science",
      "kinetic-energy"
    ],
    "icon": "Zap",
    "componentId": "math-tools",
    "mode": "kinetic-energy",
    "featured": false
  },
  {
    "id": "gravitational-potential-energy",
    "name": "Potential Energy Calculator",
    "category": "Math & Science",
    "description": "Calculate gravitational potential energy (E_p = m · g · h) from mass and height.",
    "tags": [
      "math",
      "science",
      "potential-energy"
    ],
    "icon": "Zap",
    "componentId": "math-tools",
    "mode": "potential-energy",
    "featured": false
  },
  {
    "id": "circle-calculator",
    "name": "Circle Area & Circumference Calculator",
    "category": "Math & Science",
    "description": "Calculate radius, diameter, circumference, and surface area of circles.",
    "tags": [
      "math",
      "science",
      "circle"
    ],
    "icon": "Circle",
    "componentId": "math-tools",
    "mode": "circle",
    "featured": false
  },
  {
    "id": "triangle-area-calculator",
    "name": "Triangle Area & Trigonometry Solver",
    "category": "Math & Science",
    "description": "Calculate area using base/height or Heron formula with side lengths.",
    "tags": [
      "math",
      "science",
      "triangle"
    ],
    "icon": "Triangle",
    "componentId": "math-tools",
    "mode": "triangle",
    "featured": false
  },
  {
    "id": "hypotenuse-calculator",
    "name": "Hypotenuse (Pythagorean) Calculator",
    "category": "Math & Science",
    "description": "Calculate hypotenuse length c = √(a² + b²) of a right-angled triangle.",
    "tags": [
      "math",
      "science",
      "hypotenuse"
    ],
    "icon": "Triangle",
    "componentId": "math-tools",
    "mode": "hypotenuse",
    "featured": false
  },
  {
    "id": "sphere-calculator",
    "name": "Sphere Volume & Area Calculator",
    "category": "Math & Science",
    "description": "Calculate volume V = 4/3 πr³ and surface area A = 4πr² of a sphere.",
    "tags": [
      "math",
      "science",
      "sphere"
    ],
    "icon": "Circle",
    "componentId": "math-tools",
    "mode": "sphere",
    "featured": false
  },
  {
    "id": "cylinder-calculator",
    "name": "Cylinder Volume & Area Calculator",
    "category": "Math & Science",
    "description": "Calculate volume V = πr²h and total surface area of a cylinder.",
    "tags": [
      "math",
      "science",
      "cylinder"
    ],
    "icon": "Box",
    "componentId": "math-tools",
    "mode": "cylinder",
    "featured": false
  },
  {
    "id": "cone-calculator",
    "name": "Cone Volume & Slant Height Calculator",
    "category": "Math & Science",
    "description": "Calculate volume V = 1/3 πr²h and slant height of a circular cone.",
    "tags": [
      "math",
      "science",
      "cone"
    ],
    "icon": "Triangle",
    "componentId": "math-tools",
    "mode": "cone",
    "featured": false
  },
  {
    "id": "cube-calculator",
    "name": "Cube Volume & Surface Area Calculator",
    "category": "Math & Science",
    "description": "Calculate volume V = s³ and total surface area A = 6s² of a regular cube.",
    "tags": [
      "math",
      "science",
      "cube"
    ],
    "icon": "Box",
    "componentId": "math-tools",
    "mode": "cube",
    "featured": false
  },
  {
    "id": "rectangle-calculator",
    "name": "Rectangle Area & Perimeter Calculator",
    "category": "Math & Science",
    "description": "Calculate perimeter P = 2(l + w) and surface area A = l · w of rectangles.",
    "tags": [
      "math",
      "science",
      "rectangle"
    ],
    "icon": "Square",
    "componentId": "math-tools",
    "mode": "rectangle",
    "featured": false
  },
  {
    "id": "logarithm-calculator",
    "name": "Logarithm Calculator (log10, ln, log2)",
    "category": "Math & Science",
    "description": "Compute common logarithm (base 10), natural log (ln), and binary log (base 2).",
    "tags": [
      "math",
      "science",
      "logarithm"
    ],
    "icon": "Calculator",
    "componentId": "math-tools",
    "mode": "logarithm",
    "featured": false
  },
  {
    "id": "z-score-calculator",
    "name": "Z-Score Normal Distribution Calculator",
    "category": "Math & Science",
    "description": "Calculate standard Z-score (x - μ) / σ and percentile ranking.",
    "tags": [
      "math",
      "science",
      "z-score"
    ],
    "icon": "BarChart2",
    "componentId": "math-tools",
    "mode": "z-score",
    "featured": false
  },
  {
    "id": "midpoint-calculator",
    "name": "2D Midpoint Coordinate Calculator",
    "category": "Math & Science",
    "description": "Find the midpoint coordinate ((x1+x2)/2, (y1+y2)/2) between two Cartesian points.",
    "tags": [
      "math",
      "science",
      "midpoint"
    ],
    "icon": "Compass",
    "componentId": "math-tools",
    "mode": "midpoint",
    "featured": false
  },
  {
    "id": "distance-2d-calculator",
    "name": "2D Euclidean Distance Calculator",
    "category": "Math & Science",
    "description": "Calculate straight-line distance d = √((x2-x1)² + (y2-y1)²) between two points.",
    "tags": [
      "math",
      "science",
      "distance-2d"
    ],
    "icon": "Ruler",
    "componentId": "math-tools",
    "mode": "distance-2d",
    "featured": false
  },
  {
    "id": "slope-calculator",
    "name": "Slope & Line Equation Calculator",
    "category": "Math & Science",
    "description": "Calculate slope m = (y2 - y1) / (x2 - x1) and equation y = mx + b.",
    "tags": [
      "math",
      "science",
      "slope"
    ],
    "icon": "TrendingUp",
    "componentId": "math-tools",
    "mode": "slope",
    "featured": false
  },
  {
    "id": "speed-distance-time",
    "name": "Speed, Distance & Time Calculator",
    "category": "Math & Science",
    "description": "Solve for speed (v = d/t), distance (d = vt), or time (t = d/v).",
    "tags": [
      "math",
      "science",
      "speed-dist-time"
    ],
    "icon": "Gauge",
    "componentId": "math-tools",
    "mode": "speed-dist-time",
    "featured": false
  },
  {
    "id": "density-mass-volume",
    "name": "Density, Mass & Volume Calculator",
    "category": "Math & Science",
    "description": "Calculate physical material density ρ = m / V, mass, or volume.",
    "tags": [
      "math",
      "science",
      "density"
    ],
    "icon": "Box",
    "componentId": "math-tools",
    "mode": "density",
    "featured": false
  },
  {
    "id": "work-power-energy-calculator",
    "name": "Work & Mechanical Power Calculator",
    "category": "Math & Science",
    "description": "Calculate physical work W = F · d and power output P = W / t in Watts.",
    "tags": [
      "math",
      "science",
      "work-power"
    ],
    "icon": "Zap",
    "componentId": "math-tools",
    "mode": "work-power",
    "featured": false
  },
  {
    "id": "scientific-calculator",
    "name": "Scientific Calculator",
    "category": "Math & Science",
    "description": "Full scientific calculator with trigonometric (sin, cos, tan), logarithmic, exponential, and memory functions.",
    "tags": [
      "calculator",
      "scientific",
      "math",
      "trig",
      "log"
    ],
    "icon": "Calculator",
    "componentId": "scientific-calc",
    "featured": true
  },
  {
    "id": "dice-roller",
    "name": "Virtual Dice Roller",
    "category": "Math & Science",
    "description": "Roll tabletop gaming dice (d4, d6, d8, d10, d12, d20, d100) with modifier sum and roll history log.",
    "tags": [
      "dice",
      "dnd",
      "roller",
      "d20",
      "d6",
      "games"
    ],
    "icon": "Dice5",
    "componentId": "dice-tool",
    "featured": true
  },
  {
    "id": "simple-interest-calculator",
    "name": "Simple Interest Calculator",
    "category": "Finance & Money",
    "description": "Calculate principal, rate, time, and accrued simple interest (I = P · r · t).",
    "tags": [
      "finance",
      "money",
      "simple-interest",
      "calculator"
    ],
    "icon": "DollarSign",
    "componentId": "finance-tools",
    "mode": "simple-interest"
  },
  {
    "id": "discount-sale-calculator",
    "name": "Discount & Sale Price Calculator",
    "category": "Finance & Money",
    "description": "Calculate discounted sale price, dollar savings, and final price after coupons.",
    "tags": [
      "finance",
      "money",
      "discount",
      "calculator"
    ],
    "icon": "Tag",
    "componentId": "finance-tools",
    "mode": "discount"
  },
  {
    "id": "sales-tax-vat-calculator",
    "name": "Sales Tax / VAT / GST Calculator",
    "category": "Finance & Money",
    "description": "Add or reverse tax from gross or net prices with custom tax rates.",
    "tags": [
      "finance",
      "money",
      "sales-tax",
      "calculator"
    ],
    "icon": "Percent",
    "componentId": "finance-tools",
    "mode": "sales-tax"
  },
  {
    "id": "profit-margin-markup",
    "name": "Profit Margin & Markup Calculator",
    "category": "Finance & Money",
    "description": "Compute cost, selling price, gross profit margin %, and markup percentage.",
    "tags": [
      "finance",
      "money",
      "margin-markup",
      "calculator"
    ],
    "icon": "Briefcase",
    "componentId": "finance-tools",
    "mode": "margin-markup"
  },
  {
    "id": "break-even-calculator",
    "name": "Break-Even Point Calculator",
    "category": "Finance & Money",
    "description": "Determine units and revenue required to cover fixed and variable business costs.",
    "tags": [
      "finance",
      "money",
      "break-even",
      "calculator"
    ],
    "icon": "Target",
    "componentId": "finance-tools",
    "mode": "break-even"
  },
  {
    "id": "investment-roi-calculator",
    "name": "ROI (Return on Investment) Calculator",
    "category": "Finance & Money",
    "description": "Calculate total gain, percentage return on investment, and annualized ROI.",
    "tags": [
      "finance",
      "money",
      "roi",
      "calculator"
    ],
    "icon": "TrendingUp",
    "componentId": "finance-tools",
    "mode": "roi"
  },
  {
    "id": "inflation-calculator",
    "name": "Inflation Impact Calculator",
    "category": "Finance & Money",
    "description": "Calculate how purchasing power erodes over years at given inflation rates.",
    "tags": [
      "finance",
      "money",
      "inflation",
      "calculator"
    ],
    "icon": "TrendingDown",
    "componentId": "finance-tools",
    "mode": "inflation"
  },
  {
    "id": "retirement-savings-planner",
    "name": "Retirement Savings Planner",
    "category": "Finance & Money",
    "description": "Estimate required nest egg, future portfolio value, and monthly retirement withdrawal budget.",
    "tags": [
      "finance",
      "money",
      "retirement",
      "calculator"
    ],
    "icon": "Award",
    "componentId": "finance-tools",
    "mode": "retirement"
  },
  {
    "id": "salary-to-hourly-converter",
    "name": "Salary to Hourly Wage Converter",
    "category": "Finance & Money",
    "description": "Convert annual salary into equivalent hourly, daily, weekly, and monthly pay rates.",
    "tags": [
      "finance",
      "money",
      "salary-hourly",
      "calculator"
    ],
    "icon": "CreditCard",
    "componentId": "finance-tools",
    "mode": "salary-hourly"
  },
  {
    "id": "unit-price-comparator",
    "name": "Unit Price Best-Value Comparator",
    "category": "Finance & Money",
    "description": "Compare two items with different sizes and prices to identify the cheapest unit price.",
    "tags": [
      "finance",
      "money",
      "unit-price",
      "calculator"
    ],
    "icon": "ShoppingBag",
    "componentId": "finance-tools",
    "mode": "unit-price"
  },
  {
    "id": "fuel-cost-trip-calculator",
    "name": "Trip Fuel Cost Calculator",
    "category": "Finance & Money",
    "description": "Estimate road trip fuel expenses based on distance, vehicle MPG, and fuel price per gallon/liter.",
    "tags": [
      "finance",
      "money",
      "fuel-trip",
      "calculator"
    ],
    "icon": "Car",
    "componentId": "finance-tools",
    "mode": "fuel-trip"
  },
  {
    "id": "rule-of-72-calculator",
    "name": "Rule of 72 Doubling Time Calculator",
    "category": "Finance & Money",
    "description": "Estimate how many years it will take to double your investment at a fixed annual return rate.",
    "tags": [
      "finance",
      "money",
      "rule-of-72",
      "calculator"
    ],
    "icon": "Clock",
    "componentId": "finance-tools",
    "mode": "rule-of-72"
  },
  {
    "id": "emergency-fund-calculator",
    "name": "Emergency Fund Target Calculator",
    "category": "Finance & Money",
    "description": "Calculate 3 to 6 months of living expenses reserve fund recommendation.",
    "tags": [
      "finance",
      "money",
      "emergency-fund",
      "calculator"
    ],
    "icon": "ShieldCheck",
    "componentId": "finance-tools",
    "mode": "emergency-fund"
  },
  {
    "id": "freelance-hourly-rate-calculator",
    "name": "Freelance Billing Rate Calculator",
    "category": "Finance & Money",
    "description": "Calculate minimum hourly billable rate from desired income and billable hours.",
    "tags": [
      "finance",
      "money",
      "freelance-rate",
      "calculator"
    ],
    "icon": "Briefcase",
    "componentId": "finance-tools",
    "mode": "freelance-rate"
  },
  {
    "id": "50-30-20-budget-calculator",
    "name": "50/30/20 Monthly Budget Calculator",
    "category": "Finance & Money",
    "description": "Allocate monthly take-home income into 50% Needs, 30% Wants, and 20% Savings.",
    "tags": [
      "finance",
      "money",
      "budget-50-30-20",
      "calculator"
    ],
    "icon": "PieChart",
    "componentId": "finance-tools",
    "mode": "budget-50-30-20"
  },
  {
    "id": "credit-card-payoff-calculator",
    "name": "Credit Card Debt Payoff Calculator",
    "category": "Finance & Money",
    "description": "Calculate total months and interest payments to pay off credit card balances.",
    "tags": [
      "finance",
      "money",
      "credit-card-payoff",
      "calculator"
    ],
    "icon": "CreditCard",
    "componentId": "finance-tools",
    "mode": "credit-card-payoff"
  },
  {
    "id": "net-worth-calculator",
    "name": "Personal Net Worth Calculator",
    "category": "Finance & Money",
    "description": "Sum total assets vs total liabilities to track personal financial net worth.",
    "tags": [
      "finance",
      "money",
      "net-worth",
      "calculator"
    ],
    "icon": "DollarSign",
    "componentId": "finance-tools",
    "mode": "net-worth"
  },
  {
    "id": "recurring-subscription-auditor",
    "name": "Recurring Subscription Auditor",
    "category": "Finance & Money",
    "description": "Audit monthly and annual expenditures on digital streaming and SaaS subscriptions.",
    "tags": [
      "finance",
      "money",
      "subscriptions",
      "calculator"
    ],
    "icon": "Receipt",
    "componentId": "finance-tools",
    "mode": "subscriptions"
  },
  {
    "id": "loan-mortgage-calculator",
    "name": "Loan & Mortgage EMI Calculator",
    "category": "Finance & Money",
    "description": "Calculate monthly loan EMI payments, total interest paid, total payment, and detailed amortization breakdown.",
    "tags": [
      "loan",
      "mortgage",
      "emi",
      "finance",
      "interest",
      "amortization"
    ],
    "icon": "Home",
    "componentId": "loan-calculator",
    "featured": true
  },
  {
    "id": "compound-interest-calculator",
    "name": "Compound Interest Calculator",
    "category": "Finance & Money",
    "description": "Forecast investment growth over time with compounding frequencies and regular monthly deposits.",
    "tags": [
      "compound interest",
      "investment",
      "savings",
      "growth",
      "money"
    ],
    "icon": "TrendingUp",
    "componentId": "compound-interest-tool",
    "featured": true
  },
  {
    "id": "tip-and-split-calculator",
    "name": "Tip & Bill Splitter Calculator",
    "category": "Finance & Money",
    "description": "Calculate tip percentage, tax, and split total bill evenly among party guests.",
    "tags": [
      "tip",
      "bill",
      "split",
      "restaurant",
      "dining"
    ],
    "icon": "Receipt",
    "componentId": "tip-calculator",
    "featured": true
  },
  {
    "id": "unix-timestamp-converter",
    "name": "Unix Timestamp Converter",
    "category": "Date & Time",
    "description": "Convert epoch seconds/milliseconds to human-readable ISO/UTC dates and dates to Unix timestamps.",
    "tags": [
      "date",
      "time",
      "timestamp"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "timestamp",
    "featured": true
  },
  {
    "id": "date-difference-calculator",
    "name": "Date Difference Calculator",
    "category": "Date & Time",
    "description": "Calculate exact years, months, weeks, days, hours, and minutes between two calendar dates.",
    "tags": [
      "date",
      "time",
      "date-diff"
    ],
    "icon": "Calendar",
    "componentId": "datetime-tools",
    "mode": "date-diff",
    "featured": false
  },
  {
    "id": "date-add-subtract",
    "name": "Add or Subtract Date Calculator",
    "category": "Date & Time",
    "description": "Add or subtract days, weeks, months, or years from any date to find the target date.",
    "tags": [
      "date",
      "time",
      "date-add"
    ],
    "icon": "CalendarPlus",
    "componentId": "datetime-tools",
    "mode": "date-add",
    "featured": false
  },
  {
    "id": "age-calculator",
    "name": "Chronological Age Calculator",
    "category": "Date & Time",
    "description": "Calculate your exact age in years, months, days, total hours, minutes, and seconds lived.",
    "tags": [
      "date",
      "time",
      "age"
    ],
    "icon": "UserCheck",
    "componentId": "datetime-tools",
    "mode": "age",
    "featured": true
  },
  {
    "id": "business-days-calculator",
    "name": "Work / Business Days Calculator",
    "category": "Date & Time",
    "description": "Count business days between dates excluding Saturdays and Sundays.",
    "tags": [
      "date",
      "time",
      "business-days"
    ],
    "icon": "Briefcase",
    "componentId": "datetime-tools",
    "mode": "business-days",
    "featured": false
  },
  {
    "id": "leap-year-checker",
    "name": "Leap Year Checker",
    "category": "Date & Time",
    "description": "Check whether any Gregorian calendar year is a leap year with rule explanation.",
    "tags": [
      "date",
      "time",
      "leap-year"
    ],
    "icon": "HelpCircle",
    "componentId": "datetime-tools",
    "mode": "leap-year",
    "featured": false
  },
  {
    "id": "day-of-week-finder",
    "name": "Day of Week Finder",
    "category": "Date & Time",
    "description": "Find what day of the week any historical or future date falls on.",
    "tags": [
      "date",
      "time",
      "day-of-week"
    ],
    "icon": "Calendar",
    "componentId": "datetime-tools",
    "mode": "day-of-week",
    "featured": false
  },
  {
    "id": "time-card-hours-calculator",
    "name": "Time Card & Work Hours Calculator",
    "category": "Date & Time",
    "description": "Compute daily total work hours, unpaid lunch breaks, and gross weekly pay.",
    "tags": [
      "date",
      "time",
      "time-card"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "time-card",
    "featured": false
  },
  {
    "id": "seconds-to-hms",
    "name": "Seconds to Hours, Minutes, Seconds",
    "category": "Date & Time",
    "description": "Convert large numbers of seconds into hh:mm:ss format.",
    "tags": [
      "date",
      "time",
      "sec-to-hms"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "sec-to-hms",
    "featured": false
  },
  {
    "id": "hms-to-seconds",
    "name": "HH:MM:SS to Seconds Converter",
    "category": "Date & Time",
    "description": "Convert hours, minutes, and seconds input into total integer seconds.",
    "tags": [
      "date",
      "time",
      "hms-to-sec"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "hms-to-sec",
    "featured": false
  },
  {
    "id": "minutes-to-hours-minutes",
    "name": "Minutes to Hours and Minutes",
    "category": "Date & Time",
    "description": "Convert raw minutes (e.g. 175 mins) to hours and minutes (2h 55m).",
    "tags": [
      "date",
      "time",
      "min-to-hm"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "min-to-hm",
    "featured": false
  },
  {
    "id": "decimal-hours-to-time",
    "name": "Decimal Hours to HH:MM Converter",
    "category": "Date & Time",
    "description": "Convert decimal hours (e.g. 7.75 hrs) into clock time (7 hours 45 minutes).",
    "tags": [
      "date",
      "time",
      "dec-to-time"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "dec-to-time",
    "featured": false
  },
  {
    "id": "time-to-decimal-hours",
    "name": "HH:MM to Decimal Hours Converter",
    "category": "Date & Time",
    "description": "Convert standard hours and minutes into decimal hours for payroll.",
    "tags": [
      "date",
      "time",
      "time-to-dec"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "time-to-dec",
    "featured": false
  },
  {
    "id": "days-in-month-calculator",
    "name": "Days in Month Calculator",
    "category": "Date & Time",
    "description": "Check number of days in any month of any year.",
    "tags": [
      "date",
      "time",
      "days-in-month"
    ],
    "icon": "Calendar",
    "componentId": "datetime-tools",
    "mode": "days-in-month",
    "featured": false
  },
  {
    "id": "iso-week-number-tool",
    "name": "ISO 8601 Week Number Finder",
    "category": "Date & Time",
    "description": "Find the exact ISO week number (1-53) and day of the year for any date.",
    "tags": [
      "date",
      "time",
      "iso-week"
    ],
    "icon": "Calendar",
    "componentId": "datetime-tools",
    "mode": "iso-week",
    "featured": false
  },
  {
    "id": "military-time-converter",
    "name": "12-Hour to 24-Hour Military Time",
    "category": "Date & Time",
    "description": "Convert between 12-hour AM/PM and standard 24-hour military clock time.",
    "tags": [
      "date",
      "time",
      "military-time"
    ],
    "icon": "Clock",
    "componentId": "datetime-tools",
    "mode": "military-time",
    "featured": false
  },
  {
    "id": "century-finder-tool",
    "name": "Century & Millennium Finder",
    "category": "Date & Time",
    "description": "Determine exactly which century (e.g. 21st century) and millennium any year belongs to.",
    "tags": [
      "date",
      "time",
      "century"
    ],
    "icon": "Calendar",
    "componentId": "datetime-tools",
    "mode": "century",
    "featured": false
  },
  {
    "id": "next-birthday-countdown",
    "name": "Next Birthday Countdown Clock",
    "category": "Date & Time",
    "description": "Calculate how many days, hours, and minutes remain until your next birthday.",
    "tags": [
      "date",
      "time",
      "birthday-cd"
    ],
    "icon": "CalendarHeart",
    "componentId": "datetime-tools",
    "mode": "birthday-cd",
    "featured": false
  },
  {
    "id": "new-year-countdown",
    "name": "New Year Midnight Countdown",
    "category": "Date & Time",
    "description": "Real-time countdown timer to the arrival of the upcoming New Year midnight.",
    "tags": [
      "date",
      "time",
      "new-year-cd"
    ],
    "icon": "Sparkles",
    "componentId": "datetime-tools",
    "mode": "new-year-cd",
    "featured": false
  },
  {
    "id": "world-clock-meeting-planner",
    "name": "World Clock & Timezone Planner",
    "category": "Date & Time",
    "description": "View current live times across global timezones and schedule international meetings without friction.",
    "tags": [
      "world clock",
      "timezones",
      "meeting",
      "utc",
      "gmt"
    ],
    "icon": "Globe",
    "componentId": "world-clock-tool",
    "featured": true
  },
  {
    "id": "stopwatch-lap-timer",
    "name": "Stopwatch & Lap Timer",
    "category": "Date & Time",
    "description": "High precision millisecond stopwatch with split lap records and export.",
    "tags": [
      "stopwatch",
      "timer",
      "laps",
      "chronometer"
    ],
    "icon": "Timer",
    "componentId": "stopwatch-tool"
  },
  {
    "id": "countdown-timer",
    "name": "Countdown Timer with Sound",
    "category": "Date & Time",
    "description": "Customizable countdown timer with progress ring and sound alert upon completion.",
    "tags": [
      "timer",
      "countdown",
      "alarm",
      "chime"
    ],
    "icon": "Hourglass",
    "componentId": "timer-tool"
  },
  {
    "id": "pomodoro-timer",
    "name": "Pomodoro Productivity Timer",
    "category": "Date & Time",
    "description": "Structured 25-minute focus intervals and 5-minute restorative breaks with audio notifications.",
    "tags": [
      "pomodoro",
      "focus",
      "productivity",
      "study",
      "work"
    ],
    "icon": "CheckCircle2",
    "componentId": "pomodoro-tool",
    "featured": true
  },
  {
    "id": "color-palette-generator",
    "name": "Color Palette Harmonizer",
    "category": "Color & Design",
    "description": "Generate complementary, analogous, triadic, and monochromatic harmonic color palettes.",
    "tags": [
      "color",
      "design",
      "css",
      "palette"
    ],
    "icon": "Sliders",
    "componentId": "design-tools",
    "mode": "palette"
  },
  {
    "id": "css-box-shadow-generator",
    "name": "CSS Box Shadow Generator",
    "category": "Color & Design",
    "description": "Design smooth multi-layered CSS box shadows with blur, spread, offset, and color controls.",
    "tags": [
      "color",
      "design",
      "css",
      "shadow"
    ],
    "icon": "Square",
    "componentId": "design-tools",
    "mode": "shadow"
  },
  {
    "id": "css-glassmorphism-generator",
    "name": "CSS Glassmorphism Generator",
    "category": "Color & Design",
    "description": "Design frosted glass UI cards with backdrop-blur, opacity, border, and specular reflections.",
    "tags": [
      "color",
      "design",
      "css",
      "glassmorphism"
    ],
    "icon": "Layers",
    "componentId": "design-tools",
    "mode": "glassmorphism"
  },
  {
    "id": "css-border-radius-generator",
    "name": "Fancy 8-Point Border Radius Generator",
    "category": "Color & Design",
    "description": "Create modern organic blob shapes with 8-value CSS border-radius sliders.",
    "tags": [
      "color",
      "design",
      "css",
      "border-radius"
    ],
    "icon": "Circle",
    "componentId": "design-tools",
    "mode": "border-radius"
  },
  {
    "id": "color-shades-tints-generator",
    "name": "Color Shades & Tints Generator",
    "category": "Color & Design",
    "description": "Generate 10 lighter tints and 10 darker shades of any base hex color.",
    "tags": [
      "color",
      "design",
      "css",
      "shades-tints"
    ],
    "icon": "Grid",
    "componentId": "design-tools",
    "mode": "shades-tints"
  },
  {
    "id": "hex-to-rgba-converter",
    "name": "HEX to RGBA Converter",
    "category": "Color & Design",
    "description": "Convert HEX color with alpha opacity slider into valid CSS rgba() code.",
    "tags": [
      "color",
      "design",
      "css",
      "hex-rgba"
    ],
    "icon": "Type",
    "componentId": "design-tools",
    "mode": "hex-rgba"
  },
  {
    "id": "aspect-ratio-calculator",
    "name": "Aspect Ratio Calculator",
    "category": "Color & Design",
    "description": "Calculate corresponding width or height for standard and custom aspect ratios.",
    "tags": [
      "color",
      "design",
      "css",
      "aspect-ratio"
    ],
    "icon": "AspectRatio",
    "componentId": "design-tools",
    "mode": "aspect-ratio"
  },
  {
    "id": "css-clamp-calculator",
    "name": "CSS Clamp() Fluid Typography Generator",
    "category": "Color & Design",
    "description": "Calculate responsive clamp(min, val, max) values for seamless viewport font scaling.",
    "tags": [
      "color",
      "design",
      "css",
      "css-clamp"
    ],
    "icon": "Maximize2",
    "componentId": "design-tools",
    "mode": "css-clamp"
  },
  {
    "id": "color-picker-converter",
    "name": "Color Picker & Converter",
    "category": "Color & Design",
    "description": "Pick colors visually and convert across HEX, RGB, HSL, HSV, and CMYK color spaces.",
    "tags": [
      "color",
      "picker",
      "hex",
      "rgb",
      "hsl",
      "cmyk",
      "design"
    ],
    "icon": "Palette",
    "componentId": "color-picker-tool",
    "featured": true
  },
  {
    "id": "contrast-checker",
    "name": "WCAG Color Contrast Checker",
    "category": "Color & Design",
    "description": "Test foreground and background text contrast ratios against WCAG 2.1 AA and AAA accessibility standards.",
    "tags": [
      "contrast",
      "wcag",
      "accessibility",
      "a11y",
      "color"
    ],
    "icon": "Eye",
    "componentId": "contrast-tool",
    "featured": true
  },
  {
    "id": "css-gradient-generator",
    "name": "CSS Gradient Generator",
    "category": "Color & Design",
    "description": "Interactive visual linear, radial, and conic gradient designer with copyable CSS code.",
    "tags": [
      "gradient",
      "css",
      "background",
      "linear",
      "radial"
    ],
    "icon": "Maximize",
    "componentId": "gradient-tool",
    "featured": true
  },
  {
    "id": "image-format-converter",
    "name": "Client-Side Image Format Converter",
    "category": "Image & Media",
    "description": "Convert image files between PNG, JPEG, and WebP completely in-browser with zero uploads.",
    "tags": [
      "image",
      "photo",
      "convert"
    ],
    "icon": "Image",
    "componentId": "image-studio",
    "mode": "convert",
    "featured": true
  },
  {
    "id": "image-resizer",
    "name": "Image Resizer & Scaler",
    "category": "Image & Media",
    "description": "Scale image dimensions by pixel width/height or percentage with aspect ratio lock.",
    "tags": [
      "image",
      "photo",
      "resize"
    ],
    "icon": "Scaling",
    "componentId": "image-studio",
    "mode": "resize",
    "featured": false
  },
  {
    "id": "image-compressor",
    "name": "Image Compressor & Optimizer",
    "category": "Image & Media",
    "description": "Compress photo file size with adjustable JPEG/WebP quality slider and instant preview.",
    "tags": [
      "image",
      "photo",
      "compress"
    ],
    "icon": "FileArchive",
    "componentId": "image-studio",
    "mode": "compress",
    "featured": false
  },
  {
    "id": "image-filters-effects",
    "name": "Photo Filters & Color Effects",
    "category": "Image & Media",
    "description": "Apply grayscale, sepia, invert, vintage, brightness, and contrast effects to images.",
    "tags": [
      "image",
      "photo",
      "filter"
    ],
    "icon": "Sliders",
    "componentId": "image-studio",
    "mode": "filter",
    "featured": false
  },
  {
    "id": "image-watermark-tool",
    "name": "Image Watermark Tool",
    "category": "Image & Media",
    "description": "Add custom text copyright watermark with font size, opacity, and positioning controls.",
    "tags": [
      "image",
      "photo",
      "watermark"
    ],
    "icon": "Stamp",
    "componentId": "image-studio",
    "mode": "watermark",
    "featured": false
  },
  {
    "id": "privacy-blur-redactor",
    "name": "Privacy Blur & Redaction Tool",
    "category": "Image & Media",
    "description": "Blur or black out sensitive personal details, faces, and phone numbers in photos.",
    "tags": [
      "image",
      "photo",
      "redact"
    ],
    "icon": "EyeOff",
    "componentId": "image-studio",
    "mode": "redact",
    "featured": false
  },
  {
    "id": "meme-generator",
    "name": "Classic Meme Generator",
    "category": "Image & Media",
    "description": "Add classic Impact top and bottom text with black stroke outline to any photo or template.",
    "tags": [
      "meme",
      "generator",
      "humor",
      "fun",
      "impact font"
    ],
    "icon": "Smile",
    "componentId": "meme-tool",
    "featured": true
  },
  {
    "id": "canvas-whiteboard-doodle",
    "name": "Canvas Whiteboard & Sketchpad",
    "category": "Image & Media",
    "description": "Draw, sketch, annotate, and brainstorm on an interactive whiteboard with colors, brushes, and PNG export.",
    "tags": [
      "draw",
      "sketch",
      "whiteboard",
      "canvas",
      "paint"
    ],
    "icon": "PenTool",
    "componentId": "canvas-doodle",
    "featured": true
  },
  {
    "id": "audio-tone-generator",
    "name": "Web Audio Tone Generator",
    "category": "Image & Media",
    "description": "Generate continuous pure sine, square, sawtooth, and triangle audio soundwaves with custom Hz frequency.",
    "tags": [
      "audio",
      "tone",
      "sound",
      "frequency",
      "sine wave",
      "hertz"
    ],
    "icon": "Volume2",
    "componentId": "audio-tools",
    "mode": "tone"
  },
  {
    "id": "metronome-bpm",
    "name": "Audio Metronome BPM",
    "category": "Image & Media",
    "description": "Audible precision beat metronome with adjustable BPM tempo (40 - 240) and beats per measure.",
    "tags": [
      "metronome",
      "bpm",
      "tempo",
      "music",
      "rhythm"
    ],
    "icon": "Activity",
    "componentId": "audio-tools",
    "mode": "metronome"
  },
  {
    "id": "white-pink-noise-generator",
    "name": "White & Pink Noise Sleep Machine",
    "category": "Image & Media",
    "description": "Play soothing white noise, pink noise, and deep brown noise for sleep, concentration, and tinnitus relief.",
    "tags": [
      "white noise",
      "pink noise",
      "sleep",
      "relax",
      "focus",
      "audio"
    ],
    "icon": "CloudRain",
    "componentId": "audio-tools",
    "mode": "noise"
  },
  {
    "id": "local-scratchpad",
    "name": "Distraction-Free Scratchpad",
    "category": "Productivity",
    "description": "Quick notes and markdown scratchpad with live word count, auto-saved persistently in your browser.",
    "tags": [
      "notes",
      "scratchpad",
      "memo",
      "writing",
      "autosave"
    ],
    "icon": "FileEdit",
    "componentId": "scratchpad-tool",
    "featured": true
  },
  {
    "id": "todo-checklist",
    "name": "Interactive To-Do Checklist",
    "category": "Productivity",
    "description": "Add tasks, mark done, set priorities, and keep track of daily action items with local persistence.",
    "tags": [
      "todo",
      "checklist",
      "tasks",
      "planner",
      "organizer"
    ],
    "icon": "CheckSquare",
    "componentId": "todo-tool",
    "featured": true
  },
  {
    "id": "kanban-task-board",
    "name": "Mini Kanban Board",
    "category": "Productivity",
    "description": "Organize work into To Do, In Progress, and Completed columns with drag/move controls.",
    "tags": [
      "kanban",
      "tasks",
      "board",
      "agile",
      "trello"
    ],
    "icon": "Kanban",
    "componentId": "kanban-tool"
  },
  {
    "id": "daily-habit-tracker",
    "name": "Daily Habit Streak Tracker",
    "category": "Productivity",
    "description": "Track daily habits, check off completions, and maintain your streak counts day over day.",
    "tags": [
      "habits",
      "streaks",
      "goals",
      "routine",
      "self-improvement"
    ],
    "icon": "Flame",
    "componentId": "habit-tool"
  },
  {
    "id": "decision-wheel-picker",
    "name": "Decision Wheel & Random Picker",
    "category": "Productivity",
    "description": "Enter choices (what to eat, who goes first, where to travel) and spin the wheel for a fair random pick.",
    "tags": [
      "wheel",
      "random",
      "picker",
      "decision",
      "roulette"
    ],
    "icon": "PieChart",
    "componentId": "wheel-tool",
    "featured": true
  },
  {
    "id": "flashcard-study-deck",
    "name": "Flashcards Study Tool",
    "category": "Productivity",
    "description": "Create question/answer study cards, flip through the deck, and test your knowledge for exams.",
    "tags": [
      "flashcards",
      "study",
      "quiz",
      "learn",
      "cards"
    ],
    "icon": "BookOpen",
    "componentId": "flashcards-tool"
  },
  {
    "id": "digital-signature-pad",
    "name": "Digital Signature Pad",
    "category": "Productivity",
    "description": "Draw your signature smoothly with mouse or finger and download clean transparent PNG.",
    "tags": [
      "signature",
      "sign",
      "draw",
      "document",
      "png"
    ],
    "icon": "PenTool",
    "componentId": "signature-pad-tool",
    "featured": true
  },
  {
    "id": "typing-speed-test",
    "name": "Typing Speed (WPM) Benchmark",
    "category": "Productivity",
    "description": "Test your typing speed in Words Per Minute (WPM) with live accuracy percentage and error tracking.",
    "tags": [
      "typing",
      "wpm",
      "speed",
      "test",
      "keyboard"
    ],
    "icon": "Keyboard",
    "componentId": "typing-test-tool",
    "featured": true
  },
  {
    "id": "reaction-time-tester",
    "name": "Reaction Time Reflex Tester",
    "category": "Productivity",
    "description": "Click as fast as possible when the red screen turns green to measure your reflex latency in milliseconds.",
    "tags": [
      "reaction",
      "reflex",
      "speed",
      "benchmark",
      "test"
    ],
    "icon": "Zap",
    "componentId": "reaction-tool"
  },
  {
    "id": "bmi-calculator",
    "name": "BMI (Body Mass Index) Calculator",
    "category": "Productivity",
    "description": "Calculate BMI from metric or imperial height and weight with WHO health classification.",
    "tags": [
      "health",
      "fitness",
      "bmi"
    ],
    "icon": "Activity",
    "componentId": "health-tools",
    "mode": "bmi",
    "featured": true
  },
  {
    "id": "bmr-tdee-calculator",
    "name": "BMR & Daily Calorie Needs (TDEE)",
    "category": "Productivity",
    "description": "Calculate Basal Metabolic Rate and Total Daily Energy Expenditure (TDEE) based on activity level.",
    "tags": [
      "health",
      "fitness",
      "bmr"
    ],
    "icon": "Heart",
    "componentId": "health-tools",
    "mode": "bmr",
    "featured": false
  },
  {
    "id": "daily-water-intake-calculator",
    "name": "Daily Water Intake Target",
    "category": "Productivity",
    "description": "Calculate recommended daily water consumption based on body weight and workout duration.",
    "tags": [
      "health",
      "fitness",
      "water"
    ],
    "icon": "Droplet",
    "componentId": "health-tools",
    "mode": "water",
    "featured": false
  },
  {
    "id": "sleep-cycle-calculator",
    "name": "Sleep Cycle Calculator",
    "category": "Productivity",
    "description": "Calculate optimal wake-up or bedtime schedules based on natural 90-minute REM sleep cycles.",
    "tags": [
      "health",
      "fitness",
      "sleep"
    ],
    "icon": "Moon",
    "componentId": "health-tools",
    "mode": "sleep",
    "featured": false
  },
  {
    "id": "target-heart-rate-calculator",
    "name": "Target Heart Rate Training Zones",
    "category": "Productivity",
    "description": "Calculate warm-up, fat burn, aerobic, and peak heart rate training BPM zones from your age.",
    "tags": [
      "health",
      "fitness",
      "heart-rate"
    ],
    "icon": "HeartPulse",
    "componentId": "health-tools",
    "mode": "heart-rate",
    "featured": false
  },
  {
    "id": "calorie-deficit-calculator",
    "name": "Calorie Deficit Weight Loss Planner",
    "category": "Productivity",
    "description": "Calculate target daily calorie intake deficit for healthy weight milestones.",
    "tags": [
      "health",
      "fitness",
      "calorie-deficit"
    ],
    "icon": "Flame",
    "componentId": "health-tools",
    "mode": "calorie-deficit",
    "featured": false
  },
  {
    "id": "ip-cidr-subnet-calculator",
    "name": "IPv4 Subnet & CIDR Calculator",
    "category": "Productivity",
    "description": "Calculate network IP, broadcast address, subnet mask, usable host range, and total hosts for any CIDR.",
    "tags": [
      "network",
      "system",
      "cidr"
    ],
    "icon": "Network",
    "componentId": "network-tools",
    "mode": "cidr",
    "featured": true
  },
  {
    "id": "browser-system-diagnostics",
    "name": "Browser & Device Diagnostics",
    "category": "Productivity",
    "description": "Inspect live device memory, logical CPU cores, screen resolution, GPU renderer, and browser capabilities.",
    "tags": [
      "network",
      "system",
      "system"
    ],
    "icon": "Cpu",
    "componentId": "network-tools",
    "mode": "system",
    "featured": false
  },
  {
    "id": "ping-latency-tester",
    "name": "Browser Ping & Latency Tester",
    "category": "Productivity",
    "description": "Benchmark real HTTP round-trip latency to edge global CDNs directly from your browser.",
    "tags": [
      "network",
      "system",
      "latency"
    ],
    "icon": "Wifi",
    "componentId": "network-tools",
    "mode": "latency",
    "featured": false
  },
  {
    "id": "cheatsheet-git",
    "name": "Git Commands Cheatsheet",
    "category": "Cheatsheets",
    "description": "Quick reference for git checkout, branch, rebase, stash, cherry-pick, reset, and tags with copyable syntax.",
    "tags": [
      "cheatsheet",
      "reference",
      "git"
    ],
    "icon": "GitBranch",
    "componentId": "cheatsheet-view",
    "mode": "git",
    "featured": true
  },
  {
    "id": "cheatsheet-http-status",
    "name": "HTTP Status Codes Reference",
    "category": "Cheatsheets",
    "description": "Complete guide to all standard 1xx, 2xx, 3xx, 4xx, and 5xx HTTP response codes with explanations.",
    "tags": [
      "cheatsheet",
      "reference",
      "http-status"
    ],
    "icon": "Globe",
    "componentId": "cheatsheet-view",
    "mode": "http-status",
    "featured": true
  },
  {
    "id": "cheatsheet-regex",
    "name": "RegEx Cheatsheet & Tokens",
    "category": "Cheatsheets",
    "description": "Essential reference for regular expression syntax: character classes, lookarounds, quantifiers, and groups.",
    "tags": [
      "cheatsheet",
      "reference",
      "regex"
    ],
    "icon": "Search",
    "componentId": "cheatsheet-view",
    "mode": "regex",
    "featured": true
  },
  {
    "id": "cheatsheet-markdown",
    "name": "Markdown Syntax Cheatsheet",
    "category": "Cheatsheets",
    "description": "Full reference of Markdown syntax: headings, tables, links, blockquotes, task lists, and code blocks.",
    "tags": [
      "cheatsheet",
      "reference",
      "markdown"
    ],
    "icon": "FileText",
    "componentId": "cheatsheet-view",
    "mode": "markdown",
    "featured": false
  },
  {
    "id": "cheatsheet-linux-bash",
    "name": "Linux / Bash Terminal Cheatsheet",
    "category": "Cheatsheets",
    "description": "Crucial Linux shell commands for navigation, file management, permissions, grep, and process inspection.",
    "tags": [
      "cheatsheet",
      "reference",
      "linux"
    ],
    "icon": "Terminal",
    "componentId": "cheatsheet-view",
    "mode": "linux",
    "featured": true
  },
  {
    "id": "cheatsheet-sql",
    "name": "SQL Syntax & Queries Cheatsheet",
    "category": "Cheatsheets",
    "description": "Syntax and examples for SELECT, JOIN, GROUP BY, HAVING, subqueries, and window functions.",
    "tags": [
      "cheatsheet",
      "reference",
      "sql"
    ],
    "icon": "Database",
    "componentId": "cheatsheet-view",
    "mode": "sql",
    "featured": false
  },
  {
    "id": "cheatsheet-html5-tags",
    "name": "HTML5 Semantic Tags Reference",
    "category": "Cheatsheets",
    "description": "Complete dictionary of semantic HTML5 tags: article, section, nav, dialog, figure, and form elements.",
    "tags": [
      "cheatsheet",
      "reference",
      "html5"
    ],
    "icon": "FileCode2",
    "componentId": "cheatsheet-view",
    "mode": "html5",
    "featured": false
  },
  {
    "id": "cheatsheet-css-selectors",
    "name": "CSS Selectors & Combinators Guide",
    "category": "Cheatsheets",
    "description": "Quick reference for pseudo-classes (:nth-child, :is, :has, :not), attributes, and combinators.",
    "tags": [
      "cheatsheet",
      "reference",
      "css-selectors"
    ],
    "icon": "Palette",
    "componentId": "cheatsheet-view",
    "mode": "css-selectors",
    "featured": false
  },
  {
    "id": "cheatsheet-docker",
    "name": "Docker CLI Cheatsheet",
    "category": "Cheatsheets",
    "description": "Commands reference for docker run, exec, build, compose, volumes, networks, and cleanup.",
    "tags": [
      "cheatsheet",
      "reference",
      "docker"
    ],
    "icon": "Box",
    "componentId": "cheatsheet-view",
    "mode": "docker",
    "featured": false
  },
  {
    "id": "cheatsheet-common-ports",
    "name": "Common Network Ports Guide",
    "category": "Cheatsheets",
    "description": "Lookup common TCP/UDP ports: HTTP 80, HTTPS 443, SSH 22, DNS 53, MySQL 3306, Postgres 5432, Redis 6379.",
    "tags": [
      "cheatsheet",
      "reference",
      "ports"
    ],
    "icon": "Server",
    "componentId": "cheatsheet-view",
    "mode": "ports",
    "featured": false
  },
  {
    "id": "cheatsheet-ascii-table",
    "name": "ASCII Table & Control Codes",
    "category": "Cheatsheets",
    "description": "Complete 7-bit ASCII table from 0 to 127 with binary, hex, decimal, and character symbols.",
    "tags": [
      "cheatsheet",
      "reference",
      "ascii"
    ],
    "icon": "Binary",
    "componentId": "cheatsheet-view",
    "mode": "ascii",
    "featured": false
  },
  {
    "id": "cheatsheet-periodic-table",
    "name": "Periodic Table of Elements",
    "category": "Cheatsheets",
    "description": "Explore chemical elements with atomic number, atomic mass, symbol, electron configuration, and group category.",
    "tags": [
      "cheatsheet",
      "reference",
      "periodic-table"
    ],
    "icon": "Sparkles",
    "componentId": "cheatsheet-view",
    "mode": "periodic-table",
    "featured": true
  },
  {
    "id": "cheatsheet-mime-types",
    "name": "MIME Types Dictionary",
    "category": "Cheatsheets",
    "description": "Directory of common Content-Type MIME strings for web formats, audio, video, images, and fonts.",
    "tags": [
      "cheatsheet",
      "reference",
      "mime"
    ],
    "icon": "File",
    "componentId": "cheatsheet-view",
    "mode": "mime",
    "featured": false
  },
  {
    "id": "cheatsheet-iso-country-codes",
    "name": "ISO Country Codes Reference",
    "category": "Cheatsheets",
    "description": "Lookup ISO 3166-1 alpha-2, alpha-3 country codes, dialing codes, and capital cities.",
    "tags": [
      "cheatsheet",
      "reference",
      "country-codes"
    ],
    "icon": "Flag",
    "componentId": "cheatsheet-view",
    "mode": "country-codes",
    "featured": false
  },
  {
    "id": "cheatsheet-iso-currency-codes",
    "name": "ISO Currency Codes (4217)",
    "category": "Cheatsheets",
    "description": "Reference for world currency 3-letter codes, symbols ($, €, £, ¥, ₹), and official country names.",
    "tags": [
      "cheatsheet",
      "reference",
      "currency-codes"
    ],
    "icon": "DollarSign",
    "componentId": "cheatsheet-view",
    "mode": "currency-codes",
    "featured": false
  },
  {
    "id": "cheatsheet-vim",
    "name": "Vim Keybindings Cheatsheet",
    "category": "Cheatsheets",
    "description": "Vim modal editor shortcuts for navigation, insertion, visual mode, search, buffers, and window splits.",
    "tags": [
      "cheatsheet",
      "reference",
      "vim"
    ],
    "icon": "Terminal",
    "componentId": "cheatsheet-view",
    "mode": "vim",
    "featured": false
  },
  {
    "id": "cheatsheet-tmux",
    "name": "Tmux Multiplexer Cheatsheet",
    "category": "Cheatsheets",
    "description": "Tmux session, window, and pane management keybindings.",
    "tags": [
      "cheatsheet",
      "reference",
      "tmux"
    ],
    "icon": "Layers",
    "componentId": "cheatsheet-view",
    "mode": "tmux",
    "featured": false
  },
  {
    "id": "cheatsheet-dns-records",
    "name": "DNS Record Types Guide",
    "category": "Cheatsheets",
    "description": "Reference guide to A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, SOA, and CAA records.",
    "tags": [
      "cheatsheet",
      "reference",
      "dns"
    ],
    "icon": "Globe",
    "componentId": "cheatsheet-view",
    "mode": "dns",
    "featured": false
  },
  {
    "id": "cheatsheet-javascript",
    "name": "JavaScript Methods Cheatsheet",
    "category": "Cheatsheets",
    "description": "Interactive guide to Array (map, filter, reduce), Object, and Promise methods.",
    "tags": [
      "cheatsheet",
      "reference",
      "javascript"
    ],
    "icon": "Code2",
    "componentId": "cheatsheet-view",
    "mode": "javascript",
    "featured": false
  },
  {
    "id": "cheatsheet-python",
    "name": "Python Idioms & Cheat Sheet",
    "category": "Cheatsheets",
    "description": "Essential Python syntax: list comprehensions, dict slicing, lambdas, and decorators.",
    "tags": [
      "cheatsheet",
      "reference",
      "python"
    ],
    "icon": "FileCode",
    "componentId": "cheatsheet-view",
    "mode": "python",
    "featured": false
  },
  {
    "id": "cheatsheet-http-headers",
    "name": "HTTP Headers Reference",
    "category": "Cheatsheets",
    "description": "Common standard HTTP request and response headers with directives.",
    "tags": [
      "cheatsheet",
      "reference",
      "http-headers"
    ],
    "icon": "Server",
    "componentId": "cheatsheet-view",
    "mode": "http-headers",
    "featured": false
  },
  {
    "id": "cheatsheet-physics-constants",
    "name": "Fundamental Physics Constants",
    "category": "Cheatsheets",
    "description": "Reference for speed of light, Planck constant, gravitational constant, elementary charge, and Boltzmann constant.",
    "tags": [
      "cheatsheet",
      "reference",
      "physics-constants"
    ],
    "icon": "Sparkles",
    "componentId": "cheatsheet-view",
    "mode": "physics-constants",
    "featured": false
  },
  {
    "id": "cheatsheet-math-formulas",
    "name": "Mathematical Formulas Reference",
    "category": "Cheatsheets",
    "description": "Key formulas for algebra, quadratic roots, trigonometry identities, and geometry.",
    "tags": [
      "cheatsheet",
      "reference",
      "math-formulas"
    ],
    "icon": "Calculator",
    "componentId": "cheatsheet-view",
    "mode": "math-formulas",
    "featured": false
  },
  {
    "id": "text-center-align",
    "name": "Center Align Text",
    "category": "Text & Content",
    "description": "Center-align each line of text within a fixed character column width.",
    "tags": [
      "text",
      "align",
      "center",
      "format"
    ],
    "icon": "AlignCenter",
    "componentId": "text-tools",
    "mode": "center-align"
  },
  {
    "id": "text-right-align",
    "name": "Right Align Text",
    "category": "Text & Content",
    "description": "Right-align each line of text to a fixed column width.",
    "tags": [
      "text",
      "align",
      "right",
      "format"
    ],
    "icon": "AlignRight",
    "componentId": "text-tools",
    "mode": "right-align"
  },
  {
    "id": "remove-leading-spaces",
    "name": "Remove Leading Spaces",
    "category": "Text & Content",
    "description": "Strip only leading indentations and whitespace from beginning of lines.",
    "tags": [
      "text",
      "clean",
      "indent"
    ],
    "icon": "Minimize2",
    "componentId": "text-tools",
    "mode": "leading-spaces"
  },
  {
    "id": "remove-trailing-spaces",
    "name": "Remove Trailing Spaces",
    "category": "Text & Content",
    "description": "Strip only trailing whitespace from end of lines.",
    "tags": [
      "text",
      "clean",
      "trailing"
    ],
    "icon": "Minimize2",
    "componentId": "text-tools",
    "mode": "trailing-spaces"
  },
  {
    "id": "meters-to-miles",
    "name": "Meters to Statute Miles",
    "category": "Unit Converters",
    "description": "Convert metric meters to statute miles (1 m ≈ 0.000621371 mi).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "meters-to-miles"
  },
  {
    "id": "miles-to-meters",
    "name": "Statute Miles to Meters",
    "category": "Unit Converters",
    "description": "Convert statute miles into metric meters (1 mi = 1609.344 m).",
    "tags": [
      "converter",
      "length",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "miles-to-meters"
  },
  {
    "id": "stone-to-lbs",
    "name": "Stones to Pounds Converter",
    "category": "Unit Converters",
    "description": "Convert imperial stones to pounds (1 stone = 14 lbs).",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "stone-to-lbs"
  },
  {
    "id": "lbs-to-stone",
    "name": "Pounds to Stones Converter",
    "category": "Unit Converters",
    "description": "Convert pounds to British stones and pounds.",
    "tags": [
      "converter",
      "weight",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "lbs-to-stone"
  },
  {
    "id": "atm-to-bar",
    "name": "Atmospheres to Bar Converter",
    "category": "Unit Converters",
    "description": "Convert standard atmospheres to Bar (1 atm = 1.01325 bar).",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "atm-to-bar"
  },
  {
    "id": "bar-to-atm",
    "name": "Bar to Atmospheres Converter",
    "category": "Unit Converters",
    "description": "Convert Bar to standard physical atmospheres.",
    "tags": [
      "converter",
      "pressure",
      "quick-convert",
      "units"
    ],
    "icon": "ArrowRightLeft",
    "componentId": "quick-unit-tool",
    "mode": "bar-to-atm"
  },
  {
    "id": "cost-of-delay-calculator",
    "name": "Cost of Delay Investment Calculator",
    "category": "Finance & Money",
    "description": "Estimate how much compound wealth is lost by delaying retirement investments by 1, 3, or 5 years.",
    "tags": [
      "finance",
      "investment",
      "retirement",
      "delay"
    ],
    "icon": "Clock",
    "componentId": "finance-tools",
    "mode": "cost-of-delay"
  },
  {
    "id": "present-value-annuity",
    "name": "Present Value of Annuity Calculator",
    "category": "Finance & Money",
    "description": "Calculate present discounted cash lump sum value of future periodic payments.",
    "tags": [
      "finance",
      "annuity",
      "present value",
      "investing"
    ],
    "icon": "DollarSign",
    "componentId": "finance-tools",
    "mode": "pv-annuity"
  },
  {
    "id": "future-value-annuity",
    "name": "Future Value of Annuity Calculator",
    "category": "Finance & Money",
    "description": "Calculate future accumulated value of regular periodic savings payments.",
    "tags": [
      "finance",
      "annuity",
      "future value",
      "investing"
    ],
    "icon": "TrendingUp",
    "componentId": "finance-tools",
    "mode": "fv-annuity"
  },
  {
    "id": "markup-to-margin-converter",
    "name": "Markup to Margin Converter",
    "category": "Finance & Money",
    "description": "Convert markup % to gross profit margin % and vice versa with live formula.",
    "tags": [
      "finance",
      "margin",
      "markup",
      "business"
    ],
    "icon": "Percent",
    "componentId": "finance-tools",
    "mode": "markup-margin"
  },
  {
    "id": "time-until-weekend",
    "name": "Weekend Countdown Clock",
    "category": "Date & Time",
    "description": "Live countdown timer until Friday 5:00 PM for celebrating the weekend.",
    "tags": [
      "weekend",
      "countdown",
      "time",
      "friday"
    ],
    "icon": "PartyPopper",
    "componentId": "datetime-tools",
    "mode": "weekend-cd"
  },
  {
    "id": "cheatsheet-keyboard-keys",
    "name": "Keyboard Event Keys Reference",
    "category": "Cheatsheets",
    "description": "Interactive reference of DOM KeyboardEvent key strings, codes, and legacy which values.",
    "tags": [
      "keyboard",
      "event",
      "keys",
      "keycode",
      "dom"
    ],
    "icon": "Keyboard",
    "componentId": "cheatsheet-view",
    "mode": "keyboard-keys"
  }
];

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
