export const metadata = {
  title: "Política de Privacidade — CriptoPassivo",
  description: "Política de privacidade e proteção de dados do CriptoPassivo Dashboard (LGPD)",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-bg text-ink font-display py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-base">C</div>
          <span className="font-extrabold text-lg tracking-tight">CriptoPassivo</span>
        </div>

        <article className="bg-card border border-border rounded-xl p-8 prose prose-invert max-w-none">
          <h1 className="text-2xl font-bold mb-6">Política de Privacidade</h1>

          <p className="text-muted leading-relaxed mb-6">
            Esta Política explica como coletamos, usamos, armazenamos e protegemos seus dados pessoais
            ao usar o CriptoPassivo ("Serviço"), em conformidade com a <strong>Lei Geral de Proteção de Dados — LGPD (Lei nº 13.709/2018)</strong>.
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">1. Controlador de Dados</h2>
            <p className="text-muted leading-relaxed">
              CriptoPassivo — Dashboard SaaS<br />
              Email: privacidade@criptopassivo.com.br
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">2. Dados Coletados</h2>
            <table className="w-full text-sm text-muted border-collapse mb-4">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-left p-2">Dados</th>
                  <th className="text-left p-2">Finalidade</th>
                  <th className="text-left p-2">Base Legal (LGPD)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-2">Identificação</td>
                  <td className="p-2">Email, ID do usuário (Supabase Auth)</td>
                  <td className="p-2">Autenticação, comunicação, segurança</td>
                  <td className="p-2">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2">Carteira</td>
                  <td className="p-2">Ativos: nome, símbolo, categoria, quantidade, APY, % alvo</td>
                  <td className="p-2">Cálculo de valor, alocação, projeção de rendimento</td>
                  <td className="p-2">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2">Vendas (IR)</td>
                  <td className="p-2">Ativo, data, valor venda, custo aquisição</td>
                  <td className="p-2">Cálculo simplificado de ganho de capital e IR estimado</td>
                  <td className="p-2">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2">Pagamento</td>
                  <td className="p-2">Customer ID, Subscription ID, status (via Cakto webhook)</td>
                  <td className="p-2">Controle de acesso ao plano Pro, renovação, cancelamento</td>
                  <td className="p-2">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr>
                  <td className="p-2">Técnicos</td>
                  <td className="p-2">IP, user-agent, logs de erro (temporários)</td>
                  <td className="p-2">Segurança, depuração, prevenção de fraude</td>
                  <td className="p-2">Interesse legítimo (Art. 7º, IX)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">3. Compartilhamento de Dados</h2>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-2">
              <li><strong>Supabase (PostgreSQL + Auth):</strong> Armazenamento e autenticação. Processador de dados com DPA assinado. Servidores nos EUA/EU.</li>
              <li><strong>Cakto (Gateway de pagamento):</strong> Processamento de assinaturas, emissão de NF, gestão de cliente. Apenas dados necessários para cobrança (email, customer ID).</li>
              <li><strong>CoinGecko (API pública):</strong> Consulta de preços de criptoativos. Não envia dados pessoais.</li>
              <li><strong>Autoridades legais:</strong> Quando exigido por lei, ordem judicial ou para proteger direitos.</li>
            </ul>
            <p className="text-muted leading-relaxed mt-2">
              <strong>Não vendemos, alugamos ou compartilhamos seus dados para marketing de terceiros.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">4. Segurança</h2>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-2">
              <li>Autenticação via Magic Link (Supabase Auth) — sem senhas armazenadas.</li>
              <li>Row Level Security (RLS) no banco: cada usuário acessa apenas os próprios dados.</li>
              <li>HTTPS obrigatório (TLS 1.2+), headers de segurança (CSP, HSTS via Vercel).</li>
              <li>Rate limiting em APIs públicas (/api/prices) para evitar abuso.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">5. Retenção e Exclusão</h2>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-2">
              <li>Dados da carteira e vendas: mantidos enquanto a conta estiver ativa.</li>
              <li>Ao solicitar exclusão da conta (LGPD Art. 18, VI): dados são anonimizados ou excluídos em até 30 dias.</li>
              <li>Dados de pagamento (Cakto): retidos conforme obrigações fiscais (5 anos, Art. 173 CTN).</li>
              <li>Logs técnicos: rotacionados a cada 30 dias.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">6. Seus Direitos (LGPD Art. 18)</h2>
            <p className="text-muted leading-relaxed mb-2">Você pode solicitar a qualquer momento:</p>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-1">
              <li>Confirmação de tratamento e acesso aos dados</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados a outro fornecedor</li>
              <li>Eliminação dos dados tratados com consentimento</li>
              <li>Informação sobre compartilhamento com terceiros</li>
              <li>Revogação do consentimento (quando aplicável)</li>
              <li>Oposição a tratamento baseado em interesse legítimo</li>
            </ul>
            <p className="text-muted leading-relaxed mt-2">
              Para exercer seus direitos, envie email para <strong>privacidade@criptopassivo.com.br</strong>
              com o assunto "LGPD — Direitos do Titular". Responderemos em até 15 dias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">7. Cookies e Tecnologias Similares</h2>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-1">
              <li><strong>Essenciais:</strong> Sessão de autenticação (Supabase), CSRF protection. Não podem ser desativados.</li>
              <li><strong>Funcionais:</strong> Preferências de UI (tema, sidebar).</li>
              <li><strong>Não usamos:</strong> Cookies de analytics, marketing, rastreamento cross-site.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">8. Transferência Internacional</h2>
            <p className="text-muted leading-relaxed">
              O Supabase pode processar dados em servidores fora do Brasil (EUA, UE).
              A transferência ocorre com base em Cláusulas Contratuais Padrão (SCCs) aprovadas pela ANPD
              e adequação de nível de proteção (Art. 33 LGPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">9. Alterações nesta Política</h2>
            <p className="text-muted leading-relaxed">
              Atualizações serão publicadas nesta página com nova data de "Última atualização".
              Alterações materiais serão notificadas por email ou aviso no dashboard.
            </p>
          </section>

          <hr className="border-border my-8" />
          <p className="text-sm text-muted text-center">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}<br />
            Dúvidas: privacidade@criptopassivo.com.br
          </p>
        </article>
      </div>
    </div>
  );
}