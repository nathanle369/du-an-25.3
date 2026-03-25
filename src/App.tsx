import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Download, Check, Star, Plus, X, ArrowRight, ShieldCheck, Mail, Infinity as InfinityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const VCB_CONFIG = {
  accountNo: '1234567890',
  accountName: 'NGUYEN VAN A',
  pdfUrl: '#', // Replace with actual PDF link
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [orderRef, setOrderRef] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPricingVisible, setIsPricingVisible] = useState(false);

  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Countdown logic
    const KEY = 'claude_sale_end_v3';
    const SALE_DAYS = 7;
    let endTs = parseInt(localStorage.getItem(KEY) || '0', 10);
    
    if (!endTs) {
      const d = new Date();
      d.setDate(d.getDate() + SALE_DAYS);
      d.setHours(23, 59, 59, 0);
      endTs = d.getTime();
      localStorage.setItem(KEY, endTs.toString());
    }

    const timer = setInterval(() => {
      const diff = Math.max(0, endTs - Date.now());
      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);

    // Scroll logic
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect();
        setIsPricingVisible(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const genRef = () => {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ts = Date.now().toString().slice(-4);
    return `CLAUDE${ts}${rand}`;
  };

  const handleOpenPayment = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setOrderRef(genRef());
    document.body.classList.add('modal-open');
  };

  const handleClosePayment = () => {
    setIsModalOpen(false);
    document.body.classList.remove('modal-open');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id.replace('pm-', '')]: e.target.value });
  };

  const isFormValid = formData.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <div id="annoBar" className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-4 h-11 px-[5%] border-b border-white/15 flex-wrap" style={{
        background: 'linear-gradient(90deg,#6B1515 0%,#8B1E1E 35%,#A32020 50%,#8B1E1E 65%,#6B1515 100%)'
      }}>
        {!isExpired ? (
          <>
            <span className="text-[0.75rem] text-white/90 font-semibold whitespace-nowrap tracking-[0.3px]">
              🔥 <strong className="text-white">ƯU ĐÃI KẾT THÚC SAU:</strong>
            </span>
            <div className="flex items-center gap-[5px]">
              {timeLeft.days > 0 && (
                <>
                  <div className="ab-unit">
                    <span className="ab-num">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="ab-lbl">Ngày</span>
                  </div>
                  <span className="ab-sep">:</span>
                </>
              )}
              <div className="ab-unit">
                <span className="ab-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="ab-lbl">Giờ</span>
              </div>
              <span className="ab-sep">:</span>
              <div className="ab-unit">
                <span className="ab-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="ab-lbl">Phút</span>
              </div>
              <span className="ab-sep">:</span>
              <div className="ab-unit">
                <span className="ab-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="ab-lbl">Giây</span>
              </div>
            </div>
            <span className="text-[0.72rem] text-white/60 whitespace-nowrap hidden sm:inline">
              Sau đó giá trở về <s>499.000đ</s>
            </span>
            <button onClick={handleOpenPayment} className="bg-[#F0B429] text-[#1A1C2E] text-[0.72rem] font-bold py-[5px] px-4 rounded-full cursor-pointer whitespace-nowrap tracking-[0.5px] transition-opacity hover:opacity-85">
              Mua 99k →
            </button>
          </>
        ) : (
          <span className="text-[0.82rem] text-white/70 text-center w-full">
            Chương trình ưu đãi đã kết thúc &nbsp;·&nbsp; Giá hiện tại: <strong className="text-white">499.000đ</strong>
          </span>
        )}
      </div>

      <nav className={`nav ${isScrolled ? 'bg-black/97' : 'bg-black/92'}`} id="topNav">
        <div className="nav-brand">Claude Mastery 2026</div>
        <button className="nav-cta" onClick={handleOpenPayment}>Mua ngay — Chỉ 99.000đ</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow glow-1"></div>
        <div className="hero-glow glow-2"></div>
        <div className="hero-glow glow-3"></div>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            eBook Thực Chiến · Cập nhật 2026
          </div>

          <h1 className="hero-title">
            Biến Claude Thành<br />
            <em>Trợ Lý Điều Hành</em><br />
            Cá Nhân Của Bạn
          </h1>
          <p className="hero-title-sub">— Từ người dùng thông thường thành chuyên gia AI —</p>

          <p className="hero-desc">
            Hướng dẫn <strong>duy nhất</strong> chỉ bạn cách xây dựng hệ điều hành AI hoàn chỉnh — từ cách đặt câu hỏi đúng, tạo Skills tự động hóa, đến kết nối toàn bộ công cụ làm việc hàng ngày của bạn.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-big">8</span>
              <span className="stat-small">Chương học</span>
            </div>
            <div className="hero-stat">
              <span className="stat-big">3</span>
              <span className="stat-small">Framework</span>
            </div>
            <div className="hero-stat">
              <span className="stat-big">5h+</span>
              <span className="stat-small">Tiết kiệm/ngày</span>
            </div>
            <div className="hero-stat">
              <span className="stat-big">99k</span>
              <span className="stat-small">Giá ưu đãi</span>
            </div>
          </div>

          <div className="hero-btns">
            <button className="btn-primary" onClick={handleOpenPayment}>
              <Download size={18} strokeWidth={2.5} />
              Mua Ngay — Chỉ 99.000đ
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('curriculum')}>
              Xem nội dung →
            </button>
          </div>

          <div className="hero-trust">
            <span><Check className="trust-icon" size={14} /> Giảm 80% có thời hạn</span>
            <span><Check className="trust-icon" size={14} /> Thanh toán một lần, dùng mãi</span>
            <span><Check className="trust-icon" size={14} /> Cập nhật miễn phí trọn đời</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <span className="section-kicker reveal visible">Vấn đề thực tế</span>
        <h2 className="section-title reveal visible">Bạn đang dùng Claude như<br /><em>99% người dùng thông thường</em></h2>
        <p className="section-desc reveal visible">Và đó là lý do tại sao kết quả bạn nhận được chỉ ở mức trung bình — trong khi những người biết cách sử dụng đúng đang tiết kiệm hàng giờ mỗi ngày.</p>

        <div className="pain-grid">
          <div className="pain-card reveal visible">
            <div className="pain-num">01</div>
            <h3>Prompt mơ hồ, kết quả chung chung</h3>
            <p>Bạn gõ một câu, nhận về một đoạn văn generic mà Google cũng có thể tìm ra. Không hành động được, không cụ thể cho tình huống của bạn.</p>
          </div>
          <div className="pain-card reveal visible">
            <div className="pain-num">02</div>
            <h3>Giải thích lại từ đầu mỗi cuộc chat</h3>
            <p>"Tôi là X, tôi làm Y, khách hàng của tôi là Z..." — bạn lặp đi lặp lại điều này hàng chục lần mỗi tuần. Lãng phí thời gian và công sức vô ích.</p>
          </div>
          <div className="pain-card reveal visible">
            <div className="pain-num">03</div>
            <h3>Không biết các tính năng mạnh nhất</h3>
            <p>Skills, Projects, Connectors, DBS Framework — những tính năng này biến Claude thành hệ thống tự động hóa thực sự, nhưng hầu hết không biết chúng tồn tại.</p>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="transform">
        <div className="transform-inner">
          <div className="transform-header">
            <span className="section-kicker reveal visible">Sự khác biệt</span>
            <h2 className="section-title reveal visible">Trước và sau khi đọc eBook này</h2>
            <p className="section-desc reveal visible">Không phải lý thuyết — đây là những thay đổi thực tế bạn sẽ trải qua.</p>
          </div>

          <div className="before-after reveal visible">
            <div className="ba-col ba-before">
              <div className="ba-label">
                <span>✗</span> TRƯỚC KHI ĐỌC
              </div>
              <ul className="ba-items">
                <li><span className="ba-marker">✗</span>Gõ câu hỏi một dòng, nhận về câu trả lời chung chung</li>
                <li><span className="ba-marker">✗</span>Phải giải thích lại bản thân mỗi cuộc trò chuyện mới</li>
                <li><span className="ba-marker">✗</span>Chỉ dùng chat — không biết Skills, Projects tồn tại</li>
                <li><span className="ba-marker">✗</span>Mất 2-3 giờ cho việc lẽ ra AI có thể làm trong 5 phút</li>
                <li><span className="ba-marker">✗</span>Claude làm việc theo cách nó muốn, không theo cách bạn muốn</li>
                <li><span className="ba-marker">✗</span>Không có hệ thống — mỗi lần dùng là bắt đầu lại từ zero</li>
              </ul>
            </div>
            <div className="ba-divider"><span className="ba-arrow">→</span></div>
            <div className="ba-col ba-after">
              <div className="ba-label">
                <span>✓</span> SAU KHI ĐỌC
              </div>
              <ul className="ba-items">
                <li><span className="ba-marker">✓</span>Framework GCAO tạo ra kết quả cụ thể, hành động được ngay</li>
                <li><span className="ba-marker">✓</span>AI OS cá nhân — Claude hiểu bạn từ lần đầu tiên</li>
                <li><span className="ba-marker">✓</span>Skills tự động hóa toàn bộ tác vụ lặp đi lặp lại</li>
                <li><span className="ba-marker">✓</span>Daily brief, proposals, thuyết trình — tự chạy mỗi sáng</li>
                <li><span className="ba-marker">✓</span>Claude làm việc đúng phong cách, đúng quy trình của bạn</li>
                <li><span className="ba-marker">✓</span>Hệ thống phòng ban hoàn chỉnh — cơ sở hạ tầng thực sự</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="curriculum" id="curriculum">
        <div className="curriculum-inner">
          <div className="curriculum-header">
            <span className="section-kicker reveal visible">Nội dung</span>
            <h2 className="section-title reveal visible">8 Chương — Từ Cơ Bản Đến Hệ Thống</h2>
            <p className="section-desc reveal visible">Lộ trình được thiết kế để mỗi chương xây dựng trên nền tảng chương trước — bạn sẽ tiến bộ rõ rệt sau mỗi bài đọc.</p>
          </div>

          <div className="chapter-list">
            {[
              { id: '01', title: 'Bắt đầu với Claude — Tài khoản & Gói dịch vụ', desc: 'Chọn đúng gói, setup đúng cách ngay từ đầu. Tiết kiệm tiền và thời gian thử sai.', tags: ['Setup', 'Cơ bản'] },
              { id: '02', title: 'Nghệ thuật Prompting — Framework GCAO', desc: 'Framework 4 bước biến câu hỏi vô nghĩa thành lệnh AI thực thi chính xác 100%.', tags: ['Framework', 'Core Skill'] },
              { id: '03', title: 'Tìm kiếm Web & Nhận dạng Hình ảnh', desc: 'Khai phá sức mạnh của Vision và Web Search để nghiên cứu đối thủ trong vài giây.', tags: ['Research', 'Vision'] },
              { id: '04', title: 'Artifacts — Xây dựng Công cụ Tương tác', desc: 'Tạo ứng dụng, máy tính, dashboard bằng ngôn ngữ tự nhiên — không cần code.', tags: ['No-code', 'Build'] },
              { id: '05', title: 'Hệ Điều Hành AI — Custom Instructions & Projects', desc: 'Xây dựng AI OS 5 lớp để Claude hiểu bạn hoàn toàn mà không cần giải thích lại.', tags: ['AI OS', 'Projects'] },
              { id: '06', title: 'Claude Skills — Framework DBS', desc: 'Directions · Blueprints · Solutions — hệ thống 3 lớp tạo tự động hóa thực sự.', tags: ['Automation', 'DBS'] },
              { id: '07', title: 'Connectors & Lên lịch Tự động', desc: 'Kết nối Gmail, Calendar, Slack, Drive — Claude hành động trong công cụ thực của bạn.', tags: ['Connectors', 'Scheduling'] },
              { id: '08', title: 'Tổ chức theo Bộ phận — Hệ thống Hoàn chỉnh', desc: 'Xây dựng 4 phòng ban AI: Nội dung, Khách hàng, Tài chính, Vận hành.', tags: ['System', 'Advanced'] },
            ].map((ch, idx) => (
              <div key={ch.id} className={`chapter-item reveal visible reveal-delay-${(idx % 2) + 1}`}>
                <div className="ch-num-badge">{ch.id}</div>
                <div className="ch-content">
                  <h3>{ch.title}</h3>
                  <p>{ch.desc}</p>
                  <div className="ch-tags">
                    {ch.tags.map(tag => <span key={tag} className="ch-tag">{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="framework">
        <div className="framework-inner">
          <div className="framework-header">
            <span className="section-kicker reveal visible">Phương pháp độc quyền</span>
            <h2 className="section-title reveal visible">Framework DBS —<br /><em>Xương sống của mọi Automation</em></h2>
            <p className="section-desc reveal visible">Ba lớp phối hợp với nhau tạo ra một skill hoàn chỉnh, tái sử dụng được — và hoạt động trên cả OpenAI, Google Gemini, không chỉ riêng Claude.</p>
          </div>

          <div className="dbs-grid reveal visible">
            <div className="dbs-card dbs-d">
              <div className="dbs-letter">D</div>
              <div className="dbs-eng">Directions</div>
              <div className="dbs-viet">Hướng dẫn</div>
              <ul className="dbs-items">
                <li>File skill.md — bắt buộc</li>
                <li>Tên, mô tả kích hoạt</li>
                <li>Workflow từng bước rõ ràng</li>
                <li>Rules & guardrails</li>
                <li>Lệnh trigger (/today, /report...)</li>
              </ul>
            </div>
            <div className="dbs-card dbs-b">
              <div className="dbs-letter">B</div>
              <div className="dbs-eng">Blueprints</div>
              <div className="dbs-viet">Bản thiết kế</div>
              <ul className="dbs-items">
                <li>Thư mục references/</li>
                <li>Hướng dẫn giọng văn cá nhân</li>
                <li>Brand guide & màu sắc</li>
                <li>Cấu trúc slide, email mẫu</li>
                <li>Dữ liệu lịch sử, ví dụ chuẩn</li>
              </ul>
            </div>
            <div className="dbs-card dbs-s">
              <div className="dbs-letter">S</div>
              <div className="dbs-eng">Solutions</div>
              <div className="dbs-viet">Giải pháp code</div>
              <ul className="dbs-items">
                <li>Thư mục scripts/</li>
                <li>Python scripts tự động</li>
                <li>Gọi API bên ngoài Claude</li>
                <li>Xử lý file phức tạp</li>
                <li>Tích hợp dịch vụ bên thứ ba</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="proof-inner">
          <div className="proof-header">
            <span className="section-kicker reveal visible">Phản hồi thực tế</span>
            <h2 className="section-title reveal visible">Những người đã áp dụng<br />nói gì về eBook này?</h2>
          </div>

          <div className="testimonials">
            {[
              { name: 'Minh Tuấn', role: 'Founder, SaaS startup · Hà Nội', initial: 'M', text: 'Trước đây tôi mất 2 tiếng mỗi sáng kiểm tra email, lịch và lên kế hoạch. Sau khi tạo skill <strong>/today</strong> theo hướng dẫn trong eBook, toàn bộ quy trình đó chạy tự động trong 30 giây. Không phóng đại — đây là thay đổi lớn nhất trong workflow của tôi năm nay.' },
              { name: 'Lan Phương', role: 'Marketing Manager · TP.HCM', initial: 'L', text: 'Framework GCAO thay đổi hoàn toàn cách tôi viết prompt. Trước đó tôi nghĩ mình đã dùng AI tốt rồi, nhưng sau khi so sánh kết quả — sự khác biệt là <strong>như ngày và đêm</strong>. Bây giờ mọi câu trả lời đều cụ thể và hành động được ngay.', color: 'linear-gradient(135deg,#006E65,#00A899)' },
              { name: 'Hoàng Nam', role: 'Business Consultant · Đà Nẵng', initial: 'H', text: 'Tôi là tư vấn viên, mỗi tuần phải làm ít nhất 5-7 proposal cho khách. Sau khi tạo skill proposal theo DBS framework, tôi chỉ cần gõ tên khách hàng và vấn đề chính — <strong>Claude tạo ra proposal hoàn chỉnh trong 2 phút</strong>. Tiết kiệm hơn 10 tiếng mỗi tuần.', color: 'linear-gradient(135deg,#6A2B8A,#9B59B6)' },
            ].map((t, idx) => (
              <div key={t.name} className={`testi reveal visible reveal-delay-${idx + 1}`}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => <Star key={i} className="star fill-current" size={14} />)}
                </div>
                <div className="testi-quote">"</div>
                <p className="testi-text" dangerouslySetInnerHTML={{ __html: t.text }}></p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>{t.initial}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal visible bg-black rounded-[var(--r-lg)] p-9 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="border-r border-white/10 px-5">
              <div className="font-serif text-[2.2rem] font-bold text-[var(--gold-lt)] leading-none mb-1.5">5,000+</div>
              <div className="text-[0.72rem] text-white/35 uppercase tracking-widest">Người đọc</div>
            </div>
            <div className="md:border-r border-white/10 px-5">
              <div className="font-serif text-[2.2rem] font-bold text-[var(--gold-lt)] leading-none mb-1.5">4.9/5</div>
              <div className="text-[0.72rem] text-white/35 uppercase tracking-widest">Đánh giá</div>
            </div>
            <div className="border-r border-white/10 px-5">
              <div className="font-serif text-[2.2rem] font-bold text-[var(--gold-lt)] leading-none mb-1.5">10h+</div>
              <div className="text-[0.72rem] text-white/35 uppercase tracking-widest">Tiết kiệm/tuần</div>
            </div>
            <div className="px-5">
              <div className="font-serif text-[2.2rem] font-bold text-[var(--gold-lt)] leading-none mb-1.5">8</div>
              <div className="text-[0.72rem] text-white/35 uppercase tracking-widest">Chương thực chiến</div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="offer">
        <div className="offer-inner">
          <div className="offer-header">
            <span className="section-kicker reveal visible text-[var(--teal-lt)]">Bạn nhận được gì</span>
            <h2 className="section-title reveal visible text-white">Mọi thứ bạn cần để<br /><em>làm chủ Claude hoàn toàn</em></h2>
            <p className="section-desc reveal visible text-white/50">Không phải lý thuyết học thuật. Đây là hệ thống thực chiến được xây dựng từ hàng trăm giờ thực tế sử dụng Claude hàng ngày.</p>
          </div>

          <div className="offer-grid">
            {[
              { title: 'eBook PDF đầy đủ — 11 trang A4 chuẩn', desc: 'Layout chuyên nghiệp, biểu đồ trực quan, dễ đọc trên mọi thiết bị kể cả điện thoại.' },
              { title: 'Framework GCAO — Template prompting', desc: 'Template sẵn sàng điền vào và dùng ngay cho mọi loại công việc bạn cần Claude hỗ trợ.' },
              { title: 'DBS Framework — Bộ khung xây dựng Skill', desc: 'Hướng dẫn từng bước tạo Directions, Blueprints và Solutions cho bất kỳ automation nào.' },
              { title: 'AI OS Template — Custom Instructions mẫu', desc: 'Template 5 phần điền vào là xong — Claude sẽ hiểu bạn hoàn toàn từ cuộc trò chuyện đầu tiên.' },
              { title: '4 Bộ phận Skills — Cấu trúc phòng ban', desc: 'Nội dung, Khách hàng, Tài chính, Vận hành — với danh sách đầy đủ 20+ skills gợi ý cho từng bộ phận.' },
              { title: 'Cập nhật miễn phí trọn đời', desc: 'Claude liên tục ra tính năng mới. eBook sẽ được cập nhật và bạn nhận về phiên bản mới không tốn thêm.' },
            ].map((item, idx) => (
              <div key={item.title} className={`offer-item reveal visible reveal-delay-${(idx % 2) + 1}`}>
                <div className="offer-check"><Check size={14} /></div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing" ref={pricingRef}>
        <div className="pricing-inner">
          <span className="section-kicker reveal visible text-center block">Ưu đãi có thời hạn</span>
          <h2 className="section-title reveal visible text-center mb-11">Giảm 80% — Chỉ còn<br /><span className="text-[var(--gold)]">99.000đ</span></h2>

          <div className="price-box reveal visible">
            <div className="price-badge">🔥 Ưu đãi giới hạn — Giảm 80%</div>

            <div className="mb-6">
              <div className="text-[0.72rem] font-bold text-[var(--coral)] uppercase tracking-[2px] text-center mb-2.5 flex items-center justify-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--coral)] animate-pulse"></span>
                Ưu đãi kết thúc lúc 23:59 ngày <span className="text-[var(--coral)] font-extrabold">31/03/2026</span>
              </div>
              <div id="pricing-countdown" className="grid grid-cols-4 gap-2">
                <div className="pcd-unit">
                  <span className="pcd-num">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="pcd-lbl">Ngày</span>
                </div>
                <div className="pcd-unit">
                  <span className="pcd-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="pcd-lbl">Giờ</span>
                </div>
                <div className="pcd-unit">
                  <span className="pcd-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="pcd-lbl">Phút</span>
                </div>
                <div className="pcd-unit">
                  <span className="pcd-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="pcd-lbl">Giây</span>
                </div>
              </div>
            </div>

            <h3 className="price-title">Làm Chủ Claude Toàn Diện</h3>
            <p className="price-sub">eBook thực chiến + Template + Framework — tất cả trong một file PDF có thể download và dùng ngay lập tức.</p>

            <div className="price-row">
              <span className="price-old">499.000đ</span>
              <span className="price-currency">chỉ còn</span>
              <span className="price-new">99k</span>
            </div>
            <p className="price-note text-[var(--coral)] font-semibold">⚡ Giá ưu đãi kết thúc khi hết thời gian đếm ngược</p>

            <ul className="price-features">
              <li><span className="pf-check">✓</span> eBook PDF 11 trang A4</li>
              <li><span className="pf-check">✓</span> Framework GCAO template</li>
              <li><span className="pf-check">✓</span> DBS Framework đầy đủ</li>
              <li><span className="pf-check">✓</span> AI OS Custom Instructions</li>
              <li><span className="pf-check">✓</span> 20+ Skills gợi ý theo bộ phận</li>
              <li><span className="pf-check">✓</span> Cập nhật miễn phí trọn đời</li>
              <li><span className="pf-check">✓</span> Tương thích Claude 2026</li>
              <li><span className="pf-check">✓</span> Đọc được trên mọi thiết bị</li>
            </ul>

            <button className="btn-buy" onClick={handleOpenPayment}>
              <Download size={20} strokeWidth={2.5} />
              Mua Ngay — Chỉ 99.000đ
            </button>
            <div className="btn-buy-sub">
              <span><ShieldCheck size={14} /> Thanh toán an toàn</span>
              <span><Mail size={14} /> Nhận ngay qua email</span>
              <span><InfinityIcon size={14} /> Cập nhật trọn đời</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="faq-inner">
          <div className="faq-header">
            <span className="section-kicker reveal visible">Giải đáp thắc mắc</span>
            <h2 className="section-title reveal visible">Câu hỏi thường gặp</h2>
          </div>

          <div className="faq-list">
            {[
              { q: 'eBook này phù hợp với người mới hoàn toàn không biết gì về AI không?', a: 'Hoàn toàn phù hợp. eBook được thiết kế từ chương 01 là hướng dẫn đăng ký tài khoản, sau đó tăng dần độ phức tạp. Bạn không cần biết lập trình hay có nền tảng kỹ thuật. Tất cả đều được giải thích bằng ngôn ngữ đơn giản với ví dụ thực tế.' },
              { q: 'Tôi cần dùng gói Claude trả phí để áp dụng được không?', a: 'Không bắt buộc. Gói miễn phí của Claude đã đủ để thực hành tất cả các kỹ năng trong chương 1-4. Chương 5-8 về Skills và Connectors yêu cầu gói Pro ($20/tháng), nhưng eBook sẽ giúp bạn đánh giá xem có xứng đáng nâng cấp không trước khi quyết định. Với 99k đầu tư cho eBook, bạn sẽ biết ngay mình có cần Pro hay không.' },
              { q: 'Skills và DBS Framework có hoạt động ngoài Claude không?', a: 'Có. Định dạng skill là tiêu chuẩn mở — những gì bạn xây dựng hôm nay cũng hoạt động trên OpenAI Codex, Google Gemini và nhiều AI agents khác. Đây không phải kiến thức bị khóa vào một nền tảng.' },
              { q: 'Mất bao lâu để thấy kết quả sau khi đọc?', a: 'Chương 2 (Framework GCAO) bạn có thể áp dụng ngay trong cuộc trò chuyện tiếp theo với Claude và thấy sự khác biệt tức thì. Với AI OS và Skills, bạn cần 1-2 tuần để thiết lập, nhưng sau đó tiết kiệm hàng giờ mỗi tuần — vĩnh viễn.' },
              { q: 'eBook có được cập nhật khi Claude ra tính năng mới không?', a: 'Có. Bạn sẽ nhận thông báo qua email khi có phiên bản mới và download lại hoàn toàn miễn phí. Claude đang phát triển rất nhanh — chúng tôi cam kết cập nhật eBook theo từng đợt ra mắt tính năng lớn.' },
            ].map((faq, idx) => (
              <div key={idx} className={`faq-item reveal visible ${openFaqIndex === idx ? 'open' : ''}`}>
                <div className="faq-q" onClick={() => toggleFaq(idx)}>
                  {faq.q}
                  <span className="faq-icon">{openFaqIndex === idx ? '×' : '+'}</span>
                </div>
                <div className="faq-a">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="final-cta-inner">
          <span className="section-kicker reveal visible">Đừng chần chờ nữa</span>
          <h2 className="section-title reveal visible">
            Mỗi ngày không áp dụng<br />
            là <em>mỗi ngày lãng phí</em>
          </h2>
          <p className="final-cta-desc reveal visible">
            Những người đang dùng Claude đúng cách đang làm việc ít hơn bạn, nhưng đạt kết quả nhiều hơn. eBook này chỉ 99.000đ — ít hơn một ly cà phê mỗi ngày trong một tuần — nhưng giá trị nó mang lại là hàng giờ tiết kiệm mỗi ngày, mãi mãi.
          </p>
          <button className="btn-final reveal visible" onClick={handleOpenPayment}>
            <Download size={20} strokeWidth={2.5} />
            Mua Ngay — Chỉ 99.000đ
          </button>
          <p className="reveal visible mt-5 text-[0.78rem] text-white/25">
            Thanh toán một lần · Không phí ẩn · Cập nhật miễn phí mãi mãi
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--ink-mid)] py-10 px-[5%] text-center border-t border-white/5">
        <p className="text-[0.78rem] text-white/25 leading-[1.8]">
          <strong className="text-white/50">Claude Mastery 2026</strong> · Hướng dẫn toàn diện làm chủ Claude<br />
          eBook được tổng hợp và biên soạn bởi những người dùng Claude chuyên sâu nhất<br />
          Cập nhật định kỳ theo các phiên bản Claude mới · Miễn phí hoàn toàn
        </p>
      </footer>

      {/* Floating CTA Bar */}
      <div className={`float-bar ${!isPricingVisible ? 'flex' : 'hidden'}`} id="floatBar" style={{ opacity: isScrolled ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="float-bar-text">
          <strong className="text-[var(--gold-lt)] text-[0.9rem] block">Chỉ 99.000đ — Giảm 80%</strong>
          Làm Chủ Claude 2026
        </div>
        <button className="float-btn" onClick={handleOpenPayment}>Mua Ngay</button>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/88 backdrop-blur-md overflow-y-auto p-5 flex items-start justify-center"
            onClick={(e) => e.target === e.currentTarget && handleClosePayment()}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-[24px] w-full max-w-[500px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[var(--ink)] p-5 md:px-6 flex items-center justify-between">
                <div>
                  <div className="text-[0.65rem] text-white/35 tracking-[2px] uppercase mb-0.5">Thanh toán bảo mật</div>
                  <div className="font-serif text-[1.15rem] font-bold text-white">Làm Chủ Claude 2026</div>
                </div>
                <button onClick={handleClosePayment} className="bg-white/10 border-none text-white/70 w-[34px] h-[34px] rounded-full cursor-pointer text-[1.3rem] flex items-center justify-center transition-colors hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              {/* Steps Bar */}
              <div className="flex bg-[#F8F8F6] border-b border-[#EEECE8]">
                <div className={`pm-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'done' : ''}`}>
                  <span className="pm-step-num">1</span>
                  <span className="pm-step-lbl">Thông tin</span>
                </div>
                <div className={`pm-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'done' : ''}`}>
                  <span className="pm-step-num">2</span>
                  <span className="pm-step-lbl">Chuyển khoản</span>
                </div>
                <div className={`pm-step ${currentStep === 3 ? 'active' : ''}`}>
                  <span className="pm-step-num">3</span>
                  <span className="pm-step-lbl">Nhận eBook</span>
                </div>
              </div>

              {/* Step 1 Panel */}
              {currentStep === 1 && (
                <div className="pm-panel p-6">
                  <h3 className="text-[0.95rem] font-bold text-[var(--ink)] mb-1">Điền thông tin để nhận eBook</h3>
                  <p className="text-[0.8rem] text-[var(--muted)] mb-4.5 leading-[1.6]">eBook PDF sẽ được gửi đến email của bạn ngay sau khi xác nhận thanh toán.</p>

                  <div className="mb-3">
                    <label className="pm-label">Họ và tên <span className="text-[var(--coral)]">*</span></label>
                    <input id="pm-name" type="text" className={`pm-input ${formData.name ? (formData.name.length >= 2 ? 'valid' : 'invalid') : ''}`} placeholder="Nguyễn Văn A" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="pm-label">Email nhận eBook <span className="text-[var(--coral)]">*</span></label>
                    <input id="pm-email" type="email" className={`pm-input ${formData.email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'valid' : 'invalid') : ''}`} placeholder="email@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="mb-4.5">
                    <label className="pm-label">Số điện thoại (để hỗ trợ nếu cần)</label>
                    <input id="pm-phone" type="tel" className="pm-input" placeholder="09xxxxxxxx" value={formData.phone} onChange={handleInputChange} />
                  </div>

                  {isFormValid && (
                    <div className="bg-gradient-to-br from-[#E8F7F5] to-[#F0FFF8] border-[1.5px] border-[var(--teal)] rounded-[14px] p-4 mb-4">
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="text-[1.3rem]">🎁</span>
                        <div>
                          <div className="text-[0.82rem] font-bold text-[var(--teal)]">Thông tin hợp lệ!</div>
                          <div className="text-[0.75rem] text-[#005A52]">Bạn có thể tải eBook ngay bây giờ</div>
                        </div>
                      </div>
                      <a href={VCB_CONFIG.pdfUrl} download="Claude-Mastery-2026.pdf" className="flex items-center justify-center gap-2 bg-[var(--teal)] text-white font-bold text-[0.88rem] py-3 px-5 rounded-full no-underline transition-opacity hover:opacity-85 w-full">
                        <Download size={16} strokeWidth={2.5} />
                        Tải eBook Ngay — Miễn phí
                      </a>
                    </div>
                  )}

                  <button onClick={() => isFormValid && setCurrentStep(2)} disabled={!isFormValid} className="pm-btn-primary">
                    Tiếp tục → Thanh toán 99.000đ
                  </button>
                  <p className="text-center text-[0.72rem] text-[var(--muted)] mt-2.5">🔒 Thông tin được bảo mật tuyệt đối</p>
                </div>
              )}

              {/* Step 2 Panel */}
              {currentStep === 2 && (
                <div className="pm-panel p-6">
                  <div className="bg-[#F8F8F6] rounded-[12px] p-3.5 mb-4.5">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[0.8rem] text-[var(--muted)]">Sản phẩm</span>
                      <span className="text-[0.8rem] font-semibold text-[var(--ink)]">eBook Làm Chủ Claude 2026</span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[0.8rem] text-[var(--muted)]">Gửi đến</span>
                      <span className="text-[0.8rem] font-semibold text-[var(--ink)]">{formData.email}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#E8E8E8] mt-1">
                      <span className="text-[0.88rem] font-bold text-[var(--ink)]">Tổng thanh toán</span>
                      <span className="text-[1rem] font-extrabold text-[var(--gold)]">99.000 VNĐ</span>
                    </div>
                  </div>

                  <h3 className="text-[0.95rem] font-bold text-[var(--ink)] mb-1 text-center">Quét mã QR để chuyển khoản</h3>
                  <p className="text-[0.78rem] text-[var(--muted)] text-center mb-3.5">Dùng <strong>VCB Digibank</strong> hoặc bất kỳ app ngân hàng nào hỗ trợ VietQR</p>

                  <div className="text-center mb-3.5 relative">
                    <div className="inline-block p-2.5 bg-white border-2 border-[#EEECE8] rounded-[16px] shadow-md">
                      <img src={`https://img.vietqr.io/image/vietcombank-${VCB_CONFIG.accountNo}-compact2.png?amount=99000&addInfo=${orderRef}&accountName=${encodeURIComponent(VCB_CONFIG.accountName)}`} alt="VietQR" className="w-[190px] h-[190px] block rounded-[8px]" />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      <span className="text-[0.72rem] font-bold text-[#007B3F]">Vietcombank</span>
                      <span className="text-[0.72rem] text-[var(--muted)]">× VietQR</span>
                    </div>
                  </div>

                  <div className="bg-[#F8F8F6] rounded-[12px] overflow-hidden mb-3.5 text-[0.82rem]">
                    <div className="bank-row">
                      <span className="bank-k">Ngân hàng</span>
                      <span className="bank-v font-bold text-[#007B3F]">Vietcombank (VCB)</span>
                    </div>
                    <div className="bank-row">
                      <span className="bank-k">Số tài khoản</span>
                      <span className="bank-v font-bold">{VCB_CONFIG.accountNo}</span>
                      <button onClick={() => copyToClipboard(VCB_CONFIG.accountNo)} className="ml-1.5 px-2 py-0.5 border border-gray-300 rounded-md text-[0.68rem] text-[var(--teal)] hover:bg-[#E8F7F5]">Copy</button>
                    </div>
                    <div className="bank-row">
                      <span className="bank-k">Chủ tài khoản</span>
                      <span className="bank-v font-bold uppercase">{VCB_CONFIG.accountName}</span>
                    </div>
                    <div className="bank-row">
                      <span className="bank-k">Nội dung CK</span>
                      <span className="bank-v font-bold font-mono text-[0.78rem] text-[var(--coral)]">{orderRef}</span>
                      <button onClick={() => copyToClipboard(orderRef)} className="ml-1.5 px-2 py-0.5 border border-gray-300 rounded-md text-[0.68rem] text-[var(--teal)] hover:bg-[#E8F7F5]">Copy</button>
                    </div>
                  </div>

                  <button onClick={() => setCurrentStep(3)} className="pm-btn-secondary">
                    ✓ Tôi đã chuyển khoản — Xác nhận ngay
                  </button>

                  <button onClick={() => setCurrentStep(1)} className="w-full mt-2 bg-transparent border border-gray-300 rounded-full py-2.5 text-[0.82rem] text-[var(--muted)] transition-colors hover:border-gray-400">← Quay lại</button>
                </div>
              )}

              {/* Step 3 Panel */}
              {currentStep === 3 && (
                <div className="pm-panel p-6 md:p-9 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center mx-auto mb-5 text-[2.2rem] text-white shadow-lg animate-bounce">✓</div>
                  <h3 className="font-serif text-[1.6rem] font-bold text-[var(--ink)] mb-2">Thanh toán thành công! 🎉</h3>
                  <p className="text-[0.88rem] text-[var(--muted)] mb-1">eBook đã được gửi đến:</p>
                  <p className="text-[0.95rem] font-bold text-[var(--ink)] mb-6">{formData.email}</p>

                  <div className="bg-gradient-to-br from-[#F0FFF8] to-[#E8F7F5] border-[1.5px] border-[#A9DFBF] rounded-[18px] p-5.5 mb-5">
                    <p className="text-[0.82rem] text-[#1E8449] font-bold mb-3.5">📥 Download trực tiếp tại đây:</p>
                    <a href={VCB_CONFIG.pdfUrl} download="Claude-Mastery-2026.pdf" className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#27AE60] to-[#2ECC71] text-white font-bold text-[0.92rem] py-3.5 px-8 rounded-full no-underline w-full shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
                      <Download size={18} strokeWidth={2.5} />
                      Download eBook PDF Ngay
                    </a>
                  </div>

                  <div className="text-[0.78rem] text-[var(--muted)] leading-[1.8]">
                    Kiểm tra hộp thư (kể cả <strong>Spam/Junk</strong>) nếu chưa nhận email.<br />
                    Hỗ trợ: <strong className="text-[var(--ink)]">support@claudemastery.com</strong>
                  </div>

                  <button onClick={handleClosePayment} className="mt-4.5 bg-transparent border-none text-[var(--teal)] text-[0.82rem] font-semibold cursor-pointer underline">Đóng cửa sổ</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
