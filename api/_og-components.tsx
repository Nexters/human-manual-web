// api/og/invite.tsx, api/og/compat.tsx 가 공유하는 "캐릭터 + 이름표" 열 하나.
export function PersonColumn({
  imageSrc,
  noun,
  name,
}: {
  imageSrc: string;
  noun: string;
  name: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <img
        src={imageSrc}
        width={180}
        height={180}
        style={{ objectFit: "contain", borderRadius: "50%", background: "#FFFFFF" }}
      />
      <div
        style={{
          display: "flex",
          background: "#FCE7F3",
          borderRadius: 999,
          padding: "8px 20px",
          fontSize: 20,
          color: "#831843",
        }}
      >
        {noun}
      </div>
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#1F2937" }}>{name}</div>
    </div>
  );
}
