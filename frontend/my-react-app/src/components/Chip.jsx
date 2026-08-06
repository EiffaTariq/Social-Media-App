export default function Chip({ children, gold }) {
  return <span className={"chip" + (gold ? " gold" : "")}>{children}</span>;
}
