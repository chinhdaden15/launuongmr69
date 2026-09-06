/**
 * Tiêu đề mục dùng chung: chữ nhỏ in hoa ở trên, tiêu đề lớn, mô tả ngắn.
 * Mọi mục trên trang chủ đều dùng thành phần này nên nhìn rất đồng bộ.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "ink",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  tone?: "ink" | "cream";
}) {
  const isCenter = align === "center";
  const titleColor = tone === "cream" ? "text-cream" : "text-ink";
  const leadColor = tone === "cream" ? "text-cream/72" : "text-ink-soft";
  // Trên nền tối dùng vàng nhạt, trên nền kem dùng nâu đồng — để chữ luôn rõ.
  const eyebrowColor = tone === "cream" ? "text-gold" : "text-accent";
  const ruleColor = tone === "cream" ? "bg-gold/55" : "bg-accent/45";

  return (
    <div className={`${isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow ? (
        <div
          className={`eyebrow mb-4 flex items-center gap-3 ${eyebrowColor} ${isCenter ? "justify-center" : ""}`}
        >
          <span className={`h-px w-8 ${ruleColor}`} aria-hidden />
          {eyebrow}
          <span className={`h-px w-8 ${ruleColor}`} aria-hidden />
        </div>
      ) : null}

      <h2
        className={`font-display text-3xl leading-[1.15] sm:text-4xl lg:text-5xl ${titleColor}`}
      >
        {title}
      </h2>

      {lead ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${leadColor}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
