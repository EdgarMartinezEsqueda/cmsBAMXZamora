// Pinta el texto enriquecido ya saneado por shared/content/page.js (sanitizeRichText).
// Solo conoce una lista cerrada de nodos y nunca inserta HTML: lo desconocido no se pinta.

const HEADINGS = { 2: "h2", 3: "h3", 4: "h4" };
// Alineación y color del bloque (listas cerradas de shared/content/page.js). Los colores son
// tonos oscuros de la marca: sí tienen contraste suficiente sobre fondo claro.
const ALIGN_CLASSES = { izquierda: "text-left", centro: "text-center", justificado: "text-justify" };
const COLOR_CLASSES = { predeterminado: "text-gray-700", verde: "text-verde-700", amarillo: "text-amarillo-800", rojo: "text-rojo-700", gris: "text-gris-700" };
const HEADING_COLOR_CLASSES = { predeterminado: "text-gray-800", verde: "text-verde-800", amarillo: "text-amarillo-900", rojo: "text-rojo-800", gris: "text-gris-800" };
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

export default function RichText({ blocks, align = "izquierda", color = "predeterminado" }) {
  const headingColor = HEADING_COLOR_CLASSES[color] ?? HEADING_COLOR_CLASSES.predeterminado;
  return (
    <div className={`space-y-4 text-lg leading-relaxed ${ALIGN_CLASSES[align] ?? ALIGN_CLASSES.izquierda} ${COLOR_CLASSES[color] ?? COLOR_CLASSES.predeterminado}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = HEADINGS[block.level] ?? "h2";
          return <Tag key={index} className={`${HEADING_CLASSES[block.level] ?? HEADING_CLASSES[2]} ${headingColor}`}><Inlines nodes={block.children} /></Tag>;
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
