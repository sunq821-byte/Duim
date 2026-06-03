const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" × 5.625"
pres.author = "AI Native Team";
pres.title = "基于大语言模型的AI Native事务管理系统 · 科研项目答辩";

// ============================================================
// DESIGN SYSTEM — Color Constants (no # prefix for pptxgenjs)
// ============================================================
const C = {
  bg: "F5F7FA",
  cardBg: "FFFFFF",
  text1: "1F2937",
  text2: "6B7280",
  text3: "9CA3AF",
  aiPrimary: "4F46E5",
  aiLight: "6C63FF",
  aiPurple: "8B5CF6",
  success: "10B981",
  successBg: "ECFDF5",
  successText: "065F46",
  warn: "F59E0B",
  warnBg: "FFFBEB",
  warnText: "92400E",
  error: "EF4444",
  border: "E5E7EB",
  borderStrong: "D1D5DB",
  blue: "3B82F6",
  blueBg: "EFF6FF",
  codeBg: "1E293B",
  codeText: "E2E8F0",
  lightCodeBg: "F1F5F9",
  grayTag: "F3F4F6",
  timelineGray: "D1D5DB",
};

const FONT = {
  display: "Noto Sans SC",
  body: "Arial",
  mono: "Consolas",
};

// ============================================================
// HELPER FACTORIES (fresh objects every call — avoid mutation bugs)
// ============================================================
const makeShadow = () => ({
  type: "outer",
  blur: 6,
  offset: 2,
  angle: 135,
  color: "000000",
  opacity: 0.08,
});

const makeCardShadow = () => ({
  type: "outer",
  blur: 4,
  offset: 1,
  angle: 135,
  color: "000000",
  opacity: 0.06,
});

// ============================================================
// COMMON SLIDE CHROME (top bar + footer)
// ============================================================
function addChrome(slide, leftLabel, pageLabel) {
  // Top chrome bar
  slide.addText(leftLabel, {
    x: 0.5, y: 0.2, w: 5, h: 0.35,
    fontFace: FONT.mono,
    fontSize: 9,
    color: C.text2,
    align: "left",
    valign: "middle",
    charSpacing: 1,
  });
  slide.addText(pageLabel, {
    x: 5, y: 0.2, w: 4.5, h: 0.35,
    fontFace: FONT.mono,
    fontSize: 9,
    color: C.text2,
    align: "right",
    valign: "middle",
    charSpacing: 1,
  });
  // Bottom separator line
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 0.6, w: 9, h: 0,
    line: { color: C.border, width: 0.5 },
  });
}

function addFooter(slide, text) {
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.05, w: 9, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  slide.addText(text, {
    x: 0.5, y: 5.1, w: 6, h: 0.35,
    fontFace: FONT.mono,
    fontSize: 7.5,
    color: C.text3,
    charSpacing: 0.5,
    valign: "middle",
  });
  slide.addText("2026", {
    x: 6.5, y: 5.1, w: 3, h: 0.35,
    fontFace: FONT.mono,
    fontSize: 7.5,
    color: C.text3,
    align: "right",
    valign: "middle",
  });
}

function addKicker(slide, text) {
  slide.addText(text, {
    x: 0.7, y: 0.8, w: 8.6, h: 0.35,
    fontFace: FONT.mono,
    fontSize: 8,
    color: C.text2,
    charSpacing: 1.5,
    valign: "middle",
  });
}

// ============================================================
// SLIDE BUILDERS
// ============================================================

// ─── P1: COVER ───────────────────────────────────────────
function buildP1() {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Glow orb (large semi-transparent oval)
  s.addShape(pres.shapes.OVAL, {
    x: 2.5, y: 0.8, w: 5, h: 5,
    fill: { color: C.aiLight, transparency: 93 },
  });

  // Chrome
  s.addText("科研项目申报答辩", {
    x: 0.5, y: 0.2, w: 5, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: C.text2, charSpacing: 1,
  });
  s.addText("01 / 09", {
    x: 5, y: 0.2, w: 4.5, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: C.text2, align: "right", charSpacing: 1,
  });
  addFooter(s, "AI Native 事务管理系统 · 科研项目答辩");

  // Kicker
  s.addText("AI Native · LLM-Driven Transaction Management", {
    x: 1, y: 1.6, w: 8, h: 0.4,
    fontFace: FONT.mono, fontSize: 9, color: C.aiPrimary, align: "center",
    charSpacing: 1.5, bold: true,
  });

  // Main title — line 1
  s.addText("基于大语言模型的", {
    x: 1, y: 2.0, w: 8, h: 0.8,
    fontFace: FONT.display, fontSize: 40, color: C.text1,
    align: "center", bold: true, margin: 0,
  });
  // Main title — line 2: "AI Native" in purple
  s.addText([
    { text: "AI Native", options: { fontFace: FONT.display, fontSize: 44, color: C.aiLight, bold: true } },
    { text: "事务管理系统", options: { fontFace: FONT.display, fontSize: 40, color: C.text1, bold: true } },
  ], {
    x: 1, y: 2.7, w: 8, h: 0.8,
    align: "center", margin: 0,
  });

  // Subtitle
  s.addText("设计与实现", {
    x: 1, y: 3.5, w: 8, h: 0.6,
    fontFace: FONT.display, fontSize: 24, color: C.text2,
    align: "center", bold: true,
  });

  // Description
  s.addText("自然语言驱动的AI Native事务管理研究与实现", {
    x: 2, y: 4.1, w: 6, h: 0.4,
    fontFace: FONT.body, fontSize: 13, color: C.text2, align: "center",
  });

  // Footer info (already added via addFooter)
  s.addText("[学院名称]    [专业名称]    [姓名]    指导教师：[导师姓名]", {
    x: 0.5, y: 5.1, w: 9, h: 0.35,
    fontFace: FONT.mono, fontSize: 7.5, color: C.text3, charSpacing: 0.5,
  });
}

// ─── P2: PROBLEM / AI NATIVE DUO ─────────────────────────
function buildP2() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "一 · 研究背景与问题分析", "02 / 09");
  addFooter(s, "");

  addKicker(s, `PROBLEM · 从“用户适应软件”到“软件理解用户”`);

  // Title
  s.addText([
    { text: "一句话讲清 ", options: { fontFace: FONT.display, fontSize: 26, color: C.text1, bold: true } },
    { text: "AI Native", options: { fontFace: FONT.display, fontSize: 26, color: C.aiPrimary, bold: true } },
    { text: " 方案", options: { fontFace: FONT.display, fontSize: 26, color: C.text1, bold: true } },
  ], { x: 0.7, y: 1.15, w: 8.6, h: 0.55, margin: 0 });

  // === LEFT COLUMN: Traditional ===
  const leftX = 0.7;
  const colW = 4.05;
  const topY = 1.9;

  // Badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: topY, w: 0.4, h: 0.28,
    fill: { color: C.grayTag },
  });
  s.addText("旧", {
    x: leftX, y: topY, w: 0.4, h: 0.28,
    fontFace: FONT.mono, fontSize: 7, color: C.text2, align: "center", valign: "middle", bold: true,
  });
  s.addText("TRADITIONAL APP", {
    x: leftX + 0.5, y: topY, w: 3, h: 0.28,
    fontFace: FONT.mono, fontSize: 7, color: C.text2, charSpacing: 1, valign: "middle",
  });

  // Title
  s.addText("用户适应软件", {
    x: leftX, y: topY + 0.38, w: colW, h: 0.5,
    fontFace: FONT.display, fontSize: 22, color: C.text1, bold: true, margin: 0,
  });

  // Description
  s.addText("表单填写、多层点击、操作繁琐、学习成本高。每完成一条记账需要6步操作。", {
    x: leftX, y: topY + 0.85, w: colW, h: 0.4,
    fontFace: FONT.body, fontSize: 10, color: C.text2, valign: "top",
  });

  // Bullet list (red markers)
  s.addText([
    { text: "点击新增 → 选择支出 → 输入金额", options: { bullet: true, breakLine: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
    { text: "选择分类 → 设置时间 → 点击保存", options: { bullet: true, breakLine: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
    { text: "6步操作 · 多页面跳转 · 反直觉交互", options: { bullet: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
  ], { x: leftX + 0.2, y: topY + 1.3, w: colW - 0.2, h: 0.7 });

  // Placeholder image box
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: topY + 2.1, w: colW, h: 1.3,
    fill: { color: C.bg },
    line: { color: C.borderStrong, width: 1, dashType: "dash" },
  });
  s.addText("传统记账APP界面截图", {
    x: leftX, y: topY + 2.1, w: colW, h: 1.3,
    fontFace: FONT.mono, fontSize: 8, color: C.text3, align: "center", valign: "middle",
  });

  // === CENTER DIVIDER ===
  s.addShape(pres.shapes.LINE, {
    x: 5, y: topY, w: 0, h: 3.0,
    line: { color: C.border, width: 0.8 },
  });

  // === RIGHT COLUMN: AI Native ===
  const rightX = 5.3;

  // Badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: topY, w: 0.4, h: 0.28,
    fill: { color: C.aiPrimary, transparency: 88 },
  });
  s.addText("新", {
    x: rightX, y: topY, w: 0.4, h: 0.28,
    fontFace: FONT.mono, fontSize: 7, color: C.aiPrimary, align: "center", valign: "middle", bold: true,
  });
  s.addText("AI NATIVE", {
    x: rightX + 0.5, y: topY, w: 3, h: 0.28,
    fontFace: FONT.mono, fontSize: 7, color: C.aiPrimary, charSpacing: 1, valign: "middle",
  });

  // Title
  s.addText("软件理解用户", {
    x: rightX, y: topY + 0.38, w: colW, h: 0.5,
    fontFace: FONT.display, fontSize: 22, color: C.text1, bold: true, margin: 0,
  });

  // Description
  s.addText("用户只需输入自然语言，系统自动完成识别、提取、解析、存储。一句话完成所有事务操作。", {
    x: rightX, y: topY + 0.85, w: colW, h: 0.4,
    fontFace: FONT.body, fontSize: 10, color: C.text2, valign: "top",
  });

  // Bullet list (green markers)
  s.addText([
    { text: `"今天午饭35元，明天下午3点开会"`, options: { bullet: true, breakLine: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
    { text: "自动拆分为餐饮支出 + 会议日程", options: { bullet: true, breakLine: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
    { text: "一句话完成所有事务操作", options: { bullet: true, fontFace: FONT.body, fontSize: 10, color: C.text2 } },
  ], { x: rightX + 0.2, y: topY + 1.3, w: colW - 0.2, h: 0.7 });

  // === BOTTOM QUOTE ===
  s.addShape(pres.shapes.LINE, {
    x: 0.7, y: 4.2, w: 8.6, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  s.addText(`核心理念："让软件理解用户，而不是让用户适应软件"`, {
    x: 0.7, y: 4.3, w: 7, h: 0.5,
    fontFace: FONT.display, fontSize: 14, color: C.aiPrimary, bold: true, valign: "middle",
  });
  s.addText("BACKGROUND · 02", {
    x: 6.5, y: 4.3, w: 2.8, h: 0.5,
    fontFace: FONT.mono, fontSize: 8, color: C.text3, align: "right", valign: "middle",
  });
}

// ─── P3: SYSTEM ARCHITECTURE ─────────────────────────────
function buildP3() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "二 · 系统整体架构", "03 / 09");
  addFooter(s, "");

  const leftW = 5.6;
  const rightX = 6.5;
  const rightW = 3.0;

  // === LEFT: Layered Architecture ===
  const layers = [
    { num: "01", label: "用户输入层", tech: "自然语言文本 / 语音输入", accent: "64748B" },
    { num: "02", label: "前端交互层", tech: "React · TypeScript · TailwindCSS", accent: C.blue },
    { num: "03", label: "API 服务层", tech: "Python · Flask · RESTful", accent: C.blue },
    { num: "04", label: "Prompt Workflow + 大语言模型", tech: "DeepSeek / Qwen · Temperature=0 · 多模块Prompt调度", accent: C.aiPrimary, isLLM: true },
    { num: "05", label: "校验与存储层", tech: "JSON Schema校验 · Markdown清洗 · 默认值补全 · SQLite持久化", accent: C.success },
  ];

  let y = 0.85;
  const layerH = 0.58;
  const gap = 0.06;

  layers.forEach((l, i) => {
    if (i > 0) {
      // Arrow between layers
      s.addText("↓", {
        x: 0.7, y: y - 0.02, w: leftW - 0.2, h: 0.18,
        fontFace: FONT.body, fontSize: 10, color: C.text3, align: "center", valign: "middle",
      });
      y += 0.16;
    }

    // Card background
    if (l.isLLM) {
      // LLM highlight card — slightly taller, purple tint
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.7, y: y, w: leftW - 0.2, h: layerH + 0.1,
        fill: { color: C.aiPrimary, transparency: 95 },
        line: { color: C.aiPurple, width: 1.2 },
      });
      // LLM badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.85, y: y - 0.1, w: 1.6, h: 0.2,
        fill: { color: C.aiPrimary },
      });
      s.addText("★ LLM 调用位置", {
        x: 0.85, y: y - 0.1, w: 1.6, h: 0.2,
        fontFace: FONT.mono, fontSize: 6.5, color: "FFFFFF", align: "center", valign: "middle",
        bold: true,
      });
    } else {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.7, y: y, w: leftW - 0.2, h: layerH,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 0.5 },
        shadow: makeCardShadow(),
      });
      // Left accent border
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.7, y: y, w: 0.04, h: layerH,
        fill: { color: l.accent },
      });
    }

    // Layer number
    s.addText(l.num, {
      x: 0.95, y: y, w: 0.4, h: l.isLLM ? layerH + 0.1 : layerH,
      fontFace: FONT.mono, fontSize: 9, color: l.isLLM ? C.aiPrimary : C.text3, valign: "middle",
    });

    // Label + Tech
    s.addText([
      { text: l.label + "\n", options: { fontFace: FONT.display, fontSize: 10.5, color: l.isLLM ? C.aiPrimary : C.text1, bold: true, breakLine: true } },
      { text: l.tech, options: { fontFace: FONT.body, fontSize: 7.5, color: C.text2 } },
    ], {
      x: 1.4, y: y, w: leftW - 1.9, h: l.isLLM ? layerH + 0.1 : layerH,
      valign: "middle", margin: 0,
    });

    y += (l.isLLM ? layerH + 0.1 : layerH) + gap;
  });

  // === RIGHT: Tech Stack Cards ===
  s.addText("技术栈", {
    x: rightX, y: 0.85, w: rightW, h: 0.3,
    fontFace: FONT.mono, fontSize: 8, color: C.text2, charSpacing: 1.5, bold: true,
  });

  const techCards = [
    { title: "Frontend", desc: "React · TypeScript · TailwindCSS · 响应式" },
    { title: "Backend", desc: "Python · Flask · RESTful API" },
    { title: "AI Layer", desc: "DeepSeek / Qwen · Ollama本地 · Temp=0" },
    { title: "Database", desc: "SQLite · Expenses / Schedules 双表" },
  ];

  let ty = 1.2;
  techCards.forEach((tc) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y: ty, w: rightW, h: 0.52,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });
    s.addText([
      { text: tc.title + "\n", options: { fontFace: FONT.display, fontSize: 9, color: C.aiPrimary, bold: true, breakLine: true } },
      { text: tc.desc, options: { fontFace: FONT.body, fontSize: 7.5, color: C.text2 } },
    ], { x: rightX + 0.2, y: ty, w: rightW - 0.4, h: 0.52, valign: "middle", margin: 0 });
    ty += 0.62;
  });

  // Description below cards
  s.addShape(pres.shapes.LINE, {
    x: rightX, y: ty + 0.1, w: rightW, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  s.addText([
    { text: "架构特点：", options: { fontFace: FONT.display, fontSize: 8, color: C.aiPrimary, bold: true } },
    { text: "单LLM + 模块化Prompt Workflow。每个Prompt模块独立管理、独立优化，降低多Agent复杂度。校验层确保LLM输出可靠落库，形成完整工程闭环。", options: { fontFace: FONT.body, fontSize: 7.5, color: C.text2 } },
  ], { x: rightX, y: ty + 0.25, w: rightW, h: 0.6, valign: "top" });
}

// ─── P4: LLM PIPELINE ────────────────────────────────────
function buildP4() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "三 · 大模型调用与处理流程", "04 / 09");
  addFooter(s, "");

  addKicker(s, "CORE PIPELINE · 从自然语言到结构化存储的完整AI工程链路");

  s.addText(`"今天午饭35元，明天下午3点开会" → 结构化事务存储`, {
    x: 0.7, y: 1.2, w: 8.6, h: 0.45,
    fontFace: FONT.display, fontSize: 18, color: C.text1, bold: true, margin: 0,
  });
  s.addText("不是简单API调用，而是包含意图拆分、Prompt调度、JSON校验、自动Retry的完整工程化处理链路", {
    x: 0.7, y: 1.65, w: 8.6, h: 0.3,
    fontFace: FONT.body, fontSize: 10, color: C.text2,
  });

  // 5-column Pipeline
  const steps = [
    { num: "01 · 事务拆分器", title: "多意图自动分段", desc: "将混合输入拆分为独立事务单元",
      code: '输入: "今天午饭35元，明天下午3点开会"\n输出: ["午饭35元", "明天下午3点开会"]' },
    { num: "02 · 意图识别", title: "事务类型分类", desc: "识别每个事务单元的操作类型",
      code: '"午饭35元" → expense\n"明天下午3点开会" → schedule' },
    { num: "03 · Prompt Workflow", title: "结构化字段提取", desc: "Few-Shot + Role定义 → JSON",
      code: '{\n  "type": "expense",\n  "amount": 35,\n  "category": "餐饮"\n}' },
    { num: "04 · 时间解析", title: "混合式解析引擎", desc: "LLM语义 + 规则计算",
      code: '"明天下午3点"\n→ 2026-05-26 15:00:00\n(LLM理解 + 规则转换)' },
    { num: "05 · 校验与存储", title: "多层稳定性保障", desc: "清洗→校验→Retry→落库",
      code: "// Markdown清洗 → JSON修复\n// → Schema验证 → 默认值补全\n→ INSERT INTO expenses\n→ INSERT INTO schedules" },
  ];

  const startX = 0.5;
  const colW = 1.7;
  const colGap = 0.15;
  const colTop = 2.15;

  steps.forEach((st, i) => {
    const cx = startX + i * (colW + colGap);

    // Top gradient line (solid purple bar)
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: colTop, w: colW, h: 0.03,
      fill: { color: C.aiPurple },
    });

    // Step number
    s.addText(st.num, {
      x: cx, y: colTop + 0.12, w: colW, h: 0.22,
      fontFace: FONT.mono, fontSize: 7, color: C.aiPrimary, bold: true, charSpacing: 0.5, margin: 0,
    });

    // Step title
    s.addText(st.title, {
      x: cx, y: colTop + 0.32, w: colW, h: 0.3,
      fontFace: FONT.display, fontSize: 10, color: C.text1, bold: true, margin: 0,
    });

    // Description
    s.addText(st.desc, {
      x: cx, y: colTop + 0.6, w: colW, h: 0.22,
      fontFace: FONT.body, fontSize: 7.5, color: C.text2, margin: 0,
    });

    // Light code block
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: colTop + 0.9, w: colW, h: 1.55,
      fill: { color: C.lightCodeBg },
      line: { color: C.border, width: 0.5 },
    });
    s.addText(st.code, {
      x: cx + 0.08, y: colTop + 0.95, w: colW - 0.16, h: 1.45,
      fontFace: FONT.mono, fontSize: 6, color: C.text1, margin: 0, valign: "top",
    });
  });

  // Bottom note
  s.addShape(pres.shapes.LINE, {
    x: 0.7, y: 4.85, w: 8.6, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  s.addText("← → 键逐步展示 Pipeline 各阶段  |  体现完整AI工程链路而非简单API套壳", {
    x: 0.7, y: 4.92, w: 6, h: 0.3,
    fontFace: FONT.body, fontSize: 8, color: C.text2,
  });
  s.addText("LLM PIPELINE · 04", {
    x: 6.5, y: 4.92, w: 2.8, h: 0.3,
    fontFace: FONT.mono, fontSize: 8, color: C.text3, align: "right",
  });
}

// ─── P5: DEMO ────────────────────────────────────────────
function buildP5() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "四 · 系统运行示例", "05 / 09");
  addFooter(s, "");

  addKicker(s, "LIVE DEMO · 自然语言 → 结构化事务 → 数据库存储");
  s.addText("端到端示例：一句话完成多事务处理", {
    x: 0.7, y: 1.2, w: 8.6, h: 0.45,
    fontFace: FONT.display, fontSize: 20, color: C.text1, bold: true, margin: 0,
  });

  // 3 Columns
  const colW = 2.7;
  const colH = 3.05;
  const colTop = 1.8;
  const colGap = 0.3;

  const cols = [
    { x: 0.5, header: "1. 用户自然语言输入", bodyType: "text",
      content: '"今天午饭35元，\n明天下午3点开会"',
      desc: "单条输入，包含混合意图：\n支出记账 + 日程创建",
      arrowColor: C.aiPrimary },
    { x: 0.5 + colW + colGap, header: "2. LLM 结构化输出 (JSON)", bodyType: "code",
      content: '[\n  {\n    "type": "expense",\n    "amount": 35,\n    "category": "餐饮"\n  },\n  {\n    "type": "schedule",\n    "title": "开会",\n    "time": "2026-05-26 15:00"\n  }\n]',
      desc: "Temperature=0 · Markdown清洗\nSchema校验 · 默认值补全",
      arrowColor: C.success },
    { x: 0.5 + 2 * (colW + colGap), header: "3. 数据库存储成功", bodyType: "images",
      desc: "✓ 已记录 餐饮 支出 ¥35.00\n✓ 已创建 会议 日程",
      arrowColor: C.success },
  ];

  cols.forEach((col) => {
    // Card background
    s.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: colTop, w: colW, h: colH,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });

    // Header
    s.addText(col.header, {
      x: col.x + 0.15, y: colTop + 0.12, w: colW - 0.3, h: 0.3,
      fontFace: FONT.mono, fontSize: 8, color: C.aiPrimary, bold: true, charSpacing: 0.5,
    });

    if (col.bodyType === "text") {
      s.addText(col.content, {
        x: col.x + 0.15, y: colTop + 0.65, w: colW - 0.3, h: 0.7,
        fontFace: FONT.display, fontSize: 14, color: C.text1, bold: true, margin: 0,
      });
      s.addText(col.desc, {
        x: col.x + 0.15, y: colTop + 1.35, w: colW - 0.3, h: 0.5,
        fontFace: FONT.body, fontSize: 8, color: C.text2,
      });
      // Arrow down at bottom
      s.addText("↓", {
        x: col.x, y: colTop + colH - 0.5, w: colW, h: 0.4,
        fontFace: FONT.body, fontSize: 16, color: col.arrowColor, align: "center", valign: "middle",
      });
    } else if (col.bodyType === "code") {
      // Dark code block
      s.addShape(pres.shapes.RECTANGLE, {
        x: col.x + 0.1, y: colTop + 0.55, w: colW - 0.2, h: 1.6,
        fill: { color: C.codeBg },
      });
      s.addText(col.content, {
        x: col.x + 0.2, y: colTop + 0.6, w: colW - 0.4, h: 1.5,
        fontFace: FONT.mono, fontSize: 6.5, color: C.codeText, margin: 0, valign: "top",
      });
      s.addText(col.desc, {
        x: col.x + 0.15, y: colTop + 2.25, w: colW - 0.3, h: 0.4,
        fontFace: FONT.body, fontSize: 7.5, color: C.text2,
      });
      s.addText("↓", {
        x: col.x, y: colTop + colH - 0.5, w: colW, h: 0.4,
        fontFace: FONT.body, fontSize: 16, color: col.arrowColor, align: "center", valign: "middle",
      });
    } else if (col.bodyType === "images") {
      const imgDir = path.join(__dirname, "images");
      // Screenshot 1
      const img1 = path.join(imgDir, "04-demo-chat.png");
      s.addImage({
        path: img1,
        x: col.x + 0.1, y: colTop + 0.55, w: colW - 0.2, h: 1.1,
        sizing: { type: "contain", w: colW - 0.2, h: 1.1 },
      });
      // Screenshot 2
      const img2 = path.join(imgDir, "04-demo-home.png");
      s.addImage({
        path: img2,
        x: col.x + 0.1, y: colTop + 1.75, w: colW - 0.2, h: 0.85,
        sizing: { type: "contain", w: colW - 0.2, h: 0.85 },
      });
      s.addText(col.desc, {
        x: col.x + 0.1, y: colTop + colH - 0.45, w: colW - 0.2, h: 0.35,
        fontFace: FONT.display, fontSize: 8, color: C.successText, align: "center", bold: true,
      });
    }
  });

  // Bottom
  s.addShape(pres.shapes.LINE, {
    x: 0.7, y: 5.0, w: 8.6, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  s.addText("端到端闭环：自然语言输入 → LLM结构化 → 数据库持久化  |  一套Prompt Workflow同时处理记账+日程", {
    x: 0.7, y: 5.05, w: 8.6, h: 0.3,
    fontFace: FONT.body, fontSize: 8, color: C.text2,
  });
}

// ─── P6: INNOVATIONS ─────────────────────────────────────
function buildP6() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "五 · 项目创新点", "06 / 09");
  addFooter(s, "");

  addKicker(s, "INNOVATIONS · 三项核心创新");
  s.addText("不是大模型强，是工程架构强", {
    x: 0.7, y: 1.2, w: 8.6, h: 0.5,
    fontFace: FONT.display, fontSize: 26, color: C.text1, bold: true, margin: 0,
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.75, w: 0.6, h: 0.04,
    fill: { color: C.aiPrimary },
  });

  // 3 Cards
  const innovations = [
    { num: "01 · 交互范式", title: "AI Native\n自然语言交互",
      desc: "颠覆传统表单操作模式。用户无需学习软件，一句话即可完成记账+日程+提醒。降低使用门槛至零。" },
    { num: "02 · 工程架构", title: "模块化 Prompt\nWorkflow 机制",
      desc: "单LLM + 多Prompt模块职责分离（拆分→识别→提取→解析→校验）。每个模块独立优化、易调试、可扩展，避免多Agent复杂编排。" },
    { num: "03 · 时间解析", title: "LLM语义 + 规则\n混合式时间解析",
      desc: `LLM理解"明天下午""下周三"等模糊自然语言时间表达，规则引擎负责标准计算与格式转换。兼顾灵活性与精确性。` },
  ];

  const cardW = 2.7;
  const cardH = 2.4;
  const cardY = 2.0;
  const cardGap = 0.3;
  const startX = 0.5;

  innovations.forEach((inv, i) => {
    const cx = startX + i * (cardW + cardGap);

    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cardY, w: cardW, h: cardH,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });
    // Left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cardY, w: 0.04, h: cardH,
      fill: { color: C.aiPrimary },
    });

    // Number
    s.addText(inv.num, {
      x: cx + 0.3, y: cardY + 0.15, w: cardW - 0.5, h: 0.25,
      fontFace: FONT.mono, fontSize: 8, color: C.aiPrimary, bold: true, charSpacing: 0.5,
    });
    // Title
    s.addText(inv.title, {
      x: cx + 0.3, y: cardY + 0.5, w: cardW - 0.5, h: 0.7,
      fontFace: FONT.display, fontSize: 14, color: C.text1, bold: true, margin: 0,
    });
    // Description
    s.addText(inv.desc, {
      x: cx + 0.3, y: cardY + 1.35, w: cardW - 0.5, h: 0.85,
      fontFace: FONT.body, fontSize: 8.5, color: C.text2, valign: "top",
    });
  });
}

// ─── P7: EXISTING ACHIEVEMENTS ───────────────────────────
function buildP7() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "六 · 已有成果展示", "07 / 09");
  addFooter(s, "");

  addKicker(s, "ACHIEVEMENTS · 用事实说话");
  s.addText("小组已取得成果", {
    x: 0.7, y: 1.2, w: 8.6, h: 0.5,
    fontFace: FONT.display, fontSize: 26, color: C.text1, bold: true, margin: 0,
  });

  // 2 large cards side by side
  const cardW = 4.1;
  const cardH = 2.85;
  const cardY = 1.85;

  const achievements = [
    {
      x: 0.7, title: "计算机软件著作权", sub: "AI Native事务管理系统 V1.0",
      tag: "已获得", placeholder: "软著证书扫描件\n拖放或替换此区域",
      info: "登记号：[待填写]  ·  证书号：[待填写]  ·  获得日期：[待填写]",
    },
    {
      x: 5.2, title: "学术论文", sub: "基于Prompt Workflow的自然语言事务管理",
      tag: "已发表/录用", placeholder: "论文首页/录用通知扫描件\n拖放或替换此区域",
      info: "期刊/会议：[待填写]  ·  检索类型：[EI/SCI/会议]  ·  发表时间：[待填写]",
    },
  ];

  achievements.forEach((ach) => {
    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: ach.x, y: cardY, w: cardW, h: cardH,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });

    // Header row
    s.addShape(pres.shapes.RECTANGLE, {
      x: ach.x + 0.2, y: cardY + 0.15, w: 0.4, h: 0.4,
      fill: { color: C.successBg },
    });
    s.addText(ach === achievements[0] ? "©" : "¶", {
      x: ach.x + 0.2, y: cardY + 0.15, w: 0.4, h: 0.4,
      fontFace: FONT.body, fontSize: 13, color: C.success, align: "center", valign: "middle",
    });
    s.addText([
      { text: ach.title + "\n", options: { fontFace: FONT.display, fontSize: 11, color: C.text1, bold: true, breakLine: true } },
      { text: ach.sub, options: { fontFace: FONT.body, fontSize: 8, color: C.text2 } },
    ], { x: ach.x + 0.75, y: cardY + 0.12, w: cardW - 2.0, h: 0.5, valign: "middle", margin: 0 });

    // Green tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: ach.x + cardW - 1.1, y: cardY + 0.2, w: 0.85, h: 0.25,
      fill: { color: C.successBg },
      line: { color: "A7F3D0", width: 0.5 },
    });
    s.addText(ach.tag, {
      x: ach.x + cardW - 1.1, y: cardY + 0.2, w: 0.85, h: 0.25,
      fontFace: FONT.mono, fontSize: 6.5, color: C.successText, align: "center", valign: "middle", bold: true,
    });

    // Dashed placeholder
    s.addShape(pres.shapes.RECTANGLE, {
      x: ach.x + 0.2, y: cardY + 0.8, w: cardW - 0.4, h: 1.35,
      fill: { color: C.bg },
      line: { color: C.borderStrong, width: 1, dashType: "dash" },
    });
    s.addText(ach.placeholder, {
      x: ach.x + 0.2, y: cardY + 0.8, w: cardW - 0.4, h: 1.35,
      fontFace: FONT.mono, fontSize: 8, color: C.text3, align: "center", valign: "middle",
    });

    // Info text
    s.addText(ach.info, {
      x: ach.x + 0.2, y: cardY + 2.3, w: cardW - 0.4, h: 0.3,
      fontFace: FONT.body, fontSize: 7.5, color: C.text2, align: "center",
    });
  });

  // Bottom
  s.addShape(pres.shapes.LINE, {
    x: 0.7, y: 4.9, w: 8.6, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  s.addText("以上成果为本小组独立完成，为项目结题提供坚实支撑", {
    x: 0.7, y: 4.98, w: 8.6, h: 0.35,
    fontFace: FONT.display, fontSize: 12, color: C.aiPrimary, align: "center", bold: true,
  });
}

// ─── P8: ROADMAP & TIMELINE ──────────────────────────────
function buildP8() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, "七 · 结题规划与推进", "08 / 09");
  addFooter(s, "");

  addKicker(s, "ROADMAP & DELIVERABLES · 确保项目顺利结题");
  s.addText("从原型到结题的完整路径", {
    x: 0.7, y: 1.2, w: 8.6, h: 0.5,
    fontFace: FONT.display, fontSize: 24, color: C.text1, bold: true, margin: 0,
  });

  // Green status bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.8, w: 8.6, h: 0.42,
    fill: { color: C.successBg },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.8, w: 0.03, h: 0.42,
    fill: { color: C.success },
  });
  s.addText("目前已完成", {
    x: 0.9, y: 1.8, w: 1.3, h: 0.42,
    fontFace: FONT.mono, fontSize: 8, color: C.successText, bold: true, valign: "middle",
  });
  s.addText("✓ Prompt原型设计    ✓ Web基础交互    ✓ JSON结构化解析    ✓ SQLite数据存储", {
    x: 2.2, y: 1.8, w: 7, h: 0.42,
    fontFace: FONT.body, fontSize: 8.5, color: C.successText, valign: "middle",
  });

  // === LEFT: Deliverables ===
  const leftX = 0.7;
  const leftW = 4.1;

  s.addText("预期结题成果", {
    x: leftX, y: 2.4, w: leftW, h: 0.3,
    fontFace: FONT.mono, fontSize: 8, color: C.aiPrimary, bold: true, charSpacing: 1,
  });

  const deliverables = [
    { icon: "◆", iconBg: C.successBg, iconColor: C.success, title: "可运行 Web Demo 系统",
      desc: "完整前后端 + LLM集成 + SQLite存储", tag: "已完成", tagColor: C.success, tagBg: C.successBg, tagText: C.successText },
    { icon: "▶", iconBg: C.aiPrimary, iconColor: C.aiPrimary, title: "项目演示视频（5分钟）",
      desc: "系统功能演示 + 技术架构讲解", tag: "待制作", tagColor: C.aiPrimary, tagBg: C.aiPrimary, tagText: C.aiPrimary },
    { icon: "⌂", iconBg: C.blueBg, iconColor: C.blue, title: "GitHub 开源仓库",
      desc: "完整源码 + 技术文档 + 测试报告", tag: "持续更新", tagColor: C.aiPrimary, tagBg: C.aiPrimary, tagText: C.aiPrimary },
  ];

  let dy = 2.75;
  deliverables.forEach((dl) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX, y: dy, w: leftW, h: 0.52,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });

    // Icon circle
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX + 0.12, y: dy + 0.08, w: 0.36, h: 0.36,
      fill: { color: dl.iconBg, transparency: dl === deliverables[0] ? 0 : 88 },
    });
    s.addText(dl.icon, {
      x: leftX + 0.12, y: dy + 0.08, w: 0.36, h: 0.36,
      fontFace: FONT.body, fontSize: 10, align: "center", valign: "middle",
      color: dl === deliverables[0] ? C.success : C.aiPrimary,
    });

    s.addText([
      { text: dl.title + "\n", options: { fontFace: FONT.display, fontSize: 9, color: C.text1, bold: true, breakLine: true } },
      { text: dl.desc, options: { fontFace: FONT.body, fontSize: 7.5, color: C.text2 } },
    ], { x: leftX + 0.6, y: dy + 0.05, w: leftW - 2.0, h: 0.42, valign: "middle", margin: 0 });

    // Tag
    const tagColor = dl === deliverables[0] ? C.success : C.aiPrimary;
    const tagBgColor = dl === deliverables[0] ? C.successBg : C.aiPrimary;
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX + leftW - 1.0, y: dy + 0.14, w: 0.8, h: 0.24,
      fill: { color: tagBgColor, transparency: dl === deliverables[0] ? 0 : 88 },
      line: { color: tagColor, width: 0.5 },
    });
    s.addText(dl.tag, {
      x: leftX + leftW - 1.0, y: dy + 0.14, w: 0.8, h: 0.24,
      fontFace: FONT.mono, fontSize: 6, color: dl === deliverables[0] ? C.successText : C.aiPrimary,
      align: "center", valign: "middle", bold: true,
    });

    dy += 0.62;
  });

  // === RIGHT: Timeline ===
  const rightX = 5.3;
  const rightW = 4.2;

  s.addText("推进时间轴", {
    x: rightX, y: 2.4, w: rightW, h: 0.3,
    fontFace: FONT.mono, fontSize: 8, color: C.aiPrimary, bold: true, charSpacing: 1,
  });

  // Vertical line
  s.addShape(pres.shapes.LINE, {
    x: rightX + 0.12, y: 2.85, w: 0, h: 2.25,
    line: { color: C.borderStrong, width: 1.5 },
  });

  const phases = [
    { dotColor: C.success, phase: "Phase 1", phaseTagColor: C.success, phaseTagBg: C.successBg, phaseTagText: C.successText,
      title: "Web原型开发验证", desc: "Prompt Workflow · JSON解析引擎 · SQLite存储 · Web Demo上线" },
    { dotColor: C.warn, phase: "Phase 2", phaseTagColor: C.warn, phaseTagBg: C.warnBg, phaseTagText: C.warnText,
      title: "移动端适配与Prompt优化", desc: "响应式移动端UI · 语音输入集成 · Prompt迭代 · 准确率提升至95%+" },
    { dotColor: C.timelineGray, phase: "Phase 3", phaseTagColor: C.text2, phaseTagBg: C.grayTag, phaseTagText: C.text2,
      title: "测试、优化与成果产出", desc: "准确率测试报告 · 用户体验测试 · 软著申请 · 论文撰写 · 演示视频制作" },
    { dotColor: C.timelineGray, phase: "Phase 4", phaseTagColor: C.text2, phaseTagBg: C.grayTag, phaseTagText: C.text2,
      title: "结题交付", desc: "完整结题报告 · 软著下证 · 论文发表 · 项目归档" },
  ];

  let ty = 2.85;
  phases.forEach((ph, i) => {
    // Dot
    s.addShape(pres.shapes.OVAL, {
      x: rightX + 0.07, y: ty + 0.04, w: 0.11, h: 0.11,
      fill: { color: ph.dotColor },
    });

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX + 0.35, y: ty, w: rightW - 0.35, h: 0.52,
      fill: { color: C.cardBg }, line: { color: C.border, width: 0.5 },
      shadow: makeCardShadow(),
    });

    // Phase tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX + 0.5, y: ty + 0.06, w: 0.7, h: 0.2,
      fill: { color: ph.phaseTagBg },
      line: { color: ph.phaseTagColor, width: 0.5 },
    });
    s.addText(ph.phase, {
      x: rightX + 0.5, y: ty + 0.06, w: 0.7, h: 0.2,
      fontFace: FONT.mono, fontSize: 6, color: ph.phaseTagText, align: "center", valign: "middle", bold: true,
    });

    s.addText([
      { text: ph.title + "\n", options: { fontFace: FONT.display, fontSize: 9, color: C.text1, bold: true, breakLine: true } },
      { text: ph.desc, options: { fontFace: FONT.body, fontSize: 7, color: C.text2 } },
    ], { x: rightX + 1.3, y: ty + 0.04, w: rightW - 1.6, h: 0.44, valign: "middle", margin: 0 });

    ty += 0.62;
  });
}

// ─── P9: CLOSING ─────────────────────────────────────────
function buildP9() {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Purple tint glow (large oval)
  s.addShape(pres.shapes.OVAL, {
    x: 1.5, y: 0.5, w: 7, h: 7,
    fill: { color: C.aiLight, transparency: 94 },
  });

  // Chrome
  s.addText("CLOSING", {
    x: 0.5, y: 0.2, w: 5, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: C.text2, charSpacing: 1,
  });
  s.addText("09 / 09", {
    x: 5, y: 0.2, w: 4.5, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: C.text2, align: "right", charSpacing: 1,
  });
  addFooter(s, "AI Native 事务管理系统 · 科研项目答辩");

  // Summary: left + right columns with divider
  const sumY = 1.6;
  s.addText("已完成", {
    x: 1.5, y: sumY, w: 3, h: 0.25,
    fontFace: FONT.mono, fontSize: 7, color: C.aiPrimary, bold: true, align: "right", charSpacing: 1,
  });
  s.addText("Web原型系统\nPrompt Workflow\nJSON解析引擎\nSQLite数据存储", {
    x: 1.5, y: sumY + 0.3, w: 3, h: 1.0,
    fontFace: FONT.body, fontSize: 10, color: C.text2, align: "right", lineSpacingMultiple: 1.6,
  });

  // Divider
  s.addShape(pres.shapes.LINE, {
    x: 5, y: sumY, w: 0, h: 1.3,
    line: { color: C.border, width: 0.8 },
  });

  s.addText("预期成果", {
    x: 5.5, y: sumY, w: 3, h: 0.25,
    fontFace: FONT.mono, fontSize: 7, color: C.aiPrimary, bold: true, align: "left", charSpacing: 1,
  });
  s.addText("软件著作权 1 项\nEI 技术论文 1 篇\n移动端 Demo\n项目演示视频", {
    x: 5.5, y: sumY + 0.3, w: 3, h: 1.0,
    fontFace: FONT.body, fontSize: 10, color: C.text2, align: "left", lineSpacingMultiple: 1.6,
  });

  // "AI Native" big
  s.addText("AI Native", {
    x: 1, y: 3.2, w: 8, h: 0.9,
    fontFace: FONT.display, fontSize: 44, color: C.aiLight, align: "center", bold: true, margin: 0,
  });

  // "让软件理解用户"
  s.addText("让软件理解用户", {
    x: 1, y: 3.85, w: 8, h: 0.6,
    fontFace: FONT.display, fontSize: 24, color: C.text1, align: "center", bold: true, margin: 0,
  });

  // Divider accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.55, y: 4.55, w: 0.9, h: 0.04,
    fill: { color: C.aiPrimary },
  });

  // Q&A
  s.addText("感谢各位老师聆听", {
    x: 1, y: 4.75, w: 8, h: 0.4,
    fontFace: FONT.display, fontSize: 16, color: C.text1, align: "center", bold: true,
  });
  s.addText("请各位专家评委批评指正  |  Q & A", {
    x: 1, y: 5.1, w: 8, h: 0.3,
    fontFace: FONT.body, fontSize: 10, color: C.text2, align: "center",
  });
}

// ============================================================
// BUILD ALL SLIDES
// ============================================================
buildP1();
buildP2();
buildP3();
buildP4();
buildP5();
buildP6();
buildP7();
buildP8();
buildP9();

// ============================================================
// WRITE FILE
// ============================================================
pres.writeFile({ fileName: path.join(__dirname, "答辩2.pptx") })
  .then(() => console.log("✓ 答辩2.pptx generated successfully!"))
  .catch(err => console.error("Error:", err));
