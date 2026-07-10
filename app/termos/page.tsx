export const metadata = {
  title: "Termos de Uso — CriptoPassivo",
  description: "Termos de uso do CriptoPassivo Dashboard",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-bg text-ink font-display py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-black text-[#06110c] text-base">C</div>
          <span className="font-extrabold text-lg tracking-tight">CriptoPassivo</span>
        </div>

        <article className="bg-card border border-border rounded-xl p-8 prose prose-invert max-w-none">
          <h1 className="text-2xl font-bold mb-6">Termos de Uso</h1>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">1. Aceitação dos Termos</h2>
            <p className="text-muted leading-relaxed">
              Ao acessar e usar o CriptoPassivo ("Serviço"), você concorda em cumprir estes Termos de Uso
              e todas as leis e regulamentos aplicáveis. Se não concordar com qualquer parte destes termos,
              não use o Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">2. Descrição do Serviço</h2>
            <p className="text-muted leading-relaxed">
              O CriptoPassivo é um dashboard SaaS para acompanhamento de carteira de renda passiva em criptomoedas.
              O Serviço oferece: visualização de alocação por categoria, projeção de rendimento baseada em APY,
              histórico de valor da carteira, e calculadora simplificada de imposto de renda (ganho de capital).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">3. Planos e Cobrança</h2>
            <p className="text-muted leading-relaxed mb-2">
              O Serviço possui dois planos:
            </p>
            <ul className="list-disc list-inside text-muted leading-relaxed space-y-1 mb-4">
              <li><strong>Grátis:</strong> até 5 ativos, funcionalidades básicas de dashboard.</li>
              <li><strong>Pro (R$ 57,90/mês):</strong> ativos ilimitados, calculadora de IR completa, sem limites.</li>
            </ul>
            <p className="text-muted leading-relaxed">
              A cobrança é processada pela <strong>Cakto</strong> (gateway de pagamentos brasileiro).
              A assinatura é recorrente mensal, renovada automaticamente até cancelamento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">4. Cancelamento e Reembolso</h2>
            <p className="text-muted leading-relaxed mb-2">
              Você pode cancelar a assinatura a qualquer momento pelo painel do cliente da Cakto
              ou entrando em contato com o suporte. O acesso ao plano Pro permanece ativo até o
              fim do período já pago. Não há reembolso proporcional por períodos parciais.
            </p>
            <p className="text-muted leading-relaxed">
              Em caso de falha no pagamento, o acesso ao plano Pro é revogado imediatamente
              (sem período de graça), conforme política de revogação imediata.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">5. Dados e Privacidade</h2>
            <p className="text-muted leading-relaxed mb-2">
              Coletamos apenas o necessário para o funcionamento do Serviço:
              email (autenticação), dados de ativos e vendas inseridos por você.
              Os dados financeiros são armazenados no Supabase (PostgreSQL) com
              Row Level Security — cada usuário acessa apenas os próprios dados.
            </p>
            <p className="text-muted leading-relaxed">
              Consulte nossa <a href="/privacidade" className="underline hover:text-accent">Política de Privacidade</a>
              para detalhes completos sobre tratamento de dados, direitos do titular (LGPD) e retenção.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">6. Isenção de Responsabilidade — Imposto de Renda</h2>
            <p className="text-muted leading-relaxed mb-2">
              <strong>A calculadora de IR do CriptoPassivo é uma ferramenta educacional e de simulação simplificada.</strong>
              Não substitui assessoria contábil ou jurídica profissional.
            </p>
            <p className="text-muted leading-relaxed mb-2">
              A legislação brasileira de ganho de capital em criptoativos (IN RFB nº 1.888/2019 e atualizações)
              prevê regras complexas: apuração mensal, compensação de prejuízos, alíquotas progressivas
              (15% a 22,5%), isenção para vendas até R$ 35.000,00 no mês, entre outras nuances.
            </p>
            <p className="text-muted leading-relaxed">
              <strong>Consulte sempre um contador especializado em criptoativos antes de declarar.</strong>
              O CriptoPassivo não se responsabiliza por erros, omissões ou consequências fiscais
              decorrentes do uso da calculadora.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">7. Fontes de Dados Externas</h2>
            <p className="text-muted leading-relaxed">
              Preços em tempo real vêm da API pública da <strong>CoinGecko</strong> (gratuita, com rate limit).
              O Serviço não garante disponibilidade, precisão ou continuidade dos dados de terceiros.
              Em caso de falha na API, o último preço conhecido é mantido em cache.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">8. Limitação de Responsabilidade</h2>
            <p className="text-muted leading-relaxed">
              O Serviço é fornecido "como está" e "conforme disponível". Não garantimos que
              será ininterrupto, livre de erros, ou que atenda a necessidades específicas.
              Em nenhum caso o CriptoPassivo será responsável por danos diretos, indiretos,
              incidentais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso do Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">9. Alterações nos Termos</h2>
            <p className="text-muted leading-relaxed">
              Podemos atualizar estes Termos a qualquer momento. Alterações materiais serão
              comunicadas por email ou aviso no dashboard. O uso contínuo após a vigência
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-2">10. Lei Aplicável e Foro</h2>
            <p className="text-muted leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil.
              Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias,
              com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <hr className="border-border my-8" />
          <p className="text-sm text-muted text-center">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}<br />
            Dúvidas: suporte@criptopassivo.com.br
          </p>
        </article>
      </div>
    </div>
  );
}