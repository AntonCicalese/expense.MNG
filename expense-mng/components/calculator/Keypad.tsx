import { CalcButton } from "./Button";

interface KeypadProps {
  onNumberClick: (num: string) => void;
  onComputeClick: () => void;
  onDeleteClick: () => void;
  onDeleteAllClick: () => void;
}

export function Keypad({
  onNumberClick,
  onComputeClick,
  onDeleteClick,
  onDeleteAllClick,
}: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Top row */}
      <CalcButton variant="special" clickFunction={onNumberClick} char="(" />
      <CalcButton variant="special" clickFunction={onNumberClick} char=")" />
      <CalcButton variant="danger" clickFunction={onDeleteAllClick} char="AC"></CalcButton>
      <CalcButton variant="op" clickFunction={onNumberClick} char="÷" />

      {/* 1–3 row */}
      <CalcButton variant="number" clickFunction={onNumberClick} char="1" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="2" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="3" />
      <CalcButton variant="op" clickFunction={onNumberClick} char="×" />

      {/* 4–6 row */}
      <CalcButton variant="number" clickFunction={onNumberClick} char="4" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="5" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="6" />
      <CalcButton variant="op" clickFunction={onNumberClick} char="-" />

      {/* 7–9 row */}
      <CalcButton variant="number" clickFunction={onNumberClick} char="7" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="8" />
      <CalcButton variant="number" clickFunction={onNumberClick} char="9" />
      <CalcButton variant="op" clickFunction={onNumberClick} char="+" />

      {/* Bottom row */}
      <CalcButton variant="special" clickFunction={onDeleteClick} char="C"></CalcButton>
      <CalcButton variant="number" clickFunction={onNumberClick} char="0" />
      <CalcButton variant="special" clickFunction={onNumberClick} char="." />
      <CalcButton variant="accent" clickFunction={onComputeClick} char="="></CalcButton>
    </div>
  );
}
