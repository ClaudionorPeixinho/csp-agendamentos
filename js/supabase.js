/* ============================================================
   Supabase — Configuração e sincronização de dados
   ============================================================
   Para usar: crie um projeto em https://supabase.com
   No SQL Editor, cole e execute o conteúdo de supabase-schema.sql
   Depois cole abaixo a URL e a chave anônima do seu projeto.
   ============================================================ */

const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon-aqui';

let supabaseClient = null;

function initSupabase() {
    if (typeof supabaseJs === 'undefined') {
        console.warn('Supabase SDK não carregado. Usando apenas localStorage.');
        return null;
    }
    if (SUPABASE_URL.includes('SEU_PROJETO')) {
        console.warn('Supabase não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/supabase.js');
        return null;
    }
    try {
        supabaseClient = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: false }
        });
        return supabaseClient;
    } catch (e) {
        console.warn('Erro ao inicializar Supabase:', e);
        return null;
    }
}

/* ---- UTILITÁRIOS ---- */

function mapRow(table, row) {
    if (!row) return null;
    // Converte snake_case do banco para camelCase do JS
    const map = {
        hairdressers: {
            gps_link: 'gpsLink', is_closed: 'isClosed', work_start: 'workStart',
            work_end: 'workEnd', lunch_start: 'lunchStart', lunch_end: 'lunchEnd',
            extra_slots: 'extraSlots', portfolio_enabled: 'portfolioEnabled'
        },
        services: { hairdresser_id: 'hairdresserId' },
        appointments: {
            hairdresser_id: 'hairdresserId', service_id: 'serviceId',
            client_name: 'clientName', client_phone: 'clientPhone',
            client_email: 'clientEmail', payment_method: 'paymentMethod'
        },
        transactions: {
            hairdresser_id: 'hairdresserId', payment_method: 'paymentMethod'
        },
        portfolio: { hairdresser_id: 'hairdresserId' },
        free_users: { trial_expiry: 'trialExpiry' }
    };
    const fieldMap = map[table] || {};
    const result = {};
    for (const [key, val] of Object.entries(row)) {
        const jsKey = fieldMap[key] || key;
        result[jsKey] = val;
    }
    delete result.created_at;
    return result;
}

function mapRowToDB(table, obj) {
    const map = {
        hairdressers: {
            gpsLink: 'gps_link', isClosed: 'is_closed', workStart: 'work_start',
            workEnd: 'work_end', lunchStart: 'lunch_start', lunchEnd: 'lunch_end',
            extraSlots: 'extra_slots', portfolioEnabled: 'portfolio_enabled'
        },
        services: { hairdresserId: 'hairdresser_id' },
        appointments: {
            hairdresserId: 'hairdresser_id', serviceId: 'service_id',
            clientName: 'client_name', clientPhone: 'client_phone',
            clientEmail: 'client_email', paymentMethod: 'payment_method'
        },
        transactions: {
            hairdresserId: 'hairdresser_id', paymentMethod: 'payment_method'
        },
        portfolio: { hairdresserId: 'hairdresser_id' },
        free_users: { trialExpiry: 'trial_expiry' }
    };
    const fieldMap = map[table] || {};
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        const dbKey = fieldMap[key] || key;
        result[dbKey] = val;
    }
    return result;
}

/* ---- OPERAÇÕES DE CARGA ---- */

async function loadAllFromSupabase() {
    if (!supabaseClient) return false;
    try {
        const tables = [
            { name: 'admin_config', key: 'admin' },
            { name: 'hairdressers', key: 'hairdressers' },
            { name: 'services', key: 'services' },
            { name: 'appointments', key: 'appointments' },
            { name: 'transactions', key: 'transactions' },
            { name: 'portfolio', key: 'portfolio' },
            { name: 'free_users', key: 'freeUsers' }
        ];
        for (const t of tables) {
            const { data, error } = await supabaseClient.from(t.name).select('*');
            if (error) { console.warn('Erro carregando ' + t.name + ':', error); continue; }
            if (t.name === 'admin_config' && data && data.length > 0) {
                DB.admin = { ...mapRow(t.name, data[0]) };
            } else if (data) {
                DB[t.key] = data.map(r => mapRow(t.name, r));
            }
        }
        return true;
    } catch (e) {
        console.warn('Erro ao carregar dados do Supabase:', e);
        return false;
    }
}

/* ---- OPERAÇÕES DE ESCRITA ---- */

const syncQueue = {};
let syncTimer = null;

function scheduleSync(table, rows) {
    syncQueue[table] = rows;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(flushSync, 500);
}

async function flushSync() {
    if (!supabaseClient) return;
    syncTimer = null;
    const tables = Object.keys(syncQueue);
    for (const table of tables) {
        const rows = syncQueue[table];
        delete syncQueue[table];
        try {
            if (table === 'admin_config') {
                if (rows.length > 0) {
                    await supabaseClient.from(table).upsert(mapRowToDB(table, rows[0]), { onConflict: 'id' });
                }
            } else if (table === 'hairdressers' || table === 'services') {
                for (const row of rows) {
                    await supabaseClient.from(table).upsert(mapRowToDB(table, row), { onConflict: 'id' });
                }
            } else {
                for (const row of rows) {
                    await supabaseClient.from(table).upsert(mapRowToDB(table, row), { onConflict: 'id' });
                }
            }
        } catch (e) {
            console.warn('Erro ao sincronizar ' + table + ':', e);
        }
    }
}

function syncTableToSupabase(tableName, jsArray) {
    if (!supabaseClient || !jsArray) return;
    scheduleSync(tableName, Array.isArray(jsArray) ? jsArray : [jsArray]);
}

/* ---- CONFLITO DE HORÁRIOS ---- */

async function checkTimeSlotAvailable(hairdresserId, date, time) {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .select('id')
                .eq('hairdresser_id', hairdresserId)
                .eq('date', date)
                .eq('time', time)
                .in('status', ['confirmed', 'completed']);
            if (!error && data && data.length > 0) return false;
        } catch (e) { /* fallback */ }
    }
    const existing = DB.appointments.filter(a =>
        a.hairdresserId === hairdresserId &&
        a.date === date &&
        a.time === time &&
        (a.status === 'confirmed' || a.status === 'completed')
    );
    return existing.length === 0;
}

/* ---- REAL-TIME ---- */

let unsubscribes = [];

function subscribeToChanges() {
    if (!supabaseClient) return;
    unsubscribeAll();

    const channels = [
        { table: 'hairdressers', handler: handleRealtimeChange },
        { table: 'appointments', handler: handleAppointmentChange },
        { table: 'services', handler: handleRealtimeChange }
    ];

    channels.forEach(ch => {
        const sub = supabaseClient
            .channel(ch.table + '-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: ch.table },
                payload => ch.handler(ch.table, payload)
            )
            .subscribe();
        unsubscribes.push(() => supabaseClient.removeChannel(sub));
    });
}

function unsubscribeAll() {
    unsubscribes.forEach(fn => fn());
    unsubscribes = [];
}

let _realtimeTimer = null;

function handleRealtimeChange(table, payload) {
    const keyMap = {
        hairdressers: 'hairdressers',
        services: 'services',
        appointments: 'appointments',
        transactions: 'transactions',
        portfolio: 'portfolio',
        free_users: 'freeUsers'
    };
    const jsKey = keyMap[table] || table;
    if (!DB[jsKey]) return;

    const mapped = payload.new ? mapRow(table, payload.new) : null;
    if (payload.eventType === 'INSERT' && mapped) {
        const idx = DB[jsKey].findIndex(r => r.id === mapped.id);
        if (idx === -1) DB[jsKey].push(mapped);
    } else if (payload.eventType === 'UPDATE' && mapped) {
        const idx = DB[jsKey].findIndex(r => r.id === mapped.id);
        if (idx !== -1) DB[jsKey][idx] = mapped;
    } else if (payload.eventType === 'DELETE') {
        DB[jsKey] = DB[jsKey].filter(r => r.id !== payload.old.id);
    }

    if (_realtimeTimer) clearTimeout(_realtimeTimer);
    _realtimeTimer = setTimeout(() => {
        _realtimeTimer = null;
        refreshCurrentView();
    }, 300);
}

let _currentTabName = 'my-appointments';

function refreshCurrentView() {
    const activeView = document.querySelector('.view.active');
    if (!activeView) return;
    const viewId = activeView.id;
    if (viewId === 'viewPublic') {
        if (typeof renderCatalog === 'function') {
            const activeFilter = document.querySelector('.filter-btn.active');
            renderCatalog(activeFilter ? activeFilter.dataset.filter : null);
        }
        if (typeof updateStats === 'function') updateStats();
    } else if (document.getElementById('bookingModal')?.classList.contains('open') && typeof renderTimeSlots === 'function') {
        renderTimeSlots();
    } else if (viewId === 'viewDashboard' && currentUser && typeof switchDashTab === 'function') {
        const btn = document.querySelector('.dash-tab.active');
        if (btn) switchDashTab(_currentTabName, btn);
    } else if (viewId === 'viewLogin' && typeof backToLogin === 'function') {
        backToLogin();
    }
}
