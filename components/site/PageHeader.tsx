import Image from "next/image";

/**
 * Đầu trang con: ảnh nền tối + tiêu đề lớn. Dùng cho mọi trang trừ trang chủ.
 * Chiều cao vừa phải để trên điện thoại không chiếm hết màn hình.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  image?: string;
}) {
  return (
    <section className="relative flex h-[46vh] min-h-[340px] items-center justify-center overflow-hidden lg:h-[54vh]">
      {/* Ảnh có thể trống nếu chủ quán chưa up tấm nào cho mục tương ứng —
          khi đó chỉ hiện nền xanh đậm, vẫn đẹp chứ không vỡ hình. */}
      {image ? (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div className="absolute inset-0 bg-shade/78" />
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto max-w-2xl px-5 pt-16 text-center">
        {eyebrow ? <p className="eyebrow mb-4 text-gold">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-6xl">
          {title}
        </h1>
        {lead ? (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
