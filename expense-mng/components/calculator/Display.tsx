interface DisplayProps {
  expression: string;
  previous: string;
}

export function Display({ expression, previous }: DisplayProps) {
    return (
        <section className="w-full min-h-16 rounded-2xl bg-background-light/90 backdrop-blur-xl border border-background-light/50 shadow-inner px-4 py-3">
            <div className="flex flex-col items-end gap-1">
                {/* Previous calculation */}
                <span className="text-xs text-subheader tracking-widest max-w-full min-h-4">
                    {previous || ""}
                </span>

                {/* Main value */}
                <span className="text-xl md:text-2xl text-header tracking-widest max-w-full font-mono">
                    {expression || "0"}
                </span>
            </div>
        </section>
    );
}