interface ComboMeterProps {
  combo: number;
}

export default function ComboMeter({ combo }: ComboMeterProps) {
  if (combo < 2) return null;
  return (
    <div className="combo-meter" key={combo}>
      COMBO <span className="num">&times;{combo}</span> ★
    </div>
  );
}
