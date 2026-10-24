const KEY='ac-contabil-v1';
const TABS=[['painel','Painel'],['clientes','Clientes'],['honorarios','Honorários'],['guias','Guias e impostos'],['docs','Documentos'],['orient','Orientações'],['regular','Regularização'],['servicos','Serviços'],['config','Configurações']];
const SERV=[['Abertura de MEI',150],['Declaração anual MEI (DASN-SIMEI)',80],['Regularização de MEI em atraso',200],['Parcelamento de débitos',180],['Abertura de ME / empresa',600],['Alteração contratual',350],['Baixa de empresa',300],['Contabilidade mensal – MEI',90],['Contabilidade mensal – Simples Nacional',350],['Serviço terceirizado para escritório (apuração)',250]];
const TASKS={MEI:['DASN-SIMEI entregue','DAS mensais em dia','CCMEI atualizado','Certidão negativa emitida','Parcelamento de DAS em atraso'],'Simples Nacional':['PGDAS-D transmitido','DEFIS entregue','Guias do período pagas','Inscrição municipal/estadual regular','Parcelamento de débitos','Certidão negativa emitida'],Outro:['Obrigações acessórias em dia','Guias do período pagas','Certidão negativa emitida']};
const ANX={I:[[180e3,.04,0],[360e3,.073,5940],[720e3,.095,13860],[1.8e6,.107,22500],[3.6e6,.143,87300],[4.8e6,.19,378e3]],
II:[[180e3,.045,0],[360e3,.078,5940],[720e3,.1,13860],[1.8e6,.112,22500],[3.6e6,.147,85500],[4.8e6,.3,720e3]],
III:[[180e3,.06,0],[360e3,.112,9360],[720e3,.135,17640],[1.8e6,.16,35640],[3.6e6,.21,125640],[4.8e6,.33,648e3]],
IV:[[180e3,.045,0],[360e3,.09,8100],[720e3,.102,12420],[1.8e6,.14,39780],[3.6e6,.22,183780],[4.8e6,.33,828e3]],
V:[[180e3,.155,0],[360e3,.18,4500],[720e3,.195,9900],[1.8e6,.205,17100],[3.6e6,.23,62100],[4.8e6,.305,540e3]]};
const P8='https://www8.receita.fazenda.gov.br/simplesnacional/';
const GUIAS=[
['Emitir o DAS do MEI (PGMEI)',P8+'aplicacoes/atspo/pgmei.app/identificacao',['Abra o PGMEI e informe o CNPJ do cliente (já copiado).','Clique em Emitir guia de pagamento (DAS).','Escolha o ano-calendário e marque os meses (competências) a pagar.','Clique em Apurar/Gerar DAS e confira o valor com a calculadora desta página.','Imprima o PDF ou pague pelo Pix (QR Code) e anexe o comprovante ao cliente.']],
['Declaração anual do MEI (DASN-SIMEI)',P8+'aplicacoes/atspo/dasnsimei.app/Identificacao',['Prazo: até 31 de maio de cada ano, referente ao ano anterior.','Entre com o CNPJ e a conta gov.br do cliente.','Informe a receita bruta total, separando comércio/indústria e serviços.','Informe se houve empregado contratado.','Transmita e guarde o recibo. Se a receita passou de R$ 81 mil, avalie o desenquadramento.']],
['Abrir um MEI',  'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor',['Confirme que a atividade (CNAE) é permitida ao MEI e que o faturamento previsto cabe em R$ 81 mil por ano.','Acesse o Portal do Empreendedor > Formalize-se com a conta gov.br do cliente (nível prata ou ouro).','Preencha dados pessoais, endereço e atividades.','Emita o CCMEI (certificado) e o primeiro DAS.','Oriente sobre alvará, inscrição municipal e a DASN-SIMEI anual.']],
['Parcelar DAS do MEI em atraso',P8,['Abra o Portal do Simples Nacional e entre com código de acesso ou gov.br.','Vá em Parcelamento e escolha a opção para MEI.','Selecione os débitos, o número de parcelas e confirme o pedido.','Emita a primeira parcela e acompanhe as seguintes todo mês.']],
['Transmitir o PGDAS-D (Simples Nacional)',P8+'aplicacoes/atspo/pgdasd2018.app/',['Entre com código de acesso, certificado digital ou gov.br.','Informe o período de apuração e a receita bruta do mês (mercado interno e externo).','Selecione as atividades e o Anexo (use a calculadora e o Fator R desta página).','Informe retenções na fonte e, se aplicável, receitas com ISS/ICMS retidos ou sublimite.','Transmita, emita o DAS e salve a declaração. Vencimento: dia 20 do mês seguinte.']],
['Entregar a DEFIS',P8,['Prazo: até 31 de março, referente ao ano anterior.','Entre no Portal do Simples Nacional com código de acesso ou gov.br.','Informe lucros e dividendos distribuídos, saldo em caixa e bancos, e dados dos sócios.','Transmita e guarde o recibo.']],
['Certidão negativa de débitos federais','https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir',['Informe o CNPJ do cliente e consulte.','Se houver pendências, o sistema lista os débitos: resolva e consulte de novo.','Salve o PDF na pasta do cliente. A validade é de 180 dias.']],
['Regularizar pendências (e-CAC e Regularize)','https://www.regularize.pgfn.gov.br/',['Para pendências na Receita, acesse o e-CAC com o gov.br do cliente (ou procuração).','Consulte Pendências, Diagnóstico Fiscal e Situação Fiscal.','Para dívida ativa, use o Regularize (PGFN) e negocie ou parcele.','Registre no checklist da aba Regularização o que foi resolvido.']],
['Receber procuração de outro escritório ou cliente','https://cav.receita.fazenda.gov.br/',['No e-CAC do cliente (ou do escritório contratante), abra Procuração eletrônica.','Outorgue poderes ao CPF ou CNPJ da Ana Carolina, com prazo e serviços definidos.','Com a procuração ativa, ela acessa os serviços em nome do cliente sem pedir senha.','Guarde o termo junto ao contrato de prestação de serviços.']]
];
let selOr='';
const MEI={com:82.05,serv:86.05,both:87.05};
let S={clients:[],fees:[],tasks:{},prices:{},docs:[],cfg:{}};

let tab='painel',selReg='';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=n=>(+n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const D=d=>d?d.split('-').reverse().join('/'):'–';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1800)}
const cname=id=>(S.clients.find(c=>c.id===id)||{name:'(removido)'}).name;
const today=()=>new Date().toISOString().slice(0,10);
function go(t){tab=t;render();window.scrollTo(0,0)}
function render(){
  $('nav').innerHTML=TABS.map(([k,l])=>`<button class="${k===tab?'on':''}" onclick="go('${k}')">${l}</button>`).join('');
  $('main').innerHTML=VIEWS[tab]();
  if(tab==='guias'){calcMei();calcSn();calcFr()}
  if(tab==='clientes'&&editId)fillEdit();
  labelize()
}
const VIEWS={
painel(){
  const open=S.fees.filter(f=>!f.paid),rec=S.fees.filter(f=>f.paid);
  const late=open.filter(f=>f.due&&f.due<today());
  const mrr=S.clients.filter(c=>c.status!=='Inativo').reduce((a,c)=>a+(+c.fee||0),0);
  return `<h2>${saud()}, ${esc(first())}!</h2><p class="lead">${new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}. Organização, planejamento e resultados.</p>
  <div class="kpis"><div class="kpi"><b>${S.clients.filter(c=>c.status!=='Inativo').length}</b><span>clientes ativos</span></div>
  <div class="kpi"><b>${R(mrr)}</b><span>honorários mensais previstos</span></div>
  <div class="kpi"><b>${R(open.reduce((a,f)=>a+ +f.value,0))}</b><span>a receber (${open.length})</span></div>
  <div class="kpi"><b>${R(rec.reduce((a,f)=>a+ +f.value,0))}</b><span>já recebido</span></div></div>
  ${prazos()}<div class="panel"><h3>Cobranças em atraso</h3>${late.length?`<table class="tbl">${late.map(f=>`<tr><td>${esc(cname(f.client))}</td><td>${esc(f.desc)}</td><td>${D(f.due)}</td><td>${R(f.value)}</td></tr>`).join('')}</table>`:'<p class="empty">Nenhuma cobrança em atraso.</p>'}</div>
  <div class="panel"><h3>Comece por aqui</h3><p class="note">Cadastre um cliente em <b>Clientes</b>, lance os honorários em <b>Honorários</b> e calcule o DAS em <b>Guias e impostos</b>. Os dados ficam salvos na nuvem (Firebase), com acesso por e-mail e senha.</p>
  <button class="btn alt sm" onclick="exportar()">Baixar cópia de segurança</button></div>`},
clientes(){
  return `<h2>Clientes</h2><p class="lead">Cadastro de MEIs, empresas do Simples e autônomos.</p>
  <div class="panel"><div class="row">
  <label>Nome / Razão social<input id="cn"></label><label>CPF ou CNPJ<input id="cd"></label>
  <label>Regime<select id="ct"><option>MEI</option><option>Simples Nacional</option><option>Outro</option></select></label>
  <label>WhatsApp<input id="cp" placeholder="(46) 9...."></label><label>E-mail<input id="ce" type="email"></label>
  <label>Honorário mensal (R$)<input id="cf" type="number" min="0" step="0.01"></label></div>
  <button class="btn" onclick="addClient()">Salvar cliente</button></div>
  ${BUSCA}<div class="panel wrap">${S.clients.length?`<table class="tbl"><tr><th>Nome</th><th>Documento</th><th>Regime</th><th>Honorário</th><th>Contato</th><th></th></tr>${S.clients.map(c=>`<tr><td>${esc(c.name)} ${c.status==='Inativo'?'<span class="tag">Inativo</span>':''}</td><td>${esc(c.doc)}</td><td><span class="tag">${esc(c.type)}</span></td><td>${R(c.fee)}</td><td>${esc(c.phone)} ${esc(c.email)}</td><td style="white-space:nowrap"><button class="btn alt sm" onclick="editId='${c.id}';render();window.scrollTo(0,0)">Editar</button> <button class="btn alt sm" onclick="togCli('${c.id}')">${c.status==='Inativo'?'Ativar':'Inativar'}</button> <button class="btn alt sm" onclick="delClient('${c.id}')">Excluir</button></td></tr>`).join('')}</table>`:'<p class="empty">Nenhum cliente ainda. Preencha o formulário acima para cadastrar o primeiro.</p>'}</div>`},
honorarios(){
  const opts=S.clients.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  return `<h2>Honorários</h2><p class="lead">Lance cobranças, acompanhe pagamentos e envie lembretes.</p>
  <div class="panel"><div class="row"><label>Cliente<select id="fc">${opts||'<option value="">Cadastre um cliente antes</option>'}</select></label>
  <label>Descrição<input id="fd" placeholder="Honorário de ${new Date().toLocaleDateString('pt-BR',{month:'long'})}"></label>
  <label>Valor (R$)<input id="fv" type="number" min="0" step="0.01"></label><label>Vencimento<input id="fw" type="date"></label></div>
  <button class="btn" onclick="addFee()">Lançar honorário</button> <button class="btn alt" onclick="gerarMes()">Gerar honorários do mês</button></div>
  ${BUSCA}<div class="panel wrap">${S.fees.length?`<table class="tbl"><tr><th>Cliente</th><th>Descrição</th><th>Vencimento</th><th>Valor</th><th>Situação</th><th></th></tr>${S.fees.slice().reverse().map(f=>{const late=!f.paid&&f.due&&f.due<today();return `<tr><td>${esc(cname(f.client))}</td><td>${esc(f.desc)}</td><td>${D(f.due)}</td><td>${R(f.value)}</td><td><span class="tag ${f.paid?'ok':late?'bad':''}">${f.paid?'Pago':late?'Atrasado':'Pendente'}</span></td><td style="white-space:nowrap"><button class="btn alt sm" onclick="togFee('${f.id}')">${f.paid?'Reabrir':'Dar baixa'}</button> <button class="btn alt sm" onclick="zap('${f.id}')">WhatsApp</button>${f.paid?` <button class="btn alt sm" onclick="recibo('${f.id}')">Recibo</button>`:''} <button class="btn alt sm" onclick="delFee('${f.id}')">×</button></td></tr>`}).join('')}</table>`:'<p class="empty">Sem honorários lançados.</p>'}</div>`},
guias(){
  return `<h2>Guias e impostos</h2><p class="lead">Calcule o valor e a data, emita a guia no portal oficial e anexe o PDF para enviar ao cliente.</p>${cliSel()}
  <div class="panel"><h3>DAS do MEI</h3><div class="row">
  <label>Atividade<select id="ma" onchange="calcMei()"><option value="com">Comércio / indústria</option><option value="serv">Serviços</option><option value="both">Comércio e serviços</option></select></label>
  <label>Competência<input id="mm" type="month" value="${today().slice(0,7)}" onchange="calcMei()"></label></div>
  <div class="res" id="mr"></div>
  <p class="note">Valores de 2026 (INSS de 5% sobre o salário mínimo de R$ 1.621,00, mais ICMS/ISS). <a href="https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atspo/pgmei.app/identificacao" target="_blank" rel="noopener">Emitir no PGMEI</a> · <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" target="_blank" rel="noopener">Abrir um MEI (Portal do Empreendedor)</a></p>${como(0,'Como emitir o DAS no PGMEI')}${como(1,'Como entregar a DASN-SIMEI')}</div>
  <div class="panel"><h3>DAS do Simples Nacional</h3><div class="row">
  <label>Anexo<select id="sa" onchange="calcSn()">${Object.keys(ANX).map(a=>`<option>${a}</option>`).join('')}</select></label>
  <label>Receita bruta dos últimos 12 meses (RBT12)<input id="sr" type="number" min="0" step="0.01" value="180000" oninput="calcSn()"></label>
  <label>Receita do mês (R$)<input id="sm" type="number" min="0" step="0.01" value="15000" oninput="calcSn()"></label></div>
  <div class="row"><label>Retenções na fonte já descontadas (R$)<input id="sret" type="number" min="0" step="0.01" value="0" oninput="calcSn()"></label></div><div class="res" id="sres"></div>
  <p class="note">Cálculo pela alíquota efetiva. Para os Anexos III e V, confira o Fator R antes. <a href="https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atspo/pgdasd2018.app/" target="_blank" rel="noopener">Transmitir no PGDAS-D</a></p>${como(4,'Como transmitir o PGDAS-D e emitir o DAS')}${como(5,'Como entregar a DEFIS')}</div>
  <div class="panel"><h3>Registrar guia emitida e enviar ao cliente</h3><p class="note">Depois de emitir no portal, registre a guia aqui (com o link do arquivo no Drive, se quiser). Ela fica salva no cliente e é enviada pela aba Documentos.</p>${attach('g','DAS MEI')}${S.docs.length?` <button class="btn alt" onclick="go('docs')">Ver documentos (${S.docs.length})</button>`:''}</div>
  <div class="panel"><h3>Fator R (Anexo III ou V)</h3><div class="row"><label>Folha 12 meses: salários, pró-labore e encargos (R$)<input id="fr1" type="number" min="0" value="60000" oninput="calcFr()"></label><label>RBT12 (R$)<input id="fr2" type="number" min="0" value="180000" oninput="calcFr()"></label></div><div class="res" id="frres"></div><p class="note">Com Fator R de 28% ou mais, a empresa tributa pelo Anexo III. Abaixo disso, pelo Anexo V. Vale para atividades sujeitas ao Fator R, como serviços de saúde e intelectuais.</p></div>`},
config(){const g=S.cfg;
  return `<h2>Configurações</h2><p class="lead">Dados do escritório, acesso e cópia de segurança.</p>
  <div class="panel"><h3>Escritório</h3><div class="row"><label>Nome no recibo<input id="gf" value="${esc(g.office||'')}" placeholder="Ana Carolina Contabilidade"></label><label>CRC<input id="gc" value="${esc(g.crc||'')}"></label><label>CPF ou CNPJ<input id="gd" value="${esc(g.doc||'')}"></label><label>Dia padrão de vencimento<input id="gv" type="number" min="1" max="28" value="${esc(g.venc||10)}"></label></div><button class="btn" onclick="saveCfg()">Salvar</button></div>
  <div class="panel"><h3>Alterar senha</h3><div class="row"><label>Senha atual<input id="p0" type="password" autocomplete="current-password"></label><label>Nova senha (mínimo 8 caracteres)<input id="p1" type="password" autocomplete="new-password"></label></div><button class="btn" onclick="trocaSenha()">Alterar senha</button></div>
  <div class="panel"><h3>Cópia de segurança</h3><p class="note">Guarda clientes, honorários, regularização e a lista de documentos. Os PDFs em si não são guardados aqui, só o registro e o link.</p><button class="btn alt" onclick="exportar()">Baixar cópia</button><label style="margin-top:12px">Restaurar uma cópia<input type="file" accept=".json" onchange="restaurar(this)"></label></div>`},
docs(){const rows=S.docs.slice().reverse();
  return `<h2>Documentos</h2><p class="lead">Registro das guias e comprovantes emitidos nos portais, por cliente, com a mensagem pronta para enviar.</p>
  <div class="panel"><h3>Registrar documento</h3>${attach('d','DAS MEI')}</div>
  ${BUSCA}<div class="panel wrap">${rows.length?`<table class="tbl"><tr><th>Cliente</th><th>Documento</th><th>Compet.</th><th>Venc.</th><th>Envio</th><th></th></tr>${rows.map(d=>`<tr><td>${esc(cname(d.client))}</td><td>${esc(d.kind)}${d.name?`<div class="note">${esc(d.name)}</div>`:''}</td><td>${esc(d.comp)}</td><td>${D(d.due)}</td><td><span class="tag ${d.sent?'ok':''}">${d.sent?'Enviado '+D(d.sent):'Não enviado'}</span></td><td style="white-space:nowrap"><button class="btn sm" onclick="enviar('${d.id}','zap')">WhatsApp</button> <button class="btn alt sm" onclick="enviar('${d.id}','mail')">E-mail</button> ${d.url?`<button class="btn alt sm" onclick="baixar('${d.id}')">Abrir</button> `:''}<button class="btn alt sm" onclick="delDoc('${d.id}')">×</button></td></tr>`).join('')}</table>`:'<p class="empty">Nenhum documento ainda. Emita a guia no portal e registre acima.</p>'}</div>
  <p class="note">O botão abre o WhatsApp ou o e-mail com a mensagem pronta. Se você informou o link do arquivo, ele vai junto; quem receber o link consegue abrir o arquivo, então envie só ao cliente certo. Sem link, anexe o PDF manualmente na conversa.</p>
  <div class="panel">${como(6,'Como emitir certidão negativa')}</div>`},
orient(){
  const c=S.clients.find(x=>x.id===selOr)||S.clients[0];
  return `<h2>Orientações</h2><p class="lead">Todos os passo a passo reunidos. Eles também aparecem dentro de cada aba (Guias, Regularização, Serviços e Documentos), na hora em que são necessários.</p>
  <div class="panel"><label>Cliente em atendimento<select onchange="selOr=this.value;render()"><option value="">Sem cliente selecionado</option>${S.clients.map(x=>`<option value="${x.id}" ${c&&x.id===c.id&&selOr?'selected':''}>${esc(x.name)} (${esc(x.type)})</option>`).join('')}</select></label>${c?`<p class="note">Documento a ser copiado: ${esc(c.doc)||'não cadastrado'}</p>`:''}</div>
  ${GUIAS.map(g=>`<details class="panel"><summary><b>${esc(g[0])}</b></summary><ol>${g[2].map(s=>`<li>${esc(s)}</li>`).join('')}</ol><button class="btn sm" onclick="abrir('${g[1]}')">Copiar documento e abrir portal</button></details>`).join('')}
  <div class="panel"><h3>Envio automático aos sistemas oficiais</h3><p class="note">Receita e PGDAS-D exigem login gov.br, código de acesso ou certificado digital do contribuinte, e não aceitam envio direto de um sistema como este. A integração automática existe pelo serviço pago Integra Contador (Serpro), que exige contrato e procuração eletrônica do cliente. Enquanto isso, use os botões acima: o sistema calcula, orienta e abre o portal certo.</p></div>`},
regular(){
  const c=S.clients.find(x=>x.id===selReg)||S.clients[0];
  if(!c)return `<h2>Regularização</h2><p class="empty">Cadastre um cliente para montar a lista de regularização.</p>`;
  const list=TASKS[c.type]||TASKS.Outro,t=S.tasks[c.id]||{};
  const done=list.filter(x=>t[x]).length;
  return `<h2>Regularização</h2><p class="lead">Checklist por cliente: ${done} de ${list.length} itens resolvidos.</p>
  <div class="panel"><label>Cliente<select onchange="selReg=this.value;render()">${S.clients.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(x.name)} (${esc(x.type)})</option>`).join('')}</select></label>
  <div style="margin-top:10px">${list.map(x=>`<div class="chk ${t[x]?'done':''}"><input type="checkbox" id="k${esc(x)}" ${t[x]?'checked':''} onchange="togTask('${c.id}','${esc(x)}')"><span>${esc(x)}</span>${TMAP[x]!=null?`<button class="btn alt sm" style="margin-left:auto" onclick="abrirTarefa('${c.id}','${esc(x)}')">Abrir portal</button>`:''}</div>`).join('')}</div></div>
  <p class="note">Consulte pendências no <a href="https://www.gov.br/receitafederal/pt-br/canais_atendimento/atendimento-virtual" target="_blank" rel="noopener">e-CAC / Regularize</a>.</p>`},
servicos(){
  return `<h2>Serviços</h2><p class="lead">Tabela de preços. Ajuste os valores e gere a cobrança em um clique.</p>
  <div class="panel wrap"><table class="tbl">${SERV.map(([n,p],i)=>`<tr><td>${esc(n)}</td><td style="width:130px"><input type="number" min="0" value="${S.prices[i]??p}" onchange="S.prices[${i}]=+this.value;save()"></td><td style="width:90px"><button class="btn alt sm" onclick="cobrar(${i})">Cobrar</button></td></tr>`).join('')}</table></div>
  <div class="panel">${como(2,'Como abrir um MEI, passo a passo')}${como(3,'Como parcelar DAS em atraso')}</div><p class="note">Os três últimos itens também servem para atender outros escritórios contábeis como prestadora de serviços.</p>`}
};
function addClient(){const name=$('cn').value.trim();if(!name)return toast('Informe o nome do cliente');
  const o={name,doc:$('cd').value,type:$('ct').value,phone:$('cp').value,email:$('ce').value,fee:+$('cf').value||0};
  if(editId){Object.assign(S.clients.find(c=>c.id===editId),o);editId=''}else S.clients.push(Object.assign({id:uid(),status:'Ativo'},o));save();render();toast('Cliente salvo')}
function delClient(id){if(!confirm('Excluir este cliente e seus honorários?'))return;S.clients=S.clients.filter(c=>c.id!==id);S.fees=S.fees.filter(f=>f.client!==id);save();render()}
function addFee(){const c=$('fc').value,v=+$('fv').value;if(!c||!v)return toast('Escolha o cliente e informe o valor');
  S.fees.push({id:uid(),client:c,desc:$('fd').value||'Honorários',value:v,due:$('fw').value,paid:false});save();render();toast('Honorário lançado')}
function togFee(id){const f=S.fees.find(x=>x.id===id);f.paid=!f.paid;save();render()}
function delFee(id){S.fees=S.fees.filter(f=>f.id!==id);save();render()}
function zap(id){const f=S.fees.find(x=>x.id===id),c=S.clients.find(x=>x.id===f.client)||{};
  const m=`Olá, ${c.name||''}! Passando para lembrar do honorário "${f.desc}" no valor de ${R(f.value)}, com vencimento em ${D(f.due)}. Qualquer dúvida, estou à disposição. – AC Contábil`;
  const n=(c.phone||'').replace(/\D/g,'');window.open('https://wa.me/'+(n&&n.length<=11?'55'+n:n)+'?text='+encodeURIComponent(m),'_blank','noopener')}
function cobrar(i){if(!S.clients.length){toast('Cadastre um cliente primeiro');return go('clientes')}
  tab='honorarios';render();$('fd').value=SERV[i][0];$('fv').value=S.prices[i]??SERV[i][1];$('fw').focus()}
function togTask(c,x){S.tasks[c]=S.tasks[c]||{};S.tasks[c][x]=!S.tasks[c][x];save();render()}
function calcMei(){const v=MEI[$('ma').value],m=$('mm').value;if(!m)return;
  let [y,mo]=m.split('-').map(Number);mo++;if(mo>12){mo=1;y++}
  $('mr').innerHTML=`<b>${R(v)}</b><div class="note">Vencimento: 20/${String(mo).padStart(2,'0')}/${y}</div>`}
function calcSn(){const a=ANX[$('sa').value],rbt=+$('sr').value||0,rec=+$('sm').value||0;
  if(rbt>4.8e6)return $('sres').innerHTML='<span class="tag bad">Receita acima de R$ 4,8 milhões: fora do Simples Nacional.</span>';
  const f=a.find(x=>rbt<=x[0])||a[0];const ef=rbt>0?Math.max(0,(rbt*f[1]-f[2])/rbt):f[1];
  $('sres').innerHTML=`<b>${R(Math.max(0,rec*ef-(+$('sret').value||0)))}</b><div class="note">Alíquota efetiva ${(ef*100).toFixed(2).replace('.',',')}% · faixa nominal ${(f[1]*100).toFixed(1).replace('.',',')}%</div>${rbt>3.6e6?'<div class="tag bad">RBT12 acima do sublimite de R$ 3,6 milhões: ICMS e ISS são recolhidos fora do DAS.</div>':''}`}
function calcFr(){const a=+$('fr1').value||0,b=+$('fr2').value||0;if(!b){$('frres').innerHTML='';return}const r=a/b;$('frres').innerHTML=`<b>${(r*100).toFixed(2).replace('.',',')}%</b><div class="note">${r>=.28?'Anexo III (alíquotas menores)':'Anexo V. Faltam '+R(.28*b-a)+' de folha para chegar a 28%'}</div>`}
function abrir(u){const c=S.clients.find(x=>x.id===selOr)||S.clients[0];const d=c?(c.doc||'').replace(/\D/g,''):'';
  if(d){try{navigator.clipboard.writeText(d).then(()=>toast('Documento copiado: cole no portal'))}catch(e){}}else toast('Cliente sem CPF/CNPJ cadastrado');
  window.open(u,'_blank','noopener')}
const DOCT=['DAS MEI','DAS Simples Nacional','DASN-SIMEI (recibo)','DEFIS (recibo)','Certidão negativa','Outro'];
const TMAP={'DASN-SIMEI entregue':1,'DAS mensais em dia':0,'CCMEI atualizado':2,'Certidão negativa emitida':6,'Parcelamento de DAS em atraso':3,'PGDAS-D transmitido':4,'DEFIS entregue':5,'Guias do período pagas':4,'Parcelamento de débitos':3,'Inscrição municipal/estadual regular':7};
function abrirTarefa(cid,x){selOr=cid;if(TMAP[x]!=null)abrir(GUIAS[TMAP[x]][1])}
function como(i,t){const g=GUIAS[i];return `<details style="margin-top:10px"><summary>${t||g[0]}</summary><ol>${g[2].map(s=>`<li>${esc(s)}</li>`).join('')}</ol><button class="btn sm" onclick="abrir('${g[1]}')">Copiar documento e abrir portal</button></details>`}
function cliSel(){const cur=selOr||(S.clients[0]||{}).id;return `<div class="panel"><label>Cliente em atendimento<select onchange="selOr=this.value;render()">${S.clients.map(c=>`<option value="${c.id}" ${c.id===cur?'selected':''}>${esc(c.name)} (${esc(c.type)})</option>`).join('')||'<option value="">Cadastre um cliente na aba Clientes</option>'}</select></label></div>`}
function attach(p,kind){const cur=selOr||(S.clients[0]||{}).id;return `<div class="row"><label>Cliente<select id="${p}c">${S.clients.map(c=>`<option value="${c.id}" ${c.id===cur?'selected':''}>${esc(c.name)}</option>`).join('')||'<option value="">Cadastre um cliente antes</option>'}</select></label><label>Tipo<select id="${p}k">${DOCT.map(t=>`<option ${t===kind?'selected':''}>${t}</option>`).join('')}</select></label><label>Competência<input id="${p}m" type="month" value="${prevMes()}"></label><label>Vencimento<input id="${p}v" type="date"></label><label>Link do arquivo (opcional)<input id="${p}f" type="url" placeholder="https://drive.google.com/…"></label></div><button class="btn" onclick="anexar('${p}')">Registrar para o cliente</button>`}
let editId='',tries=0,lock=0;
const BUSCA='<input class="busca" placeholder="Buscar" oninput="filtra(this.value)">';
let A=null;

const saud=()=>{const h=new Date().getHours();return h>=5&&h<12?'Bom dia':h>=5&&h<18?'Boa tarde':'Boa noite'};
const first=()=>((A&&A.name)||'').split(' ')[0];
function prevMes(){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
function labelize(){document.querySelectorAll('#main .tbl').forEach(t=>{const h=[...t.querySelectorAll('th')].map(x=>x.textContent);t.querySelectorAll('tr').forEach(r=>[...r.querySelectorAll('td')].forEach((d,i)=>d.dataset.l=h[i]||''))})}
function filtra(v){v=v.toLowerCase();document.querySelectorAll('#main .tbl tr').forEach(r=>{if(r.querySelector('th'))return;r.style.display=r.textContent.toLowerCase().includes(v)?'':'none'})}
function fillEdit(){const c=S.clients.find(x=>x.id===editId);if(!c)return;$('cn').value=c.name;$('cd').value=c.doc||'';$('ct').value=c.type;$('cp').value=c.phone||'';$('ce').value=c.email||'';$('cf').value=c.fee||'';document.querySelector('#main .panel .btn').textContent='Salvar alterações'}
function togCli(id){const c=S.clients.find(x=>x.id===id);c.status=c.status==='Inativo'?'Ativo':'Inativo';save();render()}
function prox(m,d){const n=new Date(),n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());let t=new Date(n.getFullYear(),m,d);if(t<n0)t=new Date(n.getFullYear()+1,m,d);return t}
function util(t){const w=t.getDay();if(w===6)t.setDate(t.getDate()+2);if(w===0)t.setDate(t.getDate()+1);return t}
function prazos(){const n=new Date(),n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  let das=util(new Date(n.getFullYear(),n.getMonth(),20));if(das<n0)das=util(new Date(n.getFullYear(),n.getMonth()+1,20));
  const ativos=S.clients.filter(c=>c.status!=='Inativo'),mei=ativos.filter(c=>c.type==='MEI'),sn=ativos.filter(c=>c.type==='Simples Nacional');
  const L=[['DAS (MEI e Simples)',das,mei.length+sn.length],['DEFIS',prox(2,31),sn.length],['DASN-SIMEI',prox(4,31),mei.length]];
  const dd=t=>Math.round((t-n0)/864e5),cp=new Date(das.getFullYear(),das.getMonth()-1,1),comp=cp.getFullYear()+'-'+String(cp.getMonth()+1).padStart(2,'0');
  const sem=mei.concat(sn).filter(c=>!S.docs.some(d=>d.client===c.id&&d.kind.startsWith('DAS')&&d.comp===comp));
  return `<div class="panel"><h3>Próximos prazos</h3><table class="tbl">${L.map(([t,d,q])=>`<tr><td>${t}</td><td>${d.toLocaleDateString('pt-BR')}</td><td>${dd(d)===0?'hoje':'em '+dd(d)+' dias'}</td><td>${q} cliente(s)</td></tr>`).join('')}</table>
  ${sem.length?`<p class="note" style="margin-top:12px"><b>Sem guia DAS anexada da competência ${comp.slice(5)}/${comp.slice(0,4)}:</b> ${sem.map(c=>esc(c.name)).join(', ')}. <a href="#" onclick="go('guias');return false">Anexar guia</a></p>`:'<p class="note" style="margin-top:12px">Todos os clientes têm a guia do mês anexada.</p>'}<p class="note">Feriados nacionais não são considerados nas datas.</p></div>`}
function gerarMes(){const n=new Date(),mes=n.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}),due=today().slice(0,8)+String(Math.min(28,+S.cfg.venc||10)).padStart(2,'0');let k=0;
  S.clients.filter(c=>c.status!=='Inativo'&&+c.fee>0).forEach(c=>{const desc='Honorários '+mes;if(S.fees.some(f=>f.client===c.id&&f.desc===desc))return;S.fees.push({id:uid(),client:c.id,desc,value:+c.fee,due,paid:false});k++});save();render();toast(k?k+' honorário(s) gerado(s)':'Nada novo para gerar')}
function recibo(id){const f=S.fees.find(x=>x.id===id),c=S.clients.find(x=>x.id===f.client)||{},g=S.cfg;
  $('rec').innerHTML=`<div class="recbox"><p class="brand" style="color:var(--cu)">AC Contábil</p><h2>Recibo de honorários</h2><p>Recebi de <b>${esc(c.name)}</b> ${c.doc?'(CPF/CNPJ '+esc(c.doc)+')':''} a quantia de <b>${R(f.value)}</b>, referente a ${esc(f.desc)}.</p><p>Emitido em ${new Date().toLocaleDateString('pt-BR')}.</p><p style="margin-top:44px">______________________________<br>${esc(g.office||(A&&A.name)||'')}${g.crc?'<br>CRC '+esc(g.crc):''}${g.doc?'<br>'+esc(g.doc):''}</p><div class="noprint"><button class="btn" onclick="window.print()">Imprimir ou salvar em PDF</button> <button class="btn alt" onclick="$('rec').style.display='none'">Fechar</button></div></div>`;$('rec').style.display='block'}
function saveCfg(){S.cfg={office:$('gf').value.trim(),crc:$('gc').value.trim(),doc:$('gd').value.trim(),venc:+$('gv').value||10};save();toast('Configurações salvas')}
function restaurar(i){const f=i.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(!Array.isArray(o.clients))throw 0;S=Object.assign({clients:[],fees:[],tasks:{},prices:{},docs:[],cfg:{}},o);save();render();toast('Cópia restaurada')}catch(e){toast('Arquivo de cópia inválido')}})}
function enter(){document.body.classList.add('in');$('who').innerHTML=`${esc(A.name)}<br>${esc(A.email)}<br><button class="btn alt sm" onclick="sair()">Sair</button>`;tab='painel';render();window.scrollTo(0,0);toast(saud()+', '+first()+'!')}

let last={clients:{},fees:{},docs:{},meta:''},st=null,pendingName='';
function save(){clearTimeout(st);st=setTimeout(sync,400)}
async function sync(){if(!A)return;const F=FB.F;try{
 for(const n of ['clients','fees','docs']){const cur={};S[n].forEach(x=>cur[x.id]=JSON.stringify(x));
  for(const id in cur)if(cur[id]!==last[n][id])await F.setDoc(F.doc(FB.db,'users',A.uid,n,id),JSON.parse(cur[id]));
  for(const id in last[n])if(!(id in cur))await F.deleteDoc(F.doc(FB.db,'users',A.uid,n,id));
  last[n]=cur}
 const m=JSON.stringify({tasks:S.tasks,prices:S.prices,cfg:S.cfg});if(m!==last.meta){await F.setDoc(F.doc(FB.db,'users',A.uid,'meta','main'),JSON.parse(m));last.meta=m}
}catch(e){toast('Erro ao salvar na nuvem: '+(e.code||e.message))}}
async function loadAll(){const F=FB.F;S={clients:[],fees:[],tasks:{},prices:{},docs:[],cfg:{}};
 for(const n of ['clients','fees','docs']){const sn=await F.getDocs(F.collection(FB.db,'users',A.uid,n));S[n]=sn.docs.map(d=>d.data());last[n]={};S[n].forEach(x=>last[n][x.id]=JSON.stringify(x))}
 const m=await F.getDoc(F.doc(FB.db,'users',A.uid,'meta','main'));
 if(m.exists())Object.assign(S,m.data());last.meta=m.exists()?JSON.stringify({tasks:S.tasks||{},prices:S.prices||{},cfg:S.cfg||{}}):''}
const ERR={'auth/invalid-credential':'E-mail ou senha incorretos.','auth/wrong-password':'E-mail ou senha incorretos.','auth/user-not-found':'E-mail ou senha incorretos.','auth/email-already-in-use':'Este e-mail já tem cadastro. Use Entrar.','auth/weak-password':'Use uma senha com 8 caracteres ou mais.','auth/too-many-requests':'Muitas tentativas. Aguarde um pouco e tente de novo.','auth/network-request-failed':'Sem conexão com a internet.','auth/operation-not-allowed':'O cadastro está desativado no Firebase.'};
function showLogin(m){const nw=m==='new';
 $('login').innerHTML=`<div class="lcard" onkeydown="if(event.key==='Enter')entrar('${m}')"><p class="brand" style="color:var(--cu);font-size:56px;text-align:center;margin:0">AC</p><p class="sub" style="text-align:center;color:var(--mute);margin:0 0 16px">CONTÁBIL</p><h2 style="text-align:center">${saud()}!</h2><p class="lead" style="text-align:center">${nw?'Primeiro acesso: crie seu login.':'Entre para acessar seus clientes e guias.'}</p>
 ${nw?'<label>Seu nome<input id="ln" autocomplete="name"></label>':''}<label>E-mail<input id="le" type="email" autocomplete="username"></label><label>Senha<input id="lp" class="pw" type="password" autocomplete="${nw?'new-password':'current-password'}"></label>${nw?'<label>Confirmar senha<input id="lq" class="pw" type="password" autocomplete="new-password"></label>':''}
 <label style="margin:4px 0 8px"><input type="checkbox" style="width:auto;margin:0 6px 0 0" onchange="document.querySelectorAll('.lcard .pw').forEach(i=>i.type=this.checked?'text':'password')">Mostrar senha</label><p id="lerr" class="note" style="color:var(--bad);min-height:20px" role="alert"></p><button class="btn" style="width:100%" onclick="entrar('${m}')">${nw?'Criar acesso':'Entrar'}</button>
 <p class="note" style="text-align:center;margin-top:14px">${nw?'<a href="#" onclick="showLogin(\'in\');return false">Já tenho conta</a>':'<a href="#" onclick="esqueci();return false">Esqueci minha senha</a> · <a href="#" onclick="showLogin(\'new\');return false">Primeiro acesso</a>'}</p></div>`}
async function entrar(m){const err=t=>{$('lerr').style.color='var(--bad)';$('lerr').textContent=t},e=$('le').value.trim().toLowerCase(),p=$('lp').value;
 if(!/^\S+@\S+\.\S+$/.test(e))return err('Informe um e-mail válido.');
 try{if(m==='new'){const n=$('ln').value.trim();if(!n)return err('Informe seu nome.');if(p.length<8)return err('A senha precisa ter 8 caracteres ou mais.');if(p!==$('lq').value)return err('As senhas não conferem.');
  pendingName=n;const cr=await FB.A.createUserWithEmailAndPassword(FB.auth,e,p);await FB.A.updateProfile(cr.user,{displayName:n})}
 else await FB.A.signInWithEmailAndPassword(FB.auth,e,p)}catch(x){err(ERR[x.code]||('Erro: '+(x.code||x.message)))}}
async function esqueci(){const e=($('le').value||'').trim();if(!e){$('lerr').textContent='Digite seu e-mail acima e clique de novo.';return}
 try{await FB.A.sendPasswordResetEmail(FB.auth,e)}catch(x){}$('lerr').style.color='var(--ok)';$('lerr').textContent='Se o e-mail estiver cadastrado, enviamos o link para redefinir a senha.'}
async function trocaSenha(){const a=$('p0').value,b=$('p1').value;if(b.length<8)return toast('A nova senha precisa de 8 caracteres ou mais');
 try{const u=FB.auth.currentUser;await FB.A.reauthenticateWithCredential(u,FB.A.EmailAuthProvider.credential(u.email,a));await FB.A.updatePassword(u,b);$('p0').value=$('p1').value='';toast('Senha alterada')}catch(e){toast(e.code==='auth/invalid-credential'||e.code==='auth/wrong-password'?'Senha atual incorreta':'Não foi possível alterar a senha')}}
function sair(){FB.A.signOut(FB.auth)}
function anexar(p){const c=$(p+'c').value,l=($(p+'f').value||'').trim();if(!c)return toast('Escolha o cliente');
 if(l&&!/^https?:\/\//i.test(l))return toast('O link precisa começar com http:// ou https://');
 S.docs.push({id:uid(),client:c,kind:$(p+'k').value,comp:$(p+'m').value,due:$(p+'v').value,name:'',url:l,sent:''});save();selOr=c;render();toast('Documento registrado')}
function delDoc(id){if(!confirm('Excluir este documento?'))return;S.docs=S.docs.filter(x=>x.id!==id);save();render()}
function baixar(id){const d=S.docs.find(x=>x.id===id);if(d&&d.url)window.open(d.url,'_blank','noopener')}
function enviar(id,via){const d=S.docs.find(x=>x.id===id),c=S.clients.find(x=>x.id===d.client)||{};
 const msg=`Olá, ${c.name||''}! Segue o documento "${d.kind}" (competência ${d.comp}${d.due?', vencimento '+D(d.due):''}):${d.url?'\n'+d.url:''}\nQualquer dúvida, estou à disposição. – AC Contábil`;
 d.sent=today();save();
 if(via==='mail')window.open('mailto:'+(c.email||'')+'?subject='+encodeURIComponent(d.kind+' – AC Contábil')+'&body='+encodeURIComponent(msg));
 else{const n=(c.phone||'').replace(/\D/g,'');window.open('https://wa.me/'+(n&&n.length<=11?'55'+n:n)+'?text='+encodeURIComponent(msg),'_blank','noopener')}
 render()}
function exportar(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='ac-contabil-backup.json';a.click()}
function startApp(){if(String(FB.auth.app.options.apiKey).startsWith('COLE')){$('login').innerHTML='<div class="lcard"><h2>Configure o Firebase</h2><p class="note">Edite public/firebase-config.js com os dados do seu projeto. O passo a passo está no README.</p></div>';return}
 FB.A.onAuthStateChanged(FB.auth,async u=>{if(!u){A=null;S={clients:[],fees:[],tasks:{},prices:{},docs:[],cfg:{}};document.body.classList.remove('in');showLogin('in');return}
  A={uid:u.uid,name:u.displayName||pendingName||u.email,email:u.email};
  try{await loadAll();enter()}catch(e){$('login').innerHTML='<div class="lcard"><h2>Não foi possível carregar</h2><p class="note">'+esc(e.code||e.message)+'. Confira as regras do Firestore e a conexão.</p><button class="btn" onclick="sair()">Sair</button></div>'}})}
window.onFirebaseReady=startApp;if(window.FB)startApp();
