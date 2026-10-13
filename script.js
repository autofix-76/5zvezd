// ============================================
// Пять звёзд — основной JavaScript
// (имя таблицы 'AUTOFiX' и функции autofix_* ниже — это
// названия в базе данных Supabase, их менять нельзя)
// ============================================

// ---------- Мобильное меню ----------

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  if (!nav || !burger) return;

  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute(
    'aria-label',
    open ? 'Закрыть меню' : 'Открыть меню'
  );
}

if (burger && nav) {
  burger.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
}


// ---------- Шапка при прокрутке ----------

const header = document.getElementById('header');

function onScroll() {
  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


// ---------- Обработка отсутствующих изображений ----------

document.querySelectorAll('img').forEach((img) => {
  const markMissing = () => img.classList.add('is-missing');

  img.addEventListener('error', markMissing);

  img.addEventListener('load', () => {
    img.classList.remove('is-missing');
  });

  if (
    img.complete &&
    img.naturalWidth === 0 &&
    img.getAttribute('src')
  ) {
    markMissing();
  }
});


// ---------- Текущий год ----------

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
  'https://hzzglbgrgcxwhvtumoax.supabase.co';

const SUPABASE_ANON_KEY =
  'sb_publishable_g0lr_8L1JciriuketB_GEA_-QpQSsjT';

const ORDERS_TABLE = 'AUTOFiX';

const sb =
  window.supabase &&
  !SUPABASE_URL.includes('YOUR-') &&
  !SUPABASE_ANON_KEY.includes('YOUR-')
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      )
    : null;


// ============================================
// ЭЛЕМЕНТЫ АВТОРИЗАЦИИ
// ============================================

const authGuest = document.getElementById('auth-guest');
const authUser = document.getElementById('auth-user');
const authEmail = document.getElementById('auth-email');

const authOpenLogin =
  document.getElementById('auth-open-login');

const authOpenRegister =
  document.getElementById('auth-open-register');

const authLogout =
  document.getElementById('auth-logout');

const authDialog =
  document.getElementById('auth-dialog');

const authDialogTitle =
  document.getElementById('auth-dialog-title');

const authClose =
  document.getElementById('auth-dialog-close');

const loginForm =
  document.getElementById('login-form');

const registerForm =
  document.getElementById('register-form');

const loginTab =
  document.getElementById('auth-tab-login');

const registerTab =
  document.getElementById('auth-tab-register');

const loginMsg =
  document.getElementById('login-msg');

const registerMsg =
  document.getElementById('register-msg');

const loginBtn =
  document.getElementById('login-submit');

const registerBtn =
  document.getElementById('register-submit');

const authHint =
  document.getElementById('order-auth-hint');


// ============================================
// ОШИБКИ АВТОРИЗАЦИИ
// ============================================

function authErrorMessage(error, context) {
  const message =
    String(error?.message || '').toLowerCase();

  if (
    message.includes('invalid login credentials')
  ) {
    return 'Неверный email или пароль.';
  }

  if (
    message.includes('email not confirmed')
  ) {
    return 'Сначала подтвердите email через письмо.';
  }

  if (
    message.includes('user already registered')
  ) {
    return 'Этот email уже зарегистрирован. Попробуйте войти.';
  }

  if (
    message.includes('password should be at least')
  ) {
    return 'Пароль слишком короткий. Минимум 6 символов.';
  }

  if (
    message.includes('invalid email')
  ) {
    return 'Введите корректный email.';
  }

  if (
    message.includes('signup is disabled')
  ) {
    return 'Регистрация сейчас отключена.';
  }

  if (
    message.includes('rate limit')
  ) {
    return 'Слишком много попыток. Попробуйте немного позже.';
  }

  return context || 'Произошла ошибка. Попробуйте ещё раз.';
}


// ============================================
// СООБЩЕНИЯ
// ============================================

function showLoginMessage(text, type) {
  if (!loginMsg) return;

  loginMsg.textContent = text;

  loginMsg.className =
    'form__msg' +
    (type ? ' form__msg--' + type : '');
}


function showRegisterMessage(text, type) {
  if (!registerMsg) return;

  registerMsg.textContent = text;

  registerMsg.className =
    'form__msg' +
    (type ? ' form__msg--' + type : '');
}


// ============================================
// СОСТОЯНИЕ АВТОРИЗАЦИИ
// ============================================

function setAuthView(user) {
  if (authGuest) {
    authGuest.classList.toggle('is-hidden', !!user);
  }

  if (authUser) {
    authUser.classList.toggle('is-hidden', !user);
  }

  if (authEmail) {
    authEmail.textContent =
      user?.email || '';
  }

  if (authHint) {
    authHint.hidden = !!user;
  }

  // Личный кабинет показывается только вошедшему пользователю
  cabinetOnAuthChange(user || null);
}


// ============================================
// ОКНО АВТОРИЗАЦИИ
// ============================================

function showAuthPanel(mode) {
  const isLogin = mode === 'login';

  if (loginForm) {
    loginForm.classList.toggle(
      'is-hidden',
      !isLogin
    );
  }

  if (registerForm) {
    registerForm.classList.toggle(
      'is-hidden',
      isLogin
    );
  }

  if (loginTab) {
    loginTab.classList.toggle(
      'is-active',
      isLogin
    );
  }

  if (registerTab) {
    registerTab.classList.toggle(
      'is-active',
      !isLogin
    );
  }

  if (authDialogTitle) {
    authDialogTitle.textContent =
      isLogin
        ? 'Вход в аккаунт'
        : 'Регистрация';
  }

  showLoginMessage('', '');
  showRegisterMessage('', '');
}


function openAuthDialog(mode) {
  if (!authDialog) return;

  showAuthPanel(mode);
  setMenu(false);

  if (typeof authDialog.showModal === 'function') {
    authDialog.showModal();
  } else {
    authDialog.setAttribute(
      'open',
      ''
    );
  }
}


function closeAuthDialog() {
  if (!authDialog) return;

  if (typeof authDialog.close === 'function') {
    authDialog.close();
  } else {
    authDialog.removeAttribute(
      'open'
    );
  }
}


// ============================================
// ОТКРЫТИЕ ВХОДА / РЕГИСТРАЦИИ
// ============================================

if (authOpenLogin) {
  authOpenLogin.addEventListener(
    'click',
    () => openAuthDialog('login')
  );
}


if (authOpenRegister) {
  authOpenRegister.addEventListener(
    'click',
    () => openAuthDialog('register')
  );
}


// ============================================
// ЗАКРЫТИЕ ОКНА
// ============================================

if (authClose) {
  authClose.addEventListener(
    'click',
    closeAuthDialog
  );
}


if (authDialog) {
  authDialog.addEventListener(
    'click',
    (event) => {
      if (event.target === authDialog) {
        closeAuthDialog();
      }
    }
  );
}


// ============================================
// ПЕРЕКЛЮЧЕНИЕ ВХОД / РЕГИСТРАЦИЯ
// ============================================

if (loginTab) {
  loginTab.addEventListener(
    'click',
    () => showAuthPanel('login')
  );
}


if (registerTab) {
  registerTab.addEventListener(
    'click',
    () => showAuthPanel('register')
  );
}


// ============================================
// ВХОД
// ============================================

if (loginForm) {
  loginForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      if (!sb) {
        showLoginMessage(
          'Supabase не подключён.',
          'error'
        );
        return;
      }

      if (!loginForm.reportValidity()) {
        return;
      }

      const formData =
        new FormData(loginForm);

      const email =
        String(
          formData.get('email') || ''
        ).trim();

      const password =
        String(
          formData.get('password') || ''
        );

      if (loginBtn) {
        loginBtn.disabled = true;
      }

      showLoginMessage(
        'Выполняем вход…',
        ''
      );

      try {
        const {
          data,
          error
        } = await sb.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          showLoginMessage(
            authErrorMessage(
              error,
              'Не удалось войти.'
            ),
            'error'
          );
          return;
        }

        setAuthView(data.user);

        closeAuthDialog();

        loginForm.reset();

      } catch (error) {
        showLoginMessage(
          'Нет соединения. Проверьте интернет.',
          'error'
        );
      } finally {
        if (loginBtn) {
          loginBtn.disabled = false;
        }
      }
    }
  );
}


// ============================================
// РЕГИСТРАЦИЯ
// ============================================

if (registerForm) {
  registerForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      if (!sb) {
        showRegisterMessage(
          'Supabase не подключён.',
          'error'
        );
        return;
      }

      if (!registerForm.reportValidity()) {
        return;
      }

      const formData =
        new FormData(registerForm);

      const email =
        String(
          formData.get('email') || ''
        ).trim();

      const password =
        String(
          formData.get('password') || ''
        );

      const passwordConfirm =
        String(
          formData.get('password2') || ''
        );

      if (password !== passwordConfirm) {
        showRegisterMessage(
          'Пароли не совпадают.',
          'error'
        );
        return;
      }

      if (password.length < 6) {
        showRegisterMessage(
          'Пароль должен содержать минимум 6 символов.',
          'error'
        );
        return;
      }

      if (registerBtn) {
        registerBtn.disabled = true;
      }

      showRegisterMessage(
        'Создаём аккаунт…',
        ''
      );

      try {
        const {
          data,
          error
        } = await sb.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + window.location.pathname
          }
        });

        if (error) {
          showRegisterMessage(
            authErrorMessage(
              error,
              'Не удалось зарегистрироваться.'
            ),
            'error'
          );
          return;
        }

        // Supabase иногда возвращает пользователя
        // без identity при повторной регистрации.
        if (
          data?.user &&
          Array.isArray(data.user.identities) &&
          data.user.identities.length === 0
        ) {
          showRegisterMessage(
            'Этот email уже зарегистрирован. Попробуйте войти.',
            'error'
          );
          return;
        }

        if (data?.session) {
          setAuthView(data.user);
          closeAuthDialog();
          registerForm.reset();
        } else {
          showRegisterMessage(
            'Регистрация успешна. Проверьте почту и подтвердите email.',
            'ok'
          );
        }

      } catch (error) {
        showRegisterMessage(
          'Нет соединения. Проверьте интернет.',
          'error'
        );
      } finally {
        if (registerBtn) {
          registerBtn.disabled = false;
        }
      }
    }
  );
}


// ============================================
// ВЫХОД
// ============================================

if (authLogout) {
  authLogout.addEventListener(
    'click',
    async () => {
      if (!sb) return;

      authLogout.disabled = true;

      try {
        const { error } =
          await sb.auth.signOut();

        if (error) {
          alert(
            'Не удалось выйти из аккаунта.'
          );
          return;
        }

        setAuthView(null);

      } catch (error) {
        alert(
          'Ошибка соединения.'
        );
      } finally {
        authLogout.disabled = false;
      }
    }
  );
}


// ============================================
// ЛИЧНЫЙ КАБИНЕТ: «МОИ ЗАЯВКИ»
// ============================================
// Кабинет только читает данные (sb.from(...).select(...)) под защитой RLS
// и принимает решение по смете через RPC autofix_decide_estimate.
// Никаких insert / update / delete из кабинета нет: цены, позиции и статусы
// ремонта клиент изменить не может. Все данные выводятся через textContent.

const cabinetSection = document.getElementById('cabinet');
const cabinetNavLink = document.getElementById('nav-cabinet');
const cabinetList = document.getElementById('cabinet-list');
const cabinetStatus = document.getElementById('cabinet-status');
const cabinetRefreshBtn = document.getElementById('cabinet-refresh');

const CABINET_LIMIT = 100;     // сколько последних заявок загружать

let cabinetUserId = null;      // чей кабинет сейчас на экране
let cabinetLoadSeq = 0;        // номер загрузки: ответы устаревших игнорируются
let cabinetDeciding = false;   // идёт отправка решения по смете


// ---------- Подписи ----------

const REQUEST_STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

const ORDER_STATUS_LABELS = {
  accepted: 'Заявка принята',
  diagnostics: 'Диагностика',
  awaiting_approval: 'Ожидает вашего согласования',
  approved: 'Смета согласована',
  in_repair: 'В ремонте',
  completed: 'Ремонт завершён',
  cancelled: 'Отменён'
};

const ESTIMATE_STATUS_LABELS = {
  sent: 'Ожидает решения',
  approved: 'Согласована',
  rejected: 'Отклонена',
  superseded: 'Заменена новой версией'
};

const SERVICE_LABELS = {
  repair: 'Ремонт',
  diagnostics: 'Диагностика',
  maintenance: 'Обслуживание'
};

const ITEM_TYPE_LABELS = {
  part: 'Запчасть',
  labor: 'Работа'
};

const ACTOR_ROLE_LABELS = {
  client: 'Клиент',
  master: 'Мастер',
  admin: 'Администратор'
};

// Подписи типов событий. Точный список event_type в базе мне неизвестен,
// поэтому неизвестный тип показывается как есть (см. cabinetLabel).
const EVENT_TYPE_LABELS = {
  request_accepted: 'Заявка принята',
  order_created: 'Заказ создан',
  status_changed: 'Статус изменён',
  estimate_created: 'Создана новая версия сметы',
  estimate_sent: 'Смета отправлена вам',
  estimate_approved: 'Смета согласована',
  estimate_rejected: 'Смета отклонена',
  estimate_superseded: 'Смета заменена новой версией',
  repair_started: 'Ремонт начат',
  order_completed: 'Ремонт завершён',
  order_cancelled: 'Заказ отменён'
};

// Цвет значка статуса: ok — зелёный, warn — жёлтый, bad — красный
const STATUS_TONES = {
  approved: 'ok', completed: 'ok',
  awaiting_approval: 'warn', sent: 'warn', in_progress: 'warn',
  cancelled: 'bad', rejected: 'bad'
};

function cabinetLabel(map, key) {
  if (key === null || key === undefined || key === '') return '—';
  return Object.prototype.hasOwnProperty.call(map, key)
    ? map[key]
    : String(key);
}


// ---------- Форматирование ----------

const rubFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
});

const qtyFormat = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 3
});

function formatMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? rubFormat.format(n) : '—';
}

function formatQty(value) {
  const n = Number(value);
  return Number.isFinite(n) ? qtyFormat.format(n) : '—';
}

// Дата без времени ('2026-10-15') разбирается вручную,
// чтобы часовой пояс не сдвигал день.
function formatDate(value) {
  if (!value) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ru-RU');
}

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
}

// Деньги сравниваются в копейках, чтобы не спотыкаться о дробные числа
function toCents(value) {
  return Math.round(Number(value) * 100);
}


// ---------- Безопасное создание элементов (без innerHTML) ----------

function cabEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function cabBadge(text, statusKey) {
  const tone = STATUS_TONES[statusKey];
  return cabEl(
    'span',
    'cab-badge' + (tone ? ' cab-badge--' + tone : ''),
    text
  );
}

function cabMetaRow(dl, term, valueNode, wide) {
  const row = cabEl('div', wide ? 'cab-meta__row cab-meta__row--wide' : 'cab-meta__row');
  row.append(cabEl('dt', null, term), valueNode);
  dl.append(row);
}

function cabDd(text) {
  return cabEl('dd', null, text);
}


// ---------- Сообщения и состояние загрузки ----------

function cabinetMessage(text, type) {
  if (!cabinetStatus) return;
  cabinetStatus.textContent = text || '';
  cabinetStatus.className =
    'form__msg' + (type ? ' form__msg--' + type : '');
}

function cabinetSetLoading(loading) {
  if (cabinetSection) {
    cabinetSection.setAttribute('aria-busy', String(loading));
  }
  if (cabinetRefreshBtn) {
    cabinetRefreshBtn.disabled = loading;
  }
  if (loading && cabinetList && !cabinetList.children.length) {
    cabinetList.append(cabEl('p', 'cab-muted', 'Загружаем ваши заявки…'));
  }
}

function cabinetErrorText(error) {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '');

  if (
    code === '42501' ||
    message.includes('permission denied') ||
    message.includes('row-level security')
  ) {
    return 'Нет доступа к данным. Выйдите из аккаунта и войдите снова.';
  }

  if (
    error instanceof TypeError ||
    message.includes('failed to fetch') ||
    message.includes('network')
  ) {
    return 'Нет соединения. Проверьте интернет и нажмите «Обновить».';
  }

  return 'Не удалось загрузить заявки. Нажмите «Обновить» или попробуйте позже.';
}

function decisionErrorText(error) {
  const base = cabinetErrorText(error);

  // Ошибки доступа и сети описаны выше. Остальное — скорее всего,
  // смета уже изменилась (новая версия, другая сумма, решение принято).
  if (base.startsWith('Не удалось загрузить')) {
    return 'Решение не сохранено: смета могла измениться. Мы обновили данные — проверьте актуальную смету и повторите.';
  }
  return 'Решение не сохранено. ' + base;
}


// ---------- Загрузка данных ----------
// Все запросы идут под RLS. Связанные записи запрашиваются только по
// идентификаторам заявок текущего пользователя.

function throwIfError(result) {
  if (result.error) throw result.error;
  return result.data || [];
}

async function cabinetFetch(userId) {
  const empty = { requests: [], orders: [], versions: [], items: [], events: [] };

  const requests = throwIfError(
    await sb
      .from('AUTOFiX')
      .select('id, created_at, car_brand, car_model, car_year, license_plate, service, description, preferred_date, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(CABINET_LIMIT)
  );

  if (!requests.length) return empty;

  const orders = throwIfError(
    await sb
      .from('autofix_repair_orders')
      .select('id, request_id, status, actual_completed_at, final_total, final_estimate_id, updated_at')
      .in('request_id', requests.map((r) => r.id))
  );

  if (!orders.length) return { ...empty, requests };

  const orderIds = orders.map((o) => o.id);

  const [versionsRes, eventsRes] = await Promise.all([
    sb
      .from('autofix_estimate_versions')
      .select('id, order_id, version_no, status, diagnosis, recommendations, planned_completion_date, total_amount, sent_at, decided_at, decision_comment')
      .in('order_id', orderIds)
      .neq('status', 'draft')
      .order('version_no', { ascending: false }),
    sb
      .from('autofix_order_events')
      .select('id, order_id, estimate_version_id, actor_role, event_type, comment, visible_to_customer, created_at')
      .in('order_id', orderIds)
      .eq('visible_to_customer', true)
      .order('created_at', { ascending: false })
  ]);

  // Черновики и скрытые события отсекаются ещё и здесь — на случай,
  // если сервер по ошибке вернёт лишнее.
  const versions = throwIfError(versionsRes).filter((v) => v.status !== 'draft');
  const events = throwIfError(eventsRes).filter((e) => e.visible_to_customer === true);

  let items = [];
  if (versions.length) {
    items = throwIfError(
      await sb
        .from('autofix_estimate_items')
        .select('id, version_id, item_type, name, quantity, unit_price, line_total, created_at')
        .in('version_id', versions.map((v) => v.id))
        .order('created_at', { ascending: true })
    );
  }

  return { requests, orders, versions, items, events };
}

function groupBy(list, key) {
  const map = new Map();
  for (const entry of list) {
    const k = entry[key];
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(entry);
  }
  return map;
}

async function cabinetReload() {
  const userId = cabinetUserId;
  if (!sb || !userId || !cabinetList) return;

  const seq = ++cabinetLoadSeq;
  cabinetSetLoading(true);

  try {
    const data = await cabinetFetch(userId);

    // Пользователь вышел или запущена более новая загрузка — ответ не нужен
    if (seq !== cabinetLoadSeq || userId !== cabinetUserId) return;

    cabinetRender(data);
  } catch (error) {
    if (seq !== cabinetLoadSeq || userId !== cabinetUserId) return;

    console.error('Кабинет: не удалось загрузить данные', error);
    cabinetList.replaceChildren(
      cabEl('p', 'form__msg form__msg--error', cabinetErrorText(error))
    );
  } finally {
    if (seq === cabinetLoadSeq) cabinetSetLoading(false);
  }
}


// ---------- Отрисовка ----------

function cabinetRender(data) {
  cabinetList.replaceChildren();

  if (!data.requests.length) {
    cabinetList.append(
      cabEl('p', 'cab-muted', 'У вас пока нет заявок. Отправьте первую в разделе «Заявка на сервис».')
    );
    return;
  }

  const orderByRequest = new Map(data.orders.map((o) => [o.request_id, o]));
  const versionsByOrder = groupBy(data.versions, 'order_id');
  const itemsByVersion = groupBy(data.items, 'version_id');
  const eventsByOrder = groupBy(data.events, 'order_id');

  for (const request of data.requests) {
    const order = orderByRequest.get(request.id) || null;

    cabinetList.append(
      renderRequestCard({
        request,
        order,
        versions: order ? versionsByOrder.get(order.id) || [] : [],
        itemsByVersion,
        events: order ? eventsByOrder.get(order.id) || [] : []
      })
    );
  }

  if (data.requests.length >= CABINET_LIMIT) {
    cabinetList.append(
      cabEl('p', 'cab-muted', 'Показаны последние ' + CABINET_LIMIT + ' заявок.')
    );
  }
}

function renderRequestCard({ request, order, versions, itemsByVersion, events }) {
  const card = cabEl('article', 'cab-card');

  // Заголовок: автомобиль, госномер, статус заявки
  const head = cabEl('header', 'cab-card__head');
  const titleBox = cabEl('div', 'cab-card__titlebox');

  const car = [request.car_brand, request.car_model]
    .filter(Boolean)
    .join(' ');
  const year = request.car_year ? ', ' + request.car_year : '';
  titleBox.append(cabEl('h3', 'cab-card__title', (car || 'Автомобиль') + year));

  if (request.license_plate) {
    titleBox.append(cabEl('p', 'cab-plate', request.license_plate));
  }

  head.append(
    titleBox,
    cabBadge(cabinetLabel(REQUEST_STATUS_LABELS, request.status), request.status)
  );
  card.append(head);

  // Сведения о заявке
  const meta = cabEl('dl', 'cab-meta');
  cabMetaRow(meta, 'Услуга', cabDd(cabinetLabel(SERVICE_LABELS, request.service)));
  cabMetaRow(meta, 'Подана', cabDd(formatDateTime(request.created_at)));
  cabMetaRow(meta, 'Желаемая дата', cabDd(formatDate(request.preferred_date)));

  if (order) {
    const dd = cabEl('dd');
    dd.append(cabBadge(cabinetLabel(ORDER_STATUS_LABELS, order.status), order.status));
    cabMetaRow(meta, 'Статус ремонта', dd);
  }

  if (request.description) {
    cabMetaRow(meta, 'Описание', cabEl('dd', 'cab-text', request.description), true);
  }
  card.append(meta);

  // Заказа ещё нет — заявка ждёт рассмотрения
  if (!order) {
    card.append(
      cabEl('p', 'cab-note', 'Заявка получена. Когда мастер примет её в работу, здесь появятся диагностика и смета.')
    );
    return card;
  }

  // Итоги завершённого ремонта
  if (order.actual_completed_at || order.final_total !== null && order.final_total !== undefined) {
    const result = cabEl('dl', 'cab-meta cab-meta--result');
    if (order.actual_completed_at) {
      cabMetaRow(result, 'Ремонт завершён', cabDd(formatDate(order.actual_completed_at)));
    }
    if (order.final_total !== null && order.final_total !== undefined) {
      cabMetaRow(result, 'Итоговая стоимость', cabDd(formatMoney(order.final_total)));
    }
    card.append(result);
  }

  // Сметы: последняя раскрыта, предыдущие версии свёрнуты
  if (versions.length) {
    const [latest, ...older] = versions;

    card.append(
      renderEstimate(latest, itemsByVersion.get(latest.id) || [], order, true)
    );

    if (older.length) {
      const details = cabEl('details', 'cab-details');
      details.append(cabEl('summary', null, 'Предыдущие версии сметы (' + older.length + ')'));
      for (const version of older) {
        details.append(
          renderEstimate(version, itemsByVersion.get(version.id) || [], order, false)
        );
      }
      card.append(details);
    }
  } else {
    card.append(
      cabEl('p', 'cab-note', 'Смета пока не готова. Мы сообщим, когда она появится.')
    );
  }

  // История событий, разрешённых клиенту
  if (events.length) {
    const details = cabEl('details', 'cab-details');
    details.append(cabEl('summary', null, 'История (' + events.length + ')'));

    const ul = cabEl('ul', 'cab-events');
    for (const event of events) {
      const li = cabEl('li', 'cab-events__item');
      li.append(
        cabEl('span', 'cab-events__time', formatDateTime(event.created_at)),
        cabEl('strong', 'cab-events__title', cabinetLabel(EVENT_TYPE_LABELS, event.event_type))
      );
      if (event.actor_role) {
        li.append(
          cabEl('span', 'cab-events__role', cabinetLabel(ACTOR_ROLE_LABELS, event.actor_role))
        );
      }
      if (event.comment) {
        li.append(cabEl('p', 'cab-text cab-events__comment', event.comment));
      }
      ul.append(li);
    }
    details.append(ul);
    card.append(details);
  }

  return card;
}

// Состав сметы должен сходиться с итогом. Если нет — решение не предлагаем:
// возможно, часть позиций не загрузилась.
function estimateIsConsistent(version, items) {
  const sum = items.reduce((acc, item) => acc + toCents(item.line_total), 0);
  return sum === toCents(version.total_amount);
}

function renderEstimate(version, items, order, isLatest) {
  const box = cabEl('section', 'cab-estimate');

  const head = cabEl('div', 'cab-estimate__head');
  head.append(
    cabEl('h4', 'cab-estimate__title', 'Смета, версия ' + version.version_no),
    cabBadge(cabinetLabel(ESTIMATE_STATUS_LABELS, version.status), version.status)
  );
  box.append(head);

  const meta = cabEl('dl', 'cab-meta');
  if (version.sent_at) {
    cabMetaRow(meta, 'Отправлена', cabDd(formatDateTime(version.sent_at)));
  }
  cabMetaRow(meta, 'Планируемое завершение', cabDd(formatDate(version.planned_completion_date)));
  if (version.diagnosis) {
    cabMetaRow(meta, 'Диагностика', cabEl('dd', 'cab-text', version.diagnosis), true);
  }
  if (version.recommendations) {
    cabMetaRow(meta, 'Рекомендации', cabEl('dd', 'cab-text', version.recommendations), true);
  }
  box.append(meta);

  box.append(renderItemsTable(items));

  const total = cabEl('p', 'cab-total');
  total.append(
    cabEl('span', null, 'Итого'),
    cabEl('strong', null, formatMoney(version.total_amount))
  );
  box.append(total);

  if (version.decided_at) {
    const decided = cabEl(
      'p',
      'cab-note',
      'Решение принято ' + formatDateTime(version.decided_at) + '.'
    );
    box.append(decided);
    if (version.decision_comment) {
      box.append(cabEl('p', 'cab-text', 'Ваш комментарий: ' + version.decision_comment));
    }
  }

  // Решение предлагается только по последней отправленной версии
  // и только пока заказ ждёт согласования.
  const actionable =
    isLatest &&
    version.status === 'sent' &&
    order.status === 'awaiting_approval';

  if (actionable) {
    if (estimateIsConsistent(version, items)) {
      box.append(renderDecision(version));
    } else {
      box.append(
        cabEl(
          'p',
          'form__msg form__msg--error',
          'Не удалось проверить состав сметы. Нажмите «Обновить», прежде чем принимать решение.'
        )
      );
    }
  }

  return box;
}

function renderItemsTable(items) {
  if (!items.length) {
    return cabEl('p', 'cab-muted', 'Позиции сметы не загружены.');
  }

  const table = cabEl('table', 'cab-table');
  table.append(cabEl('caption', 'cab-sr', 'Позиции сметы'));

  const headRow = cabEl('tr');
  for (const title of ['Тип', 'Наименование', 'Кол-во', 'Цена за единицу', 'Сумма']) {
    headRow.append(cabEl('th', null, title));
  }
  const thead = cabEl('thead');
  thead.append(headRow);
  table.append(thead);

  const tbody = cabEl('tbody');
  for (const item of items) {
    const tr = cabEl('tr');
    const cells = [
      ['Тип', cabinetLabel(ITEM_TYPE_LABELS, item.item_type)],
      ['Наименование', item.name],
      ['Кол-во', formatQty(item.quantity)],
      ['Цена за единицу', formatMoney(item.unit_price)],
      ['Сумма', formatMoney(item.line_total)]
    ];
    for (const [label, value] of cells) {
      const td = cabEl('td', null, value);
      td.setAttribute('data-label', label);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);

  const wrap = cabEl('div', 'cab-table-wrap');
  wrap.append(table);
  return wrap;
}


// ---------- Решение по смете ----------

function renderDecision(version) {
  const box = cabEl('div', 'cab-decision');
  box.append(
    cabEl(
      'p',
      'cab-decision__lead',
      'Проверьте смету и примите решение. Без вашего согласования ремонт не начнётся.'
    )
  );

  const actions = cabEl('div', 'cab-decision__actions');
  const approveBtn = cabEl('button', 'btn', 'Согласовать смету');
  const rejectBtn = cabEl('button', 'btn cab-btn--outline', 'Отклонить смету');
  approveBtn.type = 'button';
  rejectBtn.type = 'button';
  actions.append(approveBtn, rejectBtn);

  const panel = cabEl('div', 'cab-decision__panel');
  panel.hidden = true;

  box.append(actions, panel);

  const allButtons = () => box.querySelectorAll('button');

  function setBusy(busy, activeButton, busyText) {
    for (const button of allButtons()) button.disabled = busy;
    if (activeButton) {
      if (busy) {
        activeButton.dataset.label = activeButton.textContent;
        activeButton.textContent = busyText;
      } else if (activeButton.dataset.label) {
        activeButton.textContent = activeButton.dataset.label;
      }
    }
  }

  function openPanel(decision) {
    panel.replaceChildren();
    panel.hidden = false;

    const confirmBtn = cabEl('button', 'btn');
    confirmBtn.type = 'button';
    const backBtn = cabEl('button', 'btn cab-btn--outline', 'Назад');
    backBtn.type = 'button';

    let commentField = null;

    if (decision === 'approve') {
      panel.append(
        cabEl(
          'p',
          'cab-decision__text',
          'Вы согласуете смету версии ' + version.version_no +
            ' на сумму ' + formatMoney(version.total_amount) + '.'
        )
      );
      confirmBtn.textContent = 'Подтвердить согласование';
    } else {
      const field = cabEl('div', 'field');
      const label = cabEl('label', null, 'Комментарий (необязательно)');
      commentField = cabEl('textarea');
      commentField.id = 'cab-comment-' + version.id;
      commentField.maxLength = 1000;
      commentField.placeholder = 'Что вас не устроило';
      label.setAttribute('for', commentField.id);
      field.append(label, commentField);
      panel.append(field);
      confirmBtn.textContent = 'Подтвердить отклонение';
    }

    const row = cabEl('div', 'cab-decision__actions');
    row.append(confirmBtn, backBtn);
    panel.append(row);

    backBtn.addEventListener('click', () => {
      panel.hidden = true;
      panel.replaceChildren();
    });

    confirmBtn.addEventListener('click', async () => {
      const comment = commentField ? commentField.value.trim() : '';
      setBusy(true, confirmBtn, 'Отправляем…');
      if (commentField) commentField.disabled = true;

      const ok = await cabinetDecide(version, decision, comment);

      // При успехе кабинет перерисован; при ошибке тоже обновлён,
      // но на случай сбоя загрузки возвращаем кнопки в рабочее состояние.
      if (box.isConnected) {
        setBusy(false, confirmBtn);
        if (commentField) commentField.disabled = false;
      }
      return ok;
    });

    (commentField || confirmBtn).focus();
  }

  approveBtn.addEventListener('click', () => openPanel('approve'));
  rejectBtn.addEventListener('click', () => openPanel('reject'));

  return box;
}

// Единственная запись из кабинета: решение по смете через RPC.
// p_decision принимает только 'approve' или 'reject'.
async function cabinetDecide(version, decision, comment) {
  if (decision !== 'approve' && decision !== 'reject') return false;
  if (!sb || cabinetDeciding) return false;

  const userId = cabinetUserId;
  cabinetDeciding = true;
  cabinetMessage('', '');

  try {
    const { error } = await sb.rpc('autofix_decide_estimate', {
      p_version_id: version.id,
      p_decision: decision,
      p_expected_total: version.total_amount,
      p_comment: comment || null
    });

    // Пользователь успел выйти — ничего не показываем
    if (userId !== cabinetUserId) return false;

    if (error) {
      console.error('Кабинет: ошибка autofix_decide_estimate', error);
      cabinetMessage(decisionErrorText(error), 'error');
      await cabinetReload();
      return false;
    }

    cabinetMessage(
      decision === 'approve' ? 'Смета согласована.' : 'Смета отклонена.',
      'ok'
    );
    await cabinetReload();
    return true;
  } catch (error) {
    console.error('Кабинет: сбой при отправке решения', error);
    if (userId === cabinetUserId) {
      cabinetMessage(decisionErrorText(error), 'error');
    }
    return false;
  } finally {
    cabinetDeciding = false;
  }
}


// ---------- Вход, выход, обновление ----------

function cabinetOnAuthChange(user) {
  if (!cabinetSection || !cabinetList) return;

  const userId = user ? user.id : null;

  // Та же сессия (например, обновление токена) — ничего не делаем
  if (userId === cabinetUserId) return;

  cabinetUserId = userId;
  cabinetLoadSeq++;   // ответы запросов прежнего пользователя больше не нужны

  // Данные прежнего пользователя убираем из интерфейса
  cabinetList.replaceChildren();
  cabinetMessage('', '');

  cabinetSection.classList.toggle('is-hidden', !userId);
  if (cabinetNavLink) {
    cabinetNavLink.classList.toggle('is-hidden', !userId);
  }

  if (userId) cabinetReload();
}

if (cabinetRefreshBtn) {
  cabinetRefreshBtn.addEventListener('click', () => {
    cabinetMessage('', '');
    cabinetReload();
  });
}


// ============================================
// СЛУШАЕМ ИЗМЕНЕНИЕ СОСТОЯНИЯ AUTH
// ============================================

if (sb) {
  sb.auth.onAuthStateChange(
    (_event, session) => {
      setAuthView(
        session?.user || null
      );
    }
  );

  sb.auth
    .getSession()
    .then(({ data }) => {
      setAuthView(
        data?.session?.user || null
      );
    })
    .catch(() => {
      setAuthView(null);
    });
} else {
  setAuthView(null);
}


// ============================================
// ФОРМА ЗАКАЗА
// ============================================

const orderForm =
  document.getElementById('order-form');

if (orderForm) {
  const orderMsg =
    document.getElementById('order-msg');

  const orderBtn =
    document.getElementById('order-submit');

  const yearInput =
    document.getElementById('f-year');

  const dateInput =
    document.getElementById('f-date');


  const now = new Date();

  if (yearInput) {
    yearInput.max =
      String(now.getFullYear() + 1);
  }

  if (dateInput) {
    dateInput.min =
      new Date(
        now.getTime() -
        now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
  }


  function showOrderMessage(
    text,
    type
  ) {
    if (!orderMsg) return;

    orderMsg.textContent = text;

    orderMsg.className =
      'form__msg' +
      (type
        ? ' form__msg--' + type
        : '');
  }


  // ---------- Государственный номер ----------
  // Допустимые буквы: А В Е К М Н О Р С Т У Х (кириллица).
  // Формат: буква, 3 цифры, 2 буквы, регион из 2 или 3 цифр.
  // То же правило записано в CHECK-ограничении в PostgreSQL.
  const PLATE_RE =
    /^[АВЕКМНОРСТУХ][0-9]{3}[АВЕКМНОРСТУХ]{2}[0-9]{2,3}$/;

  const plateInput =
    document.getElementById('f-plate');

  const plateError =
    document.getElementById('plate-error');

  // Удаляем пробелы и приводим к верхнему регистру.
  // Латиницу в кириллицу НЕ заменяем.
  function normalizePlate(value) {
    return String(value || '')
      .replace(/\s+/g, '')
      .toUpperCase();
  }

  // Возвращает текст ошибки или '' если номер корректен
  function plateProblem(plate) {
    if (!plate) {
      return 'Введите государственный номер автомобиля.';
    }

    if (/[A-Za-z]/.test(plate)) {
      return 'Используйте русские буквы (А, В, Е, К, М, Н, О, Р, С, Т, У, Х), латинские не подходят.';
    }

    if (!PLATE_RE.test(plate)) {
      return 'Неверный формат номера. Пример: А123ВС777 — буква, 3 цифры, 2 буквы и регион (2–3 цифры). Допустимые буквы: А, В, Е, К, М, Н, О, Р, С, Т, У, Х.';
    }

    return '';
  }

  function showPlateError(text) {
    if (!plateInput || !plateError) return;

    plateError.textContent = text;
    plateError.hidden = !text;

    if (text) {
      plateInput.setAttribute('aria-invalid', 'true');
    } else {
      plateInput.removeAttribute('aria-invalid');
    }
  }

  if (plateInput) {
    // После ухода из поля показываем нормализованный вид.
    // Ошибку здесь НЕ показываем: она сдвинула бы кнопку «Отправить»
    // раньше, чем завершится клик по ней. Ошибка появляется при отправке.
    plateInput.addEventListener('blur', () => {
      plateInput.value =
        normalizePlate(plateInput.value);
    });

    // Пока пользователь исправляет — убираем старую ошибку
    plateInput.addEventListener('input', () => {
      if (!plateError.hidden) {
        showPlateError('');
      }
    });
  }


  orderForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      // Проверка номера до остальных проверок и до отправки
      const plate =
        normalizePlate(
          plateInput ? plateInput.value : ''
        );

      const plateMessage = plateProblem(plate);

      if (plateMessage) {
        showPlateError(plateMessage);

        if (plateInput) {
          plateInput.focus();
        }

        showOrderMessage('', '');
        return;
      }

      showPlateError('');

      if (plateInput) {
        plateInput.value = plate;
      }

      if (!orderForm.reportValidity()) {
        return;
      }

      if (!sb) {
        showOrderMessage(
          'Приём заявок через сайт пока не настроен. Позвоните нам — запишем по телефону.',
          'error'
        );
        return;
      }

      if (orderBtn) {
        orderBtn.disabled = true;
      }

      showOrderMessage(
        'Отправляем…',
        ''
      );


      try {
        const {
          data: { user },
          error: authError
        } = await sb.auth.getUser();


        if (authError || !user) {
          showOrderMessage(
            'Чтобы отправить заявку, войдите в аккаунт или зарегистрируйтесь.',
            'error'
          );
          return;
        }


        const data =
          new FormData(orderForm);


        const text = (name) =>
          String(
            data.get(name) || ''
          ).trim();


        const order = {
          user_id: user.id,
          name: text('name'),
          email: text('email'),
          phone: text('phone'),
          car_brand: text('car_brand'),
          car_model: text('car_model'),
          car_year: parseInt(
            text('car_year'),
            10
          ),
          license_plate: plate,
          service: text('service'),
          description: text('description'),
          preferred_date:
            text('preferred_date'),
          status: 'new'
        };


        if (!Number.isInteger(
          order.car_year
        )) {
          showOrderMessage(
            'Укажите год выпуска числом, например 2018.',
            'error'
          );
          return;
        }


        const { error } =
          await sb
            .from(ORDERS_TABLE)
            .insert(order);


        if (error) {
          if (
            error.code === '23514' &&
            /license_plate/i.test(
              error.message || ''
            )
          ) {
            showPlateError(
              'Сервер не принял номер. Проверьте формат: А123ВС777.'
            );
            showOrderMessage('', '');
            if (plateInput) plateInput.focus();
            return;
          }

          const denied =
            error.code === '42501' ||
            /row-level security/i.test(
              error.message || ''
            );


          showOrderMessage(
            denied
              ? 'Не удалось отправить заявку: нет доступа. Войдите в аккаунт заново.'
              : 'Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.',
            'error'
          );

          return;
        }


        orderForm.reset();
        showPlateError('');
        cabinetReload();


        showOrderMessage(
          'Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
          'ok'
        );

      } catch (error) {
        showOrderMessage(
          'Нет соединения. Проверьте интернет и попробуйте ещё раз.',
          'error'
        );
      } finally {
        if (orderBtn) {
          orderBtn.disabled = false;
        }
      }
    }
  );
}
