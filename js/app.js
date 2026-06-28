const DEFAULT_DATA = {
    admin: { username: 'admin', password: 'admin123', logo: '' },
    hairdressers: [
        { id:1, name:'Carlos Silva', specialty:'Corte Masculino & Barba', rating:4.9, bio:'Especialista em cortes masculinos e design de barba. 10 anos de experiência.', username:'carlos', password:'123', phone:'11988887777', photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'08:00', workEnd:'19:00', lunchStart:'12:00', lunchEnd:'13:30', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false },
        { id:2, name:'Ana Oliveira', specialty:'Corte Feminino & Coloração', rating:4.8, bio:'Referência em coloração e cortes femininos modernos. Técnicas avançadas de mechas.', username:'ana', password:'123', phone:'11977776666', photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'08:00', workEnd:'19:00', lunchStart:'12:00', lunchEnd:'13:00', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false },
        { id:3, name:'Juliana Costa', specialty:'Penteados & Escova', rating:4.9, bio:'Especialista em penteados para festas e escovas modeladoras.', username:'juliana', password:'123', phone:'11966665555', photo:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'08:00', workEnd:'19:00', lunchStart:'11:30', lunchEnd:'13:00', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false },
        { id:4, name:'Rafael Santos', specialty:'Corte Degradê & Estilo', rating:4.7, bio:'Mestre em degradê e cortes estilizados. Tendências internacionais.', username:'rafael', password:'123', phone:'11955554444', photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'09:00', workEnd:'20:00', lunchStart:'12:00', lunchEnd:'13:30', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false },
        { id:5, name:'Fernanda Lima', specialty:'Hidratação & Tratamentos', rating:4.9, bio:'Terapeuta capilar especializada em reconstrução e hidratação.', username:'fernanda', password:'123', phone:'11944443333', photo:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'08:00', workEnd:'18:00', lunchStart:'12:30', lunchEnd:'14:00', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false },
        { id:6, name:'Lucas Oliveira', specialty:'Corte Infantil & Familiar', rating:4.8, bio:'Expert em cortes infantis com paciência e carinho.', username:'lucas', password:'123', phone:'11933332222', photo:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', gpsLink:'https://maps.google.com/?q=-23.5505,-46.6333', workStart:'08:00', workEnd:'19:00', lunchStart:'12:00', lunchEnd:'13:00', isClosed:false, extraSlots:[], plan:'basic', portfolioEnabled:false }
    ],
    services: [
        { id:1, name:'Corte Masculino', icon:'fa-cut', price:45, duration:'40min' },
        { id:2, name:'Corte Feminino', icon:'fa-cut', price:65, duration:'50min' },
        { id:3, name:'Barba Completa', icon:'fa-razor', price:30, duration:'25min' },
        { id:4, name:'Escova Modeladora', icon:'fa-wind', price:55, duration:'45min' },
        { id:5, name:'Coloração', icon:'fa-palette', price:90, duration:'90min' },
        { id:6, name:'Mechas/Luzes', icon:'fa-sun', price:150, duration:'120min' },
        { id:7, name:'Hidratação', icon:'fa-droplet', price:60, duration:'40min' },
        { id:8, name:'Reconstrução Capilar', icon:'fa-wand-magic-sparkles', price:80, duration:'50min' },
        { id:9, name:'Penteados Festa', icon:'fa-crown', price:120, duration:'60min' },
        { id:10, name:'Corte Infantil', icon:'fa-child', price:40, duration:'30min' },
        { id:11, name:'Design de Sobrancelhas', icon:'fa-eye', price:35, duration:'20min' },
        { id:12, name:'Progressiva', icon:'fa-star', price:180, duration:'150min' }
    ],
    appointments: [],
    transactions: [],
    portfolio: []
};

let DB = {};
let currentUser = null;
let crudContext = {};
let loginRole = 'hairdresser';

function init() {
    loadDB();
    renderLogos();
    renderFilters();
    renderCatalog();
    updateStats();
    setupScrollAnimations();
    setupNav();
    renderLoginSelects();
    checkSession();
    handleUrlParams();
}

function loadDB() {
    try {
        const d = localStorage.getItem('csp_db');
        if (d) { DB = JSON.parse(d); }
    } catch(e) {}
    if (!DB || !DB.hairdressers || !DB.admin) {
        DB = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveDB();
        return;
    }
    if (!DB.admin.logo) DB.admin.logo = '';
    DB.hairdressers.forEach(h => {
        if (!h.phone) h.phone = '';
        if (!h.photo) h.photo = '';
        if (!h.gpsLink) h.gpsLink = '';
        if (!h.lunchStart) h.lunchStart = '12:00';
        if (!h.lunchEnd) h.lunchEnd = '13:00';
        if (!h.plan) h.plan = 'basic';
        if (h.portfolioEnabled === undefined) h.portfolioEnabled = false;
    });
    if (!DB.transactions) DB.transactions = [];
    if (!DB.portfolio) DB.portfolio = [];
    saveDB();
}

function saveDB() {
    try { localStorage.setItem('csp_db', JSON.stringify(DB)); } catch(e) {}
}

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view' + id.charAt(0).toUpperCase() + id.slice(1)).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (id === 'public') {
        const links = document.querySelectorAll('.nav-links a');
        links[0].classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (id === 'dashboard') renderDashboard();
    updateNav();
}

function updateNav() {
    const hasUser = currentUser !== null;
    document.getElementById('navLogin').style.display = hasUser ? 'none' : '';
    document.getElementById('navDashboard').style.display = hasUser ? '' : 'none';
    document.getElementById('navLogout').style.display = hasUser ? '' : 'none';
    if (hasUser) {
        document.getElementById('navLogout').textContent = 'Sair (' + (currentUser.role === 'admin' ? 'Admin' : currentUser.name) + ')';
    }
}

function checkSession() {
    try {
        const s = localStorage.getItem('csp_session');
        if (s) {
            const session = JSON.parse(s);
            if (session.role === 'admin') {
                currentUser = { role: 'admin', name: 'Administrador' };
            } else {
                const h = DB.hairdressers.find(h => h.id === session.hairdresserId);
                if (h) currentUser = { role: 'hairdresser', id: h.id, name: h.name };
                else { localStorage.removeItem('csp_session'); return; }
            }
            updateNav();
        }
    } catch(e) {}
}

function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const hId = params.get('hairdresser');
    if (hId) {
        const id = parseInt(hId);
        if (DB.hairdressers.find(h => h.id === id)) {
            setTimeout(() => openBooking(id), 600);
        }
    }
}

function getHairdresserLink(id) {
    const url = window.location.href.split('?')[0].split('#')[0];
    return url + '?hairdresser=' + id;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Link copiado para a área de transferência!', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}
function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Link copiado!', 'success'); } catch(e) { showToast('Erro ao copiar.', 'error'); }
    document.body.removeChild(ta);
}

function openWhatsApp(phone, text) {
    const num = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(text);
    window.open('https://wa.me/55' + num + '?text=' + msg, '_blank');
}

function shareLink(phone, link) {
    const text = 'Olá! Agende seu horário comigo aqui: ' + link;
    openWhatsApp(phone, text);
}

/* === LOGO === */
const LOGO_TEXT = '<div style="text-align:center;"><div class="logo-text" style="font-family:\'Playfair Display\',serif;font-weight:800;font-size:1.8rem;letter-spacing:1px;line-height:1.2;"><i class="fas fa-cut" style="color:var(--gold);margin-right:8px;"></i>CORTE <span style="color:var(--gold);">CERTO</span></div><span class="logo-sub" style="display:block;font-size:.75rem;letter-spacing:0;text-transform:none;color:var(--text2);margin-top:4px;">Conectando voc&ecirc; ao seu sal&atilde;o ideal</span></div>';

function renderLogos() {
    const hasLogo = DB.admin.logo && DB.admin.logo.length > 50;
    const content = hasLogo
        ? '<img src="'+DB.admin.logo+'" alt="CORTE CERTO" style="max-height:60px;width:auto;display:block;" onerror="this.outerHTML=LOGO_TEXT">'
        : LOGO_TEXT;

    ['logoNav', 'logoFooter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    });
}

function scrollToCatalog() {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

/* === LOGIN === */
function switchLoginTab(role) {
    loginRole = role;
    document.querySelectorAll('.login-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.role === role);
    });
    document.getElementById('loginError').style.display = 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const err = document.getElementById('loginError');
    err.style.display = 'none';

    if (loginRole === 'admin') {
        if (user === DB.admin.username && pass === DB.admin.password) {
            currentUser = { role: 'admin', name: 'Administrador' };
            localStorage.setItem('csp_session', JSON.stringify({ role: 'admin' }));
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            showView('dashboard');
            updateNav();
            return;
        }
    } else {
        const h = DB.hairdressers.find(h => h.username === user && h.password === pass);
        if (h) {
            currentUser = { role: 'hairdresser', id: h.id, name: h.name };
            localStorage.setItem('csp_session', JSON.stringify({ role: 'hairdresser', hairdresserId: h.id }));
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            showView('dashboard');
            updateNav();
            return;
        }
    }
    err.style.display = 'block';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('csp_session');
    updateNav();
    showView('public');
}

/* === DASHBOARD === */
function renderDashboard() {
    const title = document.getElementById('dashTitle');
    const sub = document.getElementById('dashSub');
    const tabs = document.getElementById('dashTabs');
    const content = document.getElementById('dashContent');

    if (currentUser.role === 'admin') {
        title.textContent = 'Painel Administrativo';
        sub.textContent = 'Gerencie cabeleireiros, serviços e visualize todos os agendamentos.';
        tabs.innerHTML = `
            <button class="dash-tab active" onclick="switchDashTab('appointments',this)"><i class="fas fa-calendar-check"></i> Agendamentos</button>
            <button class="dash-tab" onclick="switchDashTab('hairdressers',this)"><i class="fas fa-users"></i> Cabeleireiros</button>
            <button class="dash-tab" onclick="switchDashTab('services',this)"><i class="fas fa-cut"></i> Serviços</button>
            <button class="dash-tab" onclick="switchDashTab('admin-config',this)"><i class="fas fa-cog"></i> Config.</button>
        `;
        switchDashTab('appointments', tabs.querySelector('.dash-tab'));
    } else {
        const h = DB.hairdressers.find(h => h.id === currentUser.id);
        const isPro = h && (h.plan === 'pro' || h.plan === 'premium');
        title.textContent = 'Meus Agendamentos';
        sub.textContent = 'Bem-vindo, ' + currentUser.name + '! Plano ' + (h ? h.plan : '') + '.';
        let tabHtml = `
            <button class="dash-tab active" onclick="switchDashTab('my-appointments',this)"><i class="fas fa-calendar-check"></i> Agendamentos</button>
            <button class="dash-tab" onclick="switchDashTab('my-config',this)"><i class="fas fa-cog"></i> Meu Horário</button>`;
        if (isPro) {
            tabHtml += `
            <button class="dash-tab" onclick="switchDashTab('my-finance',this)"><i class="fas fa-dollar-sign"></i> Financeiro</button>`;
            if (h.portfolioEnabled) {
                tabHtml += `
            <button class="dash-tab" onclick="switchDashTab('my-portfolio',this)"><i class="fas fa-images"></i> Portfólio</button>`;
            }
        }
        tabs.innerHTML = tabHtml;
        switchDashTab('my-appointments', tabs.querySelector('.dash-tab'));
    }
}

function switchDashTab(tab, btn) {
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const content = document.getElementById('dashContent');

    if (tab === 'my-appointments') renderMyAppointments(content);
    else if (tab === 'my-config') renderMyConfig(content);
    else if (tab === 'my-finance') renderMyFinance(content);
    else if (tab === 'my-portfolio') renderMyPortfolio(content);
    else if (tab === 'appointments') renderAdminAppointments(content);
    else if (tab === 'hairdressers') renderAdminHairdressers(content);
    else if (tab === 'services') renderAdminServices(content);
    else if (tab === 'admin-config') renderAdminConfig(content);
}

/* === MY APPOINTMENTS (hairdresser) === */
let myApptFilterDate = '';

function renderMyAppointments(container) {
    const today = new Date().toISOString().slice(0,10);
    const filterDate = myApptFilterDate || today;

    let apps = DB.appointments.filter(a => a.hairdresserId === currentUser.id && a.date === filterDate).sort((a,b) => a.time.localeCompare(b.time));
    const totalAll = DB.appointments.filter(a => a.hairdresserId === currentUser.id).length;

    let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <span style="color:var(--text2);font-size:.9rem;">${apps.length} agendamento(s) em <strong>${new Date(filterDate+'T00:00:00').toLocaleDateString('pt-BR')}</strong></span>
        <button class="btn-primary" style="padding:8px 16px;font-size:.8rem;" onclick="openManualBooking()"><i class="fas fa-plus"></i> Novo Agendamento</button>
    </div>
    <div class="appt-filter-bar">
        <div class="appt-date-picker">
            <i class="fas fa-calendar-alt"></i>
            <input type="date" id="myApptFilterDate" value="${filterDate}" onchange="myApptFilterDate=this.value;renderMyAppointments(document.getElementById('dashContent'))">
        </div>
        ${filterDate !== today ? `<button class="appt-today-btn" onclick="myApptFilterDate='';renderMyAppointments(document.getElementById('dashContent'))"><i class="fas fa-times"></i> Hoje</button>` : ''}
        <span style="color:var(--text3);font-size:.75rem;">${totalAll} agendamento(s) no total</span>
    </div>`;

    if (apps.length === 0) {
        html += '<div class="empty-state"><i class="fas fa-calendar-check"></i><p>Nenhum agendamento para esta data.</p></div>';
        container.innerHTML = html;
        return;
    }
    html += '<div class="agenda-grid">';
    apps.forEach(a => {
        const s = DB.services.find(s => s.id === a.serviceId);
        const d = new Date(a.date + 'T00:00:00');
        const ds = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
        const statusClass = a.status === 'confirmed' ? 'confirmed' : a.status === 'completed' ? 'completed' : 'cancelled';
        const apptMsg = 'Olá ' + a.clientName + '!\n\nGostaria de lembrar do seu agendamento:\n📅 ' + ds + '\n⏰ ' + a.time + '\n💇 ' + (s?s.name:'') + '\n\n📍 Chegar com 10 minutos de antecedência!';
        html += '<div class="agenda-card fade-in">' +
            '<div class="ci"><h4>' + a.clientName + '</h4><p><i class="fas fa-phone"></i> ' + a.clientPhone + (a.clientEmail ? ' &bull; ' + a.clientEmail : '') + '</p></div>' +
            '<div style="text-align:center;"><div class="at">' + ds + ' • ' + a.time + '</div><div class="as">' + (s?s.name:'') + (a.notes?'<br><small style="color:var(--text3)">Obs: '+a.notes+'</small>':'') + '</div></div>' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
            (a.clientPhone ? '<button class="btn-sm" style="border-color:#25D366;color:#25D366;" onclick="openWhatsApp(\''+a.clientPhone+'\',\''+apptMsg.replace(/'/g,"\\'")+'\')"><i class="fab fa-whatsapp"></i></button>' : '') +
            '<span class="status ' + statusClass + '">' + a.status + '</span>' +
            (a.status === 'confirmed' ?
                '<button class="btn-sm success" onclick="updateApptStatus('+a.id+',\'completed\')"><i class="fas fa-check"></i></button>' +
                '<button class="btn-sm danger" onclick="updateApptStatus('+a.id+',\'cancelled\')"><i class="fas fa-times"></i></button>'
            : '') +
            '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
    setTimeout(() => container.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')), 50);
}

function openManualBooking() {
    const m = document.getElementById('crudModal');
    m.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('crudTitle').textContent = 'Novo Agendamento Manual';
    document.getElementById('crudSub').textContent = 'Agende um cliente manualmente em qualquer horário.';

    const serviceOptions = DB.services.map(s => '<option value="'+s.id+'">'+s.name+' - R$ '+s.price+' ('+s.duration+')</option>').join('');
    document.getElementById('crudFields').innerHTML = `
        <input type="hidden" id="mbId" value="${Date.now()}">
        <div class="form-group"><label>Nome do Cliente</label><input type="text" id="mbName" placeholder="Nome completo" required></div>
        <div class="form-group"><label>Telefone</label><input type="text" id="mbPhone" placeholder="11999998888" required></div>
        <div class="form-row">
            <div class="form-group"><label>Data</label><input type="date" id="mbDate" value="${new Date().toISOString().slice(0,10)}" required></div>
            <div class="form-group"><label>Horário</label><input type="time" id="mbTime" value="09:00" required></div>
        </div>
        <div class="form-group"><label>Serviço</label><select id="mbService">${serviceOptions}</select></div>
        <div class="form-group"><label>Observações</label><textarea id="mbNotes" placeholder="Opcional" rows="2"></textarea></div>
    `;
    const btn = document.getElementById('crudBtn');
    btn.textContent = 'Confirmar Agendamento';
    btn.type = 'button';
    btn.onclick = function() {
        const name = document.getElementById('mbName').value.trim();
        const phone = document.getElementById('mbPhone').value.trim();
        const date = document.getElementById('mbDate').value;
        const time = document.getElementById('mbTime').value;
        const sId = parseInt(document.getElementById('mbService').value);
        const notes = document.getElementById('mbNotes').value.trim();
        if (!name || !phone || !date || !time) { showToast('Preencha nome, telefone, data e horário.', 'error'); return; }

        DB.appointments.push({
            id: Date.now(),
            hairdresserId: currentUser.id,
            serviceId: sId,
            date, time,
            clientName: name,
            clientPhone: phone,
            clientEmail: '',
            notes,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            manual: true
        });
        saveDB();
        closeCrudModal();
        renderMyAppointments(document.getElementById('dashContent'));
        showToast('Agendamento manual criado para ' + name + '!', 'success');
    };
}

/* === MY CONFIG (hairdresser) === */
function renderMyConfig(container) {
    const h = DB.hairdressers.find(h => h.id === currentUser.id);
    if (!h) { container.innerHTML = ''; return; }
    const link = getHairdresserLink(h.id);
    container.innerHTML = `
        <div style="max-width:500px;">
            <div class="form-group"><label>Nome</label><input type="text" id="myName" value="${h.name}"></div>
            <div class="form-group"><label>Especialidade</label><input type="text" id="mySpecialty" value="${h.specialty}"></div>
            <div class="form-group"><label>Bio</label><textarea id="myBio">${h.bio}</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Abertura</label><input type="time" id="myWorkStart" value="${h.workStart||'08:00'}"></div>
                <div class="form-group"><label>Fechamento</label><input type="time" id="myWorkEnd" value="${h.workEnd||'19:00'}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Início do Almoço</label><input type="time" id="myLunchStart" value="${h.lunchStart}"></div>
                <div class="form-group"><label>Fim do Almoço</label><input type="time" id="myLunchEnd" value="${h.lunchEnd}"></div>
            </div>
            <div class="form-group"><label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="myIsClosed" ${h.isClosed?'checked':''}> Salão fechado (clientes não podem agendar)</label></div>
            <div class="form-row">
                <div class="form-group"><label>WhatsApp</label><input type="text" id="myPhone" placeholder="11999998888" value="${h.phone || ''}"></div>
                <div class="form-group"><label>Usuário</label><input type="text" id="myUsername" value="${h.username}"></div>
            </div>
            <div class="form-group"><label>Nova Senha</label><input type="text" id="myPassword" placeholder="Deixe vazio para manter" value="${h.password}"></div>
            <div class="form-group"><label>Foto do Salão</label>
                <input type="url" id="myPhoto" placeholder="https://exemplo.com/foto.jpg" value="${h.photo || ''}" style="margin-bottom:8px;">
                <div style="display:flex;gap:8px;align-items:center;">
                    <span style="color:var(--text3);font-size:.75rem;">Ou envie do computador:</span>
                    <input type="file" id="myPhotoFile" accept="image/*" style="flex:1;padding:6px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--rs);color:var(--text2);font-size:.8rem;">
                </div>
                <div id="myPhotoPreview" style="margin-top:8px;${h.photo ? 'display:block;' : 'display:none;'}"><img src="${h.photo || ''}" style="max-width:120px;max-height:90px;border-radius:var(--rs);border:1px solid var(--border);" onerror="this.parentElement.style.display='none'"></div>
            </div>
            <div class="form-group"><label>Link do GPS (Google Maps)</label><input type="url" id="myGpsLink" placeholder="https://maps.google.com/?q=..." value="${h.gpsLink || ''}"></div>

            <div style="margin:28px 0 16px;padding-top:20px;border-top:1px solid var(--border);">
                <h4 style="font-size:.9rem;font-weight:600;margin-bottom:8px;"><i class="fas fa-clock" style="color:var(--gold);"></i> Horários Extras</h4>
                <p style="font-size:.8rem;color:var(--text2);margin-bottom:12px;">Adicione horários avulsos disponíveis para encaixar clientes fora da grade normal.</p>
                <div id="extraSlotsList" style="margin-bottom:12px;">
                    ${(h.extraSlots||[]).map((es,i) => `
                        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
                            <input type="date" id="esDate${i}" value="${es.date}" style="flex:1;padding:6px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--text);font-size:.8rem;">
                            <input type="time" id="esTime${i}" value="${es.time}" style="flex:1;padding:6px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--text);font-size:.8rem;">
                            <input type="text" id="esLabel${i}" placeholder="Obs" value="${es.label||''}" style="flex:2;padding:6px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--text);font-size:.8rem;">
                            <button onclick="removeExtraSlot(${i})" style="background:transparent;border:none;color:var(--red);cursor:pointer;font-size:1rem;"><i class="fas fa-times-circle"></i></button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-secondary" style="padding:8px 14px;font-size:.8rem;" onclick="addExtraSlotInput()"><i class="fas fa-plus"></i> Adicionar Horário Extra</button>
            </div>

            <div style="margin:28px 0 16px;padding-top:20px;border-top:1px solid var(--border);">
                <h4 style="font-size:.9rem;font-weight:600;margin-bottom:4px;"><i class="fab fa-whatsapp" style="color:var(--gold);"></i> Link Exclusivo de Agendamento</h4>
                <p style="font-size:.8rem;color:var(--text2);margin-bottom:12px;">Compartilhe este link com seus clientes para eles agendarem direto com você.</p>
                <div style="display:flex;gap:8px;align-items:stretch;">
                    <input type="text" readonly value="${link}" style="flex:1;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--rs);color:var(--gold);font-size:.8rem;outline:none;font-family:inherit;">
                    <button class="btn-primary" style="padding:10px 16px;font-size:.8rem;white-space:nowrap;" onclick="copyToClipboard('${link}')"><i class="fas fa-copy"></i> Copiar</button>
                </div>
                <button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;margin-top:8px;width:100%;" onclick="shareLink('${h.phone || '11999999999'}','${link}')"><i class="fab fa-whatsapp"></i> Compartilhar no WhatsApp</button>
            </div>

            <button class="btn-submit" onclick="saveMyConfig()"><i class="fas fa-save"></i> Salvar Alterações</button>
        </div>
    `;
    setupPhotoUpload('my');
}

function addExtraSlotInput() {
    const h = DB.hairdressers.find(h => h.id === currentUser.id);
    if (!h) return;
    if (!h.extraSlots) h.extraSlots = [];
    h.extraSlots.push({ date: '', time: '', label: '' });
    renderMyConfig(document.getElementById('dashContent'));
}

function removeExtraSlot(index) {
    const h = DB.hairdressers.find(h => h.id === currentUser.id);
    if (!h || !h.extraSlots) return;
    h.extraSlots.splice(index, 1);
    renderMyConfig(document.getElementById('dashContent'));
}

function saveMyConfig() {
    const h = DB.hairdressers.find(h => h.id === currentUser.id);
    if (!h) return;
    h.name = document.getElementById('myName').value.trim();
    h.specialty = document.getElementById('mySpecialty').value.trim();
    h.bio = document.getElementById('myBio').value.trim();
    h.lunchStart = document.getElementById('myLunchStart').value;
    h.lunchEnd = document.getElementById('myLunchEnd').value;
    h.workStart = document.getElementById('myWorkStart').value;
    h.workEnd = document.getElementById('myWorkEnd').value;
    h.isClosed = document.getElementById('myIsClosed').checked;
    h.phone = document.getElementById('myPhone').value.trim();
    h.photo = document.getElementById('myPhoto').value.trim();
    h.gpsLink = document.getElementById('myGpsLink').value.trim();
    const np = document.getElementById('myPassword').value.trim();
    if (np) h.password = np;
    h.username = document.getElementById('myUsername').value.trim();
    // save extra slots
    const listEl = document.getElementById('extraSlotsList');
    if (listEl && h.extraSlots) {
        h.extraSlots = [];
        const items = listEl.querySelectorAll('div[style*="display:flex"]');
        items.forEach(el => {
            const dateInp = el.querySelector('input[type="date"]');
            const timeInp = el.querySelector('input[type="time"]');
            const labelInp = el.querySelectorAll('input[type="text"]');
            if (dateInp && timeInp && dateInp.value && timeInp.value) {
                h.extraSlots.push({ date: dateInp.value, time: timeInp.value, label: labelInp.length > 0 ? labelInp[labelInp.length-1].value : '' });
            }
        });
    }
    saveDB();
    showToast('Dados atualizados com sucesso!', 'success');
    renderCatalog();
    renderMyConfig(document.getElementById('dashContent'));
}

/* === ADMIN APPOINTMENTS === */
function renderAdminAppointments(container) {
    let html = '<div class="dash-header">';
    html += '<select class="dash-select" id="adminApptFilter" onchange="renderAdminAppointments(document.getElementById(\'dashContent\'))">';
    html += '<option value="">Todos os profissionais</option>';
    DB.hairdressers.forEach(h => html += '<option value="'+h.id+'">'+h.name+'</option>');
    html += '</select>';
    html += '<div style="display:flex;gap:8px;">';
    html += '<button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;" onclick="filterAdminAppts(\'today\')">Hoje</button>';
    html += '<button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;" onclick="filterAdminAppts(\'week\')">Semana</button>';
    html += '<button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;" onclick="filterAdminAppts(\'all\')">Todos</button>';
    html += '</div></div>';
    let filter = document.getElementById('adminApptFilter');
    const hId = filter ? parseInt(filter.value) : null;
    let apps = DB.appointments.filter(a => !hId || a.hairdresserId === hId);
    const now = new Date();
    const today = now.toDateString();
    if (adminApptFilterType === 'today') {
        apps = apps.filter(a => new Date(a.date+'T00:00:00').toDateString() === today);
    } else if (adminApptFilterType === 'week') {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        apps = apps.filter(a => {
            const d = new Date(a.date+'T00:00:00');
            return d >= new Date(today) && d <= weekEnd;
        });
    }
    apps.sort((a,b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
    if (apps.length === 0) {
        container.innerHTML = html + '<div class="empty-state"><i class="fas fa-calendar-check"></i><p>Nenhum agendamento.</p></div>';
        return;
    }
    html += '<div class="agenda-grid">';
    apps.forEach(a => {
        const h = DB.hairdressers.find(h => h.id === a.hairdresserId);
        const s = DB.services.find(s => s.id === a.serviceId);
        const d = new Date(a.date+'T00:00:00');
        const ds = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long' });
        const sc = a.status === 'confirmed' ? 'confirmed' : a.status === 'completed' ? 'completed' : 'cancelled';
        const amsg = 'Olá '+a.clientName+'!\n\nLembrete do seu agendamento:\n📅 '+ds+'\n⏰ '+a.time+'\n💇 '+(s?s.name:'')+'\n\n📍 Chegar com 10 minutos de antecedência!';
        html += '<div class="agenda-card fade-in">' +
            '<div class="ci"><h4>'+a.clientName+'</h4><p><i class="fas fa-phone"></i> '+a.clientPhone+(a.clientEmail?' &bull; '+a.clientEmail:'')+'</p></div>' +
            '<div style="text-align:center;"><div class="at">'+ds+' • '+a.time+'</div><div class="as">'+(h?h.name:'')+' — '+(s?s.name:'')+(a.notes?'<br><small>Obs: '+a.notes+'</small>':'')+'</div></div>' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
            (a.clientPhone ? '<button class="btn-sm" style="border-color:#25D366;color:#25D366;" onclick="openWhatsApp(\''+a.clientPhone+'\',\''+amsg.replace(/'/g,"\\'")+'\')"><i class="fab fa-whatsapp"></i></button>' : '') +
            '<span class="status '+sc+'">'+a.status+'</span></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
    setTimeout(() => container.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')), 50);
}

let adminApptFilterType = 'all';
function filterAdminAppts(type) { adminApptFilterType = type; renderAdminAppointments(document.getElementById('dashContent')); }

/* === ADMIN HAIRDRESSERS === */
function renderAdminHairdressers(container) {
    let html = '<div class="crud-bar"><h3 style="font-size:1.1rem;">Gerenciar Cabeleireiros</h3><button class="btn-primary" style="padding:10px 24px;font-size:.85rem;" onclick="openCrud(\'hairdresser\')"><i class="fas fa-plus"></i> Novo</button></div>';
    html += '<div class="crud-table-wrap"><table><thead><tr><th>Nome</th><th>Plano</th><th>Portfólio</th><th>WhatsApp</th><th>Link</th><th>Ações</th></tr></thead><tbody>';
    DB.hairdressers.forEach(h => {
        const link = getHairdresserLink(h.id);
        html += '<tr><td><strong>'+h.name+'</strong><br><small style="color:var(--text3);font-size:.7rem;">'+h.specialty+'</small></td>' +
            '<td><select class="dash-select" style="min-width:100px;font-size:.75rem;padding:4px 8px;" onchange="updatePlan('+h.id+',this.value)">' +
            '<option value="basic"'+(h.plan==='basic'?' selected':'')+'>Basic</option>' +
            '<option value="pro"'+(h.plan==='pro'?' selected':'')+'>Pro</option>' +
            '<option value="premium"'+(h.plan==='premium'?' selected':'')+'>Premium</option></select></td>' +
            '<td><label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:.75rem;"><input type="checkbox" '+(h.portfolioEnabled?'checked':'')+' onchange="togglePortfolio('+h.id+',this.checked)"> '+(h.portfolioEnabled?'Ativo':'Inativo')+'</label></td>' +
            '<td>'+(h.phone?'<small>'+h.phone+'</small>':'—')+'</td>' +
            '<td><button class="btn-sm" style="font-size:.65rem;" onclick="copyToClipboard(\''+link+'\')"><i class="fas fa-copy"></i></button></td>' +
            '<td style="display:flex;gap:6px;">' +
            '<button class="btn-sm" onclick="openCrud(\'hairdresser\','+h.id+')"><i class="fas fa-edit"></i></button>' +
            '<button class="btn-sm danger" onclick="deleteHairdresser('+h.id+')"><i class="fas fa-trash"></i></button></td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function deleteHairdresser(id) {
    if (!confirm('Excluir este cabeleireiro?')) return;
    DB.hairdressers = DB.hairdressers.filter(h => h.id !== id);
    DB.appointments = DB.appointments.filter(a => a.hairdresserId !== id);
    saveDB();
    renderAdminHairdressers(document.getElementById('dashContent'));
    renderCatalog();
    renderFilters();
    updateStats();
    showToast('Cabeleireiro excluído.', 'success');
}

function updatePlan(id, plan) {
    const h = DB.hairdressers.find(h => h.id === id);
    if (h) { h.plan = plan; saveDB(); showToast('Plano atualizado para ' + h.name + ': ' + plan, 'success'); }
}

function togglePortfolio(id, val) {
    const h = DB.hairdressers.find(h => h.id === id);
    if (h) { h.portfolioEnabled = val; saveDB(); renderAdminHairdressers(document.getElementById('dashContent')); showToast(val ? 'Portfólio liberado para ' + h.name : 'Portfólio bloqueado para ' + h.name, 'success'); }
}

/* === MY FINANCE === */
const PAYMENT_METHODS = ['Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'Pix', 'Transferência'];
let financeFilter = { day: '', month: '', year: '' };

function renderMyFinance(container) {
    const hId = currentUser.id;
    let trans = DB.transactions.filter(t => t.hairdresserId === hId);

    // apply filters
    if (financeFilter.year) {
        trans = trans.filter(t => t.date.startsWith(financeFilter.year));
    }
    if (financeFilter.month) {
        trans = trans.filter(t => t.date.slice(5,7) === financeFilter.month.padStart(2,'0'));
    }
    if (financeFilter.day) {
        trans = trans.filter(t => t.date.slice(8,10) === financeFilter.day.padStart(2,'0'));
    }

    const incomes = trans.filter(t => t.type === 'income');
    const expenses = trans.filter(t => t.type === 'expense');
    const totalIncome = incomes.reduce((s,t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s,t) => s + t.amount, 0);
    const net = totalIncome - totalExpense;

    // filter controls
    const years = [...new Set(DB.transactions.filter(t => t.hairdresserId === hId).map(t => t.date.slice(0,4)))].sort();
    const selectedYear = financeFilter.year || new Date().getFullYear().toString();
    const months = Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'));
    const daysInMonth = financeFilter.month ? new Date(parseInt(selectedYear), parseInt(financeFilter.month), 0).getDate() : 31;
    const days = Array.from({length:daysInMonth},(_,i)=>String(i+1).padStart(2,'0'));

    let html = `
    <div class="dash-header"><span style="color:var(--text2);font-size:.9rem;">Saldo geral: <strong style="color:var(--gold);font-size:1.2rem;">R$ ${(DB.transactions.filter(t=>t.hairdresserId===hId&&t.type==='income').reduce((s,t)=>s+t.amount,0)-DB.transactions.filter(t=>t.hairdresserId===hId&&t.type==='expense').reduce((s,t)=>s+t.amount,0)).toFixed(2)}</strong></span></div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-bottom:16px;background:var(--card);padding:12px;border-radius:var(--rs);border:1px solid var(--border);">
      <div style="display:flex;flex-direction:column;gap:2px;"><label style="font-size:.65rem;color:var(--text3);text-transform:uppercase;">Dia</label>
        <select id="fDay" onchange="financeFilter.day=this.value;renderMyFinance(document.getElementById('dashContent'))" style="background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:var(--rs);padding:6px 10px;font-size:.8rem;">
          <option value="">Todos</option>${days.map(d => '<option value="'+d+'"'+(financeFilter.day===d?' selected':'')+'>'+d+'</option>').join('')}
        </select></div>
      <div style="display:flex;flex-direction:column;gap:2px;"><label style="font-size:.65rem;color:var(--text3);text-transform:uppercase;">Mês</label>
        <select id="fMonth" onchange="financeFilter.month=this.value;financeFilter.day='';renderMyFinance(document.getElementById('dashContent'))" style="background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:var(--rs);padding:6px 10px;font-size:.8rem;">
          <option value="">Todos</option>${months.map(m => '<option value="'+m+'"'+(financeFilter.month===m?' selected':'')+'>'+m+'</option>').join('')}
        </select></div>
      <div style="display:flex;flex-direction:column;gap:2px;"><label style="font-size:.65rem;color:var(--text3);text-transform:uppercase;">Ano</label>
        <select id="fYear" onchange="financeFilter.year=this.value;financeFilter.day='';financeFilter.month='';renderMyFinance(document.getElementById('dashContent'))" style="background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:var(--rs);padding:6px 10px;font-size:.8rem;">
          <option value="">Todos</option>${years.map(y => '<option value="'+y+'"'+(financeFilter.year===y?' selected':'')+'>'+y+'</option>').join('')}
        </select></div>
      ${(financeFilter.day||financeFilter.month||financeFilter.year) ? '<button onclick="financeFilter={day:\'\',month:\'\',year:\'\'};renderMyFinance(document.getElementById(\'dashContent\'))" style="background:transparent;border:1px solid var(--border);color:var(--text2);border-radius:var(--rs);padding:6px 12px;font-size:.8rem;cursor:pointer;"><i class="fas fa-times"></i> Limpar</button>' : ''}
    </div>
    `;

    const isFiltered = financeFilter.day || financeFilter.month || financeFilter.year;
    const filterLabel = isFiltered ? 'no período' : 'total';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px;">';
    html += '<div style="background:rgba(46,204,113,.08);border:1px solid rgba(46,204,113,.2);border-radius:var(--rs);padding:16px;text-align:center;"><div style="font-size:.75rem;color:var(--text2);text-transform:uppercase;">Receitas ('+filterLabel+')</div><div style="font-size:1.5rem;font-weight:800;color:#2ecc71;">R$ '+totalIncome.toFixed(2)+'</div></div>';
    html += '<div style="background:rgba(231,76,60,.08);border:1px solid rgba(231,76,60,.2);border-radius:var(--rs);padding:16px;text-align:center;"><div style="font-size:.75rem;color:var(--text2);text-transform:uppercase;">Despesas ('+filterLabel+')</div><div style="font-size:1.5rem;font-weight:800;color:var(--red);">R$ '+totalExpense.toFixed(2)+'</div></div>';
    html += '<div style="background:'+(net>=0?'rgba(46,204,113,.08)':'rgba(231,76,60,.08)')+';border:1px solid '+(net>=0?'rgba(46,204,113,.2)':'rgba(231,76,60,.2)')+';border-radius:var(--rs);padding:16px;text-align:center;"><div style="font-size:.75rem;color:var(--text2);text-transform:uppercase;">Resultado Líquido</div><div style="font-size:1.5rem;font-weight:800;color:'+(net>=0?'#2ecc71':'var(--red)')+';">R$ '+net.toFixed(2)+'</div></div>';
    html += '<div style="background:rgba(52,152,219,.08);border:1px solid rgba(52,152,219,.2);border-radius:var(--rs);padding:16px;text-align:center;"><div style="font-size:.75rem;color:var(--text2);text-transform:uppercase;">Transações</div><div style="font-size:1.5rem;font-weight:800;color:var(--blue);">'+trans.length+'</div></div>';
    html += '</div>';

    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">';
    html += '<button class="btn-primary" style="padding:8px 16px;font-size:.8rem;" onclick="openTransModal(\'income\')"><i class="fas fa-plus"></i> Receita</button>';
    html += '<button class="btn-secondary" style="padding:8px 16px;font-size:.8rem;border-color:var(--red);color:var(--red);" onclick="openTransModal(\'expense\')"><i class="fas fa-minus"></i> Despesa</button>';
    html += '</div>';

    const cats = [...new Set(incomes.map(t => t.category))];
    if (cats.length > 0) {
        html += '<div style="margin-bottom:20px;"><h4 style="font-size:.85rem;font-weight:600;margin-bottom:8px;">Faturamento por Serviço</h4><div style="display:grid;gap:6px;">';
        cats.forEach(cat => {
            const total = incomes.filter(t => t.category === cat).reduce((s,t) => s + t.amount, 0);
            html += '<div style="display:flex;justify-content:space-between;padding:6px 12px;background:var(--card);border-radius:var(--rs);font-size:.8rem;"><span>'+cat+'</span><span style="color:var(--gold);font-weight:600;">R$ '+total.toFixed(2)+'</span></div>';
        });
        html += '</div></div>';
    }

    const pmets = [...new Set(incomes.filter(t => t.paymentMethod).map(t => t.paymentMethod))];
    if (pmets.length > 0) {
        html += '<div style="margin-bottom:20px;"><h4 style="font-size:.85rem;font-weight:600;margin-bottom:8px;">Faturamento por Forma de Pagamento</h4><div style="display:grid;gap:6px;">';
        pmets.forEach(pm => {
            const total = incomes.filter(t => t.paymentMethod === pm).reduce((s,t) => s + t.amount, 0);
            html += '<div style="display:flex;justify-content:space-between;padding:6px 12px;background:var(--card);border-radius:var(--rs);font-size:.8rem;"><span>'+pm+'</span><span style="color:var(--gold);font-weight:600;">R$ '+total.toFixed(2)+'</span></div>';
        });
        html += '</div></div>';
    }

    html += '<h4 style="font-size:.85rem;font-weight:600;margin-bottom:8px;">Todas as Transações</h4><div style="display:grid;gap:6px;">';
    [...incomes, ...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(t => {
        const d = new Date(t.date+'T00:00:00');
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--card);border-radius:var(--rs);font-size:.8rem;border-left:3px solid '+(t.type==='income'?'#2ecc71':'var(--red)')+';">' +
            '<div><span style="font-weight:600;">'+t.description+'</span><br><small style="color:var(--text3);">'+d.toLocaleDateString('pt-BR')+' • '+t.category+(t.paymentMethod?' • '+t.paymentMethod:'')+'</small></div>' +
            '<div style="text-align:right;"><span style="font-weight:700;color:'+(t.type==='income'?'#2ecc71':'var(--red)')+';">'+(t.type==='income'?'+':'-')+'R$ '+t.amount.toFixed(2)+'</span><br><button class="btn-sm danger" style="font-size:.6rem;padding:2px 8px;" onclick="deleteTrans('+t.id+')"><i class="fas fa-trash"></i></button></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function openTransModal(type) {
    const m = document.getElementById('crudModal');
    m.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('crudTitle').textContent = type === 'income' ? 'Nova Receita' : 'Nova Despesa';
    document.getElementById('crudSub').textContent = 'Preencha os dados da transação.';
    const nextId = Math.max(...DB.transactions.map(t => t.id), 0) + 1;
    document.getElementById('crudFields').innerHTML = `
        <input type="hidden" id="tId" value="${nextId}">
        <input type="hidden" id="tType" value="${type}">
        <div class="form-group"><label>Descrição</label><input type="text" id="tDesc" placeholder="Ex: Corte Masculino" required></div>
        <div class="form-group"><label>Categoria</label><input type="text" id="tCat" placeholder="Ex: Corte, Coloração..." value="${type==='income'?'Corte':''}" required></div>
        <div class="form-row">
            <div class="form-group"><label>Valor (R$)</label><input type="number" id="tAmount" min="0" step="0.01" required></div>
            <div class="form-group"><label>Data</label><input type="date" id="tDate" value="${new Date().toISOString().slice(0,10)}" required></div>
        </div>
        ${type === 'income' ? `        <div class="form-group"><label>Forma de Pagamento</label><select id="tPayment">${PAYMENT_METHODS.map(p => '<option>'+p+'</option>').join('')}</select></div>` : ''}
    `;
    document.getElementById('crudBtn').textContent = 'Adicionar';
    document.getElementById('crudBtn').type = 'button';
    document.getElementById('crudBtn').onclick = function() {
        const desc = document.getElementById('tDesc').value.trim();
        const cat = document.getElementById('tCat').value.trim();
        const amount = parseFloat(document.getElementById('tAmount').value);
        const date = document.getElementById('tDate').value;
        if (!desc || !cat || !amount || !date) { showToast('Preencha todos os campos.', 'error'); return; }
        const t = {
            id: parseInt(document.getElementById('tId').value),
            hairdresserId: currentUser.id,
            type: document.getElementById('tType').value,
            category: cat, description: desc, amount, date,
            paymentMethod: type === 'income' ? document.getElementById('tPayment').value : ''
        };
        DB.transactions.push(t);
        saveDB();
        closeCrudModal();
        renderMyFinance(document.getElementById('dashContent'));
        showToast(type==='income'?'Receita adicionada!':'Despesa adicionada!', 'success');
    };
}

function deleteTrans(id) {
    if (!confirm('Excluir esta transação?')) return;
    DB.transactions = DB.transactions.filter(t => t.id !== id);
    saveDB();
    renderMyFinance(document.getElementById('dashContent'));
    showToast('Transação excluída.', 'success');
}

/* === MY PORTFOLIO === */
function renderMyPortfolio(container) {
    const hId = currentUser.id;
    const posts = DB.portfolio.filter(p => p.hairdresserId === hId);
    let html = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:20px;">' +
        '<h3 style="font-size:1.1rem;">Meu Portfólio</h3>' +
        '<button class="btn-primary" style="padding:8px 16px;font-size:.8rem;" onclick="openPortfolioModal()"><i class="fas fa-plus"></i> Nova Postagem</button>' +
        '</div>';
    if (posts.length === 0) {
        html += '<div class="empty-state"><i class="fas fa-images"></i><p>Nenhuma postagem ainda. Divulgue seus trabalhos!</p></div>';
        container.innerHTML = html;
        return;
    }
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">';
    [...posts].reverse().forEach(p => {
        const d = new Date(p.date);
        html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);overflow:hidden;">';
        if (p.images && p.images.length > 0) {
            html += '<div style="position:relative;width:100%;height:200px;overflow:hidden;background:var(--bg2);"><img src="'+p.images[0]+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML=\'<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:.8rem;>Sem imagem</div>\'"></div>';
        } else {
            html += '<div style="height:120px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:.8rem;background:var(--bg2);"><i class="fas fa-image" style="font-size:2rem;opacity:.3;"></i></div>';
        }
        html += '<div style="padding:12px;"><p style="font-size:.85rem;margin-bottom:6px;">'+p.caption+'</p><small style="color:var(--text3);">'+d.toLocaleDateString('pt-BR')+'</small>';
        html += '<div style="margin-top:8px;display:flex;gap:6px;">' +
            '<button class="btn-sm" onclick="sharePortfolio('+p.id+')" style="border-color:#25D366;color:#25D366;"><i class="fab fa-whatsapp"></i></button>' +
            '<button class="btn-sm danger" onclick="deletePortfolio('+p.id+')"><i class="fas fa-trash"></i></button>' +
            '</div></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function openPortfolioModal() {
    const m = document.getElementById('crudModal');
    m.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('crudTitle').textContent = 'Nova Postagem';
    document.getElementById('crudSub').textContent = 'Compartilhe seu trabalho com os clientes!';
    const nextId = Math.max(...DB.portfolio.map(p => p.id), 0) + 1;
    document.getElementById('crudFields').innerHTML = `
        <input type="hidden" id="pId" value="${nextId}">
        <div class="form-group"><label>Legenda</label><textarea id="pCaption" placeholder="Descreva o trabalho..." rows="3"></textarea></div>
        <div class="form-group"><label>Imagens (clique para adicionar)</label>
            <input type="file" id="pImages" accept="image/*" multiple style="width:100%;padding:8px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--rs);color:var(--text2);font-size:.85rem;">
            <div id="pPreview" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;"></div>
        </div>
    `;
    document.getElementById('crudBtn').textContent = 'Publicar';
    document.getElementById('crudBtn').type = 'button';
    document.getElementById('crudBtn').onclick = function() {
        const caption = document.getElementById('pCaption').value.trim();
        const files = document.getElementById('pImages').files;
        if (!caption && files.length === 0) { showToast('Adicione uma legenda ou imagem.', 'error'); return; }
        const images = [];
        if (files.length > 0) {
            let loaded = 0;
            for (let f of files) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    images.push(ev.target.result);
                    loaded++;
                    if (loaded === files.length) savePost(nextId, caption, images);
                };
                reader.readAsDataURL(f);
            }
        } else {
            savePost(nextId, caption, images);
        }
    };
    const fi = document.getElementById('pImages');
    if (fi) fi.onchange = function() {
        const preview = document.getElementById('pPreview');
        preview.innerHTML = '';
        for (let f of this.files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML += '<img src="'+e.target.result+'" style="width:80px;height:80px;object-fit:cover;border-radius:var(--rs);border:1px solid var(--border);">';
            };
            reader.readAsDataURL(f);
        }
    };
}

function savePost(id, caption, images) {
    DB.portfolio.push({ id, hairdresserId: currentUser.id, caption, images, date: new Date().toISOString() });
    saveDB();
    closeCrudModal();
    renderMyPortfolio(document.getElementById('dashContent'));
    showToast('Postagem publicada!', 'success');
}

function deletePortfolio(id) {
    if (!confirm('Excluir esta postagem?')) return;
    DB.portfolio = DB.portfolio.filter(p => p.id !== id);
    saveDB();
    renderMyPortfolio(document.getElementById('dashContent'));
    showToast('Postagem excluída.', 'success');
}

function sharePortfolio(id) {
    const p = DB.portfolio.find(p => p.id === id);
    if (!p) return;
    const h = DB.hairdressers.find(h => h.id === currentUser.id);
    const msg = 'Confira meu trabalho! ✂️\n\n' + (p.caption ? p.caption + '\n\n' : '') + 'Agende seu horário comigo: ' + getHairdresserLink(currentUser.id);
    if (h && h.phone) openWhatsApp(h.phone, msg);
    else showToast('Cadastre seu WhatsApp para compartilhar.', 'error');
}

/* === ADMIN SERVICES === */
function renderAdminServices(container) {
    let html = '<div class="crud-bar"><h3 style="font-size:1.1rem;">Gerenciar Serviços</h3><button class="btn-primary" style="padding:10px 24px;font-size:.85rem;" onclick="openCrud(\'service\')"><i class="fas fa-plus"></i> Novo</button></div>';
    html += '<div class="crud-table-wrap"><table><thead><tr><th>Nome</th><th>Preço</th><th>Duração</th><th>Ações</th></tr></thead><tbody>';
    DB.services.forEach(s => {
        html += '<tr><td><strong>'+s.name+'</strong></td><td>R$ '+s.price+'</td><td>'+s.duration+'</td><td style="display:flex;gap:6px;">' +
            '<button class="btn-sm" onclick="openCrud(\'service\','+s.id+')"><i class="fas fa-edit"></i></button>' +
            '<button class="btn-sm danger" onclick="deleteService('+s.id+')"><i class="fas fa-trash"></i></button></td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function deleteService(id) {
    if (!confirm('Excluir este serviço?')) return;
    DB.services = DB.services.filter(s => s.id !== id);
    saveDB();
    renderAdminServices(document.getElementById('dashContent'));
    updateStats();
    showToast('Serviço excluído.', 'success');
}

/* === ADMIN CONFIG === */
function renderAdminConfig(container) {
    const hasLogo = DB.admin.logo && DB.admin.logo.length > 50;
    container.innerHTML = `
        <div style="max-width:500px;">
            <h3 style="font-size:1.1rem;margin-bottom:16px;">Configurações do Administrador</h3>
            <div class="form-group"><label>Usuário Admin</label><input type="text" id="admUser" value="${DB.admin.username}"></div>
            <div class="form-group"><label>Nova Senha</label><input type="text" id="admPass" placeholder="Deixe vazio para manter" value="${DB.admin.password}"></div>

            <div style="margin:24px 0;padding-top:20px;border-top:1px solid var(--border);">
                <h4 style="font-size:.9rem;font-weight:600;margin-bottom:8px;"><i class="fas fa-image"></i> Logotipo da Marca</h4>
                <p style="font-size:.8rem;color:var(--text2);margin-bottom:12px;">Envie uma imagem para ser o logotipo da sua página (será exibido no lugar do texto padrão)</p>
                <div id="admLogoPreview" style="margin-bottom:12px;${hasLogo ? 'display:block;' : 'display:none;'}">
                    <img id="admLogoImg" src="${DB.admin.logo || ''}" style="max-width:280px;max-height:100px;border-radius:var(--rs);border:1px solid var(--border);background:rgba(255,255,255,.03);padding:8px;" onerror="this.parentElement.style.display='none'">
                </div>
                <input type="file" id="admLogoFile" accept="image/*" style="width:100%;padding:8px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--rs);color:var(--text2);font-size:.85rem;">
                <div style="margin-top:8px;display:flex;gap:8px;">
                    <button class="btn-secondary" style="padding:8px 16px;font-size:.8rem;" onclick="document.getElementById('admLogoFile').click()"><i class="fas fa-upload"></i> Escolher Imagem</button>
                    ${hasLogo ? '<button class="btn-secondary" style="padding:8px 16px;font-size:.8rem;border-color:var(--red);color:var(--red);" onclick="removeLogo()"><i class="fas fa-trash"></i> Remover Logo</button>' : ''}
                </div>
            </div>

            <button class="btn-submit" onclick="saveAdminConfig()"><i class="fas fa-save"></i> Salvar</button>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border);">
                <h3 style="font-size:1.1rem;margin-bottom:8px;">Dados</h3>
                <p style="color:var(--text2);font-size:.85rem;margin-bottom:16px;">Exporte ou limpe todos os dados do sistema.</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;" onclick="exportData()"><i class="fas fa-download"></i> Exportar Dados</button>
                    <button class="btn-secondary" style="padding:10px 20px;font-size:.8rem;border-color:var(--red);color:var(--red);" onclick="resetData()"><i class="fas fa-trash-can"></i> Resetar Dados</button>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const fi = document.getElementById('admLogoFile');
        if (fi) fi.onchange = function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    DB.admin.logo = e.target.result;
                    const prev = document.getElementById('admLogoPreview');
                    const img = document.getElementById('admLogoImg');
                    if (prev) prev.style.display = 'block';
                    if (img) img.src = e.target.result;
                    showToast('Logo carregada! Clique em Salvar para confirmar.', 'success');
                    renderLogos();
                };
                reader.readAsDataURL(file);
            }
        };
    }, 50);
}

function removeLogo() {
    DB.admin.logo = '';
    saveDB();
    renderAdminConfig(document.getElementById('dashContent'));
    renderLogos();
    showToast('Logo removida.', 'success');
}

function saveAdminConfig() {
    const u = document.getElementById('admUser').value.trim();
    const p = document.getElementById('admPass').value.trim();
    if (u) DB.admin.username = u;
    if (p) DB.admin.password = p;
    saveDB();
    renderLogos();
    showToast('Configurações salvas!', 'success');
}

function exportData() {
    const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'csp-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    showToast('Dados exportados!', 'success');
}

function resetData() {
    if (!confirm('TEM CERTEZA? Isso vai apagar TODOS os dados (agendamentos, cabeleireiros, serviços) e restaurar o padrão.')) return;
    if (!confirm('Essa ação não pode ser desfeita. Confirma?')) return;
    DB = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveDB();
    renderAdminHairdressers(document.getElementById('dashContent'));
    renderCatalog();
    renderFilters();
    updateStats();
    showToast('Dados resetados para o padrão.', 'success');
}

/* === CRUD MODAL === */
function openCrud(type, id) {
    crudContext = { type, id: id || null };
    const modal = document.getElementById('crudModal');
    const title = document.getElementById('crudTitle');
    const sub = document.getElementById('crudSub');
    const fields = document.getElementById('crudFields');
    const btn = document.getElementById('crudBtn');
    btn.type = 'submit';
    btn.onclick = null;

    modal.classList.add('open');
    document.body.classList.add('no-scroll');

    if (type === 'hairdresser') {
        const h = id ? DB.hairdressers.find(h => h.id === id) : null;
        title.textContent = h ? 'Editar Cabeleireiro' : 'Novo Cabeleireiro';
        sub.textContent = h ? 'Editando: ' + h.name : 'Preencha os dados do novo cabeleireiro.';
        const nextId = Math.max(...DB.hairdressers.map(h => h.id), 0) + 1;
        fields.innerHTML = `
            <input type="hidden" id="cId" value="${h ? h.id : nextId}">
            <div class="form-group"><label>Nome</label><input type="text" id="cName" value="${h ? h.name : ''}" required></div>
            <div class="form-group"><label>Especialidade</label><input type="text" id="cSpecialty" value="${h ? h.specialty : ''}" required></div>
            <div class="form-group"><label>Bio</label><textarea id="cBio" required>${h ? h.bio : ''}</textarea></div>
            <div class="form-group"><label>Avaliação (0-5)</label><input type="number" id="cRating" min="0" max="5" step="0.1" value="${h ? h.rating : '5.0'}" required></div>
            <div class="form-row">
                <div class="form-group"><label>Abertura</label><input type="time" id="cWorkStart" value="${h ? (h.workStart||'08:00') : '08:00'}"></div>
                <div class="form-group"><label>Fechamento</label><input type="time" id="cWorkEnd" value="${h ? (h.workEnd||'19:00') : '19:00'}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Início Almoço</label><input type="time" id="cLunchStart" value="${h ? h.lunchStart : '12:00'}" required></div>
                <div class="form-group"><label>Fim Almoço</label><input type="time" id="cLunchEnd" value="${h ? h.lunchEnd : '13:00'}" required></div>
            </div>
            <div class="form-group"><label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="cIsClosed" ${h && h.isClosed ? 'checked' : ''}> Salão fechado (bloqueia agendamentos)</label></div>
            <div class="form-group"><label>WhatsApp</label><input type="text" id="cPhone" placeholder="11999998888" value="${h ? (h.phone || '') : ''}"></div>
            <div class="form-group"><label>Foto do Salão</label>
                <input type="url" id="cPhoto" placeholder="https://exemplo.com/foto.jpg" value="${h ? (h.photo || '') : ''}" style="margin-bottom:8px;">
                <div style="display:flex;gap:8px;align-items:center;">
                    <span style="color:var(--text3);font-size:.75rem;">Ou envie do computador:</span>
                    <input type="file" id="cPhotoFile" accept="image/*" style="flex:1;padding:6px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:var(--rs);color:var(--text2);font-size:.8rem;">
                </div>
                <div id="cPhotoPreview" style="margin-top:8px;${(h && h.photo) ? 'display:block;' : 'display:none;'}"><img src="${h ? (h.photo || '') : ''}" style="max-width:120px;max-height:90px;border-radius:var(--rs);border:1px solid var(--border);"></div>
            </div>
            <div class="form-group"><label>Link do GPS (Google Maps)</label><input type="url" id="cGpsLink" placeholder="https://maps.google.com/?q=..." value="${h ? (h.gpsLink || '') : ''}"></div>
            <div class="form-row">
                <div class="form-group"><label>Usuário</label><input type="text" id="cUsername" value="${h ? h.username : ''}" required></div>
                <div class="form-group"><label>Senha</label><input type="text" id="cPassword" value="${h ? h.password : '123'}" required></div>
            </div>
        `;
        btn.textContent = h ? 'Salvar Alterações' : 'Criar Cabeleireiro';

        setupPhotoUpload('c');
    } else if (type === 'service') {
        const s = id ? DB.services.find(s => s.id === id) : null;
        title.textContent = s ? 'Editar Serviço' : 'Novo Serviço';
        sub.textContent = s ? 'Editando: ' + s.name : 'Preencha os dados do novo serviço.';
        const nextId = Math.max(...DB.services.map(s => s.id), 0) + 1;
        fields.innerHTML = `
            <input type="hidden" id="cId" value="${s ? s.id : nextId}">
            <div class="form-group"><label>Nome</label><input type="text" id="cName" value="${s ? s.name : ''}" required></div>
            <div class="form-row">
                <div class="form-group"><label>Preço (R$)</label><input type="number" id="cPrice" min="0" value="${s ? s.price : ''}" required></div>
                <div class="form-group"><label>Duração</label><input type="text" id="cDuration" placeholder="ex: 40min" value="${s ? s.duration : ''}" required></div>
            </div>
        `;
        btn.textContent = s ? 'Salvar Alterações' : 'Criar Serviço';
    }
}

function closeCrudModal() {
    document.getElementById('crudModal').classList.remove('open');
    document.body.classList.remove('no-scroll');
    const btn = document.getElementById('crudBtn');
    btn.type = 'submit';
    btn.onclick = null;
}

function submitCrud(e) {
    e.preventDefault();
    const { type, id } = crudContext;
    if (type === 'hairdresser') {
        const formId = parseInt(document.getElementById('cId').value);
        const name = document.getElementById('cName').value.trim();
        const specialty = document.getElementById('cSpecialty').value.trim();
        const bio = document.getElementById('cBio').value.trim();
        const rating = parseFloat(document.getElementById('cRating').value);
        const lunchStart = document.getElementById('cLunchStart').value;
        const lunchEnd = document.getElementById('cLunchEnd').value;
        const workStart = document.getElementById('cWorkStart').value;
        const workEnd = document.getElementById('cWorkEnd').value;
        const isClosed = document.getElementById('cIsClosed').checked;
        const phone = document.getElementById('cPhone').value.trim();
        const photo = document.getElementById('cPhoto').value.trim();
        const gpsLink = document.getElementById('cGpsLink').value.trim();
        const username = document.getElementById('cUsername').value.trim();
        const password = document.getElementById('cPassword').value.trim();
        if (!name || !specialty || !bio || !username || !password) { showToast('Preencha todos os campos.', 'error'); return; }
        if (id) {
            const h = DB.hairdressers.find(h => h.id === id);
            if (h) { Object.assign(h, { name, specialty, bio, rating, lunchStart, lunchEnd, workStart, workEnd, isClosed, phone, photo, gpsLink, username, password }); }
        } else {
            if (DB.hairdressers.some(h => h.username === username)) { showToast('Usuário já existe.', 'error'); return; }
            DB.hairdressers.push({ id: formId, name, specialty, rating, bio, username, password, phone, photo, gpsLink, workStart, workEnd, lunchStart, lunchEnd, isClosed:false, extraSlots:[] });
        }
        saveDB();
        closeCrudModal();
        renderAdminHairdressers(document.getElementById('dashContent'));
        renderCatalog();
        renderFilters();
        updateStats();
        showToast(id ? 'Cabeleireiro atualizado!' : 'Cabeleireiro criado!', 'success');
    } else if (type === 'service') {
        const formId = parseInt(document.getElementById('cId').value);
        const name = document.getElementById('cName').value.trim();
        const price = parseFloat(document.getElementById('cPrice').value);
        const duration = document.getElementById('cDuration').value.trim();
        if (!name || !price || !duration) { showToast('Preencha todos os campos.', 'error'); return; }
        if (id) {
            const s = DB.services.find(s => s.id === id);
            if (s) Object.assign(s, { name, price, duration });
        } else {
            DB.services.push({ id: formId, name, icon: 'fa-cut', price, duration });
        }
        saveDB();
        closeCrudModal();
        renderAdminServices(document.getElementById('dashContent'));
        updateStats();
        showToast(id ? 'Serviço atualizado!' : 'Serviço criado!', 'success');
    }
}

function setupPhotoUpload(prefix) {
    setTimeout(() => {
        const fileInput = document.getElementById(prefix + 'PhotoFile');
        const urlInput = document.getElementById(prefix + 'Photo');
        const preview = document.getElementById(prefix + 'PhotoPreview');
        if (!fileInput || !urlInput || !preview) return;
        fileInput.onchange = function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    urlInput.value = e.target.result;
                    preview.style.display = 'block';
                    preview.innerHTML = '<img src="'+e.target.result+'" style="max-width:120px;max-height:90px;border-radius:var(--rs);border:1px solid var(--border);">';
                };
                reader.readAsDataURL(file);
            }
        };
        urlInput.oninput = function() {
            if (this.value) {
                preview.style.display = 'block';
                preview.innerHTML = '<img src="'+this.value+'" style="max-width:120px;max-height:90px;border-radius:var(--rs);border:1px solid var(--border);" onerror="this.parentElement.style.display=\'none\'">';
            } else {
                preview.style.display = 'none';
            }
        };
    }, 50);
}

/* === BOOKING === */
let bookingHairdresserId = null;
function openBooking(hairdresserId) {
    bookingHairdresserId = hairdresserId || null;
    const overlay = document.getElementById('bookingModal');
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');

    const hSel = document.getElementById('fHairdresser');
    const hDisplay = document.getElementById('fHairdresserDisplay');
    const hName = document.getElementById('fHairdresserName');

    hSel.innerHTML = '';
    if (hairdresserId) {
        const h = DB.hairdressers.find(h => h.id === hairdresserId);
        if (h) {
            hName.textContent = h.name;
            hDisplay.style.display = 'block';
            hSel.style.display = 'none';
            // show closed warning
            const warn = document.getElementById('fClosedWarning') || (function(){
                const el = document.createElement('div');
                el.id = 'fClosedWarning';
                el.style.cssText = 'padding:10px 14px;background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.3);border-radius:var(--rs);color:var(--red);font-size:.8rem;margin-bottom:12px;display:none;';
                document.getElementById('bookingForm').insertBefore(el, document.getElementById('bookingForm').firstChild);
                return el;
            })();
            warn.style.display = h.isClosed ? 'block' : 'none';
            warn.innerHTML = '<i class="fas fa-door-closed"></i> Este salão está fechado para agendamentos no momento.';
            const opt = document.createElement('option');
            opt.value = h.id; opt.textContent = h.name; opt.selected = true;
            hSel.appendChild(opt);
        }
    } else {
        hDisplay.style.display = 'none';
        hSel.style.display = 'block';
        DB.hairdressers.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id; opt.textContent = h.name;
            hSel.appendChild(opt);
        });
    }

    const sSel = document.getElementById('fService');
    sSel.innerHTML = '';
    DB.services.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name + ' - R$ ' + s.price + ' (' + s.duration + ')';
        sSel.appendChild(opt);
    });
    document.getElementById('fDate').value = '';
    document.getElementById('fTime').value = '';
    document.getElementById('fName').value = '';
    document.getElementById('fPhone').value = '';
    document.getElementById('fEmail').value = '';
    document.getElementById('fNotes').value = '';
    document.getElementById('fTimeSlots').innerHTML = '';
    setupBookingListeners();
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('open');
    document.body.classList.remove('no-scroll');
    bookingHairdresserId = null;
    const d = document.getElementById('fHairdresserDisplay');
    const s = document.getElementById('fHairdresser');
    if (d) d.style.display = 'none';
    if (s) s.style.display = 'block';
}

function setupBookingListeners() {
    document.getElementById('fDate').onchange = renderTimeSlots;
    document.getElementById('fHairdresser').onchange = function() {
        const hId = getSelectedHairdresserId();
        const h = hId ? DB.hairdressers.find(h => h.id === hId) : null;
        const warn = document.getElementById('fClosedWarning');
        if (warn && h) {
            warn.style.display = h.isClosed ? 'block' : 'none';
            warn.innerHTML = '<i class="fas fa-door-closed"></i> Este salão está fechado para agendamentos no momento.';
        } else if (warn) {
            warn.style.display = 'none';
        }
        if (!bookingHairdresserId && document.getElementById('fDate').value) renderTimeSlots();
    };
}

function getSelectedHairdresserId() {
    if (bookingHairdresserId) return bookingHairdresserId;
    return parseInt(document.getElementById('fHairdresser').value) || null;
}

function renderTimeSlots() {
    const container = document.getElementById('fTimeSlots');
    const date = document.getElementById('fDate').value;
    const hId = getSelectedHairdresserId();
    container.innerHTML = '';
    if (!date || !hId) { container.innerHTML = '<p style="color:var(--text3);font-size:.8rem;grid-column:1/-1;">Selecione a data e o profissional.</p>'; return; }

    const h = DB.hairdressers.find(h => h.id === hId);
    if (!h) return;

    if (h.isClosed) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--red);font-size:.9rem;"><i class="fas fa-door-closed" style="font-size:2rem;display:block;margin-bottom:8px;opacity:.5;"></i>Este salão está fechado para agendamentos no momento.</div>';
        return;
    }

    const workStart = h.workStart || '08:00';
    const workEnd = h.workEnd || '19:00';
    const lunchStart = h.lunchStart || '12:00';
    const lunchEnd = h.lunchEnd || '13:00';
    const extraSlots = h.extraSlots || [];

    // build all 30-min slots from workStart to workEnd
    function timeToMinutes(t) {
        const [hh, mm] = t.split(':').map(Number);
        return hh * 60 + mm;
    }
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);

    const allSlots = [];
    for (let m = startMin; m < endMin; m += 30) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        allSlots.push(hh + ':' + mm);
    }

    const booked = DB.appointments.filter(a => a.hairdresserId === hId && a.date === date && a.status === 'confirmed').map(a => a.time);
    const extraToday = extraSlots.filter(es => es.date === date).map(es => es.time);

    let lunchLabelAdded = false;
    allSlots.forEach(time => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot';
        btn.textContent = time;

        const isLunch = time >= lunchStart && time < lunchEnd;
        const isBooked = booked.includes(time);

        if (isLunch) {
            if (!lunchLabelAdded) {
                const lbl = document.createElement('small');
                lbl.style.cssText = 'grid-column:1/-1;text-align:center;color:var(--text3);font-size:.7rem;margin-top:4px;margin-bottom:4px;';
                lbl.textContent = '⏰ Almoço: ' + lunchStart + ' às ' + lunchEnd;
                container.appendChild(lbl);
                lunchLabelAdded = true;
            }
            btn.disabled = true;
            btn.title = 'Horário de almoço';
        } else if (isBooked) {
            btn.disabled = true;
            btn.title = 'Indisponível';
        }

        btn.onclick = () => {
            document.querySelectorAll('#fTimeSlots .time-slot').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('fTime').value = time;
        };
        container.appendChild(btn);
    });

    // render extra slots for today
    if (extraToday.length > 0) {
        const sep = document.createElement('div');
        sep.style.cssText = 'grid-column:1/-1;text-align:center;color:var(--gold);font-size:.75rem;margin-top:8px;border-top:1px dashed var(--border);padding-top:8px;';
        sep.textContent = '✨ Horários extras disponíveis';
        container.appendChild(sep);
        extraToday.forEach(time => {
            const es = extraSlots.find(e => e.date === date && e.time === time);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'time-slot extra';
            btn.textContent = time + (es && es.label ? ' (' + es.label + ')' : '');
            const isBooked = booked.includes(time);
            if (isBooked) {
                btn.disabled = true;
                btn.title = 'Indisponível';
            }
            btn.onclick = () => {
                document.querySelectorAll('#fTimeSlots .time-slot').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('fTime').value = time;
            };
            container.appendChild(btn);
        });
    }
}

function submitBooking(e) {
    e.preventDefault();
    const hId = getSelectedHairdresserId();
    const sId = parseInt(document.getElementById('fService').value);
    const date = document.getElementById('fDate').value;
    const time = document.getElementById('fTime').value;
    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const notes = document.getElementById('fNotes').value.trim();
    if (!time) { showToast('Selecione um horário disponível.', 'error'); return; }
    if (!name || !phone) { showToast('Preencha nome e telefone.', 'error'); return; }

    const h = DB.hairdressers.find(h => h.id === hId);
    const s = DB.services.find(s => s.id === sId);
    const d = new Date(date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

    DB.appointments.push({
        id: Date.now(),
        hairdresserId: hId, serviceId: sId,
        date, time, clientName: name, clientPhone: phone,
        clientEmail: email, notes, status: 'confirmed',
        createdAt: new Date().toISOString()
    });
    saveDB();
    closeModal();
    updateStats();

    const msg = 'Olá ' + name + '!\n\n' +
        '✅ Seu agendamento foi confirmado!\n\n' +
        '📋 Detalhes:\n' +
        '👤 Profissional: ' + (h ? h.name : '') + '\n' +
        '💇 Serviço: ' + (s ? s.name : '') + '\n' +
        '📅 Data: ' + dateStr + '\n' +
        '⏰ Horário: ' + time + '\n' +
        (notes ? '📝 Obs: ' + notes + '\n' : '') +
        '\n📍 Chegar com 10 minutos de antecedência no salão!\n\n' +
        'Agradecemos a preferência! 🙌';

    if (phone) {
        showToast('Agendamento confirmado! Enviando confirmação via WhatsApp...', 'success');
        setTimeout(() => openWhatsApp(phone, msg), 800);
    } else {
        showToast('Agendamento confirmado para ' + name + '!', 'success');
    }
}

function updateApptStatus(id, status) {
    const a = DB.appointments.find(a => a.id === id);
    if (!a) return;
    if (status === 'cancelled' && !confirm('Cancelar agendamento de ' + a.clientName + '?')) return;
    a.status = status;
    saveDB();
    const content = document.getElementById('dashContent');
    if (currentUser.role === 'admin') renderAdminAppointments(content);
    else renderMyAppointments(content);
    updateStats();
    if (status === 'cancelled' && a.clientPhone) {
        const s = DB.services.find(s => s.id === a.serviceId);
        const h = DB.hairdressers.find(h => h.id === a.hairdresserId);
        const d = new Date(a.date + 'T00:00:00');
        const dateStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
        const msg = 'Olá ' + a.clientName + '!\n\n' +
            '❗ Infelizmente o seu agendamento foi cancelado.\n\n' +
            '📋 Detalhes do cancelamento:\n' +
            '👤 Profissional: ' + (h ? h.name : '') + '\n' +
            '💇 Serviço: ' + (s ? s.name : '') + '\n' +
            '📅 Data: ' + dateStr + '\n' +
            '⏰ Horário: ' + a.time + '\n\n' +
            'Por favor, entre em contato para reagendar seu horário em outro dia.\n\n' +
            'Pedimos desculpas pelo transtorno! 🙏';
        setTimeout(() => openWhatsApp(a.clientPhone, msg), 500);
        showToast('Agendamento cancelado. Notificação enviada ao cliente.', 'error');
    } else {
        showToast(status === 'completed' ? 'Agendamento concluído!' : 'Agendamento cancelado.', status === 'completed' ? 'success' : 'error');
    }
}

/* === CATALOG === */
function renderFilters() {
    const container = document.getElementById('filters');
    container.innerHTML = '<button class="filter-btn active" data-filter="todos">Todos</button>';
    const specs = [...new Set(DB.hairdressers.map(h => h.specialty.split(' & ')).flat())].sort();
    specs.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = s;
        btn.textContent = s;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalog(s);
        };
        container.appendChild(btn);
    });
}

function renderCatalog(filter) {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';
    const f = filter || 'todos';
    const items = f === 'todos' ? DB.hairdressers : DB.hairdressers.filter(h => h.specialty.includes(f));
    items.forEach((h, i) => {
        const card = document.createElement('div');
        card.className = 'catalog-card fade-in';
        card.style.transitionDelay = i * 0.08 + 's';
        const initials = h.name.split(' ').map(n => n[0]).join('').slice(0,2);
        const hasPhoto = h.photo && h.photo.length > 10;
        const hasGps = h.gpsLink && h.gpsLink.length > 10;
        const closedBadge = h.isClosed ? '<div class="closed-badge"><i class="fas fa-door-closed"></i> Fechado</div>' : '';

        if (hasPhoto) {
            const gpsAttr = hasGps ? 'onclick="window.open(\''+h.gpsLink+'\',\'_blank\')" title="Ver no mapa"' : '';
            card.innerHTML =
                closedBadge +
                '<div class="card-photo-banner" '+gpsAttr+'>' +
                    '<img src="'+h.photo+'" alt="'+h.name+'" onerror="this.parentElement.outerHTML=\'\'">' +
                    '<div class="photo-initials">'+initials+'</div>' +
                    (hasGps ? '<div class="gps-badge"><i class="fas fa-map-marker-alt"></i> Ver no mapa</div>' : '') +
                '</div>' +
                '<div class="card-info" style="margin-bottom:12px;"><h3>'+h.name+'</h3><div class="card-specialty">'+h.specialty+'</div><div class="card-rating"><i class="fas fa-star"></i><span>'+h.rating+'</span></div></div>' +
                '<div class="card-bio">'+h.bio+'</div>' +
                '<div class="card-bottom"><div class="card-availability" style="color:var(--text3);font-size:.8rem;"><i class="fas fa-clock"></i> Consulte horários</div>' +
                (h.isClosed ? '<button class="btn-card" disabled style="opacity:.4;cursor:not-allowed;"><i class="fas fa-door-closed"></i> Indisponível</button>' : '<button class="btn-card" onclick="openBooking('+h.id+')"><i class="fas fa-calendar-plus"></i> Agendar</button>') + '</div>';
        } else {
            const avatarHtml = '<div class="card-avatar '+(hasGps?'card-avatar-clickable':'')+'" '+(hasGps?'onclick="window.open(\''+h.gpsLink+'\',\'_blank\')" title="Ver no mapa"':'')+'>'+initials+(hasGps?'<span class="gps-icon"><i class="fas fa-map-marker-alt"></i></span>':'')+'</div>';
            card.innerHTML =
                closedBadge +
                '<div class="card-top">'+avatarHtml+'<div class="card-info"><h3>'+h.name+'</h3><div class="card-specialty">'+h.specialty+'</div><div class="card-rating"><i class="fas fa-star"></i><span>'+h.rating+'</span></div></div></div>' +
                '<div class="card-bio">'+h.bio+'</div>' +
                '<div class="card-bottom"><div class="card-availability" style="color:var(--text3);font-size:.8rem;"><i class="fas fa-clock"></i> Consulte horários</div>' +
                (h.isClosed ? '<button class="btn-card" disabled style="opacity:.4;cursor:not-allowed;"><i class="fas fa-door-closed"></i> Indisponível</button>' : '<button class="btn-card" onclick="openBooking('+h.id+')"><i class="fas fa-calendar-plus"></i> Agendar</button>') + '</div>';
        }
        grid.appendChild(card);
    });
    setTimeout(() => grid.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')), 50);
}

function updateStats() {
    document.getElementById('statH').textContent = DB.hairdressers.length;
    document.getElementById('statA').textContent = DB.appointments.filter(a => a.status === 'confirmed').length;
    document.getElementById('statS').textContent = DB.services.length;
}

/* === TOAST === */
function showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + msg;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 4000);
}

/* === SCROLL ANIMATIONS === */
function setupScrollAnimations() {
    new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .1, rootMargin: '0px 0px -50px 0px' }).observe(document.querySelector('.hero'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

function setupNav() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.onclick = () => { hamburger.classList.toggle('active'); navLinks.classList.toggle('open'); };
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); }));
}

function renderLoginSelects() {
    renderTimeSlots();
}

document.addEventListener('DOMContentLoaded', init);