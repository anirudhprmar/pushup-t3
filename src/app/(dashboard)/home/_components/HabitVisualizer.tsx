export default function HabitVisualizer() {
  const totalDots = 365;
  const containerSize = 330;
  const dotsPerRow = Math.ceil(Math.sqrt(totalDots)); // 20
  const spacing = containerSize / (dotsPerRow + 1); // even spacing

  const dots = [];

  for (let i = 0; i < totalDots; i++) {
    const row = Math.floor(i / dotsPerRow);
    const col = i % dotsPerRow;

    const x = spacing + col * spacing;
    const y = spacing + row * spacing;

    dots.push({ x, y, day: i + 1 });
  }

  return (
    <div className="flex flex-col items-center justify-center ">

      <div
        className="relative rounded-lg "
        style={{
          width: containerSize,
          height: containerSize,
        //   boxShadow: '0 0 40px rgba(30, 41, 59, 0.8)',
        }}
      >
        {dots.map(({ x, y, day }) => (
          <div
            key={day}
            className={day === 2 || day ===1 || day === 3 ? "bg-white absolute w-2 h-2 rounded-full":"absolute w-2 h-2 rounded-full bg-blue-700"}
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
            title={`Day ${day}`}
          />
        ))}
      </div>
    </div>
  );
}
