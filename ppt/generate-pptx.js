const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "智能AI工坊实验室";
pres.title = "基于大语言模型的AI Native事务管理系统设计与实现";

// ===== Color Palette (IKB Blue Theme) =====
const C = {
  ikb: "002FA7",
  ikbBright: "5B7BFF",
  paper: "FAFAF8",
  ink: "0A0A0A",
  grey1: "F0F0EE",
  grey2: "D4D4D2",
  grey3: "737373",
  white: "FFFFFF",
  textSecondary: "525252",
};

// ===== Helpers =====
function freshShadow() {
  return { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 };
}

// ===== SLIDE 1 · COVER =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.ikb };

  // Top meta
  s.addText("开放实验室学生科研项目 · 答辩汇报", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 11, color: C.white,
    charSpacing: 3, align: "left", fontFace: "Calibri",
  });
  s.addText("01 / 07", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.white,
    charSpacing: 3, align: "right",
  });

  // English kicker
  s.addText("AI NATIVE · LLM-DRIVEN TRANSACTION MANAGEMENT", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.white,
    charSpacing: 6, align: "left", transparency: 22,
  });

  // Main title
  s.addText([
    { text: "AI Native", options: { fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true, breakLine: true } },
    { text: "事务管理系统", options: { fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true } },
  ], {
    x: 0.8, y: 1.5, w: 8.4, h: 2.2,
    align: "left", valign: "middle", lineSpacingMultiple: 0.9,
  });

  // Divider line
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.8, w: 4.5, h: 0,
    line: { color: C.white, width: 1, transparency: 70 },
  });

  // Subtitle
  s.addText("基于大语言模型的自然语言驱动事务管理研究与实现", {
    x: 0.8, y: 4.0, w: 7, h: 0.5,
    fontFace: "Calibri", fontSize: 16, color: C.white, transparency: 14,
    align: "left",
  });

  // Bottom info
  s.addText("软件工程 · 智能AI工坊实验室 · 2026", {
    x: 0.8, y: 4.9, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: C.white, transparency: 40,
    charSpacing: 2, align: "left",
  });
  s.addText("→ 方向键翻页", {
    x: 0.8, y: 4.9, w: 8.4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: C.white, transparency: 40,
    charSpacing: 2, align: "right",
  });
})();

// ===== SLIDE 2 · 项目背景与研究意义 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.paper };

  // Header
  s.addText("一 · 项目背景与研究意义", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.4,
    fontFace: "Calibri", fontSize: 10, color: C.grey3, charSpacing: 3, align: "left",
  });
  s.addText("BACKGROUND · PROBLEM → SOLUTION", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("传统困境 → AI Native 破局", {
    x: 0.8, y: 0.9, w: 8.4, h: 0.65,
    fontFace: "Arial Black", fontSize: 28, color: C.ink, bold: true, align: "left",
  });

  // Left column - Traditional
  const leftX = 0.8, cardY = 1.7, cardW = 3.85, cardH = 2.6;
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: cardW, h: cardH,
    fill: { color: C.white }, shadow: freshShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: cardW, h: 0.06,
    fill: { color: C.grey2 },
  });
  // Tag
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX + 0.3, y: cardY + 0.25, w: 0.7, h: 0.3,
    fill: { color: C.ink },
  });
  s.addText("旧", {
    x: leftX + 0.3, y: cardY + 0.25, w: 0.7, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: C.white, align: "center", valign: "middle", bold: true,
  });
  s.addText("TRADITIONAL", {
    x: leftX + 1.15, y: cardY + 0.22, w: 2, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("用户适应软件", {
    x: leftX + 0.3, y: cardY + 0.65, w: 3.2, h: 0.4,
    fontFace: "Arial Black", fontSize: 16, color: C.ink, bold: true, align: "left",
  });
  s.addText("依赖\"表单+点击\"操作，操作路径复杂，学习成本较高，无法理解自然语言。", {
    x: leftX + 0.3, y: cardY + 1.0, w: 3.2, h: 0.4,
    fontFace: "Calibri", fontSize: 10, color: C.textSecondary, align: "left",
  });
  // List
  s.addText([
    { text: "点击\"新增\" → \"支出\" → 输入金额", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.grey3 } },
    { text: "选择分类 → 设置时间 → 保存", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.grey3 } },
    { text: "6 步操作完成一条记账", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.grey3 } },
    { text: "无法解析\"昨天吃火锅花了230\"", options: { bullet: true, fontSize: 9.5, color: C.grey3 } },
  ], { x: leftX + 0.3, y: cardY + 1.5, w: 3.2, h: 1.0, fontFace: "Calibri", paraSpaceAfter: 4 });

  // Center divider
  s.addShape(pres.shapes.LINE, {
    x: 5.0, y: cardY + 0.3, w: 0, h: cardH - 0.6,
    line: { color: C.grey2, width: 1 },
  });

  // Right column - AI Native
  const rightX = 5.3;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: C.white }, shadow: freshShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: cardW, h: 0.06,
    fill: { color: C.ikb },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX + 0.3, y: cardY + 0.25, w: 0.7, h: 0.3,
    fill: { color: C.ikb },
  });
  s.addText("新", {
    x: rightX + 0.3, y: cardY + 0.25, w: 0.7, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: C.white, align: "center", valign: "middle", bold: true,
  });
  s.addText("AI NATIVE", {
    x: rightX + 1.15, y: cardY + 0.22, w: 2, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.ikb, charSpacing: 4, align: "left",
  });
  s.addText("软件理解用户", {
    x: rightX + 0.3, y: cardY + 0.65, w: 3.2, h: 0.4,
    fontFace: "Arial Black", fontSize: 16, color: C.ikb, bold: true, align: "left",
  });
  s.addText("用户只需输入自然语言，系统自动完成意图识别、金额提取、时间解析、分类处理与数据存储。", {
    x: rightX + 0.3, y: cardY + 1.0, w: 3.2, h: 0.4,
    fontFace: "Calibri", fontSize: 10, color: C.textSecondary, align: "left",
  });
  s.addText([
    { text: "\"今天午饭35元，明天下午3点开会\"", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.ikb, bold: true } },
    { text: "自动拆分为餐饮支出 + 会议日程", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.grey3 } },
    { text: "一句话完成所有操作", options: { bullet: true, breakLine: true, fontSize: 9.5, color: C.grey3 } },
    { text: "LLM 语义理解 + 规则引擎计算", options: { bullet: true, fontSize: 9.5, color: C.grey3 } },
  ], { x: rightX + 0.3, y: cardY + 1.5, w: 3.2, h: 1.0, fontFace: "Calibri", paraSpaceAfter: 4 });

  // Bottom takeaway
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.6, w: 8.4, h: 0,
    line: { color: C.grey2, width: 0.5 },
  });
  s.addText("\"让软件理解用户，而不是让用户适应软件\"", {
    x: 0.8, y: 4.65, w: 6, h: 0.35,
    fontFace: "Calibri", fontSize: 12, color: C.textSecondary, italic: true, align: "left",
  });
  s.addText("BACKGROUND · 02", {
    x: 0.8, y: 4.65, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "right",
  });
})();

// ===== SLIDE 3 · 系统整体架构 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.paper };

  // Header
  s.addText("二 · 系统整体架构", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.grey3, charSpacing: 3, align: "left",
  });
  s.addText("ARCHITECTURE · SINGLE LLM + MODULAR PROMPT WORKFLOW", {
    x: 0.8, y: 0.55, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("单 LLM + 模块化 Prompt Workflow", {
    x: 0.8, y: 0.85, w: 8.4, h: 0.55,
    fontFace: "Arial Black", fontSize: 26, color: C.ink, bold: true, align: "left",
  });

  // Pipeline - 7 steps as connected boxes
  const steps = [
    { n: "01", title: "用户输入", desc: "自然语言" },
    { n: "02", title: "事务拆分", desc: "多意图分段" },
    { n: "03", title: "意图识别", desc: "记账/日程" },
    { n: "04", title: "Prompt调度", desc: "模块匹配" },
    { n: "05", title: "JSON输出", desc: "结构化解析" },
    { n: "06", title: "校验修复", desc: "多层保障" },
    { n: "07", title: "存储反馈", desc: "SQLite存储" },
  ];
  const pipeY = 1.6, pipeH = 1.7, pipeStartX = 0.5, pipeGap = 0.12;
  const stepW = (9.0 - pipeGap * 6) / 7;

  steps.forEach((st, i) => {
    const sx = pipeStartX + i * (stepW + pipeGap);
    const isFirst = i === 0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: pipeY, w: stepW, h: pipeH,
      fill: { color: C.white },
      line: { color: isFirst ? C.ikb : C.grey2, width: isFirst ? 1.5 : 0.5 },
      shadow: freshShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: pipeY, w: stepW, h: isFirst ? 4 : 2,
      fill: { color: isFirst ? C.ikb : C.grey2 },
    });
    s.addText(st.n, {
      x: sx, y: pipeY + 0.15, w: stepW, h: 0.3,
      fontFace: "Calibri", fontSize: 12, color: isFirst ? C.white : C.grey3, align: "center", bold: true,
    });
    s.addText(st.title, {
      x: sx + 0.08, y: pipeY + 0.6, w: stepW - 0.16, h: 0.35,
      fontFace: "Arial Black", fontSize: 12, color: C.ink, align: "center", bold: true,
    });
    s.addText(st.desc, {
      x: sx + 0.08, y: pipeY + 1.05, w: stepW - 0.16, h: 0.35,
      fontFace: "Calibri", fontSize: 9, color: C.grey3, align: "center",
    });
  });

  // Tech stack 3 cards
  const techs = [
    { title: "FRONTEND", items: "React + TypeScript\nTailwindCSS\n响应式移动端UI" },
    { title: "BACKEND", items: "Python · Flask\nSQLite 数据库\nRESTful API" },
    { title: "AI LAYER", items: "DeepSeek / 通义千问\nOllama 本地开发\nTemperature = 0" },
  ];
  const tcY = 3.55, tcH = 1.55, tcW = 2.7, tcGap = 0.3, tcStartX = (10 - (tcW * 3 + tcGap * 2)) / 2;
  techs.forEach((t, i) => {
    const tx = tcStartX + i * (tcW + tcGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tcY, w: tcW, h: tcH,
      fill: { color: C.white }, shadow: freshShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: tcY, w: tcW, h: 0.04,
      fill: { color: C.ikb },
    });
    s.addText(t.title, {
      x: tx + 0.2, y: tcY + 0.2, w: tcW - 0.4, h: 0.3,
      fontFace: "Calibri", fontSize: 9, color: C.ikb, bold: true, charSpacing: 3, align: "left",
    });
    s.addText(t.items, {
      x: tx + 0.2, y: tcY + 0.55, w: tcW - 0.4, h: 0.85,
      fontFace: "Calibri", fontSize: 11, color: C.ink, align: "left", lineSpacingMultiple: 1.3,
    });
  });
})();

// ===== SLIDE 4 · 项目创新点 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.paper };

  s.addText("三 · 项目创新点", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.grey3, charSpacing: 3, align: "left",
  });
  s.addText("INNOVATIONS · FOUR CORE CONTRIBUTIONS", {
    x: 0.8, y: 0.55, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("四大核心创新", {
    x: 0.8, y: 0.85, w: 8.4, h: 0.55,
    fontFace: "Arial Black", fontSize: 26, color: C.ink, bold: true, align: "left",
  });
  // Blue accent line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.35, w: 1.2, h: 0.04, fill: { color: C.ikb },
  });

  const innos = [
    { n: "01", title: "AI Native\n交互范式", desc: "自然语言驱动事务管理，摆脱传统表单交互，一句话完成所有操作。", accent: false },
    { n: "02", title: "模块化Prompt\nWorkflow", desc: "单LLM + 多模块职责分离，易调试、易扩展，降低多Agent复杂度。", accent: false },
    { n: "03", title: "混合式\n时间解析", desc: "LLM理解\"明天下午\"\"下周三\"，规则引擎负责标准时间计算与格式转换。", accent: false },
    { n: "04", title: "结构化输出\n稳定性机制", desc: "Markdown清洗 → JSON修复 → Schema校验 → 默认值补全，多层保障。", accent: true },
  ];

  const cardW = 4.0, cardH = 1.5, gapX = 0.4, gapY = 0.35;
  const gridStartX = 0.8, gridStartY = 1.6;

  innos.forEach((ino, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = gridStartX + col * (cardW + gapX);
    const cy = gridStartY + row * (cardH + gapY);

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: ino.accent ? C.ikb : C.white }, shadow: freshShadow(),
    });
    s.addText("— " + ino.n + " / INNOVATION", {
      x: cx + 0.25, y: cy + 0.15, w: cardW - 0.5, h: 0.25,
      fontFace: "Calibri", fontSize: 8, color: ino.accent ? C.white : C.ikb, charSpacing: 3, align: "left",
      transparency: ino.accent ? 30 : 0,
    });
    s.addText(ino.title, {
      x: cx + 0.25, y: cy + 0.4, w: cardW - 0.5, h: 0.55,
      fontFace: "Arial Black", fontSize: 14, color: ino.accent ? C.white : C.ink, bold: true, align: "left",
      lineSpacingMultiple: 1.0,
    });
    s.addText(ino.desc, {
      x: cx + 0.25, y: cy + 0.95, w: cardW - 0.5, h: 0.4,
      fontFace: "Calibri", fontSize: 9.5, color: ino.accent ? C.white : C.textSecondary, align: "left",
      transparency: ino.accent ? 15 : 0,
    });
  });
})();

// ===== SLIDE 5 · 移动端交互设计 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.paper };

  s.addText("四 · 移动端交互设计", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.grey3, charSpacing: 3, align: "left",
  });
  s.addText("UI/UX · AI NATIVE MOBILE DESIGN", {
    x: 0.8, y: 0.55, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("AI 核心球 · 语音优先 · 沉浸式体验", {
    x: 0.8, y: 0.85, w: 8.4, h: 0.55,
    fontFace: "Arial Black", fontSize: 26, color: C.ink, bold: true, align: "left",
  });

  // Left column - Design features
  s.addText("DESIGN PRINCIPLES", {
    x: 0.8, y: 1.5, w: 3.5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.ikb, bold: true, charSpacing: 3, align: "left",
  });

  const features = [
    "AI核心球呼吸动画交互",
    "语音优先输入模式",
    "沉浸式单页首页设计",
    "侧边抽屉菜单（低频功能）",
    "AI Purple 柔和科技风配色",
    "深色模式优先 · 大留白 · 微发光",
  ];
  features.forEach((f, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.95, y: 1.95 + i * 0.38, w: 0.08, h: 0.08,
      fill: { color: C.ikb },
    });
    s.addText(f, {
      x: 1.2, y: 1.88 + i * 0.38, w: 3.2, h: 0.3,
      fontFace: "Calibri", fontSize: 12, color: C.ink, align: "left",
    });
  });

  // Bottom text left
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.3, w: 3.5, h: 0,
    line: { color: C.grey2, width: 0.5 },
  });
  s.addText("用户无需进入复杂页面，首页即可完成核心事务操作", {
    x: 0.8, y: 4.4, w: 3.5, h: 0.35,
    fontFace: "Calibri", fontSize: 11, color: C.textSecondary, bold: true, align: "left",
  });

  // Right column - 3 images
  const imgDir = "D:/Project/AI_Native/ppt/images";
  const imgs = [
    { file: "05-mobile-main.png", label: "主界面", sub: "AI 核心球 · 首页" },
    { file: "05-mobile-voice.png", label: "语音模式", sub: "Voice First" },
    { file: "05-mobile-input.png", label: "文字输入", sub: "ChatGPT 式交互" },
  ];

  // Read images and add
  const fs = require("fs");
  imgs.forEach((img, i) => {
    const imgPath = path.join(imgDir, img.file);
    if (fs.existsSync(imgPath)) {
      const imgData = fs.readFileSync(imgPath);
      const b64 = imgData.toString("base64");
      const ix = 4.8 + i * 1.7;
      // Use contain sizing for portrait mobile screenshots
      s.addImage({
        data: "image/png;base64," + b64,
        x: ix, y: 1.55, w: 1.45, h: 2.6,
        sizing: { type: "contain", w: 1.45, h: 2.6 },
      });
      s.addText(img.label, {
        x: ix, y: 4.25, w: 1.45, h: 0.25,
        fontFace: "Calibri", fontSize: 10, color: C.ink, bold: true, align: "center",
      });
      s.addText(img.sub, {
        x: ix, y: 4.48, w: 1.45, h: 0.2,
        fontFace: "Calibri", fontSize: 8, color: C.grey3, align: "center", charSpacing: 2,
      });
    }
  });
})();

// ===== SLIDE 6 · 预期成果与实验评估 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.paper };

  s.addText("五 · 预期成果与实验评估", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.grey3, charSpacing: 3, align: "left",
  });
  s.addText("OUTCOMES & EVALUATION METRICS", {
    x: 0.8, y: 0.55, w: 8.4, h: 0.35,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("项目产出 · 量化评估指标", {
    x: 0.8, y: 0.85, w: 8.4, h: 0.55,
    fontFace: "Arial Black", fontSize: 26, color: C.ink, bold: true, align: "left",
  });

  // Left - Deliverables
  s.addText("EXPECTED DELIVERABLES", {
    x: 0.8, y: 1.5, w: 3.5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.ikb, bold: true, charSpacing: 3, align: "left",
  });

  const deliverables = [
    { title: "AI Native 事务管理系统", sub: "Web 原型 + 移动端核心功能" },
    { title: "模块化 Prompt 模板库", sub: "事务解析 · 时间推理 · 意图分类" },
    { title: "软件著作权 1 项", sub: "AI Native 事务管理平台 V1.0" },
    { title: "技术论文 / 研究报告 1 篇", sub: "LLM 在事务管理场景的工程化验证" },
  ];
  deliverables.forEach((d, i) => {
    const dy = 1.95 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: dy, w: 3.8, h: 0.58,
      fill: { color: C.white }, shadow: freshShadow(),
    });
    s.addText(d.title, {
      x: 1.0, y: dy + 0.05, w: 3.4, h: 0.28,
      fontFace: "Calibri", fontSize: 12, color: C.ink, bold: true, align: "left",
    });
    s.addText(d.sub, {
      x: 1.0, y: dy + 0.3, w: 3.4, h: 0.22,
      fontFace: "Calibri", fontSize: 9, color: C.grey3, align: "left",
    });
  });

  // Right - H-Bar style metrics
  s.addText("EVALUATION METRICS", {
    x: 5.2, y: 1.5, w: 4.2, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.ikb, bold: true, charSpacing: 3, align: "left",
  });

  const metrics = [
    { label: "意图识别准确率", value: "≥ 90%", pct: 90, accent: true },
    { label: "JSON 输出有效率", value: "≥ 95%", pct: 95, accent: true },
    { label: "时间解析正确率", value: "≥ 88%", pct: 88, accent: false },
    { label: "多意图拆分准确率", value: "≥ 85%", pct: 85, accent: false },
    { label: "交互效率提升", value: "3-5×", pct: 70, accent: true },
  ];
  metrics.forEach((m, i) => {
    const my = 1.95 + i * 0.7;

    // Track background
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: my + 0.15, w: 3.2, h: 0.15,
      fill: { color: C.grey1 },
    });
    // Fill
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y: my + 0.15, w: 3.2 * (m.pct / 100), h: 0.15,
      fill: { color: m.accent ? C.ikb : C.grey2 },
    });
    // Label
    s.addText(m.label, {
      x: 5.2, y: my - 0.02, w: 2.2, h: 0.22,
      fontFace: "Calibri", fontSize: 11, color: C.ink, align: "left",
    });
    // Value
    s.addText(m.value, {
      x: 7.4, y: my - 0.02, w: 1.0, h: 0.22,
      fontFace: "Arial Black", fontSize: 13, color: m.accent ? C.ikb : C.ink, bold: true, align: "right",
    });
  });

  // Bottom takeaway
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.9, w: 8.4, h: 0,
    line: { color: C.grey2, width: 0.5 },
  });
  s.addText("项目目标：验证大语言模型在事务管理场景中的工程化可行性", {
    x: 0.8, y: 4.95, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: C.textSecondary, align: "left",
  });
  s.addText("OUTCOMES · 06", {
    x: 0.8, y: 4.95, w: 8.4, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "right",
  });
})();

// ===== SLIDE 7 · 结束页 =====
(() => {
  const s = pres.addSlide();
  s.background = { color: C.ikb };

  // Split: left 55% dark IKB, right 45% white area
  // Actually let's use a white card overlay on the right
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.ikb },
  });

  // Left content
  s.addText("07 / 07", {
    x: 0.8, y: 0.4, w: 4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.white, charSpacing: 3, align: "left", transparency: 38,
  });
  s.addText("CLOSING", {
    x: 0.8, y: 0.4, w: 4, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.white, charSpacing: 3, align: "right", transparency: 38,
  });

  s.addText("THANK YOU", {
    x: 0.8, y: 1.3, w: 5, h: 0.35,
    fontFace: "Calibri", fontSize: 10, color: C.white, charSpacing: 6, align: "left", transparency: 22,
  });
  s.addText("感谢各位老师", {
    x: 0.8, y: 1.65, w: 5, h: 1.0,
    fontFace: "Arial Black", fontSize: 38, color: C.white, bold: true, align: "left",
  });
  s.addText("聆听", {
    x: 0.8, y: 2.5, w: 5, h: 0.8,
    fontFace: "Arial Black", fontSize: 38, color: C.white, bold: true, align: "left", italic: true,
  });
  s.addText("\"让软件理解用户，而不是让用户适应软件。\"", {
    x: 0.8, y: 3.2, w: 5, h: 0.4,
    fontFace: "Calibri", fontSize: 12, color: C.white, align: "left", transparency: 18,
  });

  // Bottom left
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.5, w: 4.5, h: 0,
    line: { color: C.white, width: 0.5, transparency: 70 },
  });
  s.addText("智能AI工坊实验室 · 软件工程", {
    x: 0.8, y: 4.6, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.white, align: "left", transparency: 38, charSpacing: 2,
  });
  s.addText("2026.05", {
    x: 0.8, y: 4.6, w: 4.5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.white, align: "right", transparency: 38, charSpacing: 2,
  });

  // Right white card with takeaway points
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 0.8, w: 3.8, h: 4.0,
    fill: { color: C.white }, shadow: freshShadow(),
  });
  s.addText("TAKEAWAYS", {
    x: 6.1, y: 1.1, w: 3.2, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "left",
  });
  s.addText("03 POINTS", {
    x: 6.1, y: 1.1, w: 3.2, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 4, align: "right",
  });

  const takeaways = [
    { n: "01", title: "AI Native 交互范式", desc: "自然语言驱动，告别传统表单操作", accent: false },
    { n: "02", title: "模块化 Prompt Workflow", desc: "单 LLM + 多模块职责，轻量稳定", accent: false },
    { n: "03", title: "工程化可行性验证", desc: "LLM 在事务场景中的实用价值", accent: true },
  ];
  takeaways.forEach((t, i) => {
    const ty = 1.7 + i * 1.0;
    s.addText(t.n, {
      x: 6.1, y: ty, w: 0.5, h: 0.3,
      fontFace: "Calibri", fontSize: 11, color: t.accent ? C.ikb : C.grey3, bold: true, charSpacing: 2, align: "left",
    });
    s.addText(t.title, {
      x: 6.6, y: ty, w: 3.0, h: 0.3,
      fontFace: "Arial Black", fontSize: 13, color: t.accent ? C.ikb : C.ink, bold: true, align: "left",
    });
    s.addText(t.desc, {
      x: 6.6, y: ty + 0.32, w: 3.0, h: 0.25,
      fontFace: "Calibri", fontSize: 9.5, color: C.grey3, align: "left",
    });
  });

  s.addText("→ 请各位老师批评指正", {
    x: 6.1, y: 4.4, w: 3.2, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: C.grey3, charSpacing: 2, align: "right",
  });
})();

// ===== Write =====
pres.writeFile({ fileName: "D:/Project/AI_Native/ppt/AI_Native事务管理系统-答辩PPT.pptx" })
  .then(() => console.log("PPTX created successfully!"))
  .catch(err => console.error("Error:", err));
