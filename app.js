 let currentSection = 'dashboard';
    let chatHistory = [];
    let ideasHistory = [];
    let planHistory = [];
    let financeHistory = [];
    let growthHistory = [];
    let currentPlanModalId = null;

    const DASHBOARD_TIPS = [
      'Совет дня: перед запуском протестируйте идею на 10–20 людях из целевой аудитории — так вы увидите реальный спрос, а не «вежливый да».',
      'Совет дня: каждую неделю фиксируйте три цифры: выручка, валовая маржа и откуда пришли лиды.',
      'Совет дня: один чёткий оффер с результатом и сроком сильнее пяти расплывчатых предложений.',
      'Совет дня: заложите 15–25% бюджета на непредвиденное в первые 2 месяца после старта.',
      'Совет дня: первому клиенту предложите пилот с понятными условиями — так быстрее появится кейс и отзыв.',
      'Совет дня: отделите постоянные и переменные расходы — резать бизнес проще, когда видна структура.',
      'Совет дня: выберите один главный канал продаж на тест на 2 недели; не распыляйтесь на все соцсети сразу.',
      'Совет дня: средний чек растёт пакетами и допродажами, а не бесконечными скидками.',
      'Совет дня: проверяйте юнит-экономику: цена минус переменные на заказ должны покрывать маркетинг и фикс.',
      'Совет дня: договоритесь о сроке ответа клиенту (например, до 2 часов в рабочее время) — это повышает доверие.',
      'Совет дня: ведите простую таблицу: дата, канал, заявка, сделка, сумма — без неё оптимизировать рекламу невозможно.',
      'Совет дня: перед закупкой товара посчитайте оборачиваемость: сколько дней деньги лежат в складе.',
      'Совет дня: для услуг оформите 3 пакета «лёгкий / стандарт / максимум» — клиенту проще выбрать.',
      'Совет дня: раз в месяц смотрите на отзывы и возражения; из них рождаются новые офферы и FAQ.',
      'Совет дня: не масштабируйте рекламу, пока стабильно не закрываете окупаемость на малом бюджете.',
      'Совет дня: юридически оформляйте ключевые договорённости хотя бы актом или письмом — меньше споров.',
      'Совет дня: выспитесь перед важными переговорами; усталость стоит дороже одной сделки.',
      'Совет дня: если ниша перегрета, ищите узкую поднишу или другой сегмент — «для всех» не работает.',
      'Совет дня: короткое видео с болью клиента и решением часто даёт дешевле лиды, чем абстрактный баннер.',
      'Совет дня: настройте напоминание об оплате и статусе заказа — меньше отвалов на этапе «думаю».',
      'Совет дня: сравните 5 конкурентов по цене, офферу и отзывам — таблица из пяти строк сэкономит недели.',
      'Совет дня: первые продажи делайте вручную: так вы услышите язык клиента и уточните продукт.',
      'Совет дня: ставьте дедлайны даже для «исследований» — иначе подготовка затянется на месяцы.',
      'Совет дня: резерв на налоги и возвраты держите на отдельном «виртуальном» счёте в учёте.',
      'Совет дня: если маржа низкая, ищите поставщика или формат с лучшими условиями, а не только режьте качество.',
      'Совет дня: один рабочий процесс (заявка → счёт → оплата → выполнение) важнее красивого сайта на старте.',
      'Совет дня: просите клиента порекомендовать вас сразу после удачного результата — момент тёплый.',
      'Совет дня: учите команду отвечать на типовые возражения одними и теми же сильными фразами.',
      'Совет дня: отключайте рекламные кабинеты, которые не дают заявок 2 недели подряд — проверьте креатив и посадочную.',
      'Совет дня: для онлайн-школы сначала продайте курс вручную 5 людям, потом автоматизируйте воронку.',
      'Совет дня: локальный бизнес — карты, отзывы и соседние партнёры часто эффективнее дорогого федерального таргета.',
      'Совет дня: фиксируйте себестоимость после каждой закупки — цены поставщиков плывут незаметно.',
      'Совет дня: не бойтесь поднять цену на 10% на новых клиентах и посмотреть на конверсию неделю.',
      'Совет дня: шаблоны ответов в мессенджере экономят часы и снижают количество ошибок в цифрах.',
      'Совет дня: раз в квартал пересматривайте подписки на сервисы — часто половина уже не нужна.',
      'Совет дня: цель на месяц должна быть одной числовой; остальное — задачи к ней, а не десять целей сразу.'
    ];

    function localCalendarDayIndex() {
      const t = new Date();
      const start = new Date(2020, 0, 1);
      const localMidnight = new Date(t.getFullYear(), t.getMonth(), t.getDate());
      return Math.floor((localMidnight - start) / 86400000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      loadFromStorage();
      normalizePlanHistory();
      chatHistory = chatHistory.filter(m => {
        const t = String(m?.text ?? '');
        return !(m?.role === 'ai' && (t.includes('503') || t.includes('UNAVAILABLE') || t.startsWith('⚠️ **Ошибка:**')));
      });
      if (chatHistory.length === 0) {
        chatHistory.push({
          role: 'ai',
          text: `Привет! Я консультант **D&D ai** для предпринимателей.

Могу помочь с:
- **Идеями** — ниша, ЦА, цифры запуска
- **Финансами** — окупаемость, ROI, точка безубыточности
- **Маркетингом** — оффер, воронка, реклама
- **Конкурентами и SWOT** — отстройка и риски
- **Планом** — шаги и структура

Задай вопрос или выберите быстрый вариант ниже. Разделы **Анализ конкурентов**, **Маркетинг**, **Трекер роста** и **SWOT** — в меню слева.`
        });
      }
      saveToStorage();
      renderChat();
      renderIdeas();
      renderPlans();
      renderFinance();
      loadNotes();
      initDashboard();
      applyDailyTip();
      renderGrowthTable();
    });

    function normalizePlanHistory() {
      let changed = false;
      planHistory = (planHistory || []).map((p, i) => {
        if (p.id) return p;
        changed = true;
        return {
          ...p,
          id: `legacy_${i}_${Date.now()}`,
          topic: p.topic || 'Проект',
          text: p.text || ''
        };
      });
      if (changed) saveToStorage();
    }

    function loadNotes() {
      const el = document.getElementById('notesArea');
      if (el) el.value = localStorage.getItem('dnd_notes') || '';
    }
    function saveNotes() {
      const el = document.getElementById('notesArea');
      if (!el) return;
      localStorage.setItem('dnd_notes', el.value);
      const hint = document.getElementById('notesSavedHint');
      if (hint) {
        hint.classList.remove('hidden');
        setTimeout(() => hint.classList.add('hidden'), 1600);
      }
      setAppStatus('Заметки сохранены', 'ready');
    }

    function fillPlanTemplate(text) {
      document.getElementById('planInput').value = text;
      document.getElementById('planInput').focus();
    }

    function calcBreakEven() {
      const fixed = parseFloat(document.getElementById('beFixed').value) || 0;
      const price = parseFloat(document.getElementById('bePrice').value) || 0;
      const variable = parseFloat(document.getElementById('beVar').value) || 0;
      const el = document.getElementById('beResult');
      const margin = price - variable;
      el.classList.remove('hidden');
      if (fixed <= 0 || price <= 0) {
        el.innerHTML = '<span class="text-amber-400">Укажите постоянные расходы и цену.</span>';
        return;
      }
      if (margin <= 0) {
        el.innerHTML = '<span class="text-red-400">Маржа с единицы должна быть больше нуля (цена &gt; переменные расходы).</span>';
        return;
      }
      const units = Math.ceil(fixed / margin);
      el.innerHTML = `Маржа с единицы: <strong class="text-emerald-400">${margin.toLocaleString('ru-RU')} ₽</strong>. Безубыточность при текущих постоянных: <strong class="text-indigo-300">${units.toLocaleString('ru-RU')}</strong> шт. в месяц.`;
    }

    function initTheme() {
      const saved = localStorage.getItem('dnd_theme') || localStorage.getItem('ai_theme');
      document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
    }
    function toggleTheme() {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('dnd_theme', next);
    }

    function saveToStorage() {
      localStorage.setItem('dnd_copilot_chat', JSON.stringify(chatHistory));
      localStorage.setItem('dnd_copilot_ideas', JSON.stringify(ideasHistory));
      localStorage.setItem('dnd_copilot_plans', JSON.stringify(planHistory));
      localStorage.setItem('dnd_copilot_finance', JSON.stringify(financeHistory));
      localStorage.setItem('dnd_growth', JSON.stringify(growthHistory));
    }
    function loadFromStorage() {
      try {
        const c = localStorage.getItem('dnd_copilot_chat') || localStorage.getItem('ai_copilot_chat');
        if (c) chatHistory = JSON.parse(c);
        const i = localStorage.getItem('dnd_copilot_ideas') || localStorage.getItem('ai_copilot_ideas');
        if (i) ideasHistory = JSON.parse(i);
        const p = localStorage.getItem('dnd_copilot_plans') || localStorage.getItem('ai_copilot_plans');
        if (p) planHistory = JSON.parse(p);
        const f = localStorage.getItem('dnd_copilot_finance') || localStorage.getItem('ai_copilot_finance');
        if (f) financeHistory = JSON.parse(f);
        const g = localStorage.getItem('dnd_growth');
        if (g) growthHistory = JSON.parse(g);
        if (!Array.isArray(growthHistory)) growthHistory = [];
      } catch (e) { console.warn(e); }
    }

    function applyDailyTip() {
      const el = document.getElementById('dashboardTipText');
      if (!el) return;
      const idx = localCalendarDayIndex() % DASHBOARD_TIPS.length;
      el.textContent = DASHBOARD_TIPS[idx];
    }

    function initDashboard() {
      const def = { income: 15000, expense: 4000, goal: 20000 };
      let m = { ...def };
      try {
        const s = localStorage.getItem('dnd_dashboard_metrics');
        if (s) m = { ...def, ...JSON.parse(s) };
      } catch (e) { console.warn(e); }
      const inc = document.getElementById('dashIncome');
      const exp = document.getElementById('dashExpense');
      const goal = document.getElementById('dashGoal');
      if (inc) inc.value = m.income;
      if (exp) exp.value = m.expense;
      if (goal) goal.value = m.goal;
      updateDashboardDisplay();
    }

    function updateDashboardDisplay() {
      const income = parseFloat(document.getElementById('dashIncome')?.value) || 0;
      const expense = parseFloat(document.getElementById('dashExpense')?.value) || 0;
      const goal = parseFloat(document.getElementById('dashGoal')?.value) || 0;
      const profit = income - expense;
      const pct = goal > 0 ? Math.min(100, Math.max(0, Math.round((profit / goal) * 100))) : 0;
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      set('dashViewIncome', income.toLocaleString('ru-RU'));
      set('dashViewExpense', expense.toLocaleString('ru-RU'));
      set('dashViewProfit', profit.toLocaleString('ru-RU'));
      set('dashViewGoal', goal.toLocaleString('ru-RU'));
      set('dashViewPct', String(pct));
      const bar = document.getElementById('dashProgressBar');
      if (bar) bar.style.width = `${pct}%`;
      const rec = document.getElementById('dashboardAiRec');
      if (rec) {
        if (pct >= 85) rec.textContent = 'Отличный темп: закрепите каналы, которые дали результат, и масштабируйте рекламу с контролем юнит-экономики.';
        else if (pct >= 50) rec.textContent = 'На основе ваших данных наиболее перспективным направлением является развитие цифровых услуг и продвижение через короткие видеоформаты.';
        else if (profit > 0) rec.textContent = 'Фокус: тест гипотез ЦА, два канала трафика и повышение среднего чека (апсейл, пакеты).';
        else rec.textContent = 'Сначала сократите переменные расходы и проверьте ценообразование; затем — тест спроса на малой выборке.';
      }
    }

    function saveDashboardMetrics() {
      const income = parseFloat(document.getElementById('dashIncome')?.value) || 0;
      const expense = parseFloat(document.getElementById('dashExpense')?.value) || 0;
      const goal = parseFloat(document.getElementById('dashGoal')?.value) || 0;
      localStorage.setItem('dnd_dashboard_metrics', JSON.stringify({ income, expense, goal }));
      updateDashboardDisplay();
      setAppStatus('Показатели сохранены', 'ready');
    }

    function quickGo(name) {
      switchSection(name);
      const sb = document.getElementById('sidebar');
      if (sb && typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1023px)').matches) {
        sb.classList.add('hidden');
      }
      const scrollEl = document.getElementById('contentArea');
      if (scrollEl) scrollEl.scrollTop = 0;
      const map = { ideas: 'ideasInput', finance: 'finInvestment', marketing: 'mktProduct', competitors: 'compNiche' };
      const id = map[name];
      if (!id) return;
      const focusField = () => {
        const el = document.getElementById(id);
        if (!el) return;
        el.focus({ preventScroll: false });
        try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(true); }
      };
      requestAnimationFrame(() => requestAnimationFrame(focusField));
      setTimeout(focusField, 80);
    }
    window.quickGo = quickGo;

    function renderGrowthTable() {
      const tbody = document.getElementById('growthTableBody');
      const table = document.getElementById('growthTable');
      const empty = document.getElementById('growthEmpty');
      if (!tbody || !table || !empty) return;
      tbody.innerHTML = '';
      if (!growthHistory.length) {
        empty.classList.remove('hidden');
        table.classList.add('hidden');
        return;
      }
      empty.classList.add('hidden');
      table.classList.remove('hidden');
      growthHistory.forEach((row) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-indigo-500/10';
        tr.innerHTML = `
          <td class="py-2 pr-4">${escapeHtml(row.label)}</td>
          <td class="py-2 pr-4">${(row.revenue || 0).toLocaleString('ru-RU')} ₽</td>
          <td class="py-2 pr-4">${escapeHtml(String(row.leads ?? '—'))}</td>
          <td class="py-2 text-right"><button type="button" class="text-xs text-red-400 hover:text-red-300">Удалить</button></td>`;
        tr.querySelector('button').onclick = () => removeGrowthEntry(row.id);
        tbody.appendChild(tr);
      });
    }

    function addGrowthEntry() {
      const label = document.getElementById('growthLabel')?.value.trim() || `Запись ${new Date().toLocaleDateString('ru-RU')}`;
      const revenue = parseFloat(document.getElementById('growthRevenue')?.value) || 0;
      const leads = document.getElementById('growthLeads')?.value.trim();
      growthHistory.unshift({
        id: `g_${Date.now()}`,
        label,
        revenue,
        leads: leads === '' ? null : leads
      });
      if (growthHistory.length > 52) growthHistory = growthHistory.slice(0, 52);
      saveToStorage();
      renderGrowthTable();
      document.getElementById('growthLabel').value = '';
      document.getElementById('growthRevenue').value = '';
      document.getElementById('growthLeads').value = '';
      setAppStatus('Запись добавлена', 'ready');
    }

    function removeGrowthEntry(id) {
      growthHistory = growthHistory.filter((r) => r.id !== id);
      saveToStorage();
      renderGrowthTable();
    }

    function strHash(s) {
      let h = 2166136261;
      const str = String(s);
      for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
      return h >>> 0;
    }

    function scoreFromSeed(seed, dim) {
      return 2 + (strHash(String(seed) + '|' + dim) % 4);
    }

    function shortCompLabel(name, max) {
      const t = String(name).trim();
      if (!t) return '—';
      return t.length <= max ? t : t.slice(0, max - 1) + '…';
    }

    /** Сравнительная матрица: вы vs каждый конкурент по одним критериям (оценки модельные — замените фактами с рынка). */
    function buildCompetitorHtml(niche, competitorLines) {
      const names = competitorLines.map((s) => s.trim()).filter(Boolean).slice(0, 6);
      const seed = normalizeText(niche);
      const dims = [
        { key: 'price', label: 'Цена / доступность', icon: '💰' },
        { key: 'offer', label: 'Ясность оффера', icon: '🎯' },
        { key: 'digital', label: 'Онлайн-присутствие', icon: '🌐' },
        { key: 'trust', label: 'Доверие / отзывы', icon: '⭐' },
        { key: 'speed', label: 'Скорость / сервис', icon: '⚡' }
      ];
      const you = { price: 4, offer: 3, digital: 3, trust: 2, speed: 5 };
      const competitors = names.map((n) => {
        const base = seed + '|' + normalizeText(n);
        const sc = {};
        dims.forEach((d) => { sc[d.key] = scoreFromSeed(base, d.key); });
        return { raw: n, label: shortCompLabel(n, 22), scores: sc };
      });

      let thead = `<tr><th class="rounded-tl-lg">Критерий</th><th>🚀 Вы (старт)</th>`;
      competitors.forEach((c) => {
        thead += `<th title="${escapeHtml(c.raw)}">${escapeHtml(c.label)}</th>`;
      });
      thead += '</tr>';

      let tbody = '';
      dims.forEach((d) => {
        tbody += `<tr><td class="font-medium text-gray-300">${d.icon} ${d.label}</td>`;
        tbody += `<td class="text-center"><span class="score-pill">${you[d.key]}</span></td>`;
        competitors.forEach((c) => {
          const v = c.scores[d.key];
          const vsYou = v > you[d.key] ? '<span class="text-amber-400 text-[10px] ml-1">▲</span>' : v < you[d.key] ? '<span class="text-emerald-400 text-[10px] ml-1">▼</span>' : '';
          tbody += `<td class="text-center"><span class="score-pill">${v}</span>${vsYou}</td>`;
        });
        tbody += '</tr>';
      });

      const ranked = competitors
        .map((c) => ({
          ...c,
          sum: dims.reduce((a, d) => a + c.scores[d.key], 0)
        }))
        .sort((a, b) => b.sum - a.sum);

      let insightList = '';
      if (ranked.length) {
        insightList = '<ul class="list-disc ml-5 mt-2 text-gray-400 text-sm space-y-1">';
        ranked.forEach((c, i) => {
          const stronger = dims.filter((d) => c.scores[d.key] > you[d.key]).map((d) => d.label);
          const weaker = dims.filter((d) => c.scores[d.key] < you[d.key]).map((d) => d.label);
          insightList += `<li><strong class="text-gray-300">${escapeHtml(c.label)}</strong> (сумма баллов ${c.sum}/25): `;
          if (stronger.length) insightList += `сильнее вас в: ${stronger.join(', ')}. `;
          if (weaker.length) insightList += `у вас потенциал отстройки: ${weaker.join(', ')}.`;
          else if (!stronger.length) insightList += 'по модели выглядит слабее — проверьте реальные цены и отзывы.';
          insightList += '</li>';
        });
        insightList += '</ul>';
      }

      const checklist = [
        'Зайти на сайт / витрину каждого и выписать цену, срок, гарантию',
        'Сохранить 3 объявления конкурента (скрин) — креатив и УТП',
        'Прочитать 5–10 отзывов: что хвалят и что ругают',
        'Тайный звонок / заявка: скорость ответа и скрипт продаж'
      ];

      if (!names.length) {
        return `
<div class="result-rich space-y-3">
  <div class="flex flex-wrap gap-2"><span class="sticker sticker-indigo">🏢 Ниша</span><span class="text-white font-medium">${escapeHtml(niche)}</span></div>
  <p class="text-sm text-amber-300/90">Добавьте в список <strong>минимум 2 конкурентов</strong> (по строке) — тогда появится сравнительная таблица и выводы.</p>
  <div class="rich-card text-sm text-gray-400"><span class="sticker sticker-amber mb-2">📋 Чек-лист до заполнения</span><ul class="list-disc ml-5 mt-2">${checklist.map((x) => `<li>${x}</li>`).join('')}</ul></div>
</div>`;
      }

      return `
<div class="result-rich space-y-4">
  <div class="flex flex-wrap gap-2 items-center">
    <span class="sticker sticker-indigo">🏢 Ниша</span>
    <span class="text-white font-semibold">${escapeHtml(niche)}</span>
    <span class="sticker sticker-sky">📊 Сравнение</span>
  </div>
  <p class="text-xs text-gray-500 leading-relaxed">Баллы <strong>1–5</strong> — относительная модель (зависят от формулировки ниши и названий). Замените их фактами после desk-research: так вы увидите реальное сравнение, а не «красивую таблицу».</p>
  <div class="compare-table-wrap">
    <table class="compare-table" role="grid">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>
  </div>
  <div class="rich-card">
    <span class="sticker sticker-emerald mb-1">🔍 Кто давит сильнее</span>
    ${insightList || ''}
  </div>
  <div class="rich-card text-sm">
    <span class="sticker sticker-rose mb-2">✨ Как отстроиться от «${escapeHtml(shortCompLabel(niche, 32))}»</span>
    <ul class="list-disc ml-5 text-gray-400 space-y-1">
      <li>Узкий сегмент + понятный результат за срок (не «всё для всех»).</li>
      <li>Пилот с цифрой: «первые N клиентов / дней» — дешевле тест гипотезы, чем гонка скидок.</li>
      <li>Процесс на виду: статусы, сроки, человек вместо «мы обязательно свяжемся».</li>
    </ul>
  </div>
  <div class="text-xs text-gray-500"><span class="sticker sticker-amber">⚠️</span> Не полагайтесь только на оценки здесь — сверьте с ценами и отзывами на дату проверки.</div>
</div>`;
    }

    function buildMarketingHtml(product, audience, toneKey) {
      const tones = {
        pro: { label: 'Деловой', hook: 'Сфокусируйтесь на метрике и процессе — меньше эмоций, больше проверяемых обещаний.', cta: 'Получить разбор / записаться на встречу' },
        friendly: { label: 'Тёплый', hook: 'Говорите просто, как с коллегой: одна боль — одно решение — один шаг.', cta: 'Написать нам / забрать гайд' },
        bold: { label: 'Смелый', hook: 'Бейте в диссонанс: «делаете X, а теряете Y» — потом спокойное доказательство.', cta: 'Хочу так же / исправить это' }
      };
      const T = tones[toneKey] || tones.pro;
      const aud = audience.trim() || 'уточните сегмент (роль, боль, бюджет, канал)';
      const pShort = shortCompLabel(product, 48);
      const words = product.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 4);
      const w1 = words[0] || 'результат';
      const w2 = words[1] || 'задачу';

      const headlines = [
        `${pShort}: ${w1} без лишних шагов`,
        aud.length < 40 ? `Для тех, кто ${aud.split(',')[0] || 'в теме'} — ${pShort}` : `Если устали от хаоса — ${pShort}`,
        `За 14 дней: структура под ${w2} (пилот)`
      ];

      const days = [
        ['Пн', 'Боль ЦА + короткий кейс / факт', 'Пост / сторис'],
        ['Вт', `Лид-магнит: чек-лист по «${w1}»`, 'Карусель или PDF'],
        ['Ср', 'Соцдоказательство: отзыв или скрин переписки', 'Пост'],
        ['Чт', `Разбор ошибки при выборе ${w2}`, 'Видео до 60 сек'],
        ['Пт', `Прямой оффер: ${T.cta}`, 'Реклама / таргет'],
        ['Сб', 'Ответы на возражения (3 штуки)', 'Пост'],
        ['Вс', 'Итог недели + призыв в директ', 'Сторис']
      ];

      const dm1 = T.label === 'Деловой'
        ? `Здравствуйте! По вашей нише интересен продукт «${pShort}». Могу за 15 минут показать, как закрываем [боль] без [риск]. Удобно завтра 12:00 или 16:00?`
        : `Привет! Мы как раз помогаем с «${pShort}». Если актуально — кину короткий чек-лист без воды. Напишите «+» — пришлю в личку ✨`;

      const dm2 = `Напоминание: оставили заявку на «${pShort}». Готовы показать мини-демо за 10 минут — ответьте цифрой удобного часа.`;

      return `
<div class="result-rich space-y-3">
  <div class="flex flex-wrap gap-2 items-center">
    <span class="sticker sticker-indigo">📣 Продукт</span>
    <span class="text-white font-semibold">${escapeHtml(product)}</span>
  </div>
  <div class="flex flex-wrap gap-2">
    <span class="sticker sticker-sky">🎯 Аудитория</span>
    <span class="text-gray-300 text-sm">${escapeHtml(aud)}</span>
  </div>
  <div class="flex flex-wrap gap-2">
    <span class="sticker sticker-emerald">🗣 Тон: ${T.label}</span>
    <span class="text-gray-400 text-sm">${escapeHtml(T.hook)}</span>
  </div>

  <div class="rich-card">
    <span class="sticker sticker-amber mb-2">💎 УТП (3 угла)</span>
    <ol class="list-decimal ml-5 text-gray-300 text-sm space-y-1">
      <li><strong>Специализация:</strong> только ${escapeHtml(w1)} — без лишнего в продукте.</li>
      <li><strong>Прозрачность:</strong> срок, этапы, что входит в «${escapeHtml(pShort)}».</li>
      <li><strong>Снижение риска:</strong> пилот / оплата по этапам / понятный SLA.</li>
    </ol>
  </div>

  <div class="rich-card text-sm">
    <span class="sticker sticker-rose mb-2">🧲 Оффер в одном абзаце</span>
    <p class="text-gray-300">«${escapeHtml(pShort)}» — для ${escapeHtml(aud.split(',')[0] || 'занятых людей в нише')}: получаете <strong>измеримый шаг</strong> за 7–14 дней, без типовых «раскачек» и скрытых платежей. <strong>Призыв:</strong> ${escapeHtml(T.cta)}.</p>
  </div>

  <div class="rich-card">
    <span class="sticker sticker-indigo mb-2">📢 Заголовки (3 варианта)</span>
    <ul class="space-y-2 text-sm text-gray-300">
      ${headlines.map((h) => `<li class="border-l-2 border-indigo-500/40 pl-3">${escapeHtml(h)}</li>`).join('')}
    </ul>
  </div>

  <div class="compare-table-wrap">
    <table class="compare-table text-xs">
      <thead><tr><th>День</th><th>Смысл</th><th>Формат</th></tr></thead>
      <tbody>
        ${days.map((row) => `<tr><td class="font-semibold text-indigo-300">${row[0]}</td><td>${escapeHtml(row[1])}</td><td class="text-gray-500">${escapeHtml(row[2])}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="rich-card text-sm">
    <span class="sticker sticker-sky mb-2">💬 Шаблоны в мессенджер</span>
    <p class="text-gray-400 mb-2"><strong class="text-gray-300">Первый контакт:</strong></p>
    <p class="text-gray-300 bg-black/20 rounded-lg p-3 mb-3">${escapeHtml(dm1)}</p>
    <p class="text-gray-400 mb-2"><strong class="text-gray-300">Дожим:</strong></p>
    <p class="text-gray-300 bg-black/20 rounded-lg p-3">${escapeHtml(dm2)}</p>
  </div>

  <div class="rich-card text-sm text-gray-400">
    <span class="sticker sticker-emerald mb-2">📈 Бюджет теста (ориентир)</span>
    <ul class="list-disc ml-5 space-y-1">
      <li>40% — креативы и посадочная</li>
      <li>35% — таргет / контекст на 7 дней</li>
      <li>25% — доработка оффера по метрикам</li>
    </ul>
    <p class="mt-2 text-xs text-gray-500">Метрики: CPL, CR в заявку, CR в оплату, стоимость квалифицированного лида.</p>
  </div>
</div>`;
    }

    function buildSwotMarkdown(name, context) {
      const niche = inferPlanNiche(name + ' ' + context);
      const nicheHint = {
        food_delivery: 'логистика и маржа',
        education: 'репутация и программа',
        retail: 'остатки и карточка',
        tech_product: 'онбординг и удержание в продукте',
        beauty: 'повторные визиты и стандарты сервиса',
        fitness: 'безопасность и удержание абонементов',
        services: 'загрузка и стандарты',
        creator: 'охваты и монетизация',
        generic: 'спрос и дифференциация'
      }[niche] || 'спрос и дифференциация';
      return [
        `### SWOT: ${name}`,
        '',
        context ? `**Контекст:** ${context}` : '',
        '',
        '#### Strengths (сильные стороны)',
        `- Экспертиза и скорость запуска в нише.`,
        `- Гибкость малой команды / личный бренд.`,
        `- Понятный продукт и цена для первых клиентов.`,
        '',
        '#### Weaknesses (слабые стороны)',
        '- Ограниченный бренд и узнаваемость на старте.',
        '- Зависимость от 1–2 каналов продаж.',
        '- Нехватка процессов (CRM, регламенты) при росте.',
        '',
        '#### Opportunities (возможности)',
        `- Спрос на **${nicheHint}** в выбранном сегменте.`,
        '- Партнёрства, коллаборации, нишевые площадки.',
        '- Контент и короткие видео как недорогой тест спроса.',
        '',
        '#### Threats (угрозы)',
        '- Усиление конкуренции и рост стоимости трафика.',
        '- Изменение правил площадок / законодательства.',
        '- Сезонность и кассовые разрывы без резерва.',
        '',
        '#### Следующий шаг',
        '- Выберите 1 силу + 1 возможность на ближайшие 2 недели; 1 слабость закройте минимальным процессом.'
      ].filter(Boolean).join('\n');
    }

    async function runCompetitorAnalysis() {
      const niche = document.getElementById('compNiche')?.value.trim();
      if (!niche) return;
      const raw = document.getElementById('compList')?.value || '';
      const lines = raw.split(/\r?\n/);
      const btn = document.getElementById('compBtn');
      const out = document.getElementById('compResult');
      btn.disabled = true;
      setAppStatus('Анализ…', 'thinking');
      await new Promise((r) => setTimeout(r, 350));
      out.innerHTML = `<div class="chat-msg text-sm leading-relaxed">${buildCompetitorHtml(niche, lines)}</div>`;
      btn.disabled = false;
      setAppStatus('Готово к работе', 'ready');
    }

    async function runMarketingPack() {
      const product = document.getElementById('mktProduct')?.value.trim();
      if (!product) return;
      const audience = document.getElementById('mktAudience')?.value.trim();
      const tone = document.getElementById('mktTone')?.value || 'pro';
      const btn = document.getElementById('mktBtn');
      const out = document.getElementById('mktResult');
      btn.disabled = true;
      setAppStatus('Генерация…', 'thinking');
      await new Promise((r) => setTimeout(r, 350));
      out.innerHTML = `<div class="chat-msg text-sm leading-relaxed">${buildMarketingHtml(product, audience, tone)}</div>`;
      btn.disabled = false;
      setAppStatus('Готово к работе', 'ready');
    }

    async function runSwot() {
      const name = document.getElementById('swotName')?.value.trim();
      if (!name) return;
      const ctx = document.getElementById('swotContext')?.value.trim() || '';
      const btn = document.getElementById('swotBtn');
      const out = document.getElementById('swotResult');
      btn.disabled = true;
      setAppStatus('SWOT…', 'thinking');
      await new Promise((r) => setTimeout(r, 350));
      out.innerHTML = `<div class="result-rich chat-msg text-sm text-gray-300 leading-relaxed">${markdownToHtml(buildSwotMarkdown(name, ctx))}</div>`;
      btn.disabled = false;
      setAppStatus('Готово к работе', 'ready');
    }

    function normalizeText(s) {
      return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    /** Пытается извлечь 2–3 числа и посчитать прибыль / окупаемость / ROI из свободного текста. */
    function tryChatFinanceFromText(raw) {
      const ql = normalizeText(raw);
      if (!/(руб|₽|влож|инвест|доход|расход|прибыл|окуп|roi|марж|капитал|выручк|затрат)/.test(ql)) return null;
      const t = String(raw).replace(/\u00A0/g, ' ').replace(/,/g, '.');
      const nums = t.match(/\d[\d\s]*(?:\.\d+)?/g);
      if (!nums || nums.length < 2) return null;
      const N = nums.map((s) => parseFloat(String(s).replace(/\s/g, ''))).filter((x) => x > 0 && x < 1e15 && isFinite(x));
      if (N.length < 2) return null;
      let investment = 0;
      let revenue = 0;
      let expenses = 0;
      const hi = /влож|инвест|стартов|затратил|капитал|вложил/.test(ql);
      const hr = /доход|выручк|продаж|выруч|поступлен/.test(ql);
      const he = /расход|затрат|издерж/.test(ql);
      if (hr && he) {
        revenue = N[0];
        expenses = N[1];
        investment = N[2] || 0;
      } else if (hi && hr) {
        investment = N[0];
        revenue = N[1];
        expenses = N[2] || 0;
      } else {
        return null;
      }
      const profit = revenue - expenses;
      const payback = profit > 0 && investment > 0 ? Math.ceil(investment / profit) : null;
      const roiY = profit > 0 && investment > 0 ? ((profit * 12) / investment * 100).toFixed(0) : null;
      const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0';
      return [
        '### 📊 Расчёт по вашим цифрам',
        '',
        `- **Выручка:** ${revenue.toLocaleString('ru-RU')} ₽`,
        `- **Расходы:** ${expenses.toLocaleString('ru-RU')} ₽`,
        `- **Прибыль:** ${profit.toLocaleString('ru-RU')} ₽`,
        investment > 0 ? `- **Вложения:** ${investment.toLocaleString('ru-RU')} ₽` : '',
        `- **Рентабельность по выручке:** ${margin}%`,
        payback != null ? `- **Окупаемость вложений:** ~${payback} мес. при такой прибыли` : profit <= 0 ? '- **Окупаемость:** при текущей модели прибыль ≤ 0 — пересмотрите цену или структуру расходов' : '',
        roiY != null ? `- **ROI (год к вложениям, ориентир):** ~${roiY}%` : '',
        '',
        'Если что-то не сходится — напишите три числа отдельно: **вложения**, **выручка в месяц**, **расходы в месяц**.'
      ].filter(Boolean).join('\n');
    }

    function offlineChatAnswer(userText) {
      const q = normalizeText(userText);
      const financeTry = tryChatFinanceFromText(userText);
      if (financeTry) return financeTry;
      const rules = [
        [() => q.includes('iphone') && (q.includes('ресел') || q.includes('перепрод') || q.includes('resell') || q.includes('перепродав')), () => [
          '### Как стать реселлером iPhone (легально и аккуратно)',
          '',
          '- **Модель**: б/у и обмен, комиссия, аксессуары + диагностика.',
          '- **Откуда товар**: локальные чаты и объявления — только с проверкой.',
          '- **Проверка**: IMEI, iCloud, Face ID, батарея, следы вскрытия.',
          '- **Маржа**: доставка, комиссия площадки, торг, гарантия 7–14 дней.',
          '',
          'Напишите **город** и **бюджет на партию** — подскажу точнее.'
        ].join('\n')],
        [() => /рентабельн|маржинальн|рентабельность/.test(q), () => [
          '### Рентабельность и маржа',
          '',
          '- **Маржа с единицы** = цена − переменные расходы на единицу.',
          '- **Рентабельность по выручке** = (выручка − все расходы) / выручка × 100%.',
          '- Сравнивайте с нишей: в услугах часто выше, в ритейле ниже, но оборот больше.',
          '',
          'Пришлите **цену**, **себестоимость** и **постоянные расходы в месяц** — оценю грубо по вашим цифрам.'
        ].join('\n')],
        [() => /окупаем|окупаемость|payback/.test(q), () => [
          '### Окупаемость вложений',
          '',
          '- **Срок окупаемости (мес.)** ≈ вложения / чистая прибыль в месяц.',
          '- Если прибыль ≤ 0 — сначала правьте юнит-экономику и спрос.',
          '- Заложите **15–25%** на непредвиденное в прогноз.',
          '',
          'Напишите **сумму вложений** и **ожидаемую прибыль/мес** — посчитаю ориентир.'
        ].join('\n')],
        [() => /roi|рoi|окупаемость инвест/.test(q), () => [
          '### ROI (упрощённо)',
          '',
          '- **ROI за год** ≈ (прибыль в год / вложения) × 100%.',
          '- Для сравнения проектов используйте одинаковый горизонт (год).',
          '- Учитывайте время основателя — это тоже стоимость.',
          '',
          'Дайте **вложения** и **чистую прибыль в месяц** — прикину ROI.'
        ].join('\n')],
        [() => /оффер|offer|уникальн.*предложен/.test(q), () => [
          '### Оффер за 5 минут',
          '',
          '1. **Кому** — один сегмент, не «все».',
          '2. **Результат** — измеримый и понятный.',
          '3. **Срок** — за сколько получит.',
          '4. **Доказательство** — кейс, цифра, гарантия, пилот.',
          '5. **Призыв** — один следующий шаг (заявка, тест, звонок).',
          '',
          'Пример: «Для владельцев кафе: +15% повторных визитов за 30 дней через программу лояльности — пилот 2 недели».'
        ].join('\n')],
        [() => /таргет|реклам|маркетинг|продвижен|smm|контекст/.test(q), () => [
          '### Маркетинг: с чего начать',
          '',
          '- **Гипотеза ЦА** — кто платит и где живёт онлайн.',
          '- **Один канал** на тест: короткие видео / контекст / партнёры / локально.',
          '- **Лид-магнит** + простая воронка в мессенджер.',
          '- **Метрики**: стоимость лида, конверсия в оплату, не только охваты.',
          '',
          'Опишите **продукт** и **бюджет на тест** — предложу последовательность на 7 дней.'
        ].join('\n')],
        [() => /конкурент|конкуренц/.test(q), () => [
          '### Анализ конкурентов',
          '',
          '- Составьте таблицу: цена, оффер, каналы, отзывы, слабое место.',
          '- Ищите **щель**: скорость, сервис, узкая ниша, гарантия.',
          '- Не копируйте сайт — копируйте только проверенные механики.',
          '',
          'Откройте раздел **«Анализ конкурентов»** слева — там шаблон под ваш ввод.'
        ].join('\n')],
        [() => /swot|свот/.test(q), () => [
          '### SWOT',
          '',
          '- **S** — что уже работает (экспертиза, скорость, цена).',
          '- **W** — узкие места (бренд, процессы, один канал).',
          '- **O** — тренды, партнёры, новые площадки.',
          '- **T** — регуляторика, рост цены трафика, сезонность.',
          '',
          'В меню есть **SWOT-анализ** — введите проект и контекст, получите черновик матрицы.'
        ].join('\n')],
        [() => /самозанят|ип|налог|ооо/.test(q), () => [
          '### Форма и налоги (общие ориентиры)',
          '',
          '- **Самозанятость** — простой старт, лимиты и ограничения по видам деятельности.',
          '- **ИП** — УСН чаще всего; нужен учёт и понимание взносов.',
          '- **ООО** — если несколько учредителей и крупные контракты.',
          '',
          'Уточните **страну/регион** и **оборот** — подскажу, что изучить в первую очередь (без замены консультанта).'
        ].join('\n')],
        [() => /wildberries|вайлдберри|озон|ozon|маркетплейс|wb\b/.test(q), () => [
          '### Маркетплейсы',
          '',
          '- **Юнит-экономика**: закупка + логистика + комиссия + реклама на площадке.',
          '- **Карточка**: фото, SEO в названии, отзывы, цена на старте конкурентная.',
          '- **Тест**: 1–3 SKU, маленькая партия, быстрая оборачиваемость.',
          '',
          'Напишите **категорию** и **ориентир закупки** — обсудим маржу и риски.'
        ].join('\n')],
        [() => /школьник|школ|подрост|студент/.test(q), () => [
          '### Бизнес для школьника / студента',
          '',
          '- **Низкий порог**: услуги (репетиторство, дизайн, монтаж), перепродажа, мерч.',
          '- **Время**: 5–10 ч/нед — выберите один формат.',
          '- **Риски**: не нарушайте правила площадок и возрастные ограничения.',
          '',
          'Что интересно: **онлайн** или **офлайн**, какой **навык** уже есть?'
        ].join('\n')],
        [() => /расход|эконом|сократить затрат|оптимиз/.test(q), () => [
          '### Сокращение расходов',
          '',
          '- Разделите **постоянные** и **переменные** — режьте сначала необязательное.',
          '- Подписки, реклама без ROMI, избыточный склад.',
          '- Договоритесь о **отсрочке** с поставщиками при росте.',
          '',
          'Перечислите **3 крупные статьи расходов** — подскажу, что проверить первым.'
        ].join('\n')],
        [() => /ценообраз|цена|скидк|чек/.test(q), () => [
          '### Цена и средний чек',
          '',
          '- Отталкивайтесь от **желаемой маржи** и **готовности платить ЦА** (интервью).',
          '- **Пакеты** поднимают средний чек лучше, чем просто скидка.',
          '- Тестируйте цену на малой выборке, а не «на глаз».',
          '',
          'Напишите **себестоимость** и **3 конкурента с ценами** — помогу выбрать коридор.'
        ].join('\n')],
        [() => /инвест|инвестор|привлечь деньги/.test(q), () => [
          '### Инвестиции на старте',
          '',
          '- Сначала **traction**: выручка, лиды, пилоты — так проще разговаривать.',
          '- Пакет: понятная модель, юнит-экономика, план на 12 месяцев.',
          '- Друзья/семья — только с прозрачными условиями.',
          '',
          'Опишите **стадию** и **сколько нужно** — скажу, какой пакет документов собрать в первую очередь.'
        ].join('\n')],
        [() => /команда|найм|сотрудник/.test(q), () => [
          '### Команда',
          '',
          '- На старте: **процессы** важнее штата.',
          '- Аутсорс рутины (бухгалтерия, дизайн) часто дешевле ошибок.',
          '- Найм: тестовое задание + понятный KPI на испытательный срок.',
          '',
          'Кого хотите нанять первым и **какую задачу** закрыть?'
        ].join('\n')],
        [() => /поставщик|закуп|опт/.test(q), () => [
          '### Закупки',
          '',
          '- 2–3 поставщика, сравнение условий и сроков.',
          '- Малая партия на тест, потом объём.',
          '- Договор/УПД, прозрачные штрафы за брак.',
          '',
          'Какая **ниша** и **минимальная партия**, с которой готовы начать?'
        ].join('\n')],
        [() => /что такое|объясни|простыми словами/.test(q), () => [
          '### Разберём термин',
          '',
          'Напишите **одно слово или фразу** (например: юнит-экономика, LTV, воронка, лиды) — объясню коротко и дам пример из малого бизнеса.'
        ].join('\n')],
        [() => /воронк|лидоген|лиды\b|cpl\b|конверс/.test(q), () => [
          '### Воронка и лиды',
          '',
          '- **Воронка**: охват → клик → лид → квалификация → оплата → повтор.',
          '- **CPL** = расход на рекламу / количество лидов; сравнивайте по каналам.',
          '- Узкое горлышко чаще всего: посадочная, скорость ответа, цена, доверие.',
          '',
          'Напишите **канал** (таргет, поиск, органика) и **текущий CPL** — подскажу, что проверить первым.'
        ].join('\n')],
        [() => /crm|срм|amo|битрик|пайплайн/.test(q), () => [
          '### CRM на старте',
          '',
          '- Минимум: статус сделки, источник лида, следующий шаг, сумма.',
          '- Автоответ новому лиду за 5–15 минут сильнее «идеальной воронки» без ответа.',
          '- Раз в неделю: конверсия по этапам и причины отказа в 3 тега.',
          '',
          'Сколько лидов в месяц и **где** они теряются чаще всего?'
        ].join('\n')],
        [() => /лендинг|landing|посадочн|сайт прода/.test(q), () => [
          '### Посадочная страница',
          '',
          '1. Заголовок = боль + результат + срок.',
          '2. Подзаголовок = как работаете и для кого.',
          '3. Доказательства: цифры, логотипы, отзыв.',
          '4. Один основной CTA; форма короткая.',
          '',
          'Пришлите **нишу** — предложу структуру блоков в 6 строках.'
        ].join('\n')],
        [() => /делегир|аутсорс|фриланс|подряд/.test(q), () => [
          '### Делегирование',
          '',
          '- Делегируйте **повторяемое** с чек-листом, не «мысли вслух».',
          '- Контроль: срок, критерий готовности, один канал связи.',
          '- Начните с 20% времени, не с критического процесса в первый день.',
          '',
          'Какую задачу хотите отдать первой и **какой результат** ожидаете?'
        ].join('\n')],
        [() => /переговор|сделк|клиент не готов|возражен/.test(q), () => [
          '### Переговоры и возражения',
          '',
          '- Выслушайте → переформулируйте боль → дайте мини-кейс → предложите шаг (пилот, звонок, документ).',
          '- «Дорого» часто значит «не вижу ценности» — переведите в цифру или риск без вас.',
          '- Фиксируйте итог письмом: что согласовали, что отправите, когда.',
          '',
          'Какое **возражение** слышите чаще всего — одной фразой?'
        ].join('\n')],
        [() => /партнёр|коллаб|бартер|совместн/.test(q), () => [
          '### Партнёрства',
          '',
          '- Ищите смежную аудиторию без прямого конфликта продуктов.',
          '- Пакет: кто что даёт, срок пилота, метрика успеха, кто отвечает.',
          '- Оформляйте хотя бы e-mail-согласование условий.',
          '',
          'В какой **нише** ищете партнёра и что можете предложить взамен?'
        ].join('\n')],
        [() => /email|рассылк|подписчик|telegram-канал/.test(q), () => [
          '### Email и рассылки',
          '',
          '- Сегмент: новые / тёплые / клиенты — разные цепочки.',
          '- Тема письма = конкретная выгода или вопрос; тестируйте 2 варианта.',
          '- Один CTA; частота без спама — лучше реже, но полезно.',
          '',
          'Какой **продукт** и какой сегмент базы?'
        ].join('\n')],
        [() => /выгоран|устал|мотивац|прокрастин/.test(q), () => [
          '### Режим основателя',
          '',
          '- Разделите «стратегия / операционка» по дням недели — иначе всё смешивается.',
          '- Один блок глубокой работы 90 мин без мессенджеров.',
          '- Если застряли — сузьте задачу до действия на 25 минут.',
          '',
          'Что сейчас **больше всего выматывает** — объём, неопределённость или люди?'
        ].join('\n')],
        [() => /юнит-эконом|ltv|cac|пожизненн/.test(q), () => [
          '### Юнит-экономика',
          '',
          '- **CAC** ≈ маркетинг на привлечение / новые платящие за период.',
          '- **LTV** ≈ средний чек × частота покупок × срок жизни клиента (упрощённо).',
          '- Здорово, если **LTV > 3× CAC** — ориентир для подписки и повторных продаж.',
          '',
          'Дайте **средний чек** и **стоимость привлечения клиента** — оценю запас прочности.'
        ].join('\n')],
        [() => /масштаб|франшиз|открыть филиал|в другом городе/.test(q), () => [
          '### Масштабирование',
          '',
          '- Сначала **повторяемый процесс** и юнит-экономика на одной точке.',
          '- Филиал = копия процесса + локальный маркетинг + управленец на месте.',
          '- Франшиза — когда бренд и регламенты выдерживают клонирование.',
          '',
          'На каком **обороте и марже** сейчас стоите и что хотите открыть следующим шагом?'
        ].join('\n')]
      ];
      for (const [pred, fn] of rules) {
        try {
          if (pred()) return fn();
        } catch (e) { console.warn(e); }
      }
      const bucket =
        /иде|ниш|продукт|запуск|стартап/.test(q) ? 'запуск и продукт' :
          /продаж|клиент|заявк/.test(q) ? 'продажи и лиды' :
            /деньг|руб|₽|финанс|прибыл|расход/.test(q) ? 'финансы' :
              /реклам|трафик|таргет|контент/.test(q) ? 'маркетинг' : 'общая стратегия';
      return [
        '### Уточним и ответим точнее',
        '',
        `Похоже, речь о **${bucket}**. Я разобрал запрос: «${String(userText).slice(0, 220)}${String(userText).length > 220 ? '…' : ''}»`,
        '',
        '**Что могу сделать сразу:**',
        '- Ответить по **конкретным цифрам** (вложения, выручка, расходы в одном сообщении).',
        '- Разобрать **нишу** — напишите продукт и город.',
        '- Подсказать **маркетинг** — продукт, аудитория, бюджет теста.',
        '',
        'Разделы слева: **Идеи**, **Финансы**, **Маркетинг AI**, **Конкуренты**, **SWOT** — там готовые шаблоны под документ.'
      ].join('\n');
    }

    function extractIdeaKeywords(topic) {
      return String(topic)
        .split(/[,;|/]+|\s+—\s+|\s+-\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1)
        .slice(0, 6);
    }

    function buildDetailedIdea(topic, city) {
      const cleanTopic = String(topic).trim().replace(/\s+/g, ' ');
      const niche = inferPlanNiche(cleanTopic);
      const keywords = extractIdeaKeywords(cleanTopic);
      const kwLine = keywords.length
        ? `**Разбор запроса:** ${keywords.join(', ')} — ниже шаги именно под эту формулировку.`
        : '';
      const loc = String(city || '').trim();
      const locLine = loc
        ? `**Регион:** ${loc} — заложите доставку/логистику и локальную рекламу (карты, район, партнёры).`
        : '**Регион:** не указан — добавьте город: так точнее каналы и сроки доставки.';
      const draftName = cleanTopic.length > 45 ? cleanTopic.slice(0, 42) + '…' : cleanTopic;
      const audienceByNiche = {
        food_delivery: `Люди рядом с точкой продаж или в зоне доставки, кому нужно быстро и предсказуемо по **«${draftName}»**. Уточните: обеды в офис, семьи, студенты, ночной спрос.`,
        education: `Те, у кого есть конкретный дедлайн или боль по теме **«${draftName}»** (экзамен, смена профессии, навык для работы). Сегментируйте: новички vs продвинутые.`,
        retail: `Покупатели, которые ищут **«${draftName}»** на маркетплейсах или в соцсетях. Важны фото, отзывы, понятная гарантия и срок отправки.`,
        tech_product: `Бизнес или частные пользователи, у которых боль решается продуктом вокруг **«${draftName}»**. Нужен чёткий сценарий «до/после» и онбординг.`,
        beauty: `Клиенты с регулярным спросом на услуги/товары по **«${draftName}»**. Решают отзывы, мастер, гигиена, удобство записи и цена повторного визита.`,
        fitness: `Люди с целью по здоровью/форме, которым подходит формат **«${draftName}»**. Важны дисциплина, безопасность, мотивация и понятный результат за срок.`,
        services: `Заказчики с повторяемой задачей по теме **«${draftName}»**. Ценят срок, прозрачный объём работ и кейсы, а не общие обещания.`,
        creator: `Аудитория, которой интересна тема **«${draftName}»**. Монетизация: реклама, партнёрки, платные продукты; сначала стабильный охват и доверие.`,
        generic: `Сузьте ЦА для **«${draftName}»**: кто платит, какой бюджет, какой срок. Проведите 10 коротких интервью и выпишите 3 формулировки боли своими словами клиентов.`
      };
      const audienceText = audienceByNiche[niche] || audienceByNiche.generic;
      const packs = {
        food_delivery: {
          start: '25 000–150 000 ₽ (оборудование, первая закупка, упаковка, разрешения по требованиям)',
          unit: '250–900 ₽ за позицию или средний чек заказа — прикиньте из меню из 5 позиций',
          margin: '35–55% до агрегаторов; с агрегатором закладывайте комиссию 15–35% в цену',
          steps: [
            `Сформируйте меню из 3–7 позиций под **«${draftName}»**, один явный «хит»`,
            'Считайте себестоимость порции и минимальный заказ; зафиксируйте в таблице',
            '10 предзаказов в чате / у знакомых с полной оплатой или залогом',
            'Один канал: доставка, самовывоз или точка — не всё сразу'
          ]
        },
        education: {
          start: '0–45 000 ₽ (платформа, материалы, тестовый трафик)',
          unit: '1 500–3 500 ₽/урок или модуль 4 990–19 990 ₽ — зависит от трансформации, которую обещаете',
          margin: '60–85% на онлайне после отладки программы',
          steps: [
            `Опишите результат курса по **«${draftName}»** в одном измеримом предложении`,
            'Сделайте бесплатный мини-урок или PDF на 5–7 страниц как лид-магнит',
            '10 бесплатных диагностик 20 мин — слушайте формулировки, не продавайте в лоб',
            'Первые 3 оплаты вручную со скидкой за отзыв и разрешение на кейс'
          ]
        },
        retail: {
          start: '15 000–250 000 ₽ (партия, фото, упаковка, этикетки)',
          unit: 'зависит от SKU под **«${draftName}»**; посчитайте полную себестоимость с доставкой до покупателя',
          margin: '25–55%; на маркетплейсе минус комиссия и логистика площадки',
          steps: [
            '2–4 SKU максимум на тест; проверьте оборачиваемость за 30 дней',
            'Карточка: 5–7 фото, SEO в названии, честное описание и сроки',
            'Таблица остатков и себестоимости с первой продажи',
            'Реклама с лимитом; отключайте, если нет добавок в корзину за 5–7 дней'
          ]
        },
        tech_product: {
          start: '30 000–400 000 ₽ (разработка MVP, домен, базовая инфраструктура)',
          unit: 'подписка / лицензия / разовый внедрение — выберите одну модель для старта',
          margin: '40–80% после выхода на платящих; до этого учитывайте время разработки',
          steps: [
            `Опишите одну «боль» пользователя, которую закрывает **«${draftName}»**, без списка из 20 функций`,
            'MVP: 1 сценарий end-to-end, остальное в бэклог',
            '5 пилотных клиентов с письменной обратной связью каждую неделю',
            'Документация «как начать за 10 минут» и шаблон поддержки'
          ]
        },
        beauty: {
          start: '80 000–350 000 ₽ (оборудование, расходники, мебель, санобработка — по формату)',
          unit: 'услуга + retail по возможности; средний чек и частота визита — ключ к прибыли',
          margin: '35–65% после загрузки мастеров; на старте считайте простой',
          steps: [
            `Прайс и 3 пакета под **«${draftName}»** с понятной разницей`,
            'Онлайн-запись и напоминания; регламент отмены',
            '10 модельных клиентов или скидка за честный отзыв с фото (с согласия)',
            'Партнёрства с смежными точками в радиусе 500 м – 2 км'
          ]
        },
        fitness: {
          start: '50 000–200 000 ₽ (зал/аренда, страховка, минимальный инвентарь, сертификация по норме)',
          unit: 'абонемент, пакет тренировок, онлайн-сопровождение — одна основная модель на старте',
          margin: '40–70% при стабильной загрузке слотов',
          steps: [
            `Программа на 4–8 недель с измеримым результатом для **«${draftName}»**`,
            'Пробная тренировка или неделя со скидкой с чёткими правилами',
            'Договор и мед. ограничения проговорите до оплаты',
            'Набор через рефералки и локальные чаты, не только таргет'
          ]
        },
        services: {
          start: '5 000–90 000 ₽ (инструменты, первые лиды, простой сайт/лендинг)',
          unit: 'пакеты с границами объёма и срока; почасовку оставьте для допработ',
          margin: '40–75% при отлаженном процессе',
          steps: [
            `Бриф на 1 странице для услуги **«${draftName}»**`,
            'Календарь, шаблоны КП и акта — до первого платного клиента',
            '3–5 пилотов: цена ниже рынка за отзыв и разрешение на публикацию кейса',
            'Регламент: заявка → согласование → предоплата → работа → акт'
          ]
        },
        creator: {
          start: '10 000–150 000 ₽ (оборудование по необходимости, софт, тест продвижения)',
          unit: 'реклама, интеграции, платный продукт, консультации — выберите один поток монетизации на квартал',
          margin: 'зависит от ниши; учитывайте часы на производство контента',
          steps: [
            `Контент-план на 14 дней вокруг **«${draftName}»** с рубриками и CTA`,
            'Лид-магнит (чек-лист, шаблон) и ссылка в профиле',
            'Коллаборации с 2–3 смежными авторами',
            'Еженедельно: что сработало по заявкам/продажам, а не только охваты'
          ]
        },
        generic: {
          start: '0–60 000 ₽ под MVP и проверку спроса',
          unit: 'средний чек — из 5 интервью + медиана цен 3 конкурентов',
          margin: 'ориентир 30–60% до стабильных объёмов',
          steps: [
            `Сформулируйте гипотезу: кто купит **«${draftName}»** в первую очередь и зачем`,
            '10 разговоров по 15 минут, 3 вопроса: боль, бюджет, альтернатива',
            'Лендинг из 5 блоков или пост + форма в мессенджер',
            'Первые сделки вручную с фиксацией возражений'
          ]
        }
      };
      const p = packs[niche] || packs.generic;
      return [
        `### 🎯 Проект (черновик): ${draftName}`,
        kwLine,
        locLine,
        '',
        '### 💡 Суть и формат',
        `- Продукт/услуга вокруг темы **«${cleanTopic}»** в формате, который вы можете продать за 7–14 дней (не «идеально», а **проверяемо**).`,
        `- Ниша по классификатору генератора: **${niche.replace(/_/g, ' ')}** — используйте разделы **Бизнес-план**, **SWOT** и **Конкуренты** для углубления.`,
        '',
        '### 👥 Целевая аудитория',
        audienceText,
        '',
        '### 💰 Финансы (ориентиры, уточняйте под себя)',
        `- **Старт:** ${p.start}`,
        `- **Единица / монетизация:** ${p.unit}`,
        `- **Маржа:** ${p.margin}`,
        '',
        '### 📈 План на 14 дней (конкретные шаги)',
        ...p.steps.map((s) => `- ${s}`),
        '',
        '### ✅ Проверка за 48 часов',
        `- Спросите 5 человек из ЦА: «Заплатили бы X ₽ за [результат по **«${draftName}»**] в срок Y?» — фиксируйте ответы.`,
        '- Запишите 3 ближайших конкурента: цена, что обещают, слабое место.',
        '- Решите минимальную цену, ниже которой вы не работаете (себестоимость + налоги + время).',
        '',
        '### 📣 Каналы',
        loc
          ? `- **${loc}:** карты, локальные чаты, партнёры рядом, наружка/точка по бюджету.`
          : '- Локально и онлайн: начните с одного канала на 7 дней и метрики «заявка/заказ».',
        '- Короткое видео или карусель: боль → как **«${draftName}»** помогает → призыв.',
        '',
        '### ⚠️ Риски',
        '- Спрос только «на словах» — берите предоплату или пилот с чеком.',
        '- Слишком широкое **«${draftName}»** — сузьте сегмент или географию на первый месяц.',
        '',
        '### ⚙️ Дальше в D&D ai',
        '- **Бизнес-план** и **SWOT** с тем же текстом темы дадут структуру документа под инвестора или команду.'
      ].filter(Boolean).join('\n');
    }

    function formatMoneyPlan(n) {
      if (n == null || n === '' || !isFinite(Number(n))) return null;
      return `${Math.round(Number(n)).toLocaleString('ru-RU')} ₽`;
    }

    function planChannelHint(ch) {
      if (ch === 'offline') return 'Каналы: локация, сарафан, партнёрства, офлайн-реклама в районе.';
      if (ch === 'both') return 'Каналы: онлайн-витрина + офлайн-точка или самовывоз; единое имя и правила связи.';
      return 'Каналы: сайт или карточки на площадках, соцсети, мессенджеры, точечный таргет.';
    }

    function inferPlanNiche(topic) {
      const q = normalizeText(topic);
      if (/(достав|обед|еда|кофе|пекар|кафе|фуд|кухн|ланч|бургер|суши|пекарн|кондитер)/.test(q)) return 'food_delivery';
      if (/(курс|обуч|школ|репет|урок|ментор|тренинг|вебинар|коуч)/.test(q)) return 'education';
      if (/(магазин|одежд|мерч|маркет|винтаж|wildberries|озон|авито|перепрод|склад|опт)/.test(q)) return 'retail';
      if (/(прилож|saas|crm|erp|сайт|веб-серв|telegram|телеграм|бот\b|\bit\b|айти|разработ|no-code|платформ|программ)/.test(q)) return 'tech_product';
      if (/(салон|маник|барбер|косметолог|spa\b|красот|брови|ресниц)/.test(q)) return 'beauty';
      if (/(фитнес|тренер|йог|спортзал|персональн трен)/.test(q)) return 'fitness';
      if (/(игр|гейм|стрим|контент|tiktok|youtube|подкаст|блог|инфобиз)/.test(q)) return 'creator';
      if (/(услуг|ремонт|клин|студ|макияж|фотограф|юрист|бухгал|дизайн|монтаж|уборк|юрид|бухгалтер)/.test(q)) return 'services';
      return 'generic';
    }

    function buildBusinessPlan(topic, opts = {}) {
      const t = String(topic).trim();
      const channel = opts.channel || 'online';
      const audience = String(opts.audience || '').trim();
      const budget = opts.budget != null && opts.budget !== '' ? Number(opts.budget) : null;

      const budgetLine = budget != null && budget > 0
        ? `Ориентир стартового бюджета: **${formatMoneyPlan(budget)}**. Заложите 15–25% на непредвиденное.`
        : `Бюджет не указан — начните с минимального MVP и фиксируйте каждый расход в таблице.`;

      const audienceLine = audience
        ? `Аудитория (ваш ввод): **${audience}**.`
        : `Проведите 10 коротких разговоров с потенциальными клиентами и выпишите 3 главные боли.`;

      const niche = inferPlanNiche(t);
      const specSets = {
        food_delivery: [
          'Меню на старте: 3–7 позиций, один «хит», чтобы упростить закупку.',
          'Упаковка и сроки годности — закладывайте в себестоимость.',
          'Доставка: свои курьеры или агрегаторы; комиссии агрегаторов учитывайте в цене.'
        ],
        education: [
          'Программа на 4–8 занятий с понятным результатом в конце.',
          'Бесплатный мини-урок или PDF как лид-магнит.',
          'Платёж и доступ: простая схема (предоплата / рассрочка по договорённости).'
        ],
        retail: [
          'Первая партия маленькая: 2–4 SKU, быстрая оборачиваемость важнее широты.',
          'Фото и описание карточки — основа конверсии онлайн.',
          'Учёт остатков в таблице или приложении с первой недели.'
        ],
        tech_product: [
          'MVP: один ключевой сценарий пользователя, без расползания функций.',
          'Документация, демо и поддержка — часть продукта с первого дня.',
          'Метрики: активация, удержание D7, конверсия в оплату.'
        ],
        beauty: [
          'Регламент санитарии и записи; прозрачные цены и время услуги.',
          'Пакеты и абонементы для повторных визитов.',
          'Отзывы с фото (с согласия) и работа с негативом публично.'
        ],
        fitness: [
          'Программы с измеримым результатом и ограничениями по здоровью.',
          'Пробный формат и понятные правила отмены.',
          'Партнёрства с врачами, магазинами спортпита, локальными брендами.'
        ],
        services: [
          'Пакеты «базовый / стандарт / премиум» вместо размытого «всё сделаем».',
          'Онлайн-запись и напоминания снижают неявки.',
          'После первого успешного кейса — отзыв и короткое кейс-видео.'
        ],
        creator: [
          'Контент-план на 2 недели: темы, форматы, призыв к действию.',
          'Монетизация: реклама, партнёрки, платные продукты — не всё сразу, один поток на тест.',
          'Аналитика: удержание, источник подписок, что даёт заявки.'
        ],
        generic: [
          'Одна фраза: какую боль снимаете и как измеряется результат для клиента.',
          'Первые 10 сделок вручную — так быстрее учитесь рынку.',
          'Раз в неделю: выручка, маржа, откуда пришли клиенты — три цифры в заметке.'
        ]
      };
      const spec = specSets[niche] || specSets.generic;

      const lines = [
        `# Бизнес-план: ${t}`,
        '',
        `## Резюме`,
        `- **Проект:** ${t}.`,
        `- ${budgetLine}`,
        `- ${audienceLine}`,
        `- **Канал продаж:** ${planChannelHint(channel)}`,
        '',
        `## Продукт и ценность`,
        ...spec.map(s => `- ${s}`),
        '',
        `## Рынок и конкуренты`,
        `- Найдите 5–10 конкурентов, выпишите цену и их главный оффер.`,
        `- Ваше УТП в 1–2 предложениях: почему клиент выберет вас уже на этом этапе.`,
        '',
        `## Маркетинг (первые 30 дней)`,
        `- Неделя 1: оффер «для первых N клиентов», контент-план на 7 публикаций.`,
        `- Неделя 2: один канал трафика с малым бюджетом + сбор заявок в мессенджер.`,
        `- ${planChannelHint(channel)}`,
        '',
        `## Операции`,
        `- Регламент: заявка → оплата → выполнение → отзыв.`,
        `- Резерв времени ~20% на сбои в первый месяц.`,
        '',
        `## Финансы (подставьте свои расчёты)`,
        `- Стартовые вложения: ______________ ₽`,
        `- Постоянные расходы в месяц: ______________ ₽`,
        `- Средний чек: ______________ ₽`,
        `- Цель по выручке (мес. 1 / 2 / 3): ______________ / ______________ / ______________ ₽`,
        '',
        `## Риски и что делать`,
        `- Завышенные ожидания по спросу — закрывается только тестовыми продажами.`,
        `- Растущие расходы без контроля — еженедельный лимит на рекламу и закуп.`,
        '',
        `## План по неделям`,
        `1. Неделя 1: интервью, цена, оффер, канал связи с клиентом.`,
        `2. Неделя 2: первые оплаты, сбор отзывов, правка продукта.`,
        `3. Неделя 3: повтор маркетинга, акция или бандл для среднего чека.`,
        `4. Неделя 4: отчёт — выручка, маржа, стоимость лида, что отключить.`
      ];
      return lines.join('\n');
    }

    function offlineFinanceAnalysis({ niche, profit, paybackMonths, roi, margin }) {
      return [
        `### 📊 Оценка модели`,
        `- Ниша: **${niche}**`,
        `- Прибыль: **${profit.toLocaleString('ru-RU')} ₽/мес**`,
        `- Окупаемость: **${paybackMonths === '∞' ? '∞' : paybackMonths + ' мес.'}**`,
        `- ROI (год): **${roi}%**`,
        `- Рентабельность: **${margin}%**`,
        '',
        `### 💡 Рекомендации`,
        `- Средний чек и доп. продажи.`,
        `- Срез расходов на 5–15%.`,
        `- Повторные продажи и удержание.`,
        '',
        `### ⚠️ Риски`,
        `- Сезон, касса, возвраты — веди учёт и резерв.`,
        '',
        `### ⚙️ Автоматизация`,
        `- Шаблоны, таблицы, чек‑листы.`
      ].join('\n');
    }

    function escapeHtml(s) {
      return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderInlineMarkdown(s) {
      s = s.replace(/`([^`]+)`/g, (_, p1) => `<code class="bg-indigo-500/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">${p1}</code>`);
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
      s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
      return s;
    }

    function markdownToHtml(text) {
      let raw = String(text ?? '');
      raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\\n/g, '\n');
      const src = escapeHtml(raw);
      const blocks = [];
      const withPlaceholders = src.replace(/```([\s\S]*?)```/g, (_, code) => {
        const idx = blocks.push(code) - 1;
        return `@@CODEBLOCK_${idx}@@`;
      });
      const lines = withPlaceholders.split(/\r?\n/);
      let html = '';
      let inUl = false, inOl = false, inP = false;
      const closeP = () => { if (inP) { html += '</p>'; inP = false; } };
      const closeLists = () => {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
      };
      for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        const mCode = line.match(/^@@CODEBLOCK_(\d+)@@$/);
        if (mCode) {
          closeP(); closeLists();
          const code = blocks[Number(mCode[1])] ?? '';
          html += `<pre class="bg-black/30 rounded-lg p-3 my-2 overflow-x-auto text-xs"><code>${code}</code></pre>`;
          continue;
        }
        if (line.trim() === '') { closeP(); closeLists(); continue; }
        const h3 = line.match(/^###\s+(.+)$/);
        if (h3) { closeP(); closeLists(); html += `<h3 class="text-base font-bold text-white mt-4 mb-2">${renderInlineMarkdown(h3[1])}</h3>`; continue; }
        const h2 = line.match(/^##\s+(.+)$/);
        if (h2) { closeP(); closeLists(); html += `<h2 class="text-lg font-bold text-white mt-4 mb-2">${renderInlineMarkdown(h2[1])}</h2>`; continue; }
        const h1 = line.match(/^#\s+(.+)$/);
        if (h1) { closeP(); closeLists(); html += `<h1 class="text-xl font-bold text-white mt-4 mb-2">${renderInlineMarkdown(h1[1])}</h1>`; continue; }
        const ul = line.match(/^- (.+)$/);
        if (ul) {
          closeP();
          if (inOl) { html += '</ol>'; inOl = false; }
          if (!inUl) { html += '<ul>'; inUl = true; }
          html += `<li class="ml-4 text-sm text-gray-300">${renderInlineMarkdown(ul[1])}</li>`;
          continue;
        }
        const ol = line.match(/^(\d+)\.\s+(.+)$/);
        if (ol) {
          closeP();
          if (inUl) { html += '</ul>'; inUl = false; }
          if (!inOl) { html += '<ol>'; inOl = true; }
          html += `<li class="ml-4 text-sm text-gray-300">${renderInlineMarkdown(ol[2])}</li>`;
          continue;
        }
        closeLists();
        if (!inP) { html += '<p class="mb-2">'; inP = true; }
        html += `${renderInlineMarkdown(line)}<br>`;
      }
      closeP(); closeLists();
      return html;
    }

    function markdownToPlanHtml(text) {
      return markdownToHtml(text)
        .replaceAll('text-white', 'text-gray-900')
        .replaceAll('text-gray-300', 'text-gray-700');
    }

    function switchSection(name) {
      currentSection = name;
      document.querySelectorAll('.section-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('fade-in');
      });
      document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
      const section = document.getElementById(`sec-${name}`);
      if (section) { section.classList.remove('hidden'); section.classList.add('fade-in'); }
      const btn = document.querySelector(`.sidebar-item[data-section="${name}"]`);
      if (btn) btn.classList.add('active');
      const titles = {
        dashboard: 'Главная',
        chat: 'Чат с экспертом',
        ideas: 'Генератор идей',
        competitors: 'Анализ конкурентов',
        marketing: 'Маркетинг',
        growth: 'Трекер роста',
        swot: 'SWOT-анализ',
        plan: 'Бизнес-план',
        notes: 'Заметки',
        finance: 'Финансы'
      };
      document.getElementById('sectionTitle').textContent = titles[name] || name;
    }
    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('hidden');
    }
    function setAppStatus(text, type = 'ready') {
      const el = document.getElementById('appStatusText');
      el.textContent = text;
      const dot = el.previousElementSibling;
      if (type === 'thinking') dot.className = 'w-2 h-2 rounded-full bg-amber-500 status-pulse inline-block';
      else if (type === 'error') dot.className = 'w-2 h-2 rounded-full bg-red-500 inline-block';
      else dot.className = 'w-2 h-2 rounded-full bg-emerald-500 status-pulse inline-block';
    }

    function renderChat() {
      const container = document.getElementById('chatMessages');
      container.innerHTML = '';
      chatHistory.forEach((msg, i) => {
        const div = document.createElement('div');
        div.className = `flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''} slide-in`;
        div.style.animationDelay = `${Math.min(i * 0.05, 0.3)}s`;
        if (msg.role === 'ai') {
          div.innerHTML = `
            <div class="w-8 h-8 min-w-[32px] rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-sm text-white" aria-hidden="true">💬</div>
            <div class="glass rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]">
              <div class="chat-msg text-sm text-gray-300 leading-relaxed">${markdownToHtml(msg.text)}</div>
            </div>`;
        } else {
          div.innerHTML = `
            <div class="glass rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%] bg-indigo-500/10 border-indigo-500/20">
              <div class="text-sm text-white">${markdownToHtml(msg.text)}</div>
            </div>
            <div class="w-8 h-8 min-w-[32px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">Вы</div>`;
        }
        container.appendChild(div);
      });
      container.scrollTop = container.scrollHeight;
    }

    async function sendChatMessage() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      chatHistory.push({ role: 'user', text });
      renderChat();
      document.getElementById('chatTyping').classList.remove('hidden');
      setAppStatus('Готовлю ответ…', 'thinking');
      try {
        await new Promise(r => setTimeout(r, 280));
        chatHistory.push({ role: 'ai', text: offlineChatAnswer(text) });
        saveToStorage();
      } catch (e) {
        console.warn(e);
        setAppStatus('Ошибка', 'error');
      } finally {
        document.getElementById('chatTyping').classList.add('hidden');
        setAppStatus('Готово к работе', 'ready');
        renderChat();
      }
    }

    function sendQuickQuestion(text) {
      document.getElementById('chatInput').value = text;
      sendChatMessage();
    }

    function renderIdeas() {
      const container = document.getElementById('ideasResult');
      container.innerHTML = '';
      ideasHistory.forEach((idea) => {
        const div = document.createElement('div');
        div.className = 'glass neon-border rounded-2xl p-6 fade-in';
        div.innerHTML = `
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">💡</span>
              <span class="text-xs text-gray-500">${escapeHtml(idea.topic)}</span>
            </div>
            <span class="text-[10px] text-gray-600">${escapeHtml(idea.date)}</span>
          </div>
          <div class="chat-msg text-sm text-gray-300 leading-relaxed">${markdownToHtml(idea.text)}</div>`;
        container.appendChild(div);
      });
    }

    async function generateIdea() {
      const input = document.getElementById('ideasInput');
      const topic = input.value.trim();
      if (!topic) return;
      input.value = '';
      const cityEl = document.getElementById('ideasCity');
      const city = cityEl ? cityEl.value.trim() : '';
      const btn = document.getElementById('ideasBtn');
      btn.disabled = true;
      btn.textContent = '⏳ …';
      document.getElementById('ideasLoading').classList.remove('hidden');
      document.getElementById('ideasResult').innerHTML = '';
      setAppStatus('Генерация…', 'thinking');
      try {
        await new Promise(r => setTimeout(r, 400));
        const label = city ? `${topic} (${city})` : topic;
        ideasHistory.unshift({ topic: label, text: buildDetailedIdea(topic, city), date: new Date().toLocaleString('ru-RU') });
        if (ideasHistory.length > 20) ideasHistory = ideasHistory.slice(0, 20);
        saveToStorage();
        renderIdeas();
      } finally {
        document.getElementById('ideasLoading').classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '⚡ Сгенерировать';
        setAppStatus('Готово к работе', 'ready');
      }
    }

    function renderPlans() {
      const container = document.getElementById('planResult');
      container.innerHTML = '';
      if (planHistory.length === 0) {
        container.innerHTML = `
          <div class="glass rounded-2xl p-8 text-center">
            <div class="text-4xl mb-3">📋</div>
            <div class="text-gray-500 text-sm">Заполните форму выше и нажмите «Собрать план».<br>Можно открыть просмотр, скопировать текст или скачать файл.</div>
          </div>`;
        return;
      }
      planHistory.forEach((plan) => {
        const div = document.createElement('div');
        div.id = `plan-card-${plan.id}`;
        div.className = 'glass neon-border rounded-2xl p-5 mb-4 fade-in hover:border-indigo-500/30 transition';
        const preview = String(plan.text || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').slice(0, 140);
        div.innerHTML = `
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-lg shrink-0">📄</span>
              <span class="text-sm font-semibold text-white truncate">${escapeHtml(plan.topic)}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <span class="text-[10px] text-gray-600">${escapeHtml(plan.date)}</span>
              <button type="button" class="text-xs px-2.5 py-1 rounded-lg glass-light text-indigo-300 hover:bg-indigo-500/15">Просмотр</button>
              <button type="button" class="text-xs px-2.5 py-1 rounded-lg glass-light text-gray-400 hover:text-white">Копировать</button>
              <button type="button" class="text-xs px-2.5 py-1 rounded-lg glass-light text-gray-400 hover:text-emerald-300">.md</button>
              <button type="button" class="text-xs px-2.5 py-1 rounded-lg glass-light text-gray-400 hover:text-red-400">Удалить</button>
            </div>
          </div>
          <div class="text-xs text-gray-500">${escapeHtml(preview)}…</div>`;
        const btns = div.querySelectorAll('button');
        btns[0].onclick = (e) => { e.stopPropagation(); openPlanModal(plan.id); };
        btns[1].onclick = (e) => { e.stopPropagation(); copyPlanText(plan.id); };
        btns[2].onclick = (e) => { e.stopPropagation(); downloadPlanById(plan.id); };
        btns[3].onclick = (e) => { e.stopPropagation(); deletePlanById(plan.id); };
        container.appendChild(div);
      });
    }

    function getPlanById(id) {
      return planHistory.find(p => p.id === id);
    }

    function deletePlanById(id) {
      if (!confirm('Удалить этот план из списка?')) return;
      planHistory = planHistory.filter(p => p.id !== id);
      saveToStorage();
      renderPlans();
      if (currentPlanModalId === id) closePlanModal();
    }

    async function copyPlanText(id) {
      const plan = getPlanById(id);
      if (!plan || !plan.text) return;
      try {
        await navigator.clipboard.writeText(plan.text);
        setAppStatus('Текст скопирован', 'ready');
      } catch {
        setAppStatus('Копирование не удалось', 'error');
      }
    }

    function downloadPlanById(id) {
      const plan = getPlanById(id);
      if (!plan || !plan.text) return;
      const safe = String(plan.topic || 'plan').replace(/[^\w\u0400-\u04FF\-]+/g, '_').slice(0, 60);
      const blob = new Blob([plan.text], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${safe || 'biznes-plan'}.md`;
      a.click();
      URL.revokeObjectURL(a.href);
      setAppStatus('Файл скачан', 'ready');
    }

    async function generatePlan() {
      const topic = document.getElementById('planInput').value.trim();
      if (!topic) return;
      const budgetRaw = document.getElementById('planBudget').value.trim();
      const budget = budgetRaw === '' ? null : parseFloat(budgetRaw);
      const channel = document.getElementById('planChannel').value;
      const audience = document.getElementById('planAudience').value.trim();
      const btn = document.getElementById('planBtn');
      btn.disabled = true;
      btn.textContent = '⏳ Собираем…';
      document.getElementById('planLoading').classList.remove('hidden');
      document.getElementById('planResult').innerHTML = '';
      setAppStatus('Сборка плана…', 'thinking');
      let newPlan = null;
      try {
        await new Promise(r => setTimeout(r, 400));
        newPlan = {
          id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          topic,
          text: buildBusinessPlan(topic, { budget, channel, audience }),
          date: new Date().toLocaleString('ru-RU'),
          budget, channel, audience
        };
        planHistory.unshift(newPlan);
        if (planHistory.length > 15) planHistory = planHistory.slice(0, 15);
        saveToStorage();
        renderPlans();
        if (newPlan) {
          const card = document.getElementById(`plan-card-${newPlan.id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            card.classList.add('plan-card-highlight');
            setTimeout(() => card.classList.remove('plan-card-highlight'), 2200);
          }
        }
      } finally {
        document.getElementById('planLoading').classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '📄 Собрать план';
        setAppStatus('Готово к работе', 'ready');
      }
    }

    function openPlanModal(planId) {
      const plan = getPlanById(planId);
      if (!plan) return;
      currentPlanModalId = planId;
      document.getElementById('planModalContent').innerHTML = `
        <div class="text-center mb-6">
          <div class="flex items-center justify-center gap-2 mb-3">
            <span class="text-base" aria-hidden="true">📋</span>
            <span class="text-xs text-gray-400">Документ D&D — ${escapeHtml(plan.topic)}</span>
          </div>
          <div class="text-[10px] text-gray-400 mb-6">${escapeHtml(plan.date)}</div>
          <hr class="border-gray-200">
        </div>
        <div class="prose max-w-none text-sm leading-relaxed text-gray-700">${markdownToPlanHtml(plan.text)}</div>`;
      document.getElementById('planModal').classList.remove('hidden');
    }

    async function copyPlanFromModal() {
      if (currentPlanModalId) await copyPlanText(currentPlanModalId);
    }
    function downloadPlanFromModal() {
      if (currentPlanModalId) downloadPlanById(currentPlanModalId);
    }

    function closePlanModal() {
      currentPlanModalId = null;
      document.getElementById('planModal').classList.add('hidden');
    }
    function printPlan() { window.print(); }

    function renderFinance() {
      const container = document.getElementById('finResult');
      if (financeHistory.length === 0) {
        container.innerHTML = `
          <div class="text-center text-gray-600 text-sm py-8">
            <div class="text-4xl mb-3">📊</div>
            Введите данные и нажмите «Анализировать»<br>для прогноза и советов
          </div>`;
        return;
      }
      const latest = financeHistory[0];
      container.innerHTML = `
        <div class="chat-msg text-sm text-gray-300 leading-relaxed">${markdownToHtml(latest.text)}</div>
        <div class="text-[10px] text-gray-600 mt-3">${escapeHtml(latest.date)}</div>`;
    }

    async function analyzeFinances() {
      const investment = parseFloat(document.getElementById('finInvestment').value) || 0;
      const revenue = parseFloat(document.getElementById('finRevenue').value) || 0;
      const expenses = parseFloat(document.getElementById('finExpenses').value) || 0;
      const niche = document.getElementById('finNiche').value.trim() || 'общий бизнес';
      if (investment <= 0 || revenue <= 0) return;
      const btn = document.getElementById('finBtn');
      btn.disabled = true;
      btn.textContent = '⏳ …';
      const profit = revenue - expenses;
      const paybackMonths = profit > 0 ? Math.ceil(investment / profit) : '∞';
      const roi = profit > 0 ? ((profit * 12) / investment * 100).toFixed(0) : '0';
      const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(0) : '0';
      document.getElementById('finStatProfit').textContent = `${profit.toLocaleString('ru-RU')} ₽`;
      document.getElementById('finStatPayback').textContent = paybackMonths === '∞' ? '∞' : `${paybackMonths} мес.`;
      document.getElementById('finStatROI').textContent = `${roi}%`;
      document.getElementById('finStatMargin').textContent = `${margin}%`;
      document.getElementById('finLoading').classList.remove('hidden');
      document.getElementById('finResult').innerHTML = '';
      setAppStatus('Считаем…', 'thinking');
      try {
        await new Promise(r => setTimeout(r, 400));
        financeHistory.unshift({
          investment, revenue, expenses, niche,
          profit, paybackMonths, roi, margin,
          text: offlineFinanceAnalysis({ niche, profit, paybackMonths, roi, margin }),
          date: new Date().toLocaleString('ru-RU')
        });
        if (financeHistory.length > 10) financeHistory = financeHistory.slice(0, 10);
        saveToStorage();
        renderFinance();
      } finally {
        document.getElementById('finLoading').classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '🔍 Анализировать';
        setAppStatus('Готово к работе', 'ready');
      }
    }

    function clearCurrentSectionData() {
      if (!confirm('Очистить данные текущего раздела?')) return;
      switch (currentSection) {
        case 'chat': chatHistory = chatHistory.length ? [chatHistory[0]] : []; break;
        case 'ideas': ideasHistory = []; break;
        case 'plan': planHistory = []; break;
        case 'notes':
          localStorage.removeItem('dnd_notes');
          const na = document.getElementById('notesArea');
          if (na) na.value = '';
          break;
        case 'finance': financeHistory = []; break;
        case 'growth':
          growthHistory = [];
          renderGrowthTable();
          break;
        case 'dashboard':
          localStorage.removeItem('dnd_dashboard_metrics');
          initDashboard();
          break;
        case 'competitors':
          document.getElementById('compNiche').value = '';
          document.getElementById('compList').value = '';
          document.getElementById('compResult').innerHTML = '<p class="text-sm text-gray-500 text-center py-6">Заполните форму и нажмите «Собрать анализ».</p>';
          break;
        case 'marketing':
          document.getElementById('mktProduct').value = '';
          document.getElementById('mktAudience').value = '';
          document.getElementById('mktResult').innerHTML = '<p class="text-sm text-gray-500 text-center py-6">Введите продукт и нажмите «Сгенерировать пакет».</p>';
          break;
        case 'swot':
          document.getElementById('swotName').value = '';
          document.getElementById('swotContext').value = '';
          document.getElementById('swotResult').innerHTML = '<p class="text-sm text-gray-500 text-center py-6">Заполните поля и нажмите «Построить SWOT».</p>';
          break;
        default: return;
      }
      saveToStorage();
      renderChat();
      renderIdeas();
      renderPlans();
      renderFinance();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePlanModal();
    });
