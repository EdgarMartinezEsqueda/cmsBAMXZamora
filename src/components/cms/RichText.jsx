// Pinta el texto enriquecido ya saneado por shared/content/page.js (sanitizeRichText).
// Solo conoce una lista cerrada de nodos y nunca inserta HTML: lo desconocido no se pinta.

const HEADINGS = { 2: "h2", 3: "h3", 4: "h4" };
const HEADING_CLASSES = { 2: "text-3xl font-bold", 3: "text-2xl font-bold", 4: "text-xl font-semibold" };

function Inline({ node }) {
  if (node.type === "link") {
    const external = /^https?:\/\//.test(node.url);
    return (
      <a href={node.url} className="text-verdeLogo underline hover:text-amarilloLogo"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {node.children.map((child, index) => <Inline key={index} node={child} />)}
      </a>
    );
  }
  let content = node.text;
  if (node.code) content = <code className="rounded bg-gray-100 px-1">{content}</code>;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return content;
}

const Inlines = ({ nodes }) => nodes.map((node, index) => <Inline key={index} node={node} />);

export default function RichText({ blocks }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-gray-700">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = HEADINGS[block.level] ?? "h2";
          return <Tag key={index} className={`${HEADING_CLASSES[block.level] ?? HEADING_CLASSES[2]} text-gray-800`}><Inlines nodes={block.children} /></Tag>;
        }
        if (block.type === "quote") {
          return <blockquote key={index} className="border-l-4 border-verdeLogo pl-4 italic"><Inlines nodes={block.children} /></blockquote>;
        }
        if (block.type === "list") {
          const List = block.format === "ordered" ? "ol" : "ul";
          return (
            <List key={index} className={`${block.format === "ordered" ? "list-decimal" : "list-disc"} space-y-1 pl-6`}>
              {block.children.map((item, itemIndex) => <li key={itemIndex}><Inlines nodes={item.children} /></li>)}
            </List>
          );
        }
        return <p key={index}><Inlines nodes={block.children} /></p>;
      })}
    </div>
  );
}
