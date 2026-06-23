import {
  ARABIC_LETTERS,
  HARAKAT_MARKS,
  TANWIN_MARKS,
  getCardColors,
  type QaidaCardColor,
} from "@/components/classroom/shapes/qaidaCatalog";

interface QaidaToolsProps {
  onInsertLetter: (text: string, label: string, color: QaidaCardColor) => void;
}

function LetterTile({
  char,
  label,
  color,
  onClick,
  size = "md",
}: {
  char: string;
  label: string;
  color: QaidaCardColor;
  onClick: () => void;
  size?: "md" | "lg";
}) {
  const { bg, border } = getCardColors(color);
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 transition hover:scale-105 active:scale-95 ${
        size === "lg" ? "h-16 w-16" : "h-12 w-12"
      }`}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <span className={`font-arabic font-bold text-navy ${size === "lg" ? "text-3xl" : "text-xl"}`}>
        {char}
      </span>
      {size === "lg" ? (
        <span className="mt-0.5 text-[8px] font-semibold text-navy/60">{label}</span>
      ) : null}
    </button>
  );
}

export function QaidaTools({ onInsertLetter }: QaidaToolsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="mb-1.5 text-xs font-bold text-navy">Arabic Letters (Huruf)</h4>
        <p className="mb-2 text-[11px] text-zinc-500">Tap a letter card — like a flashcard!</p>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
          {ARABIC_LETTERS.map((letter) => (
            <LetterTile
              key={letter.char + letter.name}
              char={letter.char}
              label={letter.name}
              color={letter.color}
              size="md"
              onClick={() => onInsertLetter(letter.char, letter.name, letter.color)}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-1.5 text-xs font-bold text-navy">Harakat (Vowels)</h4>
        <div className="flex flex-wrap gap-2">
          {HARAKAT_MARKS.map((mark) => (
            <LetterTile
              key={mark.label}
              char={mark.sample}
              label={mark.label}
              color={mark.color}
              size="lg"
              onClick={() => onInsertLetter(mark.sample, mark.label, mark.color)}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-1.5 text-xs font-bold text-navy">Tanwin</h4>
        <div className="flex flex-wrap gap-2">
          {TANWIN_MARKS.map((mark) => (
            <LetterTile
              key={mark.label}
              char={mark.sample}
              label={mark.label}
              color={mark.color}
              size="lg"
              onClick={() => onInsertLetter(mark.sample, mark.label, mark.color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
