import frontMatter from 'front-matter';
import Prism from 'node-prismjs';
import md from 'Marked';

const components = [];

/**
 * Wraps the code and jsx in an html component
 * for styling it later
 * @param   {string} exampleRun Code to be run in the styleguide
 * @param   {string} exampleSrc Source that will be shown as example
 * @param   {string} langClass  CSS class for the code block
 * @returns {string}            Code block with souce and run code
 */
function codeBlockTemplate(exampleRun, exampleSrc, langClass) {
  return `
      <div class="code-block">
        ${ codeRunTemplate(exampleRun) }

        <div source='${exampleRun}'>
          ${exampleSrc}
        </div>
      </div>`;
}


/**
 * Render Code (React Component)
 * @param   {string} code   code string
 * @returns {string} JSX or the reference of component
 */
function codeRunTemplate(code, onlyRun) {
  const runCls = onlyRun ? 'code-just-run' : 'code-run'
  if (/React.Component/.test(code)) {
    // Don't need to use UUID
    const ID = 'B' + Math.random().toString(36).substr(2, 5).replace(/\d/g,'A');
    components.push(`const ${ID} = ${code}`);
    return `<${ID} />`
  } else {
    return `
      <div className="${runCls}">
        ${code}
      </div>`
  }
}


/**
 * highlight code
 * @param  {string} code - Raw html code
 * @param  {string} lang - Language indicated in the code block
 * @return {string} code block
 */
function highlight(code, lang) {
  const language = Prism.languages[lang] || Prism.languages.autoit;
  const hl = Prism.highlight(code, language)
    .replace(/{/g, '{"{"{')
    .replace(/}/g, '{"}"}')
    .replace(/{"{"{/g, '{"{"}')
    .replace(/(\n)/g, '{"\\n"}')
    .replace(/class=/g, 'className=')

  return `
<pre${!lang ? '' : ` class="language-${lang}"`}>
  <code${!lang ? '' : ` class="language-${lang}"`}>
    ${hl}
  </code>
</pre>
  `;
}

/**
 * Parse a code block to have a source and a run code
 * @param   {String}   code       - Raw html code
 * @param   {String}   lang       - Language indicated in the code block
 * @param   {String}   langPrefix - Language prefix
 * @param   {Function} highlight  - Code highlight function
 * @returns {String}                Code block with souce and run code
 */
function parseCodeBlock(code, lang, langPrefix) {
  const codeBlock = highlight(code, lang);

  const langClass = !lang ? '' : `${langPrefix}${escape(lang, true)}`;
  const jsx = code;

  return codeBlockTemplate(jsx, codeBlock, langClass);
}

/**
 * @typedef MarkdownObject
 * @type {Object}
 * @property {Object} attributes - Map of properties from the front matter
 * @property {String} body       - Markdown
 */

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Parse Markdown to HTML with code blocks
 * @param   {MarkdownObject} markdown - Markdown attributes and body
 * @returns {HTMLObject}                HTML and imports
 */
function parseMarkdown(markdown) {
  return new Promise((resolve, reject) => {
    let html;
    let hasCodeTemplate = false;

    const renderer = new md.Renderer();

    // customize rendering code
    renderer.code = (code, language) => {
      switch (language) {
        case 'run':
          return codeRunTemplate(code, true)
        case 'demo':
          hasCodeTemplate = true;
          return parseCodeBlock(
            code,
            'jsx',
            'language-'
          )
        default:
          return highlight(code, language)
      }
    }

    const options = {
      renderer,
      xhtml: true,
    };

    md.setOptions(options);

    try {
      html = md(markdown.body);
      return resolve({
        html,
        components,
        hasCodeTemplate,
        attributes: markdown.attributes,
      });
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * Extract FrontMatter from markdown
 * and return a separate object with keys
 * and a markdown body
 * @param   {String} markdown - Markdown string to be parsed
 * @returns {MarkdownObject}    Markdown attributes and body
 */
function parseFrontMatter(markdown) {
  return frontMatter(markdown);
}

/**
 * Parse markdown, extract the front matter
 * and return the body and imports
 * @param  {String} markdown - Markdown string to be parsed
 * @returns {HTMLObject}       HTML and imports
 */
function parse(markdown) {
  return parseMarkdown(parseFrontMatter(markdown));
}

module.exports = {
  codeBlockTemplate,
  parse,
  parseCodeBlock,
  parseFrontMatter,
  parseMarkdown
};
