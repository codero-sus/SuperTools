export interface CheatsheetItem {
  title: string;
  code?: string;
  desc: string;
  example?: string;
  tag?: string;
}

export interface CheatsheetSection {
  sectionTitle: string;
  items: CheatsheetItem[];
}

export const CHEATSHEETS: Record<string, { title: string; subtitle: string; sections: CheatsheetSection[] }> = {
  git: {
    title: 'Git Commands Cheatsheet',
    subtitle: 'Comprehensive guide to Git version control workflows, branching, commits, and remote management.',
    sections: [
      {
        sectionTitle: 'Getting Started & Setup',
        items: [
          { title: 'Initialize Repository', code: 'git init', desc: 'Create a new local Git repository in current directory.' },
          { title: 'Clone Repository', code: 'git clone <url>', desc: 'Clone an existing remote repository to local machine.' },
          { title: 'Set Global Name', code: 'git config --global user.name "Your Name"', desc: 'Configure author name for all commits.' },
          { title: 'Set Global Email', code: 'git config --global user.email "you@example.com"', desc: 'Configure author email for commits.' }
        ]
      },
      {
        sectionTitle: 'Staging & Committing',
        items: [
          { title: 'Check Status', code: 'git status', desc: 'Show modified, untracked, and staged files.' },
          { title: 'Stage Single File', code: 'git add <filename>', desc: 'Stage specific file for next commit.' },
          { title: 'Stage All Files', code: 'git add .', desc: 'Stage all modified and new files in project.' },
          { title: 'Commit with Message', code: 'git commit -m "feat: descriptive commit message"', desc: 'Commit staged changes with message.' },
          { title: 'Amend Last Commit', code: 'git commit --amend --no-edit', desc: 'Add staged changes into previous commit without changing message.' },
          { title: 'View Commit History', code: 'git log --oneline --graph --decorate', desc: 'Display condensed visual tree of recent commits.' }
        ]
      },
      {
        sectionTitle: 'Branching & Merging',
        items: [
          { title: 'List Branches', code: 'git branch -a', desc: 'List local and remote tracking branches.' },
          { title: 'Create Branch', code: 'git branch <branch-name>', desc: 'Create new branch without switching to it.' },
          { title: 'Switch Branch', code: 'git switch <branch-name>', desc: 'Switch working branch (or git checkout <branch>).' },
          { title: 'Create & Switch', code: 'git switch -c <new-branch>', desc: 'Create branch and switch to it immediately.' },
          { title: 'Merge Branch', code: 'git merge <branch-name>', desc: 'Merge specified branch into current active branch.' },
          { title: 'Rebase Branch', code: 'git rebase <target-branch>', desc: 'Replay current branch commits onto base of target branch.' },
          { title: 'Delete Local Branch', code: 'git branch -d <branch-name>', desc: 'Safely delete a merged branch (-D to force delete).' }
        ]
      },
      {
        sectionTitle: 'Stashing & Undoing Changes',
        items: [
          { title: 'Stash Working Changes', code: 'git stash', desc: 'Temporarily shelve all modified tracked files.' },
          { title: 'Restore Stash', code: 'git stash pop', desc: 'Restore most recently stashed changes and drop from stash stack.' },
          { title: 'Discard File Changes', code: 'git restore <file>', desc: 'Discard uncommitted changes in working directory.' },
          { title: 'Unstage File', code: 'git restore --staged <file>', desc: 'Remove file from staging area back to working directory.' },
          { title: 'Soft Reset', code: 'git reset --soft HEAD~1', desc: 'Undo last commit but keep changes staged.' },
          { title: 'Hard Reset (Warning)', code: 'git reset --hard HEAD~1', desc: 'Completely discard last commit and working changes.' }
        ]
      }
    ]
  },

  'http-status': {
    title: 'HTTP Status Codes Directory',
    subtitle: 'Reference of standard HTTP response status codes categorized by response class.',
    sections: [
      {
        sectionTitle: '2xx Success',
        items: [
          { title: '200 OK', code: '200 OK', desc: 'Standard response for successful HTTP requests with payload body.' },
          { title: '201 Created', code: '201 Created', desc: 'Request fulfilled and resulted in a new resource created (typical for POST).' },
          { title: '202 Accepted', code: '202 Accepted', desc: 'Request accepted for background processing, but processing not completed.' },
          { title: '204 No Content', code: '204 No Content', desc: 'Request succeeded but response has no body content (common for DELETE/PUT).' }
        ]
      },
      {
        sectionTitle: '3xx Redirection',
        items: [
          { title: '301 Moved Permanently', code: '301 Moved Permanently', desc: 'Target resource has been permanently assigned a new URI. Search engines update index.' },
          { title: '302 Found (Temporary)', code: '302 Found', desc: 'Target resource resides temporarily under a different URI.' },
          { title: '304 Not Modified', code: '304 Not Modified', desc: 'Client cached version is still fresh (If-None-Match ETag or If-Modified-Since).' },
          { title: '307 Temporary Redirect', code: '307 Temporary Redirect', desc: 'Redirect must preserve original HTTP method (e.g. POST remains POST).' },
          { title: '308 Permanent Redirect', code: '308 Permanent Redirect', desc: 'Permanent redirect preserving HTTP method without downgrading to GET.' }
        ]
      },
      {
        sectionTitle: '4xx Client Errors',
        items: [
          { title: '400 Bad Request', code: '400 Bad Request', desc: 'Server cannot parse request due to malformed syntax, invalid framing, or deceptive routing.' },
          { title: '401 Unauthorized', code: '401 Unauthorized', desc: 'Authentication required. Missing, invalid, or expired credentials.' },
          { title: '403 Forbidden', code: '403 Forbidden', desc: 'Server understood request but refuses to authorize it (insufficient permissions).' },
          { title: '404 Not Found', code: '404 Not Found', desc: 'The requested resource could not be located on the server.' },
          { title: '405 Method Not Allowed', code: '405 Method Not Allowed', desc: 'HTTP verb (GET, POST, DELETE) not supported for target resource.' },
          { title: '409 Conflict', code: '409 Conflict', desc: 'Request conflicts with current state of resource (e.g. duplicate key or version mismatch).' },
          { title: '422 Unprocessable Entity', code: '422 Unprocessable Content', desc: 'Syntactically valid request body contains semantic validation errors.' },
          { title: '429 Too Many Requests', code: '429 Too Many Requests', desc: 'Client has exceeded rate limit thresholds within a given time period.' }
        ]
      },
      {
        sectionTitle: '5xx Server Errors',
        items: [
          { title: '500 Internal Server Error', code: '500 Internal Server Error', desc: 'Generic unexpected server exception or crash during request execution.' },
          { title: '502 Bad Gateway', code: '502 Bad Gateway', desc: 'Server acting as gateway/proxy received an invalid response from upstream backend.' },
          { title: '503 Service Unavailable', code: '503 Service Unavailable', desc: 'Server temporarily overloaded or down for scheduled maintenance.' },
          { title: '504 Gateway Timeout', code: '504 Gateway Timeout', desc: 'Gateway did not receive timely response from upstream application server.' }
        ]
      }
    ]
  },

  regex: {
    title: 'Regular Expressions (RegEx) Guide',
    subtitle: 'Quick reference of pattern matching tokens, anchors, character sets, and quantifiers.',
    sections: [
      {
        sectionTitle: 'Character Classes',
        items: [
          { title: 'Any Character', code: '.', desc: 'Matches any single character except newline (unless s flag enabled).' },
          { title: 'Digit', code: '\\d', desc: 'Matches any digit character [0-9].' },
          { title: 'Non-Digit', code: '\\D', desc: 'Matches any non-digit character [^0-9].' },
          { title: 'Word Character', code: '\\w', desc: 'Matches alphanumeric characters and underscores [a-zA-Z0-9_].' },
          { title: 'Non-Word Character', code: '\\W', desc: 'Matches any non-alphanumeric character.' },
          { title: 'Whitespace', code: '\\s', desc: 'Matches spaces, tabs, carriage returns, and newlines.' },
          { title: 'Non-Whitespace', code: '\\S', desc: 'Matches any non-whitespace character.' }
        ]
      },
      {
        sectionTitle: 'Anchors & Boundaries',
        items: [
          { title: 'Start of String / Line', code: '^', desc: 'Matches the beginning of string or line (with m flag).' },
          { title: 'End of String / Line', code: '$', desc: 'Matches the end of string or line (with m flag).' },
          { title: 'Word Boundary', code: '\\b', desc: 'Matches word boundary position between \\w and \\W.' },
          { title: 'Non-Word Boundary', code: '\\B', desc: 'Matches position that is not a word boundary.' }
        ]
      },
      {
        sectionTitle: 'Quantifiers',
        items: [
          { title: 'Zero or More', code: '*', desc: 'Matches preceding element 0 or more times (greedy).' },
          { title: 'One or More', code: '+', desc: 'Matches preceding element 1 or more times (greedy).' },
          { title: 'Zero or One', code: '?', desc: 'Matches preceding element 0 or 1 time (optional).' },
          { title: 'Exact Count', code: '{n}', desc: 'Matches exactly n occurrences.' },
          { title: 'Range Count', code: '{min,max}', desc: 'Matches between min and max occurrences.' },
          { title: 'Lazy Quantifier', code: '*? or +?', desc: 'Matches as few characters as possible.' }
        ]
      },
      {
        sectionTitle: 'Groups & Lookarounds',
        items: [
          { title: 'Capturing Group', code: '(abc)', desc: 'Groups tokens together and remembers matched value in backreference.' },
          { title: 'Non-Capturing Group', code: '(?:abc)', desc: 'Groups tokens together without remembering captured value.' },
          { title: 'Named Capturing Group', code: '(?<name>abc)', desc: 'Captures match into named group object.' },
          { title: 'Positive Lookahead', code: '(?=abc)', desc: 'Asserts that what immediately follows matches pattern.' },
          { title: 'Negative Lookahead', code: '(?!abc)', desc: 'Asserts that what immediately follows does NOT match pattern.' }
        ]
      }
    ]
  },

  markdown: {
    title: 'Markdown Syntax Reference',
    subtitle: 'Standard CommonMark & GitHub Flavored Markdown (GFM) formatting reference.',
    sections: [
      {
        sectionTitle: 'Headers & Text Styling',
        items: [
          { title: 'Headings 1 to 6', code: '# H1\n## H2\n### H3', desc: 'Hashes before text define hierarchical headers.' },
          { title: 'Bold Text', code: '**bold text** or __bold__', desc: 'Wrap words in double asterisks or double underscores.' },
          { title: 'Italic Text', code: '*italic text* or _italic_', desc: 'Wrap words in single asterisk or underscore.' },
          { title: 'Strikethrough', code: '~~strikethrough~~', desc: 'Wrap words in double tildes.' },
          { title: 'Inline Code', code: '`code snippet`', desc: 'Enclose code tokens in single backticks.' }
        ]
      },
      {
        sectionTitle: 'Lists, Quotes & Links',
        items: [
          { title: 'Bulleted List', code: '- Item 1\n- Item 2\n  - Sub-item', desc: 'Unordered list using hyphens or asterisks.' },
          { title: 'Numbered List', code: '1. First\n2. Second\n3. Third', desc: 'Ordered list with sequential numbers.' },
          { title: 'Task Checklists', code: '- [x] Done task\n- [ ] Pending task', desc: 'Interactive checkbox tasks in GitHub Flavored Markdown.' },
          { title: 'Blockquotes', code: '> Quoted block of text\n> Multi-line quote', desc: 'Prepend lines with greater-than symbol.' },
          { title: 'Hyperlinks', code: '[Display Text](https://example.com)', desc: 'Square brackets for link text followed by URL in parentheses.' },
          { title: 'Images', code: '![Alt description](image.png)', desc: 'Exclamation mark followed by alt text and image URL.' }
        ]
      },
      {
        sectionTitle: 'Code Blocks & Tables',
        items: [
          { title: 'Fenced Code Block', code: '```typescript\nconst greeting = "Hello";\n```', desc: 'Triple backticks with optional language specifier for syntax highlighting.' },
          { title: 'Markdown Table', code: '| Name | Type | Description |\n| :--- | :--: | ----------: |\n| id   | num  | Unique ID   |', desc: 'Pipe characters delineate columns; colons define left, center, right alignment.' }
        ]
      }
    ]
  },

  linux: {
    title: 'Linux / Bash Commands Cheatsheet',
    subtitle: 'Essential Unix terminal commands for navigation, system diagnostics, and file operations.',
    sections: [
      {
        sectionTitle: 'Files & Directories',
        items: [
          { title: 'List Files with Details', code: 'ls -lah', desc: 'List all files including hidden with human-readable permissions and sizes.' },
          { title: 'Print Working Directory', code: 'pwd', desc: 'Display absolute filesystem path of current directory.' },
          { title: 'Change Directory', code: 'cd /path/to/folder', desc: 'Navigate to target folder (cd ~ for user home, cd .. for parent).' },
          { title: 'Create Directories', code: 'mkdir -p path/to/nested/folder', desc: 'Create directory and any missing parent folders.' },
          { title: 'Copy Files / Folders', code: 'cp -r source/ destination/', desc: 'Copy files recursively to target destination.' },
          { title: 'Move or Rename', code: 'mv oldname newname', desc: 'Rename or move file/directory.' },
          { title: 'Remove File / Folder', code: 'rm -rf folder/', desc: 'Force delete folder and its contents recursively.' }
        ]
      },
      {
        sectionTitle: 'Searching & Processing',
        items: [
          { title: 'Find Files by Name', code: 'find . -name "*.log"', desc: 'Search current hierarchy for filenames matching pattern.' },
          { title: 'Grep Search Text', code: 'grep -rn "keyword" ./src', desc: 'Recursively search text inside files with line numbers.' },
          { title: 'Stream Log Tail', code: 'tail -f -n 100 app.log', desc: 'Follow new log lines appended in real-time.' },
          { title: 'Count Lines / Words', code: 'wc -l filename', desc: 'Count total number of lines in a file.' }
        ]
      },
      {
        sectionTitle: 'System & Processes',
        items: [
          { title: 'Process Viewer', code: 'htop or top', desc: 'Interactive real-time CPU, RAM, and process activity monitor.' },
          { title: 'List Running Processes', code: 'ps aux | grep node', desc: 'Show all running system processes filtered by keyword.' },
          { title: 'Kill Process', code: 'kill -9 <PID>', desc: 'Force terminate process by process ID.' },
          { title: 'Check Disk Space', code: 'df -h', desc: 'Show available disk space across mounted filesystems.' },
          { title: 'Check Directory Size', code: 'du -sh *', desc: 'Display total size of items in current directory.' },
          { title: 'Check RAM Usage', code: 'free -h', desc: 'Display total, used, and free memory in human units.' }
        ]
      }
    ]
  },

  sql: {
    title: 'SQL Syntax & Common Queries',
    subtitle: 'Standard ANSI SQL commands, queries, joins, and database operations.',
    sections: [
      {
        sectionTitle: 'Querying Data (DQL)',
        items: [
          { title: 'Basic Select', code: 'SELECT column1, column2 FROM users WHERE active = 1 ORDER BY created_at DESC LIMIT 20;', desc: 'Retrieve filtered, ordered records with pagination.' },
          { title: 'Distinct Values', code: 'SELECT DISTINCT country FROM customers;', desc: 'Return only unique non-duplicate values.' },
          { title: 'Aggregation & Grouping', code: 'SELECT category_id, COUNT(*), AVG(price) FROM products GROUP BY category_id HAVING COUNT(*) > 5;', desc: 'Compute grouped aggregates with post-grouping filter.' },
          { title: 'Pattern Search (LIKE)', code: "SELECT * FROM users WHERE email LIKE '%@gmail.com';", desc: 'Filter strings with % wildcard (any chars) and _ (single char).' }
        ]
      },
      {
        sectionTitle: 'Joins',
        items: [
          { title: 'INNER JOIN', code: 'SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;', desc: 'Return rows where there is a matching key in both tables.' },
          { title: 'LEFT JOIN', code: 'SELECT u.name, o.id FROM users u LEFT JOIN orders o ON u.id = o.user_id;', desc: 'Return all rows from left table, and matched rows from right table (or NULL).' },
          { title: 'FULL OUTER JOIN', code: 'SELECT * FROM tableA FULL OUTER JOIN tableB ON tableA.id = tableB.a_id;', desc: 'Return all records when there is a match in either left or right table.' }
        ]
      },
      {
        sectionTitle: 'Modifying Data (DML)',
        items: [
          { title: 'Insert Record', code: "INSERT INTO users (name, email) VALUES ('Alice', 'alice@test.com');", desc: 'Add new row into table.' },
          { title: 'Update Record', code: "UPDATE users SET status = 'active' WHERE id = 42;", desc: 'Modify existing records matching WHERE clause.' },
          { title: 'Delete Record', code: 'DELETE FROM users WHERE last_login < NOW() - INTERVAL 1 YEAR;', desc: 'Remove rows matching criteria.' }
        ]
      }
    ]
  },

  html5: {
    title: 'HTML5 Semantic Tags Reference',
    subtitle: 'Modern semantic markup elements for accessible, SEO-friendly web documents.',
    sections: [
      {
        sectionTitle: 'Document Structure',
        items: [
          { title: '<header>', code: '<header>', desc: 'Introductory content or navigational links for a page or article.' },
          { title: '<nav>', code: '<nav>', desc: 'Section of major navigation links.' },
          { title: '<main>', code: '<main>', desc: 'The dominant, non-repeated central content of the <body>.' },
          { title: '<article>', code: '<article>', desc: 'Self-contained composition that can be distributed independently.' },
          { title: '<section>', code: '<section>', desc: 'Generic standalone section of a document, typically with a heading.' },
          { title: '<aside>', code: '<aside>', desc: 'Content tangentially related to the main content (sidebar, callouts).' },
          { title: '<footer>', code: '<footer>', desc: 'Footer containing author info, copyright, or sitemap links.' }
        ]
      },
      {
        sectionTitle: 'Interactive & Media Elements',
        items: [
          { title: '<dialog>', code: '<dialog id="modal">...</dialog>', desc: 'Native modal dialog or popup box with showModal() API.' },
          { title: '<details> & <summary>', code: '<details><summary>Title</summary>Content</details>', desc: 'Native disclosure widget for collapsible accordion items.' },
          { title: '<figure> & <figcaption>', code: '<figure><img ...><figcaption>Caption</figcaption></figure>', desc: 'Self-contained illustration or diagram with caption.' },
          { title: '<picture>', code: '<picture><source ...><img></picture>', desc: 'Responsive image container supporting multiple media formats.' }
        ]
      }
    ]
  },

  'css-selectors': {
    title: 'CSS Selectors & Combinators',
    subtitle: 'Modern CSS selector patterns, pseudo-classes, and structural pseudo-elements.',
    sections: [
      {
        sectionTitle: 'Pseudo-Classes',
        items: [
          { title: ':is() Selector', code: ':is(h1, h2, h3) > a', desc: 'Matches any element that matches any selector in the argument list.' },
          { title: ':has() Parent Selector', code: 'card:has(img)', desc: 'Style an element based on whether it contains matching descendants.' },
          { title: ':not() Negation', code: 'button:not([disabled])', desc: 'Matches elements that do not match the argument selector.' },
          { title: ':nth-child(n)', code: 'li:nth-child(2n + 1)', desc: 'Matches elements based on position among siblings (e.g. odd rows).' },
          { title: ':focus-visible', code: 'button:focus-visible', desc: 'Applies focus outline only when keyboard navigation is used.' }
        ]
      },
      {
        sectionTitle: 'Combinators',
        items: [
          { title: 'Descendant (Space)', code: 'div p', desc: 'Matches all <p> descendants inside <div>.' },
          { title: 'Child Combinator (>)', code: 'ul > li', desc: 'Matches only immediate direct children.' },
          { title: 'Adjacent Sibling (+)', code: 'h2 + p', desc: 'Matches immediately following sibling element.' },
          { title: 'General Sibling (~)', code: 'h2 ~ p', desc: 'Matches any subsequent sibling element.' }
        ]
      }
    ]
  },

  docker: {
    title: 'Docker CLI Cheatsheet',
    subtitle: 'Essential Docker container, image, network, and volume commands.',
    sections: [
      {
        sectionTitle: 'Container Management',
        items: [
          { title: 'Run Container', code: 'docker run -d -p 8080:80 --name web nginx', desc: 'Start a detached container with host-to-container port mapping.' },
          { title: 'List Containers', code: 'docker ps -a', desc: 'List all running and exited containers.' },
          { title: 'Container Shell', code: 'docker exec -it <container_id> /bin/sh', desc: 'Open interactive bash/sh session inside running container.' },
          { title: 'View Logs', code: 'docker logs -f --tail 50 <container_id>', desc: 'Stream live container stdout/stderr output.' },
          { title: 'Stop & Remove', code: 'docker rm -f <container_id>', desc: 'Force stop and remove container.' }
        ]
      },
      {
        sectionTitle: 'Images & Cleanup',
        items: [
          { title: 'Build Image', code: 'docker build -t myapp:latest .', desc: 'Build Docker image from Dockerfile in current directory.' },
          { title: 'List Images', code: 'docker images', desc: 'Show all locally cached Docker images with tag and size.' },
          { title: 'Prune Unused Resources', code: 'docker system prune -a --volumes', desc: 'Free disk space by removing stopped containers, unused networks, and dangling images.' }
        ]
      }
    ]
  },

  ports: {
    title: 'Common Network Ports Directory',
    subtitle: 'Standard TCP/UDP port assignments across web, mail, database, and infrastructure services.',
    sections: [
      {
        sectionTitle: 'Web & Transfer',
        items: [
          { title: 'Port 80', code: '80 (TCP)', desc: 'HTTP - Hypertext Transfer Protocol (unencrypted web traffic).' },
          { title: 'Port 443', code: '443 (TCP)', desc: 'HTTPS - HTTP over TLS/SSL secure encrypted web traffic.' },
          { title: 'Port 22', code: '22 (TCP)', desc: 'SSH / SFTP - Secure Shell remote login and encrypted file transfer.' },
          { title: 'Port 21', code: '21 (TCP)', desc: 'FTP - File Transfer Protocol command control port.' },
          { title: 'Port 53', code: '53 (UDP/TCP)', desc: 'DNS - Domain Name System name resolution queries.' }
        ]
      },
      {
        sectionTitle: 'Databases & Cache',
        items: [
          { title: 'Port 3306', code: '3306 (TCP)', desc: 'MySQL / MariaDB database server connection port.' },
          { title: 'Port 5432', code: '5432 (TCP)', desc: 'PostgreSQL relational database client connection port.' },
          { title: 'Port 27017', code: '27017 (TCP)', desc: 'MongoDB NoSQL document database server default port.' },
          { title: 'Port 6379', code: '6379 (TCP)', desc: 'Redis in-memory data store, cache, and message broker.' },
          { title: 'Port 11211', code: '11211 (TCP)', desc: 'Memcached distributed memory caching system.' }
        ]
      },
      {
        sectionTitle: 'Email & Messaging',
        items: [
          { title: 'Port 25', code: '25 (TCP)', desc: 'SMTP - Simple Mail Transfer Protocol server-to-server relay.' },
          { title: 'Port 587', code: '587 (TCP)', desc: 'SMTP Submission - Encrypted email client submission via STARTTLS.' },
          { title: 'Port 993', code: '993 (TCP)', desc: 'IMAPS - Internet Message Access Protocol over SSL.' },
          { title: 'Port 995', code: '995 (TCP)', desc: 'POP3S - Post Office Protocol 3 over TLS/SSL.' }
        ]
      }
    ]
  },

  ascii: {
    title: 'ASCII 7-Bit Character Table',
    subtitle: 'Standard American Standard Code for Information Interchange (ASCII 0-127).',
    sections: [
      {
        sectionTitle: 'Control Codes (0-31)',
        items: [
          { title: 'NUL (0)', code: '0x00 / 0b00000000', desc: 'Null character, string terminator in C.' },
          { title: 'BEL (7)', code: '0x07', desc: 'Bell / alert beep.' },
          { title: 'BS (8)', code: '0x08', desc: 'Backspace.' },
          { title: 'HT (9)', code: '0x09', desc: 'Horizontal Tab (\\t).' },
          { title: 'LF (10)', code: '0x0A', desc: 'Line Feed / Newline (\\n).' },
          { title: 'CR (13)', code: '0x0D', desc: 'Carriage Return (\\r).' },
          { title: 'ESC (27)', code: '0x1B', desc: 'Escape character.' }
        ]
      },
      {
        sectionTitle: 'Printable Characters (32-126)',
        items: [
          { title: 'Space (32)', code: '0x20', desc: 'Standard whitespace character.' },
          { title: 'Digits (48-57)', code: '0x30 to 0x39', desc: 'Digits "0" through "9".' },
          { title: 'Uppercase (65-90)', code: '0x41 to 0x5A', desc: 'Uppercase Latin letters "A" to "Z".' },
          { title: 'Lowercase (97-122)', code: '0x61 to 0x7A', desc: 'Lowercase Latin letters "a" to "z".' },
          { title: 'DEL (127)', code: '0x7F', desc: 'Delete control character.' }
        ]
      }
    ]
  },

  'periodic-table': {
    title: 'Periodic Table of Chemical Elements',
    subtitle: 'Explore chemical elements with atomic number, symbol, atomic weight, and chemical category.',
    sections: [
      {
        sectionTitle: 'Key Reactive Non-Metals & Halogens',
        items: [
          { title: 'Hydrogen (H, 1)', code: '1.008 u', desc: 'Most abundant chemical substance in the universe. Group 1.' },
          { title: 'Carbon (C, 6)', code: '12.011 u', desc: 'Basis of all known organic life. Four covalent valence bonds.' },
          { title: 'Nitrogen (N, 7)', code: '14.007 u', desc: 'Constitutes ~78% of Earth atmosphere. Colorless diatomic gas.' },
          { title: 'Oxygen (O, 8)', code: '15.999 u', desc: 'Highly reactive nonmetal essential for cellular respiration.' },
          { title: 'Fluorine (F, 9)', code: '18.998 u', desc: 'Most electronegative and reactive of all chemical elements.' }
        ]
      },
      {
        sectionTitle: 'Noble Gases',
        items: [
          { title: 'Helium (He, 2)', code: '4.0026 u', desc: 'Inert noble gas with lowest boiling point of any element.' },
          { title: 'Neon (Ne, 10)', code: '20.180 u', desc: 'Noble gas giving reddish-orange glow in high-voltage discharge tubes.' },
          { title: 'Argon (Ar, 18)', code: '39.948 u', desc: 'Third-most abundant gas in Earth atmosphere; used as inert shield.' }
        ]
      },
      {
        sectionTitle: 'Alkali & Transition Metals',
        items: [
          { title: 'Sodium (Na, 11)', code: '22.990 u', desc: 'Soft silvery-white alkali metal. Forms salt (NaCl).' },
          { title: 'Iron (Fe, 26)', code: '55.845 u', desc: 'Core constituent of Earth; major component of hemoglobin.' },
          { title: 'Copper (Cu, 29)', code: '63.546 u', desc: 'Soft ductile metal with exceptionally high thermal and electrical conductivity.' },
          { title: 'Gold (Au, 79)', code: '196.97 u', desc: 'Dense, malleable precious metal unreactive with most acids.' }
        ]
      }
    ]
  },

  mime: {
    title: 'Standard Web MIME Types',
    subtitle: 'Directory of official media types and Content-Type header values.',
    sections: [
      {
        sectionTitle: 'Application & Data',
        items: [
          { title: 'JSON', code: 'application/json', desc: 'JavaScript Object Notation structured data interchange.' },
          { title: 'PDF', code: 'application/pdf', desc: 'Adobe Portable Document Format.' },
          { title: 'ZIP Archive', code: 'application/zip', desc: 'Compressed archive containing one or more files.' },
          { title: 'Wasm', code: 'application/wasm', desc: 'WebAssembly binary code module.' }
        ]
      },
      {
        sectionTitle: 'Text Formats',
        items: [
          { title: 'HTML', code: 'text/html; charset=UTF-8', desc: 'Standard hypertext markup language documents.' },
          { title: 'CSS', code: 'text/css', desc: 'Cascading stylesheets for styling web pages.' },
          { title: 'JavaScript', code: 'text/javascript', desc: 'Client-side script files (ES modules and bundles).' },
          { title: 'Plain Text', code: 'text/plain', desc: 'Raw unstructured text without formatting.' }
        ]
      },
      {
        sectionTitle: 'Images & Media',
        items: [
          { title: 'PNG Image', code: 'image/png', desc: 'Portable Network Graphics lossless bitmap with alpha transparency.' },
          { title: 'JPEG Image', code: 'image/jpeg', desc: 'Lossy photograph image format.' },
          { title: 'WebP Image', code: 'image/webp', desc: 'Modern Google image format supporting lossy & lossless compression.' },
          { title: 'SVG Vector', code: 'image/svg+xml', desc: 'Scalable Vector Graphics XML-based drawing.' }
        ]
      }
    ]
  },

  'country-codes': {
    title: 'ISO Country Codes & Dialing Prefixes',
    subtitle: 'ISO 3166-1 alpha-2, alpha-3 codes and international calling dial prefixes.',
    sections: [
      {
        sectionTitle: 'Major Countries',
        items: [
          { title: 'United States', code: 'US / USA (Dial: +1)', desc: 'North America · Capital: Washington, D.C.' },
          { title: 'India', code: 'IN / IND (Dial: +91)', desc: 'South Asia · Capital: New Delhi' },
          { title: 'United Kingdom', code: 'GB / GBR (Dial: +44)', desc: 'Europe · Capital: London' },
          { title: 'Canada', code: 'CA / CAN (Dial: +1)', desc: 'North America · Capital: Ottawa' },
          { title: 'Germany', code: 'DE / DEU (Dial: +49)', desc: 'Europe · Capital: Berlin' },
          { title: 'France', code: 'FR / FRA (Dial: +33)', desc: 'Europe · Capital: Paris' },
          { title: 'Japan', code: 'JP / JPN (Dial: +81)', desc: 'East Asia · Capital: Tokyo' },
          { title: 'Australia', code: 'AU / AUS (Dial: +61)', desc: 'Oceania · Capital: Canberra' }
        ]
      }
    ]
  },

  'currency-codes': {
    title: 'ISO 4217 Currency Codes',
    subtitle: 'Standard three-letter currency codes and symbols.',
    sections: [
      {
        sectionTitle: 'Global Currencies',
        items: [
          { title: 'US Dollar', code: 'USD ($)', desc: 'United States of America · 2 decimal places' },
          { title: 'Euro', code: 'EUR (€)', desc: 'European Union Eurozone · 2 decimal places' },
          { title: 'British Pound Sterling', code: 'GBP (£)', desc: 'United Kingdom · 2 decimal places' },
          { title: 'Indian Rupee', code: 'INR (₹)', desc: 'India · 2 decimal places' },
          { title: 'Japanese Yen', code: 'JPY (¥)', desc: 'Japan · 0 decimal places' },
          { title: 'Swiss Franc', code: 'CHF (Fr)', desc: 'Switzerland & Liechtenstein · 2 decimal places' },
          { title: 'Canadian Dollar', code: 'CAD ($)', desc: 'Canada · 2 decimal places' },
          { title: 'Australian Dollar', code: 'AUD ($)', desc: 'Australia · 2 decimal places' }
        ]
      }
    ]
  },

  vim: {
    title: 'Vim Modal Editor Shortcuts',
    subtitle: 'Cheat sheet for Vim modes, movements, visual selections, and file operations.',
    sections: [
      {
        sectionTitle: 'Modes & Motions',
        items: [
          { title: 'Normal Mode', code: '<Esc>', desc: 'Exit insert/visual mode back to normal navigation mode.' },
          { title: 'Insert Mode', code: 'i (before cursor) or a (after cursor)', desc: 'Begin typing text.' },
          { title: 'Navigation Keys', code: 'h (left), j (down), k (up), l (right)', desc: 'Home-row cursor navigation.' },
          { title: 'Word Motions', code: 'w (next word), b (previous word), e (end of word)', desc: 'Jump forward or backward by word tokens.' },
          { title: 'Line Motions', code: '0 (start of line), $ (end of line), ^ (first non-blank)', desc: 'Jump across current line.' }
        ]
      },
      {
        sectionTitle: 'Editing & Saving',
        items: [
          { title: 'Delete / Cut Line', code: 'dd', desc: 'Delete entire current line and save into default register.' },
          { title: 'Copy (Yank) Line', code: 'yy', desc: 'Yank current line into register.' },
          { title: 'Paste', code: 'p (after cursor) or P (before cursor)', desc: 'Paste contents of register.' },
          { title: 'Undo & Redo', code: 'u (undo), Ctrl + r (redo)', desc: 'Undo or redo changes.' },
          { title: 'Save and Quit', code: ':wq or ZZ', desc: 'Write changes to file and exit Vim.' }
        ]
      }
    ]
  },

  tmux: {
    title: 'Tmux Terminal Multiplexer Cheatsheet',
    subtitle: 'Prefix key commands for sessions, windows, and pane splitting (default prefix: Ctrl+B).',
    sections: [
      {
        sectionTitle: 'Sessions & Windows',
        items: [
          { title: 'Start Named Session', code: 'tmux new -s <name>', desc: 'Create fresh session with friendly name.' },
          { title: 'Attach Session', code: 'tmux attach -t <name>', desc: 'Re-attach to background session.' },
          { title: 'Create Window', code: 'Ctrl+B then c', desc: 'Create new tab window.' },
          { title: 'Switch Windows', code: 'Ctrl+B then n (next) / p (prev) / 0-9', desc: 'Navigate between windows.' }
        ]
      },
      {
        sectionTitle: 'Panes',
        items: [
          { title: 'Split Horizontally', code: 'Ctrl+B then "', desc: 'Split current pane top/bottom.' },
          { title: 'Split Vertically', code: 'Ctrl+B then %', desc: 'Split current pane left/right.' },
          { title: 'Navigate Panes', code: 'Ctrl+B then Arrow Keys', desc: 'Move active focus between panes.' },
          { title: 'Toggle Zoom Pane', code: 'Ctrl+B then z', desc: 'Maximize or un-maximize current pane.' }
        ]
      }
    ]
  },

  dns: {
    title: 'DNS Record Types Guide',
    subtitle: 'Reference of Domain Name System resource record types and use cases.',
    sections: [
      {
        sectionTitle: 'Core Address Records',
        items: [
          { title: 'A Record', code: 'example.com. 300 IN A 93.184.216.34', desc: 'Maps domain hostname to 32-bit IPv4 address.' },
          { title: 'AAAA Record', code: 'example.com. 300 IN AAAA 2606:2800:220:1:...', desc: 'Maps hostname to 128-bit IPv6 address.' },
          { title: 'CNAME Record', code: 'www.example.com. CNAME example.com.', desc: 'Canonical name alias pointing one domain name to another.' }
        ]
      },
      {
        sectionTitle: 'Email & Verification Records',
        items: [
          { title: 'MX Record', code: 'IN MX 10 mail.example.com.', desc: 'Mail Exchanger specifies mail servers handling incoming email with priority.' },
          { title: 'TXT Record', code: 'IN TXT "v=spf1 include:_spf.google.com ~all"', desc: 'Text data used for SPF, DKIM, and domain ownership verification.' },
          { title: 'NS Record', code: 'IN NS ns1.nameserver.com.', desc: 'Authoritative Name Server for the zone.' },
          { title: 'CAA Record', code: 'IN CAA 0 issue "letsencrypt.org"', desc: 'Certificate Authority Authorization specifies which CAs may issue SSL certs.' }
        ]
      }
    ]
  },

  javascript: {
    title: 'JavaScript Methods Reference',
    subtitle: 'Core Array, Object, and Promise functional methods.',
    sections: [
      {
        sectionTitle: 'Array Transformations',
        items: [
          { title: 'Array.map()', code: 'const doubled = arr.map(x => x * 2);', desc: 'Creates new array populated with the results of calling function on each element.' },
          { title: 'Array.filter()', code: 'const evens = arr.filter(x => x % 2 === 0);', desc: 'Creates shallow copy of portion of array matching predicate test.' },
          { title: 'Array.reduce()', code: 'const sum = arr.reduce((acc, curr) => acc + curr, 0);', desc: 'Executes reducer callback function across elements, accumulating single result.' },
          { title: 'Array.find()', code: 'const found = arr.find(item => item.id === 5);', desc: 'Returns first element in array satisfying testing function.' }
        ]
      },
      {
        sectionTitle: 'Async & Promises',
        items: [
          { title: 'Promise.all()', code: 'const [resA, resB] = await Promise.all([pA, pB]);', desc: 'Fulfills when all promises resolve, or rejects when any promise fails.' },
          { title: 'Promise.allSettled()', code: 'const results = await Promise.allSettled(promises);', desc: 'Resolves when all promises settle (either fulfilled or rejected).' }
        ]
      }
    ]
  },

  python: {
    title: 'Python Idioms & Cheat Sheet',
    subtitle: 'Python 3 syntax, list comprehensions, slicing, and built-ins.',
    sections: [
      {
        sectionTitle: 'Comprehensions & Slicing',
        items: [
          { title: 'List Comprehension', code: 'squares = [x**2 for x in range(10) if x % 2 == 0]', desc: 'Concise way to transform and filter iterable sequences.' },
          { title: 'Dict Comprehension', code: 'lookup = {k: v for k, v in pairs}', desc: 'Construct dictionary mappings compactly.' },
          { title: 'Sequence Slicing', code: 'sub = lst[1:5:2] # [start:stop:step]', desc: 'Slice subsequences with optional step.' },
          { title: 'Reverse Sequence', code: 'rev = text[::-1]', desc: 'Fast idiomatic sequence reversal using negative step.' }
        ]
      }
    ]
  },

  'http-headers': {
    title: 'Standard HTTP Headers Reference',
    subtitle: 'Common request and response HTTP headers.',
    sections: [
      {
        sectionTitle: 'Security & CORS',
        items: [
          { title: 'Access-Control-Allow-Origin', code: 'Access-Control-Allow-Origin: *', desc: 'CORS header specifying permitted origins.' },
          { title: 'Content-Security-Policy', code: "Content-Security-Policy: default-src 'self'", desc: 'Restricts resources browser is allowed to load for given page.' },
          { title: 'Strict-Transport-Security', code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains', desc: 'HSTS enforces HTTPS connections.' }
        ]
      }
    ]
  },

  'physics-constants': {
    title: 'Fundamental Physical Constants',
    subtitle: 'Standard values for physics and scientific calculations.',
    sections: [
      {
        sectionTitle: 'Universal Constants',
        items: [
          { title: 'Speed of Light (c)', code: '299,792,458 m/s', desc: 'Speed of electromagnetic radiation in a vacuum.' },
          { title: 'Planck Constant (h)', code: '6.62607015 × 10⁻³⁴ J·s', desc: 'Quantum of electromagnetic action.' },
          { title: 'Gravitational Constant (G)', code: '6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²', desc: 'Newtonian gravitational constant.' },
          { title: 'Elementary Charge (e)', code: '1.602176634 × 10⁻¹⁹ C', desc: 'Electric charge carried by single proton or electron.' },
          { title: 'Boltzmann Constant (k_B)', code: '1.380649 × 10⁻²³ J/K', desc: 'Relates temperature to energy at molecular level.' }
        ]
      }
    ]
  },

  'math-formulas': {
    title: 'Mathematical Formulas Reference',
    subtitle: 'Essential formulas for algebra, trigonometry, and geometry.',
    sections: [
      {
        sectionTitle: 'Algebra & Geometry',
        items: [
          { title: 'Quadratic Formula', code: 'x = (-b ± √(b² - 4ac)) / (2a)', desc: 'Roots of ax² + bx + c = 0.' },
          { title: 'Pythagorean Theorem', code: 'a² + b² = c²', desc: 'Relation of sides in right-angled triangle.' },
          { title: 'Circle Area & Circumference', code: 'A = πr², C = 2πr', desc: 'Area and perimeter of a circle.' },
          { title: 'Sphere Volume', code: 'V = (4/3)πr³', desc: 'Volume of a three-dimensional sphere.' }
        ]
      }
    ]
  },

  'keyboard-keys': {
    title: 'Keyboard Event Key Codes Reference',
    subtitle: 'Standard DOM KeyboardEvent key values and legacy which codes.',
    sections: [
      {
        sectionTitle: 'Special & Modifier Keys',
        items: [
          { title: 'Enter', code: 'key: "Enter", code: "Enter", which: 13', desc: 'Return or enter key.' },
          { title: 'Escape', code: 'key: "Escape", code: "Escape", which: 27', desc: 'Escape cancel key.' },
          { title: 'Space', code: 'key: " ", code: "Space", which: 32', desc: 'Spacebar key.' },
          { title: 'Backspace', code: 'key: "Backspace", code: "Backspace", which: 8', desc: 'Backspace key.' },
          { title: 'Tab', code: 'key: "Tab", code: "Tab", which: 9', desc: 'Tabulation key.' }
        ]
      }
    ]
  }
};
