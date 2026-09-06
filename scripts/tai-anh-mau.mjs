/**
 * Tải ảnh mẫu từ Unsplash về thư mục public/uploads.
 *
 * Ảnh Unsplash dùng được miễn phí kể cả cho mục đích thương mại, không cần
 * ghi nguồn. Đây CHỈ LÀ ẢNH MẪU để bạn thấy bố cục — hãy thay bằng ảnh thật
 * chụp tại quán trước khi đưa website lên tên miền.
 *
 * Chạy lại: node scripts/tai-anh-mau.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(OUT, { recursive: true });

/** [tên file, mã ảnh Unsplash, rộng, cao] */
const ANH = [
  // --- Ảnh bìa trang chủ ---
  ["hero-1", "photo-1708388064672-6536507fdf6e", 1920, 1080],
  ["hero-2", "photo-1614104030967-5ca61a54247b", 1920, 1080],
  ["hero-3", "photo-1526069631228-723c945bea6b", 1920, 1080],

  // --- Khối giới thiệu (ảnh dọc) ---
  ["about", "photo-1521017432531-fbd92d768814", 900, 1150],

  // --- Nhóm món ---
  ["cat-lau", "photo-1662655552348-4ad26f9d4e75", 900, 700],
  ["cat-nuong", "photo-1677029979796-906d97385651", 900, 700],
  ["cat-combo", "photo-1568360987818-833c9383a326", 900, 700],
  ["cat-nhau", "photo-1563551342810-8da014a2160f", 900, 700],
  ["cat-them", "photo-1583328656355-c9594923462c", 900, 700],
  ["cat-uong", "photo-1533007716222-4b465613a984", 900, 700],

  // --- Món ăn ---
  ["mon-lau-thai", "photo-1608229642114-0061d4e6a9ab", 800, 600],
  ["mon-lau-song-vi", "photo-1611345157614-26d3bdd10c93", 800, 600],
  ["mon-lau-ga", "photo-1682496178113-6275890f1fd7", 800, 600],
  ["mon-lau-bo", "photo-1621916805571-2e804f82170c", 800, 600],
  ["mon-ba-chi-bo", "photo-1632558610168-8377309e34c7", 800, 600],
  ["mon-suon-heo", "photo-1700077103134-17a454ee5f09", 800, 600],
  ["mon-bach-tuoc", "photo-1606850780554-b55ea4dd0b70", 800, 600],
  ["mon-ga-nuong", "photo-1709433420612-8cad609df914", 800, 600],
  ["mon-tom-nuong", "photo-1737140790080-2476f8600131", 800, 600],
  ["mon-nam-bo", "photo-1677029969065-c9f4003a9ad5", 800, 600],
  ["combo-2", "photo-1723437395525-77b08e41e53c", 800, 600],
  ["combo-4", "photo-1697603899621-4fcc1f7f548a", 800, 600],
  ["combo-6", "photo-1665083231512-39c945f90d54", 800, 600],
  ["mon-chan-ga", "photo-1705366960961-026ae4297a68", 800, 600],
  ["mon-khoai-tay", "photo-1584269974503-653d2d40c75c", 800, 600],
  ["mon-nem-chua", "photo-1584225064769-e372be09a775", 800, 600],
  ["mon-rau", "photo-1583328439472-8130d925d63c", 800, 600],
  ["mon-mi", "photo-1633421055454-c32a8665db49", 800, 600],
  ["mon-nam", "photo-1504545102780-26774c1bb073", 800, 600],
  ["mon-bia", "photo-1698925724585-80e161c60a9a", 800, 600],
  ["mon-tra-dao", "photo-1623123093752-b59353db6a5e", 800, 600],
  ["mon-nuoc-ep", "photo-1601390395693-364c0e22031a", 800, 600],

  // --- Ưu đãi ---
  ["promo-1", "photo-1584509171119-9054d2d7d9a7", 1200, 800],
  ["promo-2", "photo-1519671282429-b44660ead0a7", 1200, 800],
  ["promo-3", "photo-1708388064287-4cb063e84b65", 1200, 800],

  // --- Chi nhánh ---
  ["branch-1", "photo-1685719730785-256ba3187893", 1200, 800],
  ["branch-2", "photo-1636405189493-181ecf851006", 1200, 800],

  // --- Thư viện ảnh ---
  ["gal-1", "photo-1652195960911-c9f55224bd89", 1000, 750],
  ["gal-2", "photo-1708388064345-3179039b3999", 1000, 750],
  ["gal-3", "photo-1670819917685-f1040e76b9b7", 1000, 750],
  ["gal-4", "photo-1578231177134-f1bbe379b054", 1000, 750],
  ["gal-5", "photo-1658853577859-7a75373c2675", 1000, 750],
  ["gal-6", "photo-1568360987818-833c9383a326", 1000, 750],
  ["gal-7", "photo-1702012464343-a9966c1a9ead", 1000, 750],
  ["gal-8", "photo-1528605248644-14dd04022da1", 1000, 750],
  ["gal-9", "photo-1527529482837-4698179dc6ce", 1000, 750],
];

let ok = 0;
let loi = 0;

for (const [ten, ma, w, h] of ANH) {
  const url = `https://images.unsplash.com/${ma}?w=${w}&h=${h}&fit=crop&crop=entropy&q=78&fm=jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error("file quá nhỏ, có thể lỗi");
    fs.writeFileSync(path.join(OUT, `${ten}.jpg`), buf);
    ok++;
    process.stdout.write(".");
  } catch (err) {
    loi++;
    console.error(`\n  ✗ ${ten}: ${err.message}`);
  }
}

console.log(`\nTải xong: ${ok} ảnh thành công, ${loi} lỗi.`);
