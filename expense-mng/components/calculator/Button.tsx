type Variant = 'number' | 'op' | 'special' | 'danger' | 'accent';

const variantClasses: Record<Variant, string> = {
    number:  "bg-background-light hover:bg-background-light/70 border border-background-light/50 text-header text-lg",
    op:      "bg-accent/90 hover:bg-accent-dark/90 border border-accent/50 text-background font-bold text-lg",
    special: "bg-background-light hover:bg-background-light/70 border border-background-light/50 text-subheader",
    danger:  "bg-background-light hover:bg-background-light/70 border border-accent/50 text-header font-bold",
    accent:  "bg-accent/90 hover:bg-accent-dark/90 border border-accent/50 text-background font-bold text-base",
};

const baseBtn =
    "aspect-square rounded-xl backdrop-blur-sm " +
    "hover:-translate-y-0.5 transition-all duration-100 font-mono " +
    "flex items-center justify-center active:scale-[0.98]";

interface CalcButtonProps {
  variant: Variant;
  clickFunction: (num: string) => void,
  char: string
}

export function CalcButton({ variant, clickFunction, char }: CalcButtonProps) {
    return (
        <button className={`${baseBtn} ${variantClasses[variant]}`} onClick={() => clickFunction(char)}>
            {char}
        </button>
    )
}